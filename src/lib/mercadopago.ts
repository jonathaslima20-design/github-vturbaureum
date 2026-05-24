import { initMercadoPago } from '@mercadopago/sdk-react';

let initialized = false;
let cachedKey: string | null = null;

export function initMercadoPagoSdk(publicKey: string) {
  if (initialized && cachedKey === publicKey) return;
  initMercadoPago(publicKey, { locale: 'pt-BR' });
  initialized = true;
  cachedKey = publicKey;
}

export function resetMercadoPago() {
  initialized = false;
  cachedKey = null;
}
