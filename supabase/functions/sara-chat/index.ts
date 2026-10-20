import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { SARA_KNOWLEDGE } from "./knowledge.ts";

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

// Solo los orígenes de la lista blanca reciben cabeceras CORS: el navegador
// bloquea a cualquier otra web que intente usar a Sara.
const json = (data: unknown, status = 200, origin = "") =>
  new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json",
      ...(origin
        ? {
          "Access-Control-Allow-Origin": origin,
          "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-anon-id",
          "Access-Control-Allow-Methods": "POST, OPTIONS",
        }
        : {}),
      "Vary": "Origin",
    },
  });

// Visitantes sin cuenta: mensajes por sesión en 24 h. Debe coincidir con
// DEMO_LIMIT en src/hooks/useSaraChat.ts (el contador del navegador se puede
// borrar; este no).
const ANON_DAILY_LIMIT = 10;
// Por conexión (IP) en 24 h: impide saltarse el límite cambiando de session_id.
// Más alto que el de sesión porque varias personas pueden compartir IP.
const ANON_IP_DAILY_LIMIT = 30;
const USER_IP_DAILY_LIMIT = 100;
// Red de seguridad para la factura de IA: mensajes de toda la web en 24 h.
const SITE_DAILY_CAP = parseInt(Deno.env.get("SARA_DAILY_CAP") ?? "1000", 10);
const MAX_MESSAGE_CHARS = 2000;
const DAY_MS = 24 * 60 * 60 * 1000;

// Proyecto de Supabase de la web, donde inician sesión los usuarios.
const WEB_SUPABASE_URL = Deno.env.get("WEB_SUPABASE_URL") ?? "https://bxweazufzinukesvhiji.supabase.co";
const WEB_SUPABASE_ANON_KEY = Deno.env.get("WEB_SUPABASE_ANON_KEY") ?? "";

// Comprueba la sesión contra el proyecto de la web: un token inventado no cuenta.
const isSignedIn = async (authHeader: string) => {
  const token = authHeader.replace(/^Bearer\s+/i, "").trim();
  if (!WEB_SUPABASE_ANON_KEY || !token || token.split(".").length !== 3) return false;
  try {
    const res = await fetch(`${WEB_SUPABASE_URL}/auth/v1/user`, {
      headers: { apikey: WEB_SUPABASE_ANON_KEY, Authorization: `Bearer ${token}` },
    });
    return res.ok;
  } catch {
    return false;
  }
};

// IP real del visitante (Cloudflare la pone y rechaza las peticiones que la
// falsifican). Se guarda resumida, nunca la IP en claro.
const clientIpKey = async (req: Request) => {
  const ip = req.headers.get("cf-connecting-ip") ??
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(`nova-sara:${ip}`));
  return Array.from(new Uint8Array(digest)).slice(0, 8).map((b) => b.toString(16).padStart(2, "0")).join("");
};

const isAllowedOrigin = (origin: string) => {
  if (!origin) return false;
  if (origin === "https://solutionsnova.es") return true;
  if (origin === "https://www.solutionsnova.es") return true;

  try {
    const u = new URL(origin);
    // Desarrollo local y vistas previas de Cloudflare Pages
    if (u.hostname === "localhost" || u.hostname === "127.0.0.1") return true;
    if (u.hostname === "77851234.pages.dev" || u.hostname.endsWith(".77851234.pages.dev")) return true;
  } catch {}

  return false;
};

Deno.serve(async (req: Request) => {
  const origin = req.headers.get("origin") ?? "";
  const allowOrigin = isAllowedOrigin(origin) ? origin : "";

  // Peticiones desde webs ajenas: sin cabeceras CORS y rechazadas
  if (origin && !allowOrigin) return json({ error: "Origin not allowed" }, 403);

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

  const message = String(extracted ?? "").trim().slice(0, MAX_MESSAGE_CHARS);

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
  const sid = String(body.session_id ?? body.sessionId ?? "").trim().slice(0, 100) || crypto.randomUUID();
  // La memoria se guarda con la IP resumida delante: así se pueden contar los
  // mensajes de una misma conexión aunque cambie de session_id.
  const ipKey = await clientIpKey(req);
  const memSid = `${ipKey}|${sid}`;

  // Secrets Gemini. Con VERTEX_API_KEY se usa Vertex AI (crédito de Google Cloud del proyecto VERTEX_PROJECT);
  // si no, Gemini de AI Studio (prepago) como antes.
  const VERTEX_API_KEY = Deno.env.get("VERTEX_API_KEY") ?? "";
  const VERTEX_PROJECT = Deno.env.get("VERTEX_PROJECT") ?? "lupa-nova";
  const VERTEX_MODEL = Deno.env.get("VERTEX_MODEL") ?? "gemini-3.5-flash-lite";
  const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY") ?? "";
  const GEMINI_MODEL = Deno.env.get("GEMINI_MODEL") ?? "gemini-2.5-flash";
  if (!VERTEX_API_KEY && !GEMINI_API_KEY)
    return json({ error: "Missing VERTEX_API_KEY / GEMINI_API_KEY" }, 500, allowOrigin);

  // Conocimiento de NOVA (knowledge.ts) + notas opcionales desde Secrets
  const extra = (Deno.env.get("SARA_EXTRA_PROMPT") ?? "").trim();
  const system = extra ? `${SARA_KNOWLEDGE}\n\n# Notas adicionales\n${extra}` : SARA_KNOWLEDGE;

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

    const signedIn = await isSignedIn(req.headers.get("authorization") ?? "");

    const { count: ipCount, error: ipError } = await supabase
      .from(MEMORY_TABLE)
      .select("session_id", { count: "exact", head: true })
      .like("session_id", `${ipKey}|%`)
      .eq("role", "user")
      .gte("created_at", since);
    if (ipError) console.error("IP daily count error:", ipError);
    if ((ipCount ?? 0) >= (signedIn ? USER_IP_DAILY_LIMIT : ANON_IP_DAILY_LIMIT)) {
      return json(
        {
          error: "Has alcanzado el límite de mensajes de hoy. Escríbenos por WhatsApp y te respondemos enseguida.",
          limit_reached: true,
        },
        429,
        allowOrigin
      );
    }

    if (!signedIn) {
      const { count, error } = await supabase
        .from(MEMORY_TABLE)
        .select("session_id", { count: "exact", head: true })
        .eq("session_id", memSid)
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
      .eq("session_id", memSid)
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

  const aiBody = JSON.stringify({ systemInstruction: { parts: [{ text: system }] }, contents });
  const callGemini = (u: string, key: string) =>
    fetch(u, { method: "POST", headers: { "Content-Type": "application/json", "x-goog-api-key": key }, body: aiBody });

  let gemRes = await callGemini(url, VERTEX_API_KEY || GEMINI_API_KEY);

  // Si Vertex falla (p. ej. facturación desactivada en Google Cloud) y hay clave de AI Studio, se usa esa.
  if (!gemRes.ok && VERTEX_API_KEY && GEMINI_API_KEY) {
    console.error("Vertex failed:", gemRes.status, (await gemRes.text().catch(() => "")).slice(0, 300));
    gemRes = await callGemini(
      `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(GEMINI_MODEL)}:generateContent`,
      GEMINI_API_KEY
    );
  }

  // El detalle técnico va solo al registro; el visitante ve un mensaje amable.
  if (!gemRes.ok) {
    console.error("AI failed:", gemRes.status, (await gemRes.text().catch(() => "")).slice(0, 300));
    return json(
      { error: "Ahora mismo no puedo responder. Escríbenos por WhatsApp y te atendemos enseguida.", ai_failed: true },
      503,
      allowOrigin
    );
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
      { session_id: memSid, role: "user", content: message },
      { session_id: memSid, role: "assistant", content: reply },
    ]);
    // Conservación (política de privacidad): las conversaciones se borran al año.
    // Basta con limpiar de vez en cuando, no en cada mensaje.
    if (Math.random() < 0.05) {
      const cutoff = new Date(Date.now() - 365 * DAY_MS).toISOString();
      const { error: purgeError } = await supabase.from(MEMORY_TABLE).delete().lt("created_at", cutoff);
      if (purgeError) console.error("Memory purge error:", purgeError);
    }
  }

  // ✅ Respuesta compatible con más widgets: reply + message
  return json({ reply, message: reply, session_id: sid }, 200, allowOrigin);
});
