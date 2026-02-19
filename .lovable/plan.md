
## Plan completo de mejoras

Este plan cubre 7 grupos de tareas prioritarias detectadas en tu mensaje.

---

### Problema 1: Las conversaciones no aparecen en el panel de admin

**Causa raíz identificada:** El endpoint de Sara en `src/lib/saraApi.ts` apunta a un proyecto Supabase incorrecto (`dnnqeydtybmzriyjqqyt.supabase.co`) en lugar del proyecto activo. Además, la función `sara-chat` necesita redeployarse contra el proyecto correcto.

**Solución:**
- Corregir la URL del endpoint en `saraApi.ts` usando la variable de entorno correcta `import.meta.env.VITE_SUPABASE_URL` en lugar de una URL hardcodeada
- Redesplegar la función `sara-chat`

---

### Problema 2: Historial demo al crear cuenta

**Situación actual:** Cuando el usuario supera los 3 mensajes y crea una cuenta, el historial demo en localStorage se pierde.

**Solución en `useSaraChat.ts`:**
- Al detectar que el usuario acaba de iniciar sesión y hay mensajes demo en localStorage, migrar esos mensajes a la base de datos como primeros mensajes de su nueva conversación
- La clave es detectar la transición `isDemo → !isDemo` y ejecutar la migración automáticamente

---

### Problema 3: Opción de releer el último mensaje al bloquearse el chat

**Solución en `AIChatMode.tsx`:**
- Cuando se llega al límite demo, en lugar de solo mostrar el diálogo de login, mostrar también un botón "Ver últimos mensajes" que permita scroll hacia arriba para releer la conversación sin poder escribir
- El input sigue bloqueado pero el scroll queda habilitado

---

### Problema 4: Sara puede agregar servicios al carrito con autorización

**Flujo propuesto:**
1. Sara analiza la necesidad del usuario en la conversación
2. Cuando detecta suficiente información, Sara genera una propuesta con servicios específicos
3. Aparece en el chat una tarjeta de propuesta (botón especial) que el usuario puede aceptar o rechazar
4. Si acepta → se añaden los servicios al carrito automáticamente vía `CartContext`

**Implementación:**
- Actualizar el `SYSTEM_PROMPT` en la edge function `sara-chat` para que Sara pueda devolver un campo `cart_proposal` en formato JSON junto con su respuesta
- En `AIChatMode.tsx`, detectar si la respuesta incluye `[PROPUESTA_CARRITO:...]` y renderizar una tarjeta de propuesta especial con botón "Añadir al carrito"
- Conectar con `CartContext.addItem()` cuando el usuario acepta

---

### Problema 5: Favicon con logo de Nova

**Solución:**
- Copiar `src/assets/logo.png` al directorio `public/` como `favicon.png`
- Actualizar `index.html` para referenciar `/favicon.png` en el tag `<link rel="icon">`
- Añadir también meta tags para iOS/Android home screen (apple-touch-icon)

---

### Problema 6: Categoría "Instalar App" — PWA con notificaciones

**Implementación PWA completa:**

1. **Nueva página `/instalar-app`:** Tutorial paso a paso con instrucciones visuales para instalar en Android, iOS y PC
2. **Configuración PWA:** Instalar `vite-plugin-pwa`, crear `manifest.json` con iconos del logo de Nova, registrar service worker
3. **Push notifications web:** Usar la Web Push API para enviar notificaciones cuando hay actualizaciones relevantes (nuevo mensaje de admin, estado de proyecto, etc.)
4. **Badge en icono:** Usar la `navigator.setAppBadge()` API para mostrar el número de notificaciones no leídas en el icono de la app instalada (efecto badge tipo Facebook)
5. **Nueva opción en el menú del asistente:** Añadir "Instalar App" con ícono `Download` en `VirtualAssistant/index.tsx`
6. **Nueva ruta** en `App.tsx` → `/instalar-app`
7. **Notificaciones admin:** Crear función edge `send-push-notification` que envíe push notifications al admin cuando hay nuevas conversaciones importantes de Sara

**Base de datos:** Tabla `push_subscriptions` para almacenar suscripciones de notificaciones push de usuarios y admin

---

### Problema 7: Filtro por fechas en estadísticas de Sara IA

**Implementación en `SaraLeadIntelligence.tsx`:**
- Añadir selector de rango de fechas con dos inputs de tipo date (desde / hasta) usando `react-day-picker` (ya instalado)
- Los datos de conversaciones, gráficas semanales y métricas se filtrarán automáticamente por ese rango
- Añadir botones de acceso rápido: "Hoy", "Esta semana", "Este mes", "Últimos 3 meses"
- La gráfica semanal cambiará a mostrar datos del rango seleccionado

---

### Pregunta sobre referidos de Lovable

Sobre quién te invitó a Lovable con un link de referidos: esa información es interna de la plataforma Lovable y no tengo acceso a ella. Deberías contactar directamente con el soporte de Lovable en support@lovable.dev para consultarlo.

---

### Resumen técnico de archivos a modificar/crear

| Archivo | Cambio |
|---|---|
| `src/lib/saraApi.ts` | Corregir URL hardcodeada por variable de entorno |
| `src/hooks/useSaraChat.ts` | Migración de mensajes demo al crear cuenta |
| `src/components/VirtualAssistant/AIChatMode.tsx` | Botón de releer + tarjeta de propuesta de carrito |
| `supabase/functions/sara-chat/index.ts` | Añadir soporte cart_proposal en respuesta |
| `index.html` | Favicon con logo Nova + meta tags PWA |
| `public/favicon.png` | Copiar logo como favicon |
| `public/manifest.json` | Manifiesto PWA |
| `vite.config.ts` | Añadir vite-plugin-pwa |
| `src/App.tsx` | Nueva ruta /instalar-app |
| `src/pages/InstalarApp.tsx` | Nueva página tutorial instalación |
| `src/components/SaraLeadIntelligence.tsx` | Filtro de fechas con calendario |
| `src/components/VirtualAssistant/index.tsx` | Opción "Instalar App" en menú |
| Migration SQL | Tabla `push_subscriptions` |
| `supabase/functions/send-push/index.ts` | Edge function notificaciones push |
