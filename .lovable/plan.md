

# Plan: Mejorar icono PWA en moviles + Push notifications para usuarios normales

## Problema 1: Icono de la app se ve mal en moviles

En la captura se ve que el icono de Nova en la pantalla de inicio del movil tiene un fondo que no se ajusta bien. El problema es que el manifiesto PWA solo usa el SVG para ambos propositos (`any` y `maskable`), pero no incluye los iconos PNG que ya existen en el proyecto (`nova-icon-192.png` y `nova-icon-512.png`). Los iconos PNG con tamanios fijos se renderizan mucho mejor en las pantallas de inicio de Android.

**Solucion**: Actualizar `public/manifest.json` para incluir los iconos PNG con sus tamanios correctos (192x192 y 512x512) como iconos principales, manteniendo el SVG como respaldo. Separar los propositos `any` y `maskable` correctamente: los PNG para `any` y el SVG para `maskable` con el fondo oscuro del tema.

## Problema 2: Los usuarios normales no reciben notificaciones push

Actualmente el sistema funciona asi:
- Cuando el admin actualiza un proyecto (estado, fase, hito, mantenimiento, ticket, presupuesto), se inserta un registro en la tabla `notifications` para el usuario
- El usuario ve esas notificaciones en su Dashboard via realtime
- El Dashboard ya suscribe automaticamente al usuario a push notifications (`subscribePush()` se llama 3 segundos despues del login)
- **PERO**: nadie llama a `send-push-notification` cuando se crea una notificacion para un usuario normal

En resumen: los usuarios estan suscritos a push, pero nadie les envia el push cuando hay una notificacion nueva.

**Solucion**: Crear una funcion auxiliar en `Admin.tsx` que, despues de insertar en la tabla `notifications`, tambien llame a la edge function `send-push-notification` con el `user_id` del usuario como `target`. Asi el usuario recibira la notificacion push en su PC o movil.

## Cambios a realizar

### 1. `public/manifest.json`
Agregar los iconos PNG al manifiesto con tamanios especificos:
- `nova-icon-192.png` con size `192x192`, purpose `any`
- `nova-icon-512.png` con size `512x512`, purpose `any`
- Mantener el SVG como `maskable` (con fondo adaptable al tema)

### 2. `src/pages/Admin.tsx`
Crear una funcion `sendUserPushNotification(userId, title, message, url)` que llame a la edge function `send-push-notification` con `target: userId`. Luego, en cada lugar donde se inserta en la tabla `notifications` (hay 6 lugares), agregar una llamada a esta funcion justo despues de la insercion:

1. **Actualizacion de ticket** (linea 304) - enviar push al usuario del ticket
2. **Actualizacion de estado de proyecto** (linea 335) - enviar push al usuario del proyecto
3. **Actualizacion de fase de proyecto** (linea 376) - enviar push al usuario del proyecto
4. **Nuevo hito** (linea 460) - enviar push al usuario del proyecto
5. **Mantenimiento realizado** (linea 492) - enviar push al usuario del proyecto
6. **Nuevo presupuesto** (linea 569) - enviar push al usuario

### Seccion tecnica

**Funcion auxiliar en Admin.tsx:**
```text
const sendUserPush = async (userId: string, title: string, body: string, url: string = '/dashboard') => {
  try {
    await supabase.functions.invoke('send-push-notification', {
      body: { title, body, url, type: 'user-notification', target: userId }
    });
  } catch (e) {
    console.error('Push to user failed:', e);
  }
};
```

Esta funcion se llamara justo despues de cada `supabase.from('notifications').insert(...)` exitoso.

**Manifiesto PWA actualizado:**
```text
"icons": [
  { "src": "/nova-icon-192.png", "sizes": "192x192", "type": "image/png", "purpose": "any" },
  { "src": "/nova-icon-512.png", "sizes": "512x512", "type": "image/png", "purpose": "any" },
  { "src": "/nova-icon.svg", "sizes": "any", "type": "image/svg+xml", "purpose": "maskable" }
]
```

