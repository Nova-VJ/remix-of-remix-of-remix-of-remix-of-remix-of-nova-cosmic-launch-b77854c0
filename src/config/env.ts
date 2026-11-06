// Environment configuration for deployment
// Values are locale-aware and can be overridden via environment variables

import { getLocale } from '@/i18n';

const currentLocale = getLocale();
const isEnglish = currentLocale === 'en';

export const SITE_URL =
  import.meta.env.VITE_SITE_URL ??
  (isEnglish ? 'https://novasolutionsmkt.com' : 'https://solutionsnova.es');

export const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
export const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

// Sara chat endpoint (uses this project's edge function)
export const SARA_CHAT_ENDPOINT =
  import.meta.env.VITE_SARA_CHAT_ENDPOINT ??
  'https://dnnqeydtybmzriyjqqyt.supabase.co/functions/v1/sara-chat';

// URLs for Sara chat and contact buttons
export const FORM_URL =
  import.meta.env.VITE_FORM_URL ??
  (typeof window !== 'undefined' ? `${window.location.origin}/?openBriefing=true` : `${SITE_URL}/?openBriefing=true`);

export const WHATSAPP_NUMBER = isEnglish ? '13029919144' : '34659343822';
export const WHATSAPP_URL =
  import.meta.env.VITE_WHATSAPP_URL ?? `https://wa.me/${WHATSAPP_NUMBER}`;

export const CONTACT_EMAIL = isEnglish ? 'info@novasolutionsmkt.com' : 'info@solutionsnova.es';
export const CONTACT_PHONE = isEnglish ? '+1 (302) 991-9144' : '+34 659 34 38 22';

export const getWhatsAppNumber = () => WHATSAPP_NUMBER;
export const getContactEmail = () => CONTACT_EMAIL;
export const getSiteUrl = () => SITE_URL;
