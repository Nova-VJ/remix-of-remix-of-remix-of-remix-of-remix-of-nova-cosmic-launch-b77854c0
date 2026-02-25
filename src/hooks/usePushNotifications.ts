import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

// Cache the VAPID public key after fetching once
let cachedVapidKey: string | null = null;

async function getVapidPublicKey(): Promise<string> {
  if (cachedVapidKey) return cachedVapidKey;
  
  const { data, error } = await supabase.functions.invoke('send-push-notification', {
    method: 'GET',
  });
  
  if (error || !data?.publicKey) {
    console.error('Failed to fetch VAPID public key:', error);
    throw new Error('Could not fetch VAPID public key from server');
  }
  
  cachedVapidKey = data.publicKey;
  return data.publicKey;
}

export const usePushNotifications = () => {
  const { user } = useAuth();
  const [isSupported, setIsSupported] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [permission, setPermission] = useState<NotificationPermission>('default');

  useEffect(() => {
    const supported = 'serviceWorker' in navigator && 'PushManager' in window && 'Notification' in window;
    setIsSupported(supported);
    if (supported) {
      setPermission(Notification.permission);
    }
  }, []);

  // vite-plugin-pwa registers the SW automatically via injectManifest

  // Check existing subscription
  useEffect(() => {
    if (!isSupported) return;
    navigator.serviceWorker.ready.then((reg: any) => {
      reg.pushManager?.getSubscription().then((sub: any) => {
        setIsSubscribed(!!sub);
      });
    });
  }, [isSupported]);

  const requestPermission = useCallback(async () => {
    if (!isSupported) return false;
    const result = await Notification.requestPermission();
    setPermission(result);
    return result === 'granted';
  }, [isSupported]);

  const subscribe = useCallback(async () => {
    if (!isSupported || !user) return false;

    try {
      const granted = await requestPermission();
      if (!granted) return false;

      // Fetch the VAPID public key from the server to ensure it matches
      const vapidPublicKey = await getVapidPublicKey();
      console.log('Using VAPID public key from server:', vapidPublicKey.substring(0, 20) + '...');

      const reg: any = await navigator.serviceWorker.ready;
      
      // Unsubscribe any existing subscription (may have been created with wrong key)
      const existingSub = await reg.pushManager.getSubscription();
      if (existingSub) {
        await existingSub.unsubscribe();
        console.log('Unsubscribed old push subscription');
      }

      // Create new subscription with correct server key
      const sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidPublicKey),
      });

      const subJson = sub.toJSON();
      
      // Check if user is admin
      const { data: profile } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('user_id', user.id)
        .single();
      
      // Save to database
      await supabase.from('push_subscriptions').upsert({
        user_id: user.id,
        endpoint: sub.endpoint,
        p256dh: subJson.keys?.p256dh || '',
        auth: subJson.keys?.auth || '',
        is_admin: profile?.is_admin || false,
      }, { onConflict: 'endpoint' });

      setIsSubscribed(true);
      console.log('Push subscription created successfully');
      return true;
    } catch (e) {
      console.error('Push subscription error:', e);
      return false;
    }
  }, [isSupported, user, requestPermission]);

  // Set app badge count
  const setBadgeCount = useCallback(async (count: number) => {
    if ('setAppBadge' in navigator) {
      try {
        if (count > 0) {
          await (navigator as any).setAppBadge(count);
        } else {
          await (navigator as any).clearAppBadge();
        }
      } catch (e) {
        const reg = await navigator.serviceWorker?.ready;
        reg?.active?.postMessage({ type: 'SET_BADGE', count });
      }
    }
  }, []);

  return {
    isSupported,
    isSubscribed,
    permission,
    requestPermission,
    subscribe,
    setBadgeCount,
  };
};
