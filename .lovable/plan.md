

# Plan: Mejoras del Admin, Chat de Sara, Referidos, Notificaciones Push y PWA

## Resumen

Este plan cubre 6 areas principales:
1. Arreglar scroll del chat de Sara en movil
2. Sistema de referidos con registro automatico
3. Icono de la app sin borde blanco
4. Analiticas admin para conversaciones de Sara
5. Notificaciones push con badges
6. Tab de usuarios admin con exportacion

---

## 1. Arreglar scroll del chat de Sara en movil

**Problema**: En la version movil no se puede hacer scroll dentro del chat de Sara (AIChatMode).

**Solucion**: El componente `AIChatMode.tsx` usa `ScrollArea` pero el contenedor padre tiene restricciones de altura fijas. Se necesita:
- Agregar `overflow-y: auto` y `-webkit-overflow-scrolling: touch` al contenedor del chat
- Asegurar que el `ScrollArea` tenga `touch-action: pan-y` para que funcione el scroll tactil en movil
- Ajustar la estructura del contenedor para que flex funcione correctamente con alturas dinamicas

**Archivos**: `src/components/VirtualAssistant/AIChatMode.tsx`, `src/components/VirtualAssistant/index.tsx`

---

## 2. Sistema de referidos con codigo en registro

**Problema**: Al registrarse, no hay opcion de ingresar un codigo de referido. Ademas, el link de invitacion debe incluir el codigo de referido para que se auto-rellene al abrir.

**Solucion**:

### 2a. Registro con codigo de referido
- En `Auth.tsx`, agregar un campo "Codigo de referido" (opcional) en el formulario de registro
- Al detectar `?ref=CODIGO` en la URL, auto-rellenar ese campo
- Tras el registro exitoso, buscar en la tabla `profiles` al usuario con ese `referral_code` y crear un registro en la tabla `referrals` vinculando referidor y referido
- Mostrar el campo de referido en la seccion de datos opcionales del registro

### 2b. Link de invitacion en el perfil del usuario
- En la pagina de perfil (`Profile.tsx`), agregar una seccion de "Referidos" con:
  - Mostrar el codigo de referido del usuario
  - Un link de invitacion copiable (ej: `solutionsnova.es/auth?ref=NOVAXXXXXX`)
  - Boton para copiar el link

### 2c. Admin: ver referidos con datos
- La tabla de referidos en Admin ya existe. Se mejorara para mostrar de donde vino cada usuario referido.

**Archivos**: `src/pages/Auth.tsx`, `src/pages/Profile.tsx`, `src/pages/Admin.tsx`

---

## 3. Icono de app sin borde blanco

**Problema**: El icono SVG actual tiene un fondo transparente, lo que causa que el sistema operativo ponga un borde/fondo blanco alrededor al instalarlo como PWA.

**Solucion**:
- Generar iconos PNG en multiples resoluciones (192x192, 512x512) con fondo solido del color de la marca (`#0f0a1e`) rellenando todo el area
- Actualizar `manifest.json` para usar PNG en lugar de SVG para los iconos
- Separar el icono `maskable` (con padding) del icono `any` (sin padding extra)
- Crear el icono maskable con zona segura (el logo centrado en el 80% interior)

**Nota tecnica**: Los iconos SVG no son bien soportados como iconos de PWA en todos los dispositivos. Se necesitan PNGs. Se creara un componente o script que genere las imagenes correctas, o se hara manualmente ajustando el SVG para que tenga fondo solido y exportandolo.

**Solucion practica**: Modificar el SVG actual para que tenga un fondo solido `#0f0a1e` que cubra todo el viewBox, y actualizar manifest.json con entradas separadas para `any` y `maskable`.

**Archivos**: `public/nova-icon.svg`, `public/manifest.json`

---

## 4. Analiticas admin: guardar y visualizar chats de Sara

**Problema**: Las conversaciones de Sara no se estan guardando correctamente en la base de datos.

**Solucion**:
- Verificar que la edge function `sara-chat` este insertando correctamente tanto mensajes del usuario como respuestas en `sara_anonymous_messages`
- Verificar que las conversaciones se crean/actualizan en `sara_anonymous_conversations`
- Verificar las politicas RLS: las tablas usan `has_role(auth.uid(), 'admin')` pero tambien tienen politicas con `profiles.is_admin`. Asegurar que el admin tenga el rol en `user_roles`
- Revisar los logs de la edge function para detectar errores

**Archivos**: `supabase/functions/sara-chat/index.ts` (verificar), posible migracion de datos

---

## 5. Notificaciones push con badges

**Problema**: Se necesita que al iniciar sesion en la app movil, se mantenga la sesion y lleguen notificaciones push con badges en el icono.

**Solucion**:
- La sesion ya se persiste via `localStorage` (configurado en el cliente de Supabase)
- Se necesita generar claves VAPID reales para las notificaciones push
- Crear una edge function `send-push-notification` que envie notificaciones a los endpoints suscritos
- Integrar el envio de push en eventos clave (nuevo mensaje de Sara, nuevo usuario registrado)
- El service worker ya existe en `public/sw.js` y maneja push y badges

**Pasos tecnicos**:
1. Generar par de claves VAPID (publica/privada) y guardar la privada como secret
2. Actualizar la clave publica en `usePushNotifications.ts`
3. Crear edge function `send-push-notification` usando la libreria `web-push`
4. Llamar a esta funcion desde `sara-chat` y desde triggers relevantes
5. En el Dashboard, solicitar permiso de notificaciones al usuario admin

**Archivos**: `src/hooks/usePushNotifications.ts`, `public/sw.js`, nueva edge function `supabase/functions/send-push-notification/index.ts`, `src/pages/Dashboard.tsx`

---

## 6. Tab de usuarios admin con exportacion

**Problema**: El tab de usuarios ya existe pero necesita opciones de exportacion.

**Solucion**:
- Agregar boton "Exportar CSV" en el tab de usuarios del admin
- El boton generara un CSV con todos los datos de los perfiles (nombre, email, telefono, empresa, sector, web, fecha de registro, codigo de referido)
- Descargar el archivo automaticamente

**Archivos**: `src/pages/Admin.tsx`

---

## Detalles tecnicos

### Migraciones de base de datos
- Agregar columna `referred_by_code` a la tabla `profiles` para registrar el codigo de referido usado al registrarse (texto, nullable)

### Edge functions
- Actualizar `sara-chat` si es necesario para corregir persistencia
- Crear `send-push-notification` para enviar notificaciones push reales

### Orden de implementacion
1. Fix scroll movil del chat (rapido)
2. Icono PWA sin borde blanco
3. Sistema de referidos en registro
4. Analiticas y persistencia de conversaciones Sara
5. Exportacion CSV en admin
6. Notificaciones push con VAPID (requiere secret key)

