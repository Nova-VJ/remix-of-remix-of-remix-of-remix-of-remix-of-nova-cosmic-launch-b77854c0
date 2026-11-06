import { useEffect } from 'react';
import { getLocale } from '@/i18n';

interface SEOHeadProps {
  title: string;
  description: string;
  path?: string;
  ogImage?: string;
  ogType?: string;
}

const DOMAIN_ES = 'https://solutionsnova.es';
const DOMAIN_EN = 'https://novasolutionsmkt.com';

const setMetaTag = (attr: string, key: string, content: string) => {
  let el = document.querySelector(`meta[${attr}="${key}"]`) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
};

const setLinkTag = (rel: string, href: string, extraAttrs?: Record<string, string>) => {
  const selector = extraAttrs?.hreflang
    ? `link[rel="${rel}"][hreflang="${extraAttrs.hreflang}"]`
    : `link[rel="${rel}"]`;
  let el = document.querySelector(selector) as HTMLLinkElement | null;
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', rel);
    if (extraAttrs) {
      Object.entries(extraAttrs).forEach(([k, v]) => el!.setAttribute(k, v));
    }
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
};

const SEOHead = ({
  title,
  description,
  path = '/',
  ogImage,
  ogType = 'website',
}: SEOHeadProps) => {
  const locale = getLocale();
  const isEn = locale === 'en';
  const baseUrl = isEn ? DOMAIN_EN : DOMAIN_ES;
  const defaultOgImage = `${baseUrl}/og-image.jpg`;
  const image = ogImage ?? defaultOgImage;

  useEffect(() => {
    const normalizedPath = path === '/' ? '/' : path;
    const canonicalUrl = `${baseUrl}${normalizedPath}`;
    const esUrl = `${DOMAIN_ES}${normalizedPath}`;
    const enUrl = `${DOMAIN_EN}${normalizedPath}`;

    // Document language
    document.documentElement.lang = locale;

    // Title
    document.title = title;

    // Standard meta
    setMetaTag('name', 'description', description);

    // Canonical
    setLinkTag('canonical', canonicalUrl);

    // Hreflang alternates connecting Spanish and English domains
    setLinkTag('alternate', esUrl, { hreflang: 'es' });
    setLinkTag('alternate', enUrl, { hreflang: 'en' });
    setLinkTag('alternate', esUrl, { hreflang: 'x-default' });

    // Open Graph
    setMetaTag('property', 'og:title', title);
    setMetaTag('property', 'og:description', description);
    setMetaTag('property', 'og:url', canonicalUrl);
    setMetaTag('property', 'og:type', ogType);
    setMetaTag('property', 'og:image', image);
    setMetaTag('property', 'og:locale', isEn ? 'en_US' : 'es_ES');
    setMetaTag('property', 'og:site_name', 'NOVA Marketing Solutions');

    // Twitter
    setMetaTag('name', 'twitter:title', title);
    setMetaTag('name', 'twitter:description', description);
    setMetaTag('name', 'twitter:image', image);
    setMetaTag('name', 'twitter:card', 'summary_large_image');
  }, [title, description, path, image, ogType, baseUrl, isEn, locale]);

  return null;
};

export default SEOHead;
