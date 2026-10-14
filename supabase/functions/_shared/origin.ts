// Webs que pueden llamar a las funciones desde el navegador.
export const isAllowedOrigin = (origin: string) => {
  if (origin === "https://solutionsnova.es" || origin === "https://www.solutionsnova.es") return true;
  try {
    const u = new URL(origin);
    // Desarrollo local y vistas previas de Cloudflare Pages
    if (u.hostname === "localhost" || u.hostname === "127.0.0.1") return true;
    if (u.hostname === "77851234.pages.dev" || u.hostname.endsWith(".77851234.pages.dev")) return true;
  } catch {
    // origen mal formado
  }
  return false;
};

// Rechaza las llamadas hechas desde webs ajenas (sin cabeceras CORS, así el
// navegador las bloquea). Las peticiones sin Origin (servidor) siguen pasando.
export const rejectForeignOrigin = (req: Request): Response | null => {
  const origin = req.headers.get("origin");
  if (!origin || isAllowedOrigin(origin)) return null;
  return new Response(JSON.stringify({ error: "Origin not allowed" }), {
    status: 403,
    headers: { "Content-Type": "application/json", "Vary": "Origin" },
  });
};
