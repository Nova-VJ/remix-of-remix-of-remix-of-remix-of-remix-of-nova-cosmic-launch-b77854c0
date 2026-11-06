// Per-page title/description. The same JSON is read by scripts/prerender-seo.mjs
// to write one HTML file per route, so crawlers and link previews see the right
// metadata without running JavaScript.
import seoPagesEs from "./seoPages.json";
import seoPagesEn from "./seoPages.en.json";
import { getLocale } from "@/i18n";

export type PageSEO = { title: string; description: string; path: string };

const currentLocale = getLocale();
const activeSeoPages = currentLocale === "en" ? seoPagesEn : seoPagesEs;

export const SEO_PAGES: Record<string, PageSEO> = Object.fromEntries(
  Object.entries(activeSeoPages).map(([path, meta]) => [path, { ...meta, path }]),
);

export const SEO_PAGES_ES = seoPagesEs;
export const SEO_PAGES_EN = seoPagesEn;
