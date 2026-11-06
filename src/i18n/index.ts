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

  // 2. Browser runtime fallback by domain (in case served on novasolutionsmkt.com without env set)
  if (typeof window !== 'undefined' && window.location?.hostname) {
    const host = window.location.hostname.toLowerCase();
    if (host.includes('novasolutionsmkt.com')) {
      return 'en';
    }
    if (host.includes('solutionsnova.es')) {
      return 'es';
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

export const t: TranslationSchema = dictionaries[locale];

export const formatCurrency = (amount: number): string => {
  if (isEn) {
    return `$${new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(amount)}`;
  }
  return `${new Intl.NumberFormat('es-ES', { maximumFractionDigits: 0 }).format(amount)}€`;
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
