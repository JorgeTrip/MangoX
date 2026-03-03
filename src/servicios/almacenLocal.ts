import type { Gasto, Operacion, Prestamo } from '../types/finanzas';

const KEYS = {
  gastos: 'mangox-gastos',
  prestamos: 'mangox-prestamos',
  operaciones: 'mangox-operaciones',
} as const;

function leerLista<T>(key: string): T[] {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return [];
    const data = JSON.parse(raw) as T[];
    return Array.isArray(data) ? data : [];
  } catch (e) {
    void e;
    return [];
  }
}

function guardarLista<T>(key: string, data: T[]) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    void e;
  }
}

export function listarGastos() {
  return leerLista<Gasto>(KEYS.gastos);
}

export function listarPrestamos() {
  return leerLista<Prestamo>(KEYS.prestamos);
}

export function listarOperaciones() {
  return leerLista<Operacion>(KEYS.operaciones);
}

export function agregarGasto(gasto: Gasto) {
  const data = listarGastos();
  guardarLista(KEYS.gastos, [gasto, ...data]);
}

export function agregarPrestamo(prestamo: Prestamo) {
  const data = listarPrestamos();
  guardarLista(KEYS.prestamos, [prestamo, ...data]);
}

export function agregarOperacion(operacion: Operacion) {
  const data = listarOperaciones();
  guardarLista(KEYS.operaciones, [operacion, ...data]);
}
