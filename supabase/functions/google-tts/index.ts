import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const TTS_URL = "https://texttospeech.googleapis.com/v1/text:synthesize";

// Gemini TTS config (requires OAuth2 - higher quality, slower auth)
const GEMINI_STYLE_PROMPT = "Juvenil. Acento Valladolid. Castilla y León España.";
const GEMINI_VOICE_NAME = "Achernar";

// Standard TTS config (supports API key - zero auth overhead)
const STANDARD_VOICE_NAME = "es-ES-Neural2-A"; // High-quality female Spanish voice


// --- Service Account OAuth2 (fallback when API key not available) ---

let cachedToken: { token: string; expiresAt: number } | null = null;

function base64url(buf: ArrayBuffer): string {
  const bytes = new Uint8Array(buf);
  let binary = "";
  for (const b of bytes) binary += String.fromCharCode(b);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

async function getAccessToken(saJson: string): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  if (cachedToken && cachedToken.expiresAt > now + 60) {
    return cachedToken.token;
  }

  const sa = JSON.parse(saJson);
  const header = { alg: "RS256", typ: "JWT" };
  const payload = {
    iss: sa.client_email,
    scope: "https://www.googleapis.com/auth/cloud-platform",
    aud: "https://oauth2.googleapis.com/token",
    iat: now,
    exp: now + 3600,
  };

  const enc = new TextEncoder();
  const headerB64 = base64url(enc.encode(JSON.stringify(header)));
  const payloadB64 = base64url(enc.encode(JSON.stringify(payload)));
  const signInput = `${headerB64}.${payloadB64}`;

  const pemBody = sa.private_key
    .replace("-----BEGIN PRIVATE KEY-----", "")
    .replace("-----END PRIVATE KEY-----", "")
    .replace(/\s/g, "");
  const keyBytes = Uint8Array.from(atob(pemBody), (c) => c.charCodeAt(0));

  const cryptoKey = await crypto.subtle.importKey(
    "pkcs8",
    keyBytes,
    { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
    false,
    ["sign"]
  );

  const signature = await crypto.subtle.sign("RSASSA-PKCS1-v1_5", cryptoKey, enc.encode(signInput));
  const jwt = `${signInput}.${base64url(signature)}`;

  const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `grant_type=urn%3Aietf%3Aparams%3Aoauth%3Agrant-type%3Ajwt-bearer&assertion=${jwt}`,
  });

  if (!tokenRes.ok) {
    throw new Error(`OAuth token exchange failed: ${tokenRes.status} ${await tokenRes.text()}`);
  }

  const tokenData = await tokenRes.json();
  cachedToken = { token: tokenData.access_token, expiresAt: now + (tokenData.expires_in || 3600) };
  return cachedToken.token;
}

// --- Main handler ---

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { text } = await req.json();
    if (!text || typeof text !== "string" || text.trim().length === 0) {
      return new Response(JSON.stringify({ error: "Text is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const apiKey = Deno.env.get("GOOGLE_TTS_API_KEY");
    const saJson = Deno.env.get("GOOGLE_SERVICE_ACCOUNT_JSON");
    const inputText = text.substring(0, 5000);

    // Strategy 1: API Key + Neural2 voice (fastest - zero auth overhead, ~0.5-1s)
    if (apiKey) {
      const standardBody = JSON.stringify({
        input: { text: inputText },
        voice: { languageCode: "es-ES", name: STANDARD_VOICE_NAME },
        audioConfig: { audioEncoding: "MP3", speakingRate: 1.05, pitch: 1.0 },
      });

      const ttsRes = await fetch(`${TTS_URL}?key=${apiKey}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: standardBody,
      });

      if (ttsRes.ok) {
        const data = await ttsRes.json();
        if (data.audioContent) {
          const bytes = Uint8Array.from(atob(data.audioContent), (c) => c.charCodeAt(0));
          return new Response(bytes, {
            headers: { ...corsHeaders, "Content-Type": "audio/mpeg" },
          });
        }
      }
      console.warn("API key auth failed:", ttsRes.status, "- falling back to OAuth2 + Gemini");
    }

    // Strategy 2: Service Account OAuth2 + Gemini voice (fallback - higher quality but slower auth)
    if (!saJson) throw new Error("No GOOGLE_SERVICE_ACCOUNT_JSON or GOOGLE_TTS_API_KEY configured");

    const geminiBody = JSON.stringify({
      input: { text: inputText, prompt: GEMINI_STYLE_PROMPT },
      voice: { languageCode: "es-ES", name: GEMINI_VOICE_NAME, model_name: "gemini-2.5-flash-tts" },
      audioConfig: { audioEncoding: "MP3" },
    });

    const accessToken = await getAccessToken(saJson);
    const ttsRes = await fetch(TTS_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${accessToken}` },
      body: geminiBody,
    });

    if (!ttsRes.ok) {
      const errorText = await ttsRes.text();
      console.error("Google TTS error:", ttsRes.status, errorText);
      throw new Error(`Google TTS failed: ${ttsRes.status} ${errorText}`);
    }

    const data = await ttsRes.json();
    if (!data.audioContent) throw new Error("No audioContent in Google TTS response");

    const bytes = Uint8Array.from(atob(data.audioContent), (c) => c.charCodeAt(0));

    return new Response(bytes, {
      headers: { ...corsHeaders, "Content-Type": "audio/mpeg" },
    });
  } catch (error) {
    console.error("TTS error:", error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "TTS failed" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
