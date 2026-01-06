const SARA_ENDPOINT = 'https://dnnqeydtybmzriyjqqyt.supabase.co/functions/v1/sara-chat';

export async function sendToSara(
  message: string,
  accessToken?: string
): Promise<{ reply: string }> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (accessToken) {
    headers['Authorization'] = `Bearer ${accessToken}`;
  }

  const response = await fetch(SARA_ENDPOINT, {
    method: 'POST',
    headers,
    body: JSON.stringify({ message }),
  });

  if (!response.ok) {
    let errorMessage = `Error ${response.status}`;
    try {
      const errorData = await response.json();
      errorMessage = errorData.error || errorData.message || errorMessage;
    } catch {
      const text = await response.text();
      if (text) errorMessage = text;
    }
    throw new Error(errorMessage);
  }

  const data = await response.json();
  return { reply: data.reply || data.response || data.message || '' };
}
