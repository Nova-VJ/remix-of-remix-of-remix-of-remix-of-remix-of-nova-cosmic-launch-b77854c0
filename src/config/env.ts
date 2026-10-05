// Environment configuration for deployment
// These values can be overridden via environment variables

export const SITE_URL = import.meta.env.VITE_SITE_URL ?? 'https://solutionsnova.es';
export const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
export const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

// Sara chat endpoint (uses this project's edge function)
export const SARA_CHAT_ENDPOINT = import.meta.env.VITE_SARA_CHAT_ENDPOINT ?? 'https://dnnqeydtybmzriyjqqyt.supabase.co/functions/v1/sara-chat';

// URLs for Sara chat - these are replaced from placeholders in Sara's responses
export const FORM_URL = import.meta.env.VITE_FORM_URL ?? `${window.location.origin}/?openBriefing=true`;
export const WHATSAPP_URL = import.meta.env.VITE_WHATSAPP_URL ?? 'https://wa.me/34611967651';
