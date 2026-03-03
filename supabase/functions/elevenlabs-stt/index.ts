import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const DEEPGRAM_API_KEY = Deno.env.get("DEEPGRAM_API_KEY");

    if (!DEEPGRAM_API_KEY) {
      throw new Error("DEEPGRAM_API_KEY is not configured");
    }

    const formData = await req.formData();
    const audioFile = formData.get("audio") as File;

    if (!audioFile) {
      return new Response(
        JSON.stringify({ error: "Audio file is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const audioBuffer = await audioFile.arrayBuffer();
    console.log(`STT: audio size=${audioBuffer.byteLength} bytes, type=${audioFile.type}, name=${audioFile.name}`);

    if (audioBuffer.byteLength < 1000) {
      console.warn("STT: Audio too small, likely silence or empty recording");
      return new Response(
        JSON.stringify({ text: "", warning: "audio_too_small" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const response = await fetch(
      "https://api.deepgram.com/v1/listen?model=nova-2&language=es&smart_format=true",
      {
        method: "POST",
        headers: {
          Authorization: `Token ${DEEPGRAM_API_KEY}`,
          "Content-Type": audioFile.type || "audio/webm",
        },
        body: audioBuffer,
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Deepgram STT error:", response.status, errorText);
      throw new Error(`Deepgram STT failed: ${response.status}`);
    }

    const result = await response.json();
    console.log("Deepgram response:", JSON.stringify(result?.results?.channels?.[0]?.alternatives?.[0]));
    const transcript =
      result?.results?.channels?.[0]?.alternatives?.[0]?.transcript || "";
    const confidence = result?.results?.channels?.[0]?.alternatives?.[0]?.confidence || 0;
    console.log(`STT result: "${transcript}" (confidence: ${confidence})`);

    return new Response(
      JSON.stringify({ text: transcript }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("STT error:", error);
    const errorMessage = error instanceof Error ? error.message : "STT failed";

    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
