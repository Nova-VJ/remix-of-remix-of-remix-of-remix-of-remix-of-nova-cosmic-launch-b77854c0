/// <reference lib="webworker" />
import { precacheAndRoute } from 'workbox-precaching';

declare const self: ServiceWorkerGlobalScope;

// Workbox precaching (manifest injected by vite-plugin-pwa)
precacheAndRoute(self.__WB_MANIFEST);

// ─── Push notification handler ───
self.addEventListener('push', (event) => {
  let data = { title: 'Nova Marketing', body: 'Tienes una nueva notificación', url: '/' } as any;

  if (event.data) {
    try {
      data = { ...data, ...event.data.json() };
    } catch {
      data.body = event.data.text();
    }
  }

  const options = {
    body: data.body,
    icon: '/nova-icon.svg',
    badge: '/nova-icon.svg',
    vibrate: [200, 100, 200],
    data: { url: data.url || '/' },
    tag: data.tag || 'nova-notification',
    renotify: true,
  } as any;

  event.waitUntil(self.registration.showNotification(data.title, options));
});

// ─── Notification click handler ───
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const url = event.notification.data?.url || '/';

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url.includes(self.location.origin) && 'focus' in client) {
          (client as WindowClient).navigate(url);
          return (client as WindowClient).focus();
        }
      }
      return self.clients.openWindow(url);
    })
  );
});

// ─── Badge count via postMessage ───
self.addEventListener('message', (event) => {
  if (event.data?.type === 'SET_BADGE') {
    if ('setAppBadge' in navigator) {
      if (event.data.count > 0) {
        (navigator as any).setAppBadge(event.data.count);
      } else {
        (navigator as any).clearAppBadge();
      }
    }
  }
});
