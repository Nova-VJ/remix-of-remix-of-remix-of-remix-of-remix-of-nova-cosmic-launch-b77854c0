

# Plan: Icono oficial, clasificacion IA y notificaciones push

## Problemas identificados

1. **Icono con marco blanco**: Los PNGs actuales tienen fondo oscuro que no se adapta bien a todos los launchers. Se necesita usar el nuevo SVG oficial con fondo transparente, y configurar el manifest para que Android use `theme_color` (#0f0a1e) como relleno.

2. **La IA no clasifica la mayoria de leads**: La clasificacion solo se ejecuta cuando `message_count >= 3 AND message_count % 3 === 0`. La mayoria de conversaciones tienen solo 2 mensajes del usuario, por lo que nunca llegan al umbral. Hay que bajar el umbral a 2 mensajes.

3. **Notificaciones push no llegan**: La tabla `push_subscriptions` esta VACIA. La suscripcion anterior fue eliminada (error 410 - endpoint expirado). Se necesita que te vuelvas a suscribir desde la app instalada. Ademas, el Service Worker referencia iconos que no existen.

## Cambios a realizar

### 1. Icono oficial en todas partes
- Copiar el nuevo SVG a `public/nova-icon.svg`
- Actualizar `public/manifest.json`: usar el SVG como icono principal con `purpose: "any"` y `purpose: "maskable"` (Android rellenara el fondo con el theme_color oscuro)
- Actualizar `index.html`: favicon apuntando al SVG
- Actualizar `public/sw.js`: iconos de notificacion push apuntando al SVG correcto

### 2. Arreglar clasificacion IA de leads
- En `supabase/functions/sara-chat/index.ts`: cambiar el umbral de clasificacion de `count >= 3 && count % 3 === 0` a `count >= 2` para que clasifique desde el segundo mensaje del usuario y en cada mensaje posterior
- Esto hara que todos los leads nuevos (y los existentes cuando envien otro mensaje) reciban score, analisis y clasificacion automatica

### 3. Arreglar notificaciones push
- Verificar que el `send-push-notification` edge function tiene el header CORS correcto para aceptar llamadas internas con service role key
- Agregar logs adicionales en `send-push-notification` para diagnosticar problemas
- Importante: despues de implementar estos cambios, deberas abrir la app en tu movil, ir a tu perfil y activar las notificaciones de nuevo para registrar un nuevo token push

---

## Seccion tecnica

### Archivos a modificar:
1. `public/nova-icon.svg` - reemplazar con el nuevo icono oficial
2. `public/manifest.json` - referencias al SVG, mantener theme_color #0f0a1e
3. `index.html` - favicon SVG
4. `public/sw.js` - icon/badge en notificaciones push
5. `supabase/functions/sara-chat/index.ts` - umbral de clasificacion IA (linea 345)
6. `supabase/functions/send-push-notification/index.ts` - logging mejorado

### Sobre las VAPID keys:
Las claves VAPID estan correctamente guardadas como secretos del proyecto (VAPID_PUBLIC_KEY y VAPID_PRIVATE_KEY). El problema NO son las claves, sino que la tabla de suscripciones push esta vacia porque el token anterior expiro y fue eliminado. Solo necesitas volver a activar las notificaciones desde la app.

