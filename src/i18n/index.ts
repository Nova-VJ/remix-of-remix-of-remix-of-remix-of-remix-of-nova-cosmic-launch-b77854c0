import { es } from './es';
import { en } from './en';
import type { TranslationSchema } from './types';

export type Locale = 'es' | 'en';

export const getLocale = (): Locale => {
  // 1. Build-time environment variable (Cloudflare build setting: VITE_LOCALE=en)
  const envLocale = import.meta.env.VITE_LOCALE?.toLowerCase();
  if (envLocale === 'en' || envLocale === 'es') {
    return envLocale;
  }

  // 2. Browser runtime fallback by domain & query param
  if (typeof window !== 'undefined') {
    // Explicit query param override ?lang=en or ?lang=es
    if (window.location?.search) {
      const params = new URLSearchParams(window.location.search);
      const q = params.get('lang') || params.get('locale');
      if (q === 'en' || q === 'es') {
        return q;
      }
    }

    if (window.location?.hostname) {
      const host = window.location.hostname.toLowerCase();
      // US domain or Cloudflare pages deployment for US
      if (
        host.includes('novasolutionsmkt.com') ||
        host.includes('77851234') ||
        host.includes('novasolutions')
      ) {
        return 'en';
      }
      if (host.includes('solutionsnova.es')) {
        return 'es';
      }
    }
  }

  return 'es';
};

export const locale: Locale = getLocale();
export const isEn: boolean = locale === 'en';
export const isEs: boolean = locale === 'es';

export const dictionaries: Record<Locale, TranslationSchema> = {
  es,
  en,
};

/** Inline text by locale: L('español', 'English') */
export const L = <T,>(es: T, en: T): T => (isEn ? en : es);

export const t: TranslationSchema = dictionaries[locale];

export const formatCurrency = (amount: number): string => {
  if (isEn) {
    return `$${new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(amount)}`;
  }
  return `${new Intl.NumberFormat('es-ES', { maximumFractionDigits: 0 }).format(amount)} €`;
};

export const formatPriceWithPeriod = (amount: number, isMonthly?: boolean): string => {
  const formatted = formatCurrency(amount);
  if (isMonthly) {
    return `${formatted}${t.services.perMonth}`;
  }
  return formatted;
};

export const useTranslation = () => {
  return {
    t,
    locale,
    isEn,
    isEs,
    formatCurrency,
    formatPriceWithPeriod,
  };
};

export type { TranslationSchema } from './types';
