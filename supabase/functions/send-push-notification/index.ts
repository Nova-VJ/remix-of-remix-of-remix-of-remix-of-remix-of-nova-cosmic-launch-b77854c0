import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.89.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Build JWT for VAPID auth
async function buildVapidJwt(endpoint: string, subject: string, publicKey: string, privateKey: string) {
  const aud = new URL(endpoint).origin;
  const header = { typ: "JWT", alg: "ES256" };
  const now = Math.floor(Date.now() / 1000);
  const payload = { aud, exp: now + 12 * 3600, sub: subject };

  const enc = new TextEncoder();
  const b64url = (buf: ArrayBuffer) =>
    btoa(String.fromCharCode(...new Uint8Array(buf)))
      .replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");

  const headerB64 = btoa(JSON.stringify(header)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  const payloadB64 = btoa(JSON.stringify(payload)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  const unsignedToken = `${headerB64}.${payloadB64}`;

  // Import private key
  const privKeyBytes = Uint8Array.from(atob(privateKey.replace(/-/g, "+").replace(/_/g, "/")), c => c.charCodeAt(0));
  const pubKeyBytes = Uint8Array.from(atob(publicKey.replace(/-/g, "+").replace(/_/g, "/")), c => c.charCodeAt(0));

  // Build JWK for import
  const jwk = {
    kty: "EC",
    crv: "P-256",
    x: btoa(String.fromCharCode(...pubKeyBytes.slice(1, 33))).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, ""),
    y: btoa(String.fromCharCode(...pubKeyBytes.slice(33, 65))).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, ""),
    d: privateKey,
  };

  const key = await crypto.subtle.importKey("jwk", jwk, { name: "ECDSA", namedCurve: "P-256" }, false, ["sign"]);
  const sig = await crypto.subtle.sign({ name: "ECDSA", hash: "SHA-256" }, key, enc.encode(unsignedToken));

  // Convert DER signature to raw r||s
  const sigBytes = new Uint8Array(sig);
  let r: Uint8Array, s: Uint8Array;
  if (sigBytes.length === 64) {
    r = sigBytes.slice(0, 32);
    s = sigBytes.slice(32, 64);
  } else {
    // DER encoded
    const rLen = sigBytes[3];
    const rStart = 4;
    const rBytes = sigBytes.slice(rStart, rStart + rLen);
    const sLen = sigBytes[rStart + rLen + 1];
    const sBytes = sigBytes.slice(rStart + rLen + 2, rStart + rLen + 2 + sLen);
    r = rBytes.length > 32 ? rBytes.slice(rBytes.length - 32) : rBytes;
    s = sBytes.length > 32 ? sBytes.slice(sBytes.length - 32) : sBytes;
    // Pad if needed
    if (r.length < 32) { const p = new Uint8Array(32); p.set(r, 32 - r.length); r = p; }
    if (s.length < 32) { const p = new Uint8Array(32); p.set(s, 32 - s.length); s = p; }
  }
  const rawSig = new Uint8Array(64);
  rawSig.set(r, 0);
  rawSig.set(s, 32);

  const token = `${unsignedToken}.${b64url(rawSig.buffer)}`;
  return { token, publicKey };
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const VAPID_PUBLIC_KEY = Deno.env.get("VAPID_PUBLIC_KEY")!;
    const VAPID_PRIVATE_KEY = Deno.env.get("VAPID_PRIVATE_KEY")!;
    const VAPID_SUBJECT = "mailto:info@solutionsnova.es";

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    const { title, body, url, type, target } = await req.json();

    // target: "admin" | "all" | specific user_id
    let query = supabase.from("push_subscriptions").select("*");
    if (target === "admin") {
      query = query.eq("is_admin", true);
    } else if (target && target !== "all") {
      query = query.eq("user_id", target);
    }

    const { data: subscriptions } = await query;

    if (!subscriptions || subscriptions.length === 0) {
      await supabase.from("admin_notifications").insert({
        type: type || "push",
        title: title || "Nova Notification",
        message: body || "",
        data: { url: url || "/" },
      });
      return new Response(
        JSON.stringify({ success: true, message: "No push subscribers, saved as notification" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const pushPayload = JSON.stringify({
      title: title || "Nova Marketing",
      body: body || "",
      url: url || "/",
      tag: type || "nova-notification",
    });

    let sent = 0;
    let failed = 0;
    const failedEndpoints: string[] = [];

    for (const sub of subscriptions) {
      try {
        const { token } = await buildVapidJwt(sub.endpoint, VAPID_SUBJECT, VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY);

        const res = await fetch(sub.endpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/octet-stream",
            "Content-Encoding": "aes128gcm",
            Authorization: `vapid t=${token}, k=${VAPID_PUBLIC_KEY}`,
            TTL: "86400",
          },
          body: new TextEncoder().encode(pushPayload),
        });

        if (res.status === 201 || res.status === 200) {
          sent++;
        } else if (res.status === 410 || res.status === 404) {
          // Subscription expired, remove it
          await supabase.from("push_subscriptions").delete().eq("endpoint", sub.endpoint);
          failed++;
          failedEndpoints.push(sub.endpoint);
        } else {
          console.error(`Push failed for ${sub.endpoint}: ${res.status} ${await res.text()}`);
          failed++;
        }
      } catch (e) {
        console.error(`Push error for ${sub.endpoint}:`, e);
        failed++;
      }
    }

    // Also save as admin notification
    await supabase.from("admin_notifications").insert({
      type: type || "push",
      title: title || "Nova Notification",
      message: body || "",
      data: { url: url || "/", push_sent: true, sent, failed },
    });

    return new Response(
      JSON.stringify({ success: true, sent, failed, total: subscriptions.length }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Push notification error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
