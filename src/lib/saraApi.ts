const SARA_ENDPOINT =
  import.meta.env.VITE_SARA_CHAT_ENDPOINT ||
  "https://dnnqeydtybmzriyjqqyt.supabase.co/functions/v1/sara-chat";

function getOrCreateAnonId() {
  const key = "sara_anon_id";
  let id = localStorage.getItem(key);
  if (!id) {
    id =
      (crypto as any).randomUUID?.() ??
      `anon_${Date.now()}_${Math.random().toString(16).slice(2)}`;
    localStorage.setItem(key, id);
  }
  return id;
}

// ✅ Ahora acepta sessionId y devuelve también session_id
export async function sendToSara(
  message: string,
  accessToken?: string,
  sessionId?: string
): Promise<{ reply: string; session_id?: string }> {
  const anonId = getOrCreateAnonId();

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "x-anon-id": anonId,
  };

  if (accessToken) headers["Authorization"] = `Bearer ${accessToken}`;

  const res = await fetch(SARA_ENDPOINT, {
    method: "POST",
    headers,
    body: JSON.stringify({
      message,
      anon_id: anonId,
      session_id: sessionId, // ✅ importante para memoria
    }),
  });

  const text = await res.text();
  let data: any;
  try {
    data = JSON.parse(text);
  } catch {
    data = { raw: text };
  }

  if (!res.ok) {
    throw new Error(
      typeof data === "string" ? data : JSON.stringify(data, null, 2)
    );
  }

  return {
    reply: (data.reply as string) ?? "",
    session_id: data.session_id as string | undefined, // ✅ por si el backend lo devuelve
  };
}
