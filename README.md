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

Hay **dos proyectos** de Supabase:

| Proyecto | Para qué | Dónde se configura |
| --- | --- | --- |
| `rpqldtlvdzdwspxpccuh` | Web principal: login, panel de cliente, admin, formularios | `VITE_SUPABASE_URL` y `VITE_SUPABASE_PUBLISHABLE_KEY` en `.env` |
| `dnnqeydtybmzriyjqqyt` ("Nova Solutions Chatbot") | Solo Sara (función `sara-chat` y sus conversaciones) | `VITE_SARA_CHAT_ENDPOINT` en `.env` |

La URL y la clave de `.env` tienen que ser **del mismo proyecto**; si no, Supabase responde "Invalid API key" y fallan el login y el panel.

Las migraciones están en `supabase/migrations` y las funciones en `supabase/functions`. Para desplegar Sara:

```sh
npx supabase login
npx supabase functions deploy sara-chat --project-ref dnnqeydtybmzriyjqqyt
```

### Límites de Sara

- Visitantes sin cuenta: 10 mensajes cada 24 h (`DEMO_LIMIT` en `src/hooks/useSaraChat.ts` y `ANON_DAILY_LIMIT` en la función; tienen que coincidir).
- Toda la web: tope de seguridad de 1000 mensajes cada 24 h (secreto opcional `SARA_DAILY_CAP`). Al llegar, Sara deriva a WhatsApp.
- Por persona: máximo 10 mensajes por minuto (antispam).

Secretos que necesitan las funciones (*Supabase → Edge Functions → Secrets*):

| Secreto | Lo usa |
| --- | --- |
| `GEMINI_API_KEY` | `sara-chat` (Google AI Studio). Mientras no exista, Sara usa la pasarela de Lovable (`LOVABLE_API_KEY`) |
| `GEMINI_MODEL` | opcional, por defecto `gemini-2.5-flash-lite` |
| `SARA_DAILY_CAP` | opcional, tope diario de mensajes de toda la web (por defecto 1000) |
| `ELEVENLABS_API_KEY` | `elevenlabs-tts` |
| `DEEPGRAM_API_KEY` | `elevenlabs-stt` |
| `GOOGLE_TTS_API_KEY` / `GOOGLE_SERVICE_ACCOUNT_JSON` | `google-tts` |
| `VAPID_PUBLIC_KEY` / `VAPID_PRIVATE_KEY` | `send-push-notification` |
