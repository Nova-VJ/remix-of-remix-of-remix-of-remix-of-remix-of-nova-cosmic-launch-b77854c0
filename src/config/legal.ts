// Datos del titular de la web (LSSI-CE art. 10 y RGPD art. 13). Se muestran en el Aviso Legal y en la
// Política de Privacidad; los campos vacíos no se muestran. Pendiente de completar: titular, NIF y domicilio.
export const LEGAL_ENTITY = {
  tradeName: 'Nova Marketing Solutions',
  holder: '', // nombre y apellidos o razón social
  taxId: '', // NIF / CIF
  address: '', // domicilio
  email: 'info@solutionsnova.es',
  phone: '+34 659 34 38 22',
};

export const LEGAL_UPDATED = '15 de octubre de 2026';

export const legalIdentityRows = () =>
  [
    ['Titular', LEGAL_ENTITY.holder],
    ['Nombre comercial', LEGAL_ENTITY.tradeName],
    ['NIF', LEGAL_ENTITY.taxId],
    ['Domicilio', LEGAL_ENTITY.address],
    ['Email', LEGAL_ENTITY.email],
    ['Teléfono', LEGAL_ENTITY.phone],
  ].filter(([, value]) => value);
