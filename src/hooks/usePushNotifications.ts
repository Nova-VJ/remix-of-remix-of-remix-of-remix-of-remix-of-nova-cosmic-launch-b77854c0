import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

const VAPID_PUBLIC_KEY = 'BDummyKeyForPWASetup'; // Will need real VAPID key

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

  // Register the push SW
  useEffect(() => {
    if (!isSupported) return;
    navigator.serviceWorker.register('/sw.js').catch(console.error);
  }, [isSupported]);

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

      const reg: any = await navigator.serviceWorker.ready;
      
      let sub = await reg.pushManager.getSubscription();
      if (!sub) {
        sub = await reg.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
        });
      }

      const subJson = sub.toJSON();
      
      // Save to database
      await supabase.from('push_subscriptions').upsert({
        user_id: user.id,
        endpoint: sub.endpoint,
        p256dh: subJson.keys?.p256dh || '',
        auth: subJson.keys?.auth || '',
        is_admin: false,
      }, { onConflict: 'endpoint' });

      setIsSubscribed(true);
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
        // Fallback to SW
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
