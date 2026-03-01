import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const TTS_URL = "https://texttospeech.googleapis.com/v1/text:synthesize";
const STYLE_PROMPT = "Juvenil. Acento Valladolid. Castilla y León España.";
const VOICE_NAME = "Achernar";

// --- Service Account OAuth2 helpers ---

let cachedToken: { token: string; expiresAt: number } | null = null;

function base64url(buf: ArrayBuffer): string {
  const bytes = new Uint8Array(buf);
  let binary = "";
  for (const b of bytes) binary += String.fromCharCode(b);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

async function getAccessToken(saJson: string): Promise<string> {
  const now = Math.floor(Date.now() / 1000);

  // Return cached token if still valid (with 60s margin)
  if (cachedToken && cachedToken.expiresAt > now + 60) {
    return cachedToken.token;
  }

  const sa = JSON.parse(saJson);

  // Build JWT header + payload
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

  // Import private key
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

  const signature = await crypto.subtle.sign(
    "RSASSA-PKCS1-v1_5",
    cryptoKey,
    enc.encode(signInput)
  );

  const jwt = `${signInput}.${base64url(signature)}`;

  // Exchange JWT for access token
  const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `grant_type=urn%3Aietf%3Aparams%3Aoauth%3Agrant-type%3Ajwt-bearer&assertion=${jwt}`,
  });

  if (!tokenRes.ok) {
    const errText = await tokenRes.text();
    throw new Error(`OAuth token exchange failed: ${tokenRes.status} ${errText}`);
  }

  const tokenData = await tokenRes.json();
  cachedToken = {
    token: tokenData.access_token,
    expiresAt: now + (tokenData.expires_in || 3600),
  };

  return cachedToken.token;
}

// --- Main TTS call ---

async function synthesize(text: string, authHeader: Record<string, string>): Promise<Response> {
  const body = {
    input: {
      text: text.substring(0, 5000),
      prompt: STYLE_PROMPT,
    },
    voice: {
      languageCode: "es-ES",
      name: VOICE_NAME,
      model_name: "gemini-2.5-flash-tts",
    },
    audioConfig: { audioEncoding: "MP3" },
  };

  const res = await fetch(TTS_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...authHeader,
    },
    body: JSON.stringify(body),
  });

  return res;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { text } = await req.json();

    if (!text || typeof text !== "string" || text.trim().length === 0) {
      return new Response(
        JSON.stringify({ error: "Text is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Try API key first
    const apiKey = Deno.env.get("GOOGLE_TTS_API_KEY");
    let ttsRes: Response | null = null;

    if (apiKey) {
      ttsRes = await synthesize(text, {});
      // Override URL with API key query param
      const urlWithKey = `${TTS_URL}?key=${apiKey}`;
      const body = {
        input: { text: text.substring(0, 5000), prompt: STYLE_PROMPT },
        voice: { languageCode: "es-ES", name: VOICE_NAME, model_name: "gemini-2.5-flash-tts" },
        audioConfig: { audioEncoding: "MP3" },
      };
      ttsRes = await fetch(urlWithKey, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
    }

    // If API key failed or not set, use service account
    if (!ttsRes || !ttsRes.ok) {
      if (ttsRes) {
        const errBody = await ttsRes.text();
        console.log("API key attempt failed:", ttsRes.status, errBody);
      }

      const saJson = Deno.env.get("GOOGLE_SERVICE_ACCOUNT_JSON");
      if (!saJson) {
        throw new Error("No GOOGLE_SERVICE_ACCOUNT_JSON configured and API key failed");
      }

      const accessToken = await getAccessToken(saJson);
      ttsRes = await synthesize(text, { Authorization: `Bearer ${accessToken}` });
    }

    if (!ttsRes.ok) {
      const errorText = await ttsRes.text();
      console.error("Google TTS error:", ttsRes.status, errorText);
      throw new Error(`Google TTS failed: ${ttsRes.status} ${errorText}`);
    }

    const data = await ttsRes.json();
    const audioContent = data.audioContent;

    if (!audioContent) {
      throw new Error("No audioContent in Google TTS response");
    }

    // Decode base64 to bytes
    const binaryStr = atob(audioContent);
    const bytes = new Uint8Array(binaryStr.length);
    for (let i = 0; i < binaryStr.length; i++) {
      bytes[i] = binaryStr.charCodeAt(i);
    }

    return new Response(bytes, {
      headers: {
        ...corsHeaders,
        "Content-Type": "audio/mpeg",
      },
    });
  } catch (error) {
    console.error("TTS error:", error);
    const errorMessage = error instanceof Error ? error.message : "TTS failed";

    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
