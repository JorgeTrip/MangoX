const API_BCRA = 'https://api.bcra.gob.ar/entidades/v1.0/entidades';

export const billeterasTop = [
  'Mercado Pago',
  'Ualá',
  'Personal Pay',
  'Naranja X',
  'Prex',
  'Lemon Cash',
  'Belo',
  'Modo',
  'Buenbit',
  'Ripio',
  "Let'sBit",
  'Fiwind',
  'TiendaCrypto',
  'Vibrant',
  'Astropay',
  'PayPal',
  'Skrill',
  'Wise',
  'Payoneer',
  'Nexo',
  'Binance',
];

type BancoResp = { results?: Array<{ nombre?: string; denominacion?: string }> };

export async function listarEntidadesFinancieras() {
  try {
    const r = await fetch(API_BCRA, { cache: 'no-store' });
    if (!r.ok) throw new Error('sin respuesta');
    const json = (await r.json()) as BancoResp;
    const bancos = (json.results ?? [])
      .map((b) => b.nombre ?? b.denominacion ?? '')
      .map((b) => b.trim())
      .filter(Boolean);
    if (bancos.length === 0) throw new Error('sin bancos');
    return [...new Set([...bancos, ...billeterasTop])];
  } catch (e) {
    void e;
    return billeterasTop;
  }
}
