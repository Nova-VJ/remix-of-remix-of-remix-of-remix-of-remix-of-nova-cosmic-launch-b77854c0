

# Plan: Icono definitivo, notificaciones push funcionales y badge de alertas

## Problemas encontrados

### 1. Icono con marco blanco (PC y movil)
El SVG actual no se renderiza bien como icono de app/favicon en algunos contextos. La solucion definitiva es usar el nuevo SVG que has proporcionado (`Favi_icon_Nova_logo_de_app_y_pc-4.svg`) y copiarlo como `public/nova-icon.svg`, reemplazando el anterior.

### 2. Notificaciones push NO llegan (error 403 VAPID)
Este es el problema principal. Los logs del servidor muestran este error claro:

```text
403: the VAPID credentials in the authorization header 
do not correspond to the credentials used to create 
the subscriptions.
```

Esto significa que la clave publica VAPID que usa el frontend para crear la suscripcion (`BIuPxNAgh93iY84V...`) **NO coincide** con las claves VAPID guardadas como secretos del proyecto. Cuando creaste las claves VAPID en una web y me las diste, se guardaron como secretos del servidor. Pero la clave publica que esta hardcodeada en el frontend es diferente.

**Solucion**: Mover la clave publica VAPID a una variable de entorno para que sea consistente. Y lo mas importante: necesitas **verificar** que la clave publica VAPID que tienes guardada en un lugar seguro coincide con la que esta en el frontend. Si no coincide, necesitaremos actualizarla.

**Pasos concretos**:
- Cambiar el frontend para usar `VITE_VAPID_PUBLIC_KEY` como variable de entorno en vez de tener la clave hardcodeada
- Alternativamente, puedo leer la clave publica desde el secreto del servidor a traves de un endpoint seguro
- **Despues de arreglar las claves**, hay que borrar la suscripcion actual (que fue creada con la clave incorrecta) y re-suscribirse

### 3. Punto rojo de notificaciones tipo Facebook/WhatsApp
Actualmente el badge de notificaciones solo aparece dentro del panel de admin. Hay que agregar un indicador visual permanente (punto rojo con numero) en la Navbar, visible en todo momento cuando el admin esta logueado, usando realtime para actualizarse automaticamente.

## Cambios a realizar

### Archivo 1: `public/nova-icon.svg`
- Reemplazar con el nuevo SVG proporcionado (fondo transparente, sin marco)

### Archivo 2: `index.html`
- Sin cambios (ya apunta a `/nova-icon.svg`)

### Archivo 3: `public/manifest.json`
- Sin cambios (ya apunta a `/nova-icon.svg` con purpose any/maskable)

### Archivo 4: `src/hooks/usePushNotifications.ts`
- Crear un mecanismo para obtener la clave publica VAPID correcta
- Opcion recomendada: usar una variable de entorno `VITE_VAPID_PUBLIC_KEY` o leerla del secreto del servidor
- La clave publica VAPID del frontend DEBE coincidir con el par de claves del servidor

### Archivo 5: `src/components/Navbar.tsx`
- Agregar indicador de notificaciones (punto rojo con numero) para el admin
- Consultar `admin_notifications` con filtro `read = false` y mostrar el conteo
- Suscripcion realtime a cambios en `admin_notifications` para actualizar en tiempo real
- Al hacer clic, navegar al panel de admin en la pestana de Sara IA / Alertas

### Archivo 6: `src/pages/Admin.tsx`
- Agregar auto-suscripcion a push notifications cuando el admin accede al panel (si aun no esta suscrito)

### Archivo 7: `supabase/functions/send-push-notification/index.ts`
- Agregar un endpoint GET que devuelva la clave publica VAPID (para que el frontend la lea de forma segura y siempre coincida con el servidor)

## Seccion tecnica

### Sobre las claves VAPID
El error 403 es definitivo: la clave publica en el frontend (`BIuPxNAgh93iY84VXiCUywI5ucFgeJ7pfgYDhOh0eZXYLh7EA7lHhFJCYtIEfqUHkkWdK5P277KHVQPG7Eo_yxc`) NO es la misma que el par guardado como secreto del servidor. 

Para solucionarlo de raiz, creare un nuevo endpoint que devuelve la clave publica VAPID desde el servidor, y el frontend la usara para suscribirse. Asi siempre coincidiran.

### Flujo de notificacion corregido
```text
1. Admin abre Dashboard/Admin -> se suscribe automaticamente
2. Frontend pide la clave publica VAPID al servidor
3. Se crea suscripcion push con la clave correcta
4. Sara clasifica lead con score >= 50
5. sara-chat llama a send-push-notification
6. send-push-notification envia push con las claves correctas
7. El movil/PC recibe la notificacion nativa
8. Badge rojo en Navbar se actualiza en tiempo real
```

### Badge en Navbar (punto rojo)
- Solo visible para el admin (email === 'info@solutionsnova.es')
- Consulta inicial de `admin_notifications` con `read = false`
- Suscripcion realtime para actualizacion instantanea
- Punto rojo con numero (estilo WhatsApp/Facebook)
- Al pulsar, redirige a `/admin` (tab Sara IA)

### Pasos post-implementacion
Despues de aplicar los cambios:
1. Borrar los datos de la app instalada en PC y movil (o desinstalar y reinstalar)
2. Volver a abrir la app
3. Iniciar sesion como admin
4. Aceptar el permiso de notificaciones cuando aparezca
5. Enviar un mensaje de prueba a Sara para verificar que llega la notificacion

