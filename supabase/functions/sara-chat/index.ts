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
- Código promocional: NOVA20 para 20% de descuento
- Contacto: info@solutionsnova.es, WhatsApp disponible

CATÁLOGO DE SERVICIOS Y PRECIOS:
| ID | Servicio | Precio | Tipo |
|---|---|---|---|
| web | Página Web Profesional | 600€ | service |
| apps | Aplicación Móvil | 1700€ | service |
| social | Redes Sociales (mensual) | 500€/mes | service |
| branding | Branding Profesional | 200€ | service |
| marketing | Marketing Digital | 200€ | service |
| sem | SEM - Google Ads (mensual) | 150€/mes | service |
| pkg-pro | Paquete Pro (Web + Social + Marketing gratis) | 800€ | package |
| pkg-plus | Paquete Plus (Web + Social + Branding + Apps + Marketing + SEM gratis) | 1900€ | package |

INSTRUCCIONES:
1. Responde SOLO con información de Nova Marketing Solutions
2. Sé amable, profesional y conciso
3. Si no tienes información sobre algo específico, sugiere contactar con el equipo
4. Puedes sugerir agendar una cita o contactar por WhatsApp
5. NO inventes precios exactos si no los conoces, di "desde X€" o "consultar"
6. Responde siempre en español
7. Si preguntan por servicios no relacionados con Nova, indica que solo puedes ayudar con temas de Nova

LINKS Y FORMULARIOS (OBLIGATORIO):
- NUNCA escribas URLs como "solutionsnova.es/formulario" ni ninguna URL de formulario inventada
- Para referir al formulario de briefing SIEMPRE usa el texto exacto: [LINK_FORMULARIO]
- Para referir a WhatsApp SIEMPRE usa el texto exacto: [LINK_WHATSAPP]
- Estos placeholders se convertirán automáticamente en botones bonitos para el usuario

FUNCIONALIDAD DE CARRITO (CRÍTICO - LEE ESTO):
Tú SÍ tienes la funcionalidad de añadir servicios al carrito del usuario. NUNCA digas que "no tienes esa funcionalidad" o que "no puedes agregar al carrito". Tú PUEDES hacerlo mediante el tag [PROPUESTA_CARRITO].

CADA VEZ que menciones, recomiendes, o el usuario pregunte por CUALQUIER servicio o plan del catálogo, DEBES incluir el tag [PROPUESTA_CARRITO] al final de tu mensaje. Esto mostrará automáticamente cada servicio como una tarjeta con un botón de carrito 🛒 que el usuario puede tocar para agregarlo.

REGLAS de la propuesta:
1. Escribe tu respuesta normal primero
2. En la ÚLTIMA línea, añade el tag con formato EXACTO (una sola línea, sin saltos de línea dentro del JSON):
[PROPUESTA_CARRITO:{"items":[{"id":"ID","name":"NOMBRE","price":PRECIO,"type":"TIPO"}],"description":"DESCRIPCIÓN"}]
3. Usa SOLO los IDs de la tabla de arriba (web, apps, social, branding, marketing, sem, pkg-pro, pkg-plus)
4. Los precios DEBEN coincidir EXACTAMENTE con la tabla de arriba
5. La descripción debe ser breve

CUÁNDO generar propuesta (SIEMPRE en estos casos):
- Usuario menciona cualquier servicio → incluir propuesta
- Usuario pregunta precios → incluir propuesta
- Usuario describe su proyecto → incluir propuesta con servicios recomendados
- Usuario pide agregar algo al carrito → incluir propuesta
- Usuario pregunta "¿qué servicios tenéis?" → incluir TODOS los servicios
- Básicamente: si se habla de un servicio, SIEMPRE va el tag

EJEMPLO:
"¡Genial! Para tu restaurante te recomiendo una página web profesional. Aquí tienes el servicio para que puedas agregarlo:
[PROPUESTA_CARRITO:{"items":[{"id":"web","name":"Página Web Profesional","price":600,"type":"service"}],"description":"Web para restaurante"}]"

FORMATO:
- Usa respuestas cortas y claras
- Usa emojis con moderación para ser amigable
- Si es apropiado, ofrece opciones o siguientes pasos`;

const CLASSIFICATION_PROMPT = `Analiza la siguiente conversación entre un usuario y Sara (asistente de Nova Marketing Solutions).
Devuelve un JSON con esta estructura exacta (sin markdown, solo JSON puro):
{
  "title": "Título máximo 8 palabras, específico y comercial. Ejemplos: 'Web corporativa – Alta intención', 'App marketplace – Solicita presupuesto', 'Solo pregunta precios', 'Branding – Consulta inicial'",
  "service": "uno de: Web|App|Branding|Social|Ads|Automatizaciones|Consulta general|Otro",
  "stage": "uno de: Curioso|Comparando|Pide precio|Alta intención|Listo para comprar",
  "urgency": "uno de: Alta|Media|Baja",
  "quality": "uno de: Alta|Media|Baja",
  "score": número entre 0 y 100 (considera: menciona presupuesto +20, plazo concreto +15, solicita llamada +20, negocio activo +10, claridad de necesidad +15, intención de compra +20),
  "summary": "Resumen ejecutivo 3-5 líneas: qué quiere, en qué fase está, probabilidad de cierre, próxima acción recomendada",
  "next_action": "Próxima acción específica recomendada en máximo 10 palabras",
  "contact_name": "nombre si se mencionó o null",
  "contact_email": "email si se mencionó o null",
  "contact_phone": "teléfono si se mencionó o null",
  "contact_city": "ciudad si se mencionó o null",
  "contact_website": "web si se mencionó o null"
}`;

// Simple in-memory rate limiting
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW_MS = 60000;
const MAX_REQUESTS_PER_WINDOW = 10;

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

let requestCounter = 0;
function cleanupRateLimitMap() {
  requestCounter++;
  if (requestCounter % 100 === 0) {
    const now = Date.now();
    for (const [key, value] of rateLimitMap.entries()) {
      if (now > value.resetTime) rateLimitMap.delete(key);
    }
  }
}

async function classifyConversation(
  messages: { role: string; content: string }[],
  apiKey: string
): Promise<any> {
  try {
    const conversationText = messages
      .map(m => `${m.role === 'user' ? 'Usuario' : 'Sara'}: ${m.content}`)
      .join('\n');

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: CLASSIFICATION_PROMPT },
          { role: "user", content: `Conversación:\n${conversationText}` }
        ],
        max_tokens: 600,
      }),
    });

    if (!response.ok) return null;
    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || '';
    
    // Parse JSON from response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return null;
    return JSON.parse(jsonMatch[0]);
  } catch (e) {
    console.error("Classification error:", e);
    return null;
  }
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, anon_id, session_id } = await req.json();
    
    const clientIP = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || 
                     req.headers.get("x-real-ip") || 
                     anon_id || 
                     "unknown";
    
    cleanupRateLimitMap();
    const rateLimitResult = checkRateLimit(clientIP);
    
    if (!rateLimitResult.allowed) {
      return new Response(
        JSON.stringify({ error: "Demasiadas solicitudes. Por favor, espera un momento antes de enviar otro mensaje." }),
        { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return new Response(
        JSON.stringify({ error: "Mensaje inválido" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (message.length > 2000) {
      return new Response(
        JSON.stringify({ error: "Mensaje demasiado largo. Máximo 2000 caracteres." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!);

    // Check auth
    const authHeader = req.headers.get("Authorization");
    let userId: string | null = null;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.replace("Bearer ", "");
      const { data: { user } } = await supabase.auth.getUser(token);
      userId = user?.id || null;
    }

    const effectiveAnonId = userId || anon_id || "unknown";
    
    // Always use sara_anonymous_conversations for admin visibility
    let conversationId: string | null = null;
    let allMessages: { role: string; content: string }[] = [];
    
    const { data: existingConv } = await supabase
      .from("sara_anonymous_conversations")
      .select("id, message_count")
      .eq("anon_id", effectiveAnonId)
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (existingConv) {
      conversationId = existingConv.id;
      await supabase
        .from("sara_anonymous_conversations")
        .update({ 
          updated_at: new Date().toISOString(),
          message_count: (existingConv.message_count || 0) + 1
        })
        .eq("id", conversationId);
    } else {
      const { data: newConv } = await supabase
        .from("sara_anonymous_conversations")
        .insert({ anon_id: effectiveAnonId, message_count: 1 })
        .select("id")
        .single();
      if (newConv) conversationId = newConv.id;
    }

    if (conversationId) {
      await supabase.from("sara_anonymous_messages").insert({
        conversation_id: conversationId,
        role: "user",
        content: message.substring(0, 2000)
      });

      // Load conversation history for context
      const { data: history } = await supabase
        .from("sara_anonymous_messages")
        .select("role, content")
        .eq("conversation_id", conversationId)
        .order("created_at", { ascending: true })
        .limit(20);
      allMessages = history || [];
    }

    console.log(`Processing chat - ID: ${effectiveAnonId}, Authenticated: ${!!userId}, Remaining: ${rateLimitResult.remaining}`);

    // Build API messages with history for context
    const apiMessages = [
      { role: "system", content: SYSTEM_PROMPT },
      ...allMessages.slice(-10).map(m => ({ role: m.role as "user" | "assistant", content: m.content })),
      { role: "user", content: message }
    ];
    // Deduplicate last user message if already in history
    const lastHistoryMsg = allMessages[allMessages.length - 1];
    const finalMessages = lastHistoryMsg?.role === 'user' && lastHistoryMsg.content === message
      ? [{ role: "system", content: SYSTEM_PROMPT }, ...allMessages.slice(-10).map(m => ({ role: m.role as "user" | "assistant", content: m.content }))]
      : apiMessages;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: finalMessages,
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

    // Save Sara's response
    if (conversationId) {
      await supabase.from("sara_anonymous_messages").insert({
        conversation_id: conversationId,
        role: "assistant",
        content: assistantMessage
      });

      // Create admin notification
      const senderLabel = userId ? 'Usuario registrado' : 'Anónimo';
      const notifTitle = `💬 Nuevo mensaje de Sara`;
      const notifMsg = `${senderLabel} escribió: "${message.substring(0, 80)}${message.length > 80 ? '...' : ''}"`;
      await supabase.from("admin_notifications").insert({
        type: 'sara_message',
        title: notifTitle,
        message: notifMsg,
        data: { 
          conversation_id: conversationId, 
          anon_id: effectiveAnonId,
          user_message: message.substring(0, 200)
        }
      });

      // Run AI classification every 3 messages (background)
      const { data: msgCount } = await supabase
        .from("sara_anonymous_conversations")
        .select("message_count")
        .eq("id", conversationId)
        .single();
      
      const count = msgCount?.message_count || 0;
      if (count >= 2) {
        const { data: fullHistory } = await supabase
          .from("sara_anonymous_messages")
          .select("role, content")
          .eq("conversation_id", conversationId)
          .order("created_at", { ascending: true });

        if (fullHistory && fullHistory.length >= 3) {
          const classification = await classifyConversation(fullHistory, LOVABLE_API_KEY);
          if (classification) {
            await supabase.from("sara_anonymous_conversations").update({
              ai_title: classification.title,
              ai_service: classification.service,
              ai_stage: classification.stage,
              ai_urgency: classification.urgency,
              ai_quality: classification.quality,
              ai_score: Math.min(100, Math.max(0, parseInt(classification.score) || 0)),
              ai_summary: classification.summary,
              ai_next_action: classification.next_action,
              contact_name: classification.contact_name,
              contact_email: classification.contact_email,
              contact_phone: classification.contact_phone,
              contact_city: classification.contact_city,
              contact_website: classification.contact_website,
              classified_at: new Date().toISOString()
            }).eq("id", conversationId);

            if ((classification.score || 0) >= 50) {
              await supabase.from("admin_notifications").insert({
                type: 'high_priority_lead',
                title: `🚀 Lead de alta prioridad detectado (Score: ${classification.score})`,
                message: `${classification.title} – ${classification.service} – ${classification.stage}`,
                data: { conversation_id: conversationId, ...classification }
              });

              // Send push notification to admin devices
              const SUPABASE_URL_VAL = Deno.env.get("SUPABASE_URL")!;
              const SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
              try {
                const pushRes = await fetch(`${SUPABASE_URL_VAL}/functions/v1/send-push-notification`, {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${SERVICE_ROLE_KEY}`,
                  },
                  body: JSON.stringify({
                    title: `🚀 Lead Score: ${classification.score}`,
                    body: `${classification.title} – ${classification.service}`,
                    url: "/admin",
                    type: "high_priority_lead",
                    target: "admin",
                  }),
                });
                const pushResult = await pushRes.text();
                console.log("Push notification result:", pushRes.status, pushResult);
              } catch (pushErr) {
                console.error("Push notification error:", pushErr);
              }
            }
          }
        }
      }
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
      JSON.stringify({ error: error instanceof Error ? error.message : "Error desconocido" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
