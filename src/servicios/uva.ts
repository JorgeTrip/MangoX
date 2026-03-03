type UvaResp = { fecha: string; valor: number }[];

const KEY = 'uva-cache';
const MS_DIA = 24 * 60 * 60 * 1000;

export async function obtenerUvaActual(): Promise<number | null> {
  const fuentes = [
    'https://api.argentinadatos.com/v1/finanzas/indices/uva',
    'https://api.argentinadatos.com/v1/cotizaciones/uva',
  ];
  try {
    for (const endpoint of fuentes) {
      const r = await fetch(endpoint, { cache: 'no-store' });
      if (!r.ok) continue;
      const data = (await r.json()) as UvaResp;
      const ultimo = data.at(-1);
      if (ultimo?.valor) {
        cachear(ultimo.valor);
        return ultimo.valor;
      }
    }
  } catch (e) {
    void e;
  }
  const c = leerCache();
  if (c) return c.valor;
  return null;
}

function cachear(valor: number) {
  try {
    localStorage.setItem(KEY, JSON.stringify({ valor, ts: Date.now() }));
  } catch (e) {
    void e;
  }
}

function leerCache(): { valor: number; ts: number } | null {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const obj = JSON.parse(raw) as { valor: number; ts: number };
    if (Date.now() - obj.ts < 3 * MS_DIA) return obj;
  } catch (e) {
    void e;
  }
  return null;
}
