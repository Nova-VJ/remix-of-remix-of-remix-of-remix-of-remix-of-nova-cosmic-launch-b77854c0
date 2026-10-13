// Analytics and ad pixels. Nothing loads until the visitor accepts the matching
// cookie category (see CookieConsent), and each tool stays off until its ID is
// set as an environment variable in Cloudflare Pages:
//   VITE_GA4_ID          Google Analytics 4, e.g. G-XXXXXXX
//   VITE_GOOGLE_ADS_ID   Google Ads conversion tag, e.g. AW-XXXXXXX
//   VITE_META_PIXEL_ID   Meta (Facebook/Instagram) Pixel ID

const GA4_ID = import.meta.env.VITE_GA4_ID as string | undefined;
const GOOGLE_ADS_ID = import.meta.env.VITE_GOOGLE_ADS_ID as string | undefined;
const META_PIXEL_ID = import.meta.env.VITE_META_PIXEL_ID as string | undefined;

type Gtag = (...args: unknown[]) => void;
type Fbq = ((...args: unknown[]) => void) & { callMethod?: (...args: unknown[]) => void; queue: unknown[]; loaded: boolean; version: string; push: Fbq };

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: Gtag;
    fbq?: Fbq;
    _fbq?: Fbq;
  }
}

const configured = new Set<string>();

function addScript(src: string) {
  const script = document.createElement('script');
  script.async = true;
  script.src = src;
  document.head.appendChild(script);
}

function gtagConfig(id: string, options?: Record<string, unknown>) {
  if (configured.has(id)) return;
  if (!window.gtag) {
    window.dataLayer = window.dataLayer || [];
    window.gtag = function gtag() {
      // gtag.js expects the arguments object itself, not an array
      // eslint-disable-next-line prefer-rest-params
      window.dataLayer!.push(arguments);
    };
    window.gtag('js', new Date());
    addScript(`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(id)}`);
  }
  window.gtag('config', id, options);
  configured.add(id);
}

export function loadAnalytics() {
  if (GA4_ID) gtagConfig(GA4_ID, { anonymize_ip: true });
}

export function loadMarketing() {
  if (GOOGLE_ADS_ID) gtagConfig(GOOGLE_ADS_ID);

  if (META_PIXEL_ID && !window.fbq) {
    // Standard Meta Pixel bootstrap
    const fbq = function (...args: unknown[]) {
      if (fbq.callMethod) fbq.callMethod(...args);
      else fbq.queue.push(args);
    } as Fbq;
    fbq.push = fbq;
    fbq.loaded = true;
    fbq.version = '2.0';
    fbq.queue = [];
    window.fbq = fbq;
    window._fbq = fbq;
    addScript('https://connect.facebook.net/en_US/fbevents.js');
    fbq('init', META_PIXEL_ID);
    fbq('track', 'PageView');
  }
}

/** A visitor asked for a quote or contacted us: report it as a lead conversion. */
export function trackLead(method: string) {
  window.gtag?.('event', 'generate_lead', { method });
  window.fbq?.('track', 'Lead', { content_name: method });
}
