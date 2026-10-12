// Per-page title/description. The same JSON is read by scripts/prerender-seo.mjs
// to write one HTML file per route, so crawlers and link previews see the right
// metadata without running JavaScript.
import seoPages from "./seoPages.json";

export type PageSEO = { title: string; description: string; path: string };

export const SEO_PAGES: Record<string, PageSEO> = Object.fromEntries(
  Object.entries(seoPages).map(([path, meta]) => [path, { ...meta, path }]),
);
