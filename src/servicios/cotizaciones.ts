import type { Moneda } from '../types/finanzas';

const KEY_USD_ARS = 'mangox-cache-usd-ars';
const KEY_EUR_USD = 'mangox-cache-eur-usd';
const TTL_MS = 12 * 60 * 60 * 1000;

type Cotizacion = { valor: number; ts: number };
type BluelyticsResp = { oficial?: { value_avg?: number; value_sell?: number; value_buy?: number } };
type FrankfurterResp = { rates?: { USD?: number } };

export async function sugerirTasaCambioAPesos(moneda: Moneda) {
  if (moneda === 'ARS') return { tasa: 1, fuente: 'Fija ARS', fecha: new Date().toISOString() };
  if (moneda === 'USD') {
    const usdArs = await obtenerUsdArs();
    return { tasa: usdArs, fuente: 'Bluelytics oficial promedio', fecha: new Date().toISOString() };
  }
  const [eurUsd, usdArs] = await Promise.all([obtenerEurUsd(), obtenerUsdArs()]);
  return {
    tasa: redondear(eurUsd * usdArs),
    fuente: 'Frankfurter EUR/USD + Bluelytics USD/ARS',
    fecha: new Date().toISOString(),
  };
}

async function obtenerUsdArs() {
  const cache = leer(KEY_USD_ARS);
  if (cache) return cache.valor;
  const r = await fetch('https://api.bluelytics.com.ar/v2/latest', { cache: 'no-store' });
  if (!r.ok) throw new Error('sin cotización USD/ARS');
  const data = (await r.json()) as BluelyticsResp;
  const avg = data.oficial?.value_avg ?? promedio(data.oficial?.value_buy, data.oficial?.value_sell);
  if (!avg || avg <= 0) throw new Error('cotización inválida USD/ARS');
  guardar(KEY_USD_ARS, avg);
  return avg;
}

async function obtenerEurUsd() {
  const cache = leer(KEY_EUR_USD);
  if (cache) return cache.valor;
  const r = await fetch('https://api.frankfurter.dev/v1/latest?base=EUR&symbols=USD', { cache: 'no-store' });
  if (!r.ok) throw new Error('sin cotización EUR/USD');
  const data = (await r.json()) as FrankfurterResp;
  const usd = data.rates?.USD;
  if (!usd || usd <= 0) throw new Error('cotización inválida EUR/USD');
  guardar(KEY_EUR_USD, usd);
  return usd;
}

function promedio(a?: number, b?: number) {
  if (!a || !b) return null;
  return (a + b) / 2;
}

function redondear(valor: number) {
  return Math.round((valor + Number.EPSILON) * 100) / 100;
}

function guardar(key: string, valor: number) {
  try {
    localStorage.setItem(key, JSON.stringify({ valor, ts: Date.now() }));
  } catch (e) {
    void e;
  }
}

function leer(key: string): Cotizacion | null {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const data = JSON.parse(raw) as Cotizacion;
    if (Date.now() - data.ts > TTL_MS) return null;
    if (data.valor <= 0) return null;
    return data;
  } catch (e) {
    void e;
    return null;
  }
}
