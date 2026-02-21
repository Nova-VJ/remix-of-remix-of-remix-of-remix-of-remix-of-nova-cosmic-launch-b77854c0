import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.89.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Web Push requires VAPID keys - for now we use the Supabase admin notification system
// Real VAPID push requires generating keys and storing them as secrets

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    const { title, body, url, type } = await req.json();

    // Get all admin push subscriptions
    const { data: subscriptions } = await supabase
      .from("push_subscriptions")
      .select("*")
      .eq("is_admin", true);

    if (!subscriptions || subscriptions.length === 0) {
      // No push subscriptions - just create admin notification
      await supabase.from("admin_notifications").insert({
        type: type || "push",
        title: title || "Nova Notification",
        message: body || "",
        data: { url: url || "/" },
      });

      return new Response(
        JSON.stringify({ success: true, message: "Notification saved (no push subscribers)" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // For now, save as admin notification - real push requires VAPID keys
    await supabase.from("admin_notifications").insert({
      type: type || "push",
      title: title || "Nova Notification",
      message: body || "",
      data: { url: url || "/", push_sent: false },
    });

    return new Response(
      JSON.stringify({ success: true, subscribers: subscriptions.length }),
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
