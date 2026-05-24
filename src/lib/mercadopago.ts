import { initMercadoPago } from '@mercadopago/sdk-react';
import { getPublicKey } from './mpPayments';

let initialized = false;
let cachedInfo: { public_key: string; environment: string } | null = null;

export async function ensureMercadoPago(): Promise<{ public_key: string; environment: string }> {
  if (cachedInfo && initialized) return cachedInfo;

  const info = await getPublicKey();

  if (!info.public_key) {
    throw new Error('Chave publica do Mercado Pago nao configurada');
  }

  if (!initialized) {
    initMercadoPago(info.public_key, { locale: 'pt-BR' });
    initialized = true;
  }

  cachedInfo = info;
  return info;
}

export function resetMercadoPago() {
  initialized = false;
  cachedInfo = null;
}
