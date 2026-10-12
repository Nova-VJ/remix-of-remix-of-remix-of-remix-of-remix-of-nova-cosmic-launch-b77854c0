import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

type Body = {
  // soporta distintos formatos que puede enviar el widget web
  message?: string;
  input?: string;
  text?: string;
  messages?: Array<{ role?: string; content?: string }>;

  // session id en dos variantes
  session_id?: string;
  sessionId?: string;
};

const json = (data: unknown, status = 200, origin = "*") =>
  new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": origin,
      "Access-Control-Allow-Headers":
        "authorization, x-client-info, apikey, content-type, x-anon-id",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Vary": "Origin",
    },
  });

// Visitantes sin cuenta: mensajes por sesión en 24 h. Debe coincidir con
// DEMO_LIMIT en src/hooks/useSaraChat.ts (el contador del navegador se puede
// borrar; este no).
const ANON_DAILY_LIMIT = 10;
// Red de seguridad para la factura de IA: mensajes de toda la web en 24 h.
const SITE_DAILY_CAP = parseInt(Deno.env.get("SARA_DAILY_CAP") ?? "1000", 10);
const DAY_MS = 24 * 60 * 60 * 1000;

// La web inicia sesión contra su proyecto principal de Supabase, no contra este,
// así que aquí no se puede validar el token. Solo para el límite de visitantes,
// un JWT con role "authenticated" y sin caducar cuenta como usuario con cuenta.
const looksSignedIn = (authHeader: string) => {
  const token = authHeader.replace(/^Bearer\s+/i, "");
  try {
    const payload = token.split(".")[1];
    if (!payload) return false;
    const data = JSON.parse(atob(payload.replace(/-/g, "+").replace(/_/g, "/")));
    return data.role === "authenticated" && (!data.exp || data.exp * 1000 > Date.now());
  } catch {
    return false;
  }
};

const isAllowedOrigin = (origin: string) => {
  if (!origin) return false;
  if (origin === "http://localhost:5173") return true;
  if (origin === "https://solutionsnova.es") return true;
  if (origin === "https://www.solutionsnova.es") return true;

  // previews de Lovable
  try {
    const u = new URL(origin);
    if (u.hostname.endsWith(".lovable.app")) return true;
  } catch {}

  return false;
};

Deno.serve(async (req: Request) => {
  const origin = req.headers.get("origin") ?? "";
  const allowOrigin = isAllowedOrigin(origin) ? origin : "*";

  // CORS preflight
  if (req.method === "OPTIONS") return json({ ok: true }, 200, allowOrigin);
  if (req.method !== "POST")
    return json({ error: "Method not allowed" }, 405, allowOrigin);

  // Body
  let body: Body = {};
  try {
    body = (await req.json()) as Body;
  } catch {
    return json({ error: "Invalid JSON body" }, 400, allowOrigin);
  }

  // ✅ Extraer mensaje desde distintas claves posibles
  const extracted =
    body?.message ??
    body?.input ??
    body?.text ??
    (Array.isArray(body?.messages) ? body.messages.at(-1)?.content : "");

  const message = String(extracted ?? "").trim();

  if (!message) {
    return json(
      {
        error: "Missing message",
        details:
          "Envía {message:'...'} o {input:'...'} o {text:'...'} o {messages:[{role:'user',content:'...'}]}",
        received_keys: Object.keys(body || {}),
      },
      400,
      allowOrigin
    );
  }

  // ✅ Session ID (memoria por conversación) — soporta session_id y sessionId
  const sid = String(body.session_id ?? body.sessionId ?? "").trim() || crypto.randomUUID();

  // Secrets Gemini. Con VERTEX_API_KEY se usa Vertex AI (crédito de Google Cloud del proyecto VERTEX_PROJECT);
  // si no, Gemini de AI Studio (prepago) como antes.
  const VERTEX_API_KEY = Deno.env.get("VERTEX_API_KEY") ?? "";
  const VERTEX_PROJECT = Deno.env.get("VERTEX_PROJECT") ?? "lupa-nova";
  const VERTEX_MODEL = Deno.env.get("VERTEX_MODEL") ?? "gemini-3.5-flash-lite";
  const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY") ?? "";
  const GEMINI_MODEL = Deno.env.get("GEMINI_MODEL") ?? "gemini-1.5-flash";
  if (!VERTEX_API_KEY && !GEMINI_API_KEY)
    return json({ error: "Missing VERTEX_API_KEY / GEMINI_API_KEY" }, 500, allowOrigin);

  // Prompt (desde Secrets) — se presenta 1 sola vez por conversación
  const DEFAULT_SYSTEM = `
Eres Sara de Nova (asistente virtual).
Reglas:
- Preséntate SOLO una vez al inicio de cada conversación (cuando no haya historial).
- Responde claro, útil y en español.
- Si falta información, dilo y sugiere contactar con Nova.
- No inventes precios ni condiciones.
`.trim();

  const system = (Deno.env.get("SARA_SYSTEM_PROMPT") ?? DEFAULT_SYSTEM).trim();

  // Supabase (memoria)
  const SUPABASE_URL = Deno.env.get("SUPABASE_URL") ?? "";
  const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
  const MEMORY_TABLE = (Deno.env.get("SARA_MEMORY_TABLE") ?? "sara_memory_messages").trim();

  const hasMemory = Boolean(SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY && MEMORY_TABLE);
  const supabase = hasMemory ? createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY) : null;

  // Límites diarios. Si un recuento falla se deja pasar el mensaje en vez de
  // romper el chat.
  if (supabase) {
    const since = new Date(Date.now() - DAY_MS).toISOString();

    if (!looksSignedIn(req.headers.get("authorization") ?? "")) {
      const { count, error } = await supabase
        .from(MEMORY_TABLE)
        .select("session_id", { count: "exact", head: true })
        .eq("session_id", sid)
        .eq("role", "user")
        .gte("created_at", since);
      if (error) console.error("Session daily count error:", error);
      if ((count ?? 0) >= ANON_DAILY_LIMIT) {
        return json(
          {
            error: `Has usado los ${ANON_DAILY_LIMIT} mensajes gratuitos de hoy. Inicia sesión o crea una cuenta para seguir hablando con Sara, o escríbenos por WhatsApp.`,
            limit_reached: true,
          },
          429,
          allowOrigin
        );
      }
    }

    const { count: siteCount, error: siteError } = await supabase
      .from(MEMORY_TABLE)
      .select("session_id", { count: "exact", head: true })
      .eq("role", "user")
      .gte("created_at", since);
    if (siteError) console.error("Site daily count error:", siteError);
    if ((siteCount ?? 0) >= SITE_DAILY_CAP) {
      console.warn(`Sara daily cap reached (${SITE_DAILY_CAP})`);
      return json(
        {
          error: "Sara está atendiendo muchas consultas ahora mismo. Escríbenos por WhatsApp y te respondemos enseguida.",
          daily_cap: true,
        },
        503,
        allowOrigin
      );
    }
  }

  // Traer historial (últimos 16 mensajes)
  let history: Array<{ role: string; content: string }> = [];
  if (supabase) {
    const { data, error } = await supabase
      .from(MEMORY_TABLE)
      .select("role, content")
      .eq("session_id", sid)
      .order("created_at", { ascending: true })
      .limit(16);

    if (!error && data?.length) history = data as any;
  }

  const hasHistory = history.length > 0;

  // Construir contents para Gemini
  const contents = [
    ...history.map((m) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
    })),
    // Si NO hay historial, insertamos un “hola” interno para que se presente una vez
    ...(hasHistory ? [] : [{ role: "user", parts: [{ text: "Hola" }] }]),
    { role: "user", parts: [{ text: message }] },
  ];

  // Call Gemini
  const url = VERTEX_API_KEY
    ? `https://aiplatform.googleapis.com/v1/projects/${encodeURIComponent(VERTEX_PROJECT)}/locations/global/publishers/google/models/${encodeURIComponent(VERTEX_MODEL)}:generateContent`
    : `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(GEMINI_MODEL)}:generateContent`;

  const gemRes = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-goog-api-key": VERTEX_API_KEY || GEMINI_API_KEY },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: system }] },
      contents,
    }),
  });

  if (!gemRes.ok) {
    const errText = await gemRes.text().catch(() => "");
    return json({ error: "AI_FAILED", details: errText.slice(0, 300) }, 500, allowOrigin);
  }

  const gemJson = await gemRes.json();
  const reply =
    gemJson?.candidates?.[0]?.content?.parts
      ?.map((p: any) => p?.text)
      .filter(Boolean)
      .join("") ||
    "Ahora mismo no puedo responder. Inténtalo de nuevo.";

  // Guardar memoria (best effort)
  if (supabase) {
    await supabase.from(MEMORY_TABLE).insert([
      { session_id: sid, role: "user", content: message },
      { session_id: sid, role: "assistant", content: reply },
    ]);
  }

  // ✅ Respuesta compatible con más widgets: reply + message
  return json({ reply, message: reply, session_id: sid }, 200, allowOrigin);
});
