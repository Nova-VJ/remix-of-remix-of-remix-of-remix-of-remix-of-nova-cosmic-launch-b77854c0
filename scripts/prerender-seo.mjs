// Runs after `vite build`. Writes one HTML file per route with that page's
// <title>, description, canonical, hreflang, and Open Graph tags, plus a 404.html.
//
// On Cloudflare Pages this means:
//   - /casos-exito is served from dist/casos-exito.html with the right metadata,
//     so link previews (WhatsApp, LinkedIn...) and crawlers see it without JS.
//   - Unknown URLs get dist/404.html with a real HTTP 404 status (Pages only
//     falls back to index.html when there is no 404.html).
//   - The home page ships with its menu and hero already rendered (from
//     dist-shell, built by vite.shell.config.ts), so it paints before the JS loads.
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const dist = join(root, "dist");

const locale = (process.env.VITE_LOCALE || "es").toLowerCase();
const isEn = locale === "en";

const DOMAIN_ES = "https://solutionsnova.es";
const DOMAIN_EN = "https://novasolutionsmkt.com";
const BASE_URL = isEn ? DOMAIN_EN : DOMAIN_ES;

const seoConfigFile = isEn ? "src/config/seoPages.en.json" : "src/config/seoPages.json";
const pages = JSON.parse(readFileSync(join(root, seoConfigFile), "utf8"));

// Logged-in / account pages: reachable, but never indexed.
const PRIVATE_ROUTES = isEn
  ? {
      "/auth": "Log In",
      "/dashboard": "My Dashboard",
      "/profile": "My Profile",
      "/admin": "Admin",
      "/forgot-password": "Reset Password",
      "/reset-password": "New Password",
    }
  : {
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
  const normalizedPath = path === "/" ? "/" : path;
  const url = `${BASE_URL}${normalizedPath}`;
  const esUrl = `${DOMAIN_ES}${normalizedPath}`;
  const enUrl = `${DOMAIN_EN}${normalizedPath}`;

  let html = template;

  // Language attribute
  html = html.replace(/<html lang="[^"]*"/, `<html lang="${isEn ? "en" : "es"}"`);

  // Basic tags
  html = replaceOnce(html, /<title>[^<]*<\/title>/, `<title>${t}</title>`);
  html = replaceOnce(html, /(<meta name="description" content=")[^"]*(")/, `$1${d}$2`);
  html = replaceOnce(html, /(<link rel="canonical" href=")[^"]*(")/, `$1${url}$2`);
  html = replaceOnce(html, /(<meta property="og:title" content=")[^"]*(")/, `$1${t}$2`);
  html = replaceOnce(html, /(<meta property="og:description" content=")[^"]*(")/, `$1${d}$2`);
  html = replaceOnce(html, /(<meta property="og:url" content=")[^"]*(")/, `$1${url}$2`);
  html = replaceOnce(html, /(<meta name="twitter:title" content=")[^"]*(")/, `$1${t}$2`);
  html = replaceOnce(html, /(<meta name="twitter:description" content=")[^"]*(")/, `$1${d}$2`);

  // Open Graph locale
  html = html.replace(
    /<meta property="og:locale" content="[^"]*"/,
    `<meta property="og:locale" content="${isEn ? "en_US" : "es_ES"}"`
  );

  // Hreflang alternates
  const hreflangTags = `
    <link rel="alternate" hreflang="es" href="${esUrl}" />
    <link rel="alternate" hreflang="en" href="${enUrl}" />
    <link rel="alternate" hreflang="x-default" href="${esUrl}" />`;

  if (!html.includes('hreflang="es"')) {
    html = html.replace(/(<link rel="canonical"[^>]*>)/, `$1${hreflangTags}`);
  }

  if (noindex) {
    html = html.replace(/<link rel="canonical"[^>]*>\s*/, "");
    html = html.replace(/<link rel="alternate"[^>]*>\s*/g, "");
    html = html.replace("</title>", '</title>\n    <meta name="robots" content="noindex" />');
  }

  return html;
}

function write(relativePath, html) {
  const file = join(dist, relativePath);
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, html);
}

// Pre-rendered menu + hero for the home page only (other routes show other content)
const shellEntry = join(root, "dist-shell", "shell.js");
const homeShell = existsSync(shellEntry) ? (await import(pathToFileURL(shellEntry).href)).render() : "";

let count = 0;
for (const [path, meta] of Object.entries(pages)) {
  let html = render({ ...meta, path });
  if (path === "/" && homeShell) {
    html = replaceOnce(html, /<div id="root"><\/div>/, `<div id="root">${homeShell}</div>`);
    // Download the app straight away but run it after the browser has painted the
    // pre-rendered menu and hero; otherwise running the bundle delays the first paint.
    html = replaceOnce(
      html,
      /<script type="module" crossorigin src="([^"]+)"><\/script>/,
      (_, src) =>
        `<link rel="modulepreload" crossorigin href="${src}">
    ` +
        `<script type="module">requestAnimationFrame(() => setTimeout(() => import("${src}")));</script>`
    );
  }
  write(path === "/" ? "index.html" : `${path.slice(1)}.html`, html);
  count++;
}

for (const [path, label] of Object.entries(PRIVATE_ROUTES)) {
  write(
    `${path.slice(1)}.html`,
    render({
      title: `${label} | NOVA Marketing Solutions`,
      description: pages["/"].description,
      path,
      noindex: true,
    })
  );
  count++;
}

write(
  "404.html",
  render({
    title: isEn
      ? "Page Not Found | NOVA Marketing Solutions"
      : "Página no encontrada | NOVA Marketing Solutions",
    description: pages["/"].description,
    path: "/404",
    noindex: true,
  })
);

// Generate robots.txt customized for the locale domain
const robotsTxt = `User-agent: Googlebot
Allow: /

User-agent: Bingbot
Allow: /

User-agent: Twitterbot
Allow: /

User-agent: facebookexternalhit
Allow: /

User-agent: *
Allow: /
Disallow: /auth
Disallow: /dashboard
Disallow: /profile
Disallow: /admin
Disallow: /forgot-password
Disallow: /reset-password

Sitemap: ${BASE_URL}/sitemap.xml
`;
writeFileSync(join(dist, "robots.txt"), robotsTxt);

// Generate sitemap.xml with hreflang alternate links
const today = new Date().toISOString().split("T")[0];
const sitemapUrls = Object.keys(pages)
  .map((path) => {
    const normalizedPath = path === "/" ? "/" : path;
    const loc = `${BASE_URL}${normalizedPath}`;
    const esLoc = `${DOMAIN_ES}${normalizedPath}`;
    const enLoc = `${DOMAIN_EN}${normalizedPath}`;
    const priority = path === "/" ? "1.0" : path.startsWith("/casos-exito") || path === "/metodo-nova" ? "0.8" : "0.5";
    const changefreq = path === "/" ? "daily" : "weekly";
    return `  <url>
    <loc>${loc}</loc>
    <xhtml:link rel="alternate" hreflang="es" href="${esLoc}" />
    <xhtml:link rel="alternate" hreflang="en" href="${enLoc}" />
    <xhtml:link rel="alternate" hreflang="x-default" href="${esLoc}" />
    <lastmod>${today}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
  })
  .join("\n");

const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${sitemapUrls}
</urlset>
`;
writeFileSync(join(dist, "sitemap.xml"), sitemapXml);

console.log(
  `prerender-seo [${locale}]: wrote ${count} route pages + 404.html + robots.txt + sitemap.xml${
    homeShell ? " (home page pre-rendered)" : ""
  }`
);
