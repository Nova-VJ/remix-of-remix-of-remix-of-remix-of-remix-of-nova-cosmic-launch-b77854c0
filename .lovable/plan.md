
## Fix del Chat de Sara - Endpoint incorrecto

### Problema
El chat de Sara llama a la edge function del proyecto Lovable Cloud (`rpqldtlvdzdwspxpccuh.supabase.co`), pero la funcion real de Sara esta desplegada en un proyecto Supabase externo (`dnnqeydtybmzriyjqqyt.supabase.co`). Esto causa errores 500 porque la edge function local no es la correcta.

### Solucion

**Archivo: `src/lib/saraApi.ts`** (linea 1-2)

Cambiar el endpoint de:
```typescript
const SARA_ENDPOINT =
  `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/sara-chat`;
```

A:
```typescript
const SARA_ENDPOINT =
  import.meta.env.VITE_SARA_CHAT_ENDPOINT ||
  "https://dnnqeydtybmzriyjqqyt.supabase.co/functions/v1/sara-chat";
```

Esto usa una variable de entorno dedicada (`VITE_SARA_CHAT_ENDPOINT`) con fallback al endpoint correcto. No se hardcodea el endpoint del proyecto equivocado.

**Archivo: `src/config/env.ts`**

Agregar la variable de configuracion para documentarla junto a las demas:
```typescript
export const SARA_CHAT_ENDPOINT = import.meta.env.VITE_SARA_CHAT_ENDPOINT ?? 'https://dnnqeydtybmzriyjqqyt.supabase.co/functions/v1/sara-chat';
```

### Lo que NO se toca
- El backend / edge function (no hay cambios en `supabase/functions/sara-chat/`)
- El formato de request/response (ya es correcto: `{message, session_id, anon_id}` y `{reply, session_id}`)
- Los headers CORS (ya funcionan con el endpoint correcto)

### Resultado esperado
Despues del cambio, el chat de Sara llamara a `dnnqeydtybmzriyjqqyt.supabase.co/functions/v1/sara-chat` y recibira respuestas 200 con el reply correcto.
