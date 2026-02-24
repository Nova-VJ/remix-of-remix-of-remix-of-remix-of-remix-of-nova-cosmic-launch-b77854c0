import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.89.0";
import webpush from "npm:web-push@3.6.7";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  // GET endpoint: return VAPID public key so frontend always uses the correct one
  if (req.method === "GET") {
    const VAPID_PUBLIC_KEY = Deno.env.get("VAPID_PUBLIC_KEY");
    if (!VAPID_PUBLIC_KEY) {
      return new Response(
        JSON.stringify({ error: "VAPID_PUBLIC_KEY not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    return new Response(
      JSON.stringify({ publicKey: VAPID_PUBLIC_KEY }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  try {
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const VAPID_PUBLIC_KEY = Deno.env.get("VAPID_PUBLIC_KEY")!;
    const VAPID_PRIVATE_KEY = Deno.env.get("VAPID_PRIVATE_KEY")!;

    webpush.setVapidDetails(
      "mailto:info@solutionsnova.es",
      VAPID_PUBLIC_KEY,
      VAPID_PRIVATE_KEY
    );

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    const { title, body, url, type, target } = await req.json();
    console.log("Push request received:", { title, body, url, type, target });

    // target: "admin" | "all" | specific user_id
    let query = supabase.from("push_subscriptions").select("*");
    if (target === "admin") {
      query = query.eq("is_admin", true);
    } else if (target && target !== "all") {
      query = query.eq("user_id", target);
    }

    const { data: subscriptions, error: subError } = await query;
    console.log("Subscriptions found:", subscriptions?.length || 0, "Error:", subError);

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

    const payload = JSON.stringify({
      title: title || "Nova Marketing",
      body: body || "",
      url: url || "/",
      tag: type || "nova-notification",
    });

    let sent = 0;
    let failed = 0;

    for (const sub of subscriptions) {
      const pushSub = {
        endpoint: sub.endpoint,
        keys: {
          p256dh: sub.p256dh,
          auth: sub.auth,
        },
      };

      try {
        await webpush.sendNotification(pushSub, payload);
        sent++;
        console.log(`Push sent successfully to ${sub.endpoint.substring(0, 50)}...`);
      } catch (e: any) {
        console.error(`Push failed for ${sub.endpoint}:`, e.statusCode, e.body);
        if (e.statusCode === 410 || e.statusCode === 404) {
          await supabase.from("push_subscriptions").delete().eq("endpoint", sub.endpoint);
          console.log(`Removed expired subscription: ${sub.endpoint.substring(0, 50)}...`);
        }
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
