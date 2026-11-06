import { getLocale } from '@/i18n';

// Datos del titular de la web (adaptados por idioma y jurisdicción)
const locale = getLocale();
const isEn = locale === 'en';

export const LEGAL_ENTITY = isEn
  ? {
      tradeName: 'Nova Marketing Solutions',
      /* REVISAR: Legal corporate structure (LLC, Corp) to be confirmed by legal counsel */
      holder: 'Nova Marketing Solutions LLC',
      /* REVISAR: EIN (Employer Identification Number) or state filing number */
      taxId: '',
      /* REVISAR: Registered office or commercial address in the United States */
      address: 'Delaware, United States',
      email: 'info@novasolutionsmkt.com',
      phone: '+1 (302) 991-9144',
      jurisdiction: 'State of Delaware, United States',
    }
  : {
      tradeName: 'Nova Marketing Solutions',
      holder: '',
      taxId: '',
      address: '',
      email: 'info@solutionsnova.es',
      phone: '+34 659 34 38 22',
      jurisdiction: 'España',
    };

export const LEGAL_UPDATED = isEn ? 'October 2026' : '15 de octubre de 2026';

export const legalIdentityRows = () => {
  if (isEn) {
    return [
      ['Entity / Holder', LEGAL_ENTITY.holder],
      ['Trade Name', LEGAL_ENTITY.tradeName],
      ['EIN / Registration', LEGAL_ENTITY.taxId],
      ['Address', LEGAL_ENTITY.address],
      ['Email', LEGAL_ENTITY.email],
      ['Phone', LEGAL_ENTITY.phone],
    ].filter(([, value]) => value);
  }

  return [
    ['Titular', LEGAL_ENTITY.holder],
    ['Nombre comercial', LEGAL_ENTITY.tradeName],
    ['NIF', LEGAL_ENTITY.taxId],
    ['Domicilio', LEGAL_ENTITY.address],
    ['Email', LEGAL_ENTITY.email],
    ['Teléfono', LEGAL_ENTITY.phone],
  ].filter(([, value]) => value);
};
