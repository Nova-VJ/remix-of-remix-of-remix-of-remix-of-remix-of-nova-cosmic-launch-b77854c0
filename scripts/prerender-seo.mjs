// Runs after `vite build`. Writes one HTML file per route with that page's
// <title>, description, canonical and Open Graph tags, plus a 404.html.
//
// On Cloudflare Pages this means:
//   - /casos-exito is served from dist/casos-exito.html with the right metadata,
//     so link previews (WhatsApp, LinkedIn...) and crawlers see it without JS.
//   - Unknown URLs get dist/404.html with a real HTTP 404 status (Pages only
//     falls back to index.html when there is no 404.html).
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const dist = join(root, "dist");
const BASE_URL = "https://solutionsnova.es";

const pages = JSON.parse(readFileSync(join(root, "src/config/seoPages.json"), "utf8"));

// Logged-in / account pages: reachable, but never indexed.
const PRIVATE_ROUTES = {
  "/auth": "Acceder",
  "/dashboard": "Mi panel",
  "/profile": "Mi perfil",
  "/admin": "Administración",
  "/forgot-password": "Recuperar contraseña",
  "/reset-password": "Nueva contraseña",
};

const template = readFileSync(join(dist, "index.html"), "utf8");

const escapeHtml = (value) =>
  value.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

function replaceOnce(html, pattern, replacement) {
  if (!pattern.test(html)) throw new Error(`prerender-seo: pattern not found in index.html: ${pattern}`);
  return html.replace(pattern, replacement);
}

function render({ title, description, path, noindex = false }) {
  const t = escapeHtml(title);
  const d = escapeHtml(description);
  const url = `${BASE_URL}${path === "/" ? "/" : path}`;
  let html = template;
  html = replaceOnce(html, /<title>[^<]*<\/title>/, `<title>${t}</title>`);
  html = replaceOnce(html, /(<meta name="description" content=")[^"]*(")/, `$1${d}$2`);
  html = replaceOnce(html, /(<link rel="canonical" href=")[^"]*(")/, `$1${url}$2`);
  html = replaceOnce(html, /(<meta property="og:title" content=")[^"]*(")/, `$1${t}$2`);
  html = replaceOnce(html, /(<meta property="og:description" content=")[^"]*(")/, `$1${d}$2`);
  html = replaceOnce(html, /(<meta property="og:url" content=")[^"]*(")/, `$1${url}$2`);
  html = replaceOnce(html, /(<meta name="twitter:title" content=")[^"]*(")/, `$1${t}$2`);
  html = replaceOnce(html, /(<meta name="twitter:description" content=")[^"]*(")/, `$1${d}$2`);
  if (noindex) {
    html = html.replace(/<link rel="canonical"[^>]*>\s*/, "");
    html = html.replace("</title>", '</title>\n    <meta name="robots" content="noindex" />');
  }
  return html;
}

function write(relativePath, html) {
  const file = join(dist, relativePath);
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, html);
}

let count = 0;
for (const [path, meta] of Object.entries(pages)) {
  const html = render({ ...meta, path });
  write(path === "/" ? "index.html" : `${path.slice(1)}.html`, html);
  count++;
}

for (const [path, label] of Object.entries(PRIVATE_ROUTES)) {
  write(`${path.slice(1)}.html`, render({
    title: `${label} | NOVA Marketing Solutions`,
    description: pages["/"].description,
    path,
    noindex: true,
  }));
  count++;
}

write("404.html", render({
  title: "Página no encontrada | NOVA Marketing Solutions",
  description: pages["/"].description,
  path: "/404",
  noindex: true,
}));

console.log(`prerender-seo: wrote ${count} route pages + 404.html`);
