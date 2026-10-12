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

Cada push a `main` se publica solo. Configuración del proyecto en Cloudflare Pages:

| Ajuste | Valor |
| --- | --- |
| Framework preset | None / Vite |
| Build command | `npm run build` |
| Build output directory | `dist` |
| Node | se toma de `.nvmrc` |

Las variables `VITE_*` se leen de `.env` (solo contiene claves públicas). Para cambiarlas sin tocar el repo, defínelas en *Settings → Environment variables* de Pages.

Las cabeceras (caché de `/assets`, service worker, seguridad) están en [`public/_headers`](public/_headers).

## Backend (Supabase)

Proyecto `dnnqeydtybmzriyjqqyt`. Las migraciones están en `supabase/migrations` y las funciones en `supabase/functions`. Para desplegar una función:

```sh
npx supabase login
npx supabase functions deploy sara-chat --project-ref dnnqeydtybmzriyjqqyt
```

Secretos que necesitan las funciones (*Supabase → Edge Functions → Secrets*):

| Secreto | Lo usa |
| --- | --- |
| `GEMINI_API_KEY` | `sara-chat` (Google AI Studio). Mientras no exista, Sara usa la pasarela de Lovable (`LOVABLE_API_KEY`) |
| `GEMINI_MODEL` | opcional, por defecto `gemini-2.5-flash-lite` |
| `ELEVENLABS_API_KEY` | `elevenlabs-tts` |
| `DEEPGRAM_API_KEY` | `elevenlabs-stt` |
| `GOOGLE_TTS_API_KEY` / `GOOGLE_SERVICE_ACCOUNT_JSON` | `google-tts` |
| `VAPID_PUBLIC_KEY` / `VAPID_PRIVATE_KEY` | `send-push-notification` |
