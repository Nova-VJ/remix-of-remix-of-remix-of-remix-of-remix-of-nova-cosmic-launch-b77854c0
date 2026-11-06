import { getLocale } from "@/i18n";

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

export class SaraApiError extends Error {
  status: number;
  data: any;

  constructor(status: number, data: any) {
    super(typeof data === "string" ? data : JSON.stringify(data, null, 2));
    this.status = status;
    this.data = data;
  }
}

// Accepts sessionId and passes locale to backend
export async function sendToSara(
  message: string,
  accessToken?: string,
  sessionId?: string
): Promise<{ reply: string; session_id?: string }> {
  const anonId = getOrCreateAnonId();
  const currentLocale = getLocale();

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
      session_id: sessionId,
      locale: currentLocale,
      lang: currentLocale,
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
    throw new SaraApiError(res.status, data);
  }

  return {
    reply: data.reply ?? data.message ?? "",
    session_id: data.session_id ?? sessionId,
  };
}
