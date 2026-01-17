import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.89.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-anon-id",
};

const SYSTEM_PROMPT = `Eres Sara, la asistente virtual de Nova Marketing Solutions. Tu rol es ayudar a los visitantes de la web de Nova.

SOBRE NOVA MARKETING SOLUTIONS:
- Agencia de marketing digital y desarrollo web ubicada en España
- Servicios: Páginas web, Aplicaciones móviles, Redes sociales, Branding, Ciberseguridad/Pentesting
- Paquetes: Pro (incluye marketing digital gratis) y Plus (incluye marketing digital + SEM gratis)
- Código promocional: NOVA30 para 30% de descuento (no aplicable con paquete Plus)
- Contacto: info@solutionsnova.es, WhatsApp disponible

PACKS Y PRECIOS (orientativos):
- Web Starter: desde 499€ - Landing page, 3 secciones
- Web Business: desde 999€ - Web completa, hasta 10 páginas
- Web Premium: desde 1999€ - E-commerce, funcionalidades avanzadas
- Apps: desde 1499€ (básica) hasta 4999€ (premium)
- Branding: desde 299€ (básico) hasta 999€ (completo)
- Redes sociales: desde 299€/mes hasta 799€/mes
- Ciberseguridad: desde 499€ (auditoría) hasta 2999€ (pentesting completo)

INSTRUCCIONES:
1. Responde SOLO con información de Nova Marketing Solutions
2. Sé amable, profesional y conciso
3. Si no tienes información sobre algo específico, sugiere contactar con el equipo
4. Puedes sugerir agendar una cita o contactar por WhatsApp
5. NO inventes precios exactos si no los conoces, di "desde X€" o "consultar"
6. Responde siempre en español
7. Si preguntan por servicios no relacionados con Nova, indica que solo puedes ayudar con temas de Nova

FORMATO:
- Usa respuestas cortas y claras
- Usa emojis con moderación para ser amigable
- Si es apropiado, ofrece opciones o siguientes pasos`;

// Simple in-memory rate limiting (resets on cold start, but provides basic protection)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW_MS = 60000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 10; // 10 requests per minute per identifier

function checkRateLimit(identifier: string): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const record = rateLimitMap.get(identifier);
  
  if (!record || now > record.resetTime) {
    rateLimitMap.set(identifier, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS });
    return { allowed: true, remaining: MAX_REQUESTS_PER_WINDOW - 1 };
  }
  
  if (record.count >= MAX_REQUESTS_PER_WINDOW) {
    return { allowed: false, remaining: 0 };
  }
  
  record.count++;
  return { allowed: true, remaining: MAX_REQUESTS_PER_WINDOW - record.count };
}

// Clean up old entries periodically (every 100 requests)
let requestCounter = 0;
function cleanupRateLimitMap() {
  requestCounter++;
  if (requestCounter % 100 === 0) {
    const now = Date.now();
    for (const [key, value] of rateLimitMap.entries()) {
      if (now > value.resetTime) {
        rateLimitMap.delete(key);
      }
    }
  }
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, anon_id, session_id } = await req.json();
    
    // Get client IP for rate limiting (fallback to anon_id)
    const clientIP = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || 
                     req.headers.get("x-real-ip") || 
                     anon_id || 
                     "unknown";
    
    // Check rate limit
    cleanupRateLimitMap();
    const rateLimitResult = checkRateLimit(clientIP);
    
    if (!rateLimitResult.allowed) {
      console.log(`Rate limit exceeded for: ${clientIP}`);
      return new Response(
        JSON.stringify({ error: "Demasiadas solicitudes. Por favor, espera un momento antes de enviar otro mensaje." }),
        { 
          status: 429, 
          headers: { 
            ...corsHeaders, 
            "Content-Type": "application/json",
            "X-RateLimit-Remaining": "0",
            "X-RateLimit-Reset": String(Math.ceil(RATE_LIMIT_WINDOW_MS / 1000))
          } 
        }
      );
    }

    // Validate message
    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return new Response(
        JSON.stringify({ error: "Mensaje inválido" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Limit message length to prevent abuse
    if (message.length > 2000) {
      return new Response(
        JSON.stringify({ error: "Mensaje demasiado largo. Máximo 2000 caracteres." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Crear cliente de Supabase con service role para guardar mensajes
    const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!);

    // Check if user is authenticated
    const authHeader = req.headers.get("Authorization");
    let userId: string | null = null;
    
    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.replace("Bearer ", "");
      const { data: { user } } = await supabase.auth.getUser(token);
      userId = user?.id || null;
    }

    // Determinar si es usuario anónimo o registrado
    const isAnonymous = !userId && anon_id;

    // Obtener o crear conversación anónima
    let anonConversationId: string | null = null;
    if (isAnonymous) {
      // Buscar si ya existe una conversación para este anon_id
      const { data: existingConv } = await supabase
        .from("sara_anonymous_conversations")
        .select("id")
        .eq("anon_id", anon_id)
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

      if (existingConv) {
        anonConversationId = existingConv.id;
        // Actualizar timestamp
        await supabase
          .from("sara_anonymous_conversations")
          .update({ updated_at: new Date().toISOString() })
          .eq("id", anonConversationId);
      } else {
        // Crear nueva conversación anónima
        const { data: newConv } = await supabase
          .from("sara_anonymous_conversations")
          .insert({ anon_id })
          .select("id")
          .single();
        
        if (newConv) {
          anonConversationId = newConv.id;
        }
      }

      // Guardar mensaje del usuario
      if (anonConversationId) {
        await supabase
          .from("sara_anonymous_messages")
          .insert({
            conversation_id: anonConversationId,
            role: "user",
            content: message.substring(0, 2000) // Ensure message is truncated
          });
      }
    }

    console.log(`Processing chat request - IP: ${clientIP}, Anonymous: ${isAnonymous}, Remaining requests: ${rateLimitResult.remaining}`);

    // Preparar mensajes para la API
    const apiMessages = [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: message }
    ];

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: apiMessages,
        stream: false,
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Demasiadas solicitudes. Por favor, espera un momento." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Servicio temporalmente no disponible." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error("Error al procesar la solicitud");
    }

    const data = await response.json();
    const assistantMessage = data.choices?.[0]?.message?.content || 
      "Lo siento, no pude procesar tu mensaje. ¿Puedes intentarlo de nuevo?";

    // Guardar respuesta de Sara para usuarios anónimos
    if (isAnonymous && anonConversationId) {
      await supabase
        .from("sara_anonymous_messages")
        .insert({
          conversation_id: anonConversationId,
          role: "assistant",
          content: assistantMessage
        });
    }

    return new Response(
      JSON.stringify({ 
        reply: assistantMessage,
        session_id: session_id || anon_id 
      }),
      { 
        headers: { 
          ...corsHeaders, 
          "Content-Type": "application/json",
          "X-RateLimit-Remaining": String(rateLimitResult.remaining)
        } 
      }
    );
  } catch (error) {
    console.error("sara-chat error:", error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : "Error desconocido" 
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});