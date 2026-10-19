# NOVA Marketing Solutions — solutionsnova.es

Web de la agencia: React + Vite + TypeScript + Tailwind (shadcn/ui), con Supabase como backend (login, panel, admin, chat de Sara) y publicada en **Cloudflare Pages**.

## Trabajar en local

Requiere Node.js 20 o superior.

```sh
npm install
npm run dev        # servidor de desarrollo en http://localhost:8080
npm run build      # build de producción en dist/
npm run preview    # sirve dist/ para probarlo
```

`npm run build` hace dos cosas:

1. `vite build` genera la web en `dist/`.
2. `scripts/prerender-seo.mjs` escribe un HTML por página (`dist/casos-exito.html`, `dist/metodo-nova.html`…) con su título, descripción y etiquetas Open Graph, y un `dist/404.html`. Así Google y las previsualizaciones de WhatsApp/LinkedIn ven los datos correctos de cada página, y las URLs que no existen devuelven un 404 de verdad.

Los títulos y descripciones de cada página están en [`src/config/seoPages.json`](src/config/seoPages.json). Si añades una página pública nueva, añádela ahí y en `public/sitemap.xml`.

## Publicar (Cloudflare Pages)

Proyecto de Pages: **`77851234`** (dominio `solutionsnova.es`). Cada push a `main` se publica solo en la web. Cualquier otra rama genera una URL de prueba, por ejemplo `https://mejoras-rendimiento-seo.77851234.pages.dev`, para revisar los cambios antes de publicarlos.

Configuración del proyecto:

| Ajuste | Valor |
| --- | --- |
| Framework preset | None / Vite |
| Build command | `npm run build` |
| Build output directory | `dist` |
| Node | se toma de `.nvmrc` |

Las variables `VITE_*` se leen de `.env` (solo contiene claves públicas). Para cambiarlas sin tocar el repo, defínelas en *Settings → Environment variables* de Pages.

Las cabeceras (caché de `/assets`, service worker, seguridad) están en [`public/_headers`](public/_headers).

### Analítica y píxeles (opcional)

Solo se cargan si el visitante los acepta en el banner de cookies, y cada uno se activa al definir su ID en *Settings → Environment variables* de Pages (y volver a desplegar):

| Variable | Herramienta | Categoría de cookies |
| --- | --- | --- |
| `VITE_GA4_ID` | Google Analytics 4 (`G-…`) | Analíticas |
| `VITE_GOOGLE_ADS_ID` | Google Ads (`AW-…`) | Marketing |
| `VITE_META_PIXEL_ID` | Meta Pixel (Facebook/Instagram) | Marketing |

Las solicitudes de presupuesto y los envíos del formulario de contacto se registran como evento `generate_lead` (Google) y `Lead` (Meta). El código está en [`src/lib/tracking.ts`](src/lib/tracking.ts).

## Backend (Supabase)

Hay **dos proyectos** de Supabase:

| Proyecto | Para qué | Dónde se configura |
| --- | --- | --- |
| `rpqldtlvdzdwspxpccuh` | Web principal: login, panel de cliente, admin, formularios | `VITE_SUPABASE_URL` y `VITE_SUPABASE_PUBLISHABLE_KEY` en `.env` |
| `dnnqeydtybmzriyjqqyt` ("Nova Solutions Chatbot") | Solo Sara (función `sara-chat` y sus conversaciones) | `VITE_SARA_CHAT_ENDPOINT` en `.env` |

La URL y la clave de `.env` tienen que ser **del mismo proyecto**; si no, Supabase responde "Invalid API key" y fallan el login y el panel.

Las migraciones están en `supabase/migrations`. La función de Sara (`supabase/functions/sara-chat`) es la que está desplegada en el proyecto del chatbot. Para publicar un cambio:

- Automático: al cambiar `supabase/functions/sara-chat/` en `main`, la tarea de GitHub «Publicar Sara» (`.github/workflows/deploy-sara.yml`) la publica sola (necesita el secreto `SUPABASE_ACCESS_TOKEN`; también se lanza a mano desde Actions).
- Desde el panel: Supabase → Edge Functions → `sara-chat` → *Code*, pegar el contenido de `index.ts` y pulsar **Deploy updates**.
- O desde la terminal:

```sh
npx supabase login
npx supabase functions deploy sara-chat --project-ref dnnqeydtybmzriyjqqyt
```

### Límites de Sara

- Visitantes sin cuenta: 10 mensajes cada 24 h (`DEMO_LIMIT` en `src/hooks/useSaraChat.ts` y `ANON_DAILY_LIMIT` en la función; tienen que coincidir).
- Toda la web: tope de seguridad de 1000 mensajes cada 24 h (secreto opcional `SARA_DAILY_CAP`). Al llegar, Sara deriva a WhatsApp.
- Por persona: máximo 10 mensajes por minuto (antispam).

Secretos de Sara (*Supabase → Edge Functions → Secrets* del proyecto del chatbot):

| Secreto | Para qué |
| --- | --- |
| `VERTEX_API_KEY`, `VERTEX_PROJECT`, `VERTEX_MODEL` | IA de Google Cloud (Vertex). Si existe la clave, se usa esta |
| `GEMINI_API_KEY`, `GEMINI_MODEL` | Alternativa con Google AI Studio si no hay clave de Vertex |
| `SARA_SYSTEM_PROMPT` | Instrucciones de Sara (personalidad, servicios, precios) |
| `SARA_MEMORY_TABLE` | Tabla donde se guarda la conversación (por defecto `sara_memory_messages`) |
| `SARA_DAILY_CAP` | Opcional: tope diario de mensajes de toda la web (por defecto 1000) |
