import { listarGastos, agregarGasto } from './almacenLocal';
import type { Gasto } from '../types/finanzas';

const KEY_TS = 'mangox-gastos-fijos-ts';

export function asegurarGastosFijosDelMes() {
  const gastos = listarGastos();
  const fijos = gastos.filter((g) => g.esGastoFijo);
  if (fijos.length === 0) return;
  const mesClave = claveMes(new Date());
  const yaEjecutado = leerTs() === mesClave;
  if (yaEjecutado) return;
  const existentes = new Set(gastos.filter((g) => claveMes(new Date(g.fecha)) === mesClave).map((g) => firma(g)));
  fijos.forEach((base) => {
    const f = firma(base);
    if (existentes.has(f)) return;
    const nuevo: Gasto = {
      ...base,
      id: crypto.randomUUID(),
      fecha: new Date(new Date().getFullYear(), new Date().getMonth(), Math.min(15, new Date().getDate())).toISOString(),
      fechaPagoEstimada: base.fechaPagoEstimada,
    };
    agregarGasto(nuevo);
  });
  escribirTs(mesClave);
}

function claveMes(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}

function firma(g: Gasto) {
  return `${g.concepto}|${g.entidad}|${g.moneda}`;
}

function leerTs() {
  try {
    return localStorage.getItem(KEY_TS) ?? '';
  } catch {
    return '';
  }
}

function escribirTs(valor: string) {
  try {
    localStorage.setItem(KEY_TS, valor);
  } catch {
    void 0;
  }
}
