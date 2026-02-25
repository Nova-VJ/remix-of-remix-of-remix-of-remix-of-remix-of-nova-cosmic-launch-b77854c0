

# Plan: Arreglar notificaciones push y marcar alertas como leidas

## Problema 1: Las notificaciones push NO llegan al PC

**Causa raiz encontrada**: El proyecto usa `vite-plugin-pwa` con `registerType: "autoUpdate"`, que genera su propio Service Worker via Workbox. Este SW generado automaticamente **reemplaza** al archivo `/sw.js` manual donde estan los handlers de push. El resultado: los push llegan exitosamente al servidor de Google (FCM devuelve 200 OK, los logs lo confirman), pero el Service Worker activo en el navegador no tiene handlers para el evento `push`, asi que la notificacion se descarta silenciosamente.

**Solucion**: Configurar `vite-plugin-pwa` para inyectar el codigo de push dentro del SW generado, usando la opcion `injectManifest` en lugar de `generateSW`, o mejor aun: usar la opcion `customWorkerEntry` / importar el sw.js como archivo custom. La forma mas limpia es cambiar la estrategia a `injectManifest` que permite escribir un SW custom con caching de Workbox + handlers de push.

## Problema 2: Marcar alertas como leidas al abrir la seccion

El usuario quiere que cuando entre en el panel admin y vea las alertas, estas se marquen automaticamente como leidas (y el badge rojo desaparezca). Actualmente solo se marcan una por una al hacer clic.

## Cambios a realizar

### Archivo 1: `vite.config.ts`
- Cambiar la estrategia de PWA de `generateSW` (default) a `injectManifest`
- Apuntar al nuevo archivo source del service worker

### Archivo 2: `src/sw.ts` (nuevo)
- Crear un service worker que combine:
  - La logica de precaching de Workbox (via `precacheAndRoute`)
  - Los handlers de push notification (evento `push`, `notificationclick`)
  - El handler de badge (`message`)
- Este archivo sera procesado por vite-plugin-pwa para generar el SW final

### Archivo 3: `public/sw.js` (eliminar)
- Ya no se necesita porque el SW se genera desde `src/sw.ts`

### Archivo 4: `src/hooks/usePushNotifications.ts`
- Eliminar el registro manual de `/sw.js` (linea 52) ya que vite-plugin-pwa lo registra automaticamente
- Usar el SW ya registrado por el plugin para obtener la suscripcion push

### Archivo 5: `src/components/SaraLeadIntelligence.tsx`
- Agregar un efecto que al montar el tab de "notifications" marque todas las no leidas como leidas automaticamente
- Esto hara que el badge rojo del Navbar se limpie al ver las alertas

## Seccion tecnica

### Cambio en vite.config.ts
```text
VitePWA({
  registerType: "autoUpdate",
  strategies: "injectManifest",       // <-- cambio clave
  srcDir: "src",                      // <-- donde esta el SW source
  filename: "sw.ts",                  // <-- archivo source del SW
  manifest: false,
  injectManifest: {
    globPatterns: ["**/*.{js,css,html,ico,png,svg,woff2}"],
    maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
  },
})
```

### Nuevo src/sw.ts
Combinara Workbox precaching + push handlers:
```text
import { precacheAndRoute } from 'workbox-precaching';

// Workbox precaching (injected by vite-plugin-pwa)
precacheAndRoute(self.__WB_MANIFEST);

// Push notification handler
self.addEventListener('push', (event) => { ... });
self.addEventListener('notificationclick', (event) => { ... });
self.addEventListener('message', (event) => { ... });
```

### Auto-marcar leidas en SaraLeadIntelligence
Cuando el tab "notifications" este activo, se ejecutara un UPDATE masivo:
```text
UPDATE admin_notifications SET read = true WHERE read = false
```
Esto limpiara el badge rojo automaticamente via la suscripcion realtime del Navbar.

