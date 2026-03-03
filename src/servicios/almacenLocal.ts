import type { Gasto, Operacion, Prestamo } from '../types/finanzas';

const KEYS = {
  gastos: 'mangox-gastos',
  prestamos: 'mangox-prestamos',
  operaciones: 'mangox-operaciones',
  preferenciasNotificacion: 'mangox-preferencias-notificacion',
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

export function agregarGastos(gastos: Gasto[]) {
  const data = listarGastos();
  guardarLista(KEYS.gastos, [...gastos, ...data]);
}

export function eliminarGasto(gastoId: string) {
  const data = listarGastos();
  guardarLista(
    KEYS.gastos,
    data.filter((g) => g.id !== gastoId)
  );
}

export function agregarPrestamo(prestamo: Prestamo) {
  const data = listarPrestamos();
  guardarLista(KEYS.prestamos, [prestamo, ...data]);
}

export function actualizarPrestamo(prestamo: Prestamo) {
  const data = listarPrestamos();
  guardarLista(
    KEYS.prestamos,
    [prestamo, ...data.filter((p) => p.id !== prestamo.id)]
  );
}

export function agregarOperacion(operacion: Operacion) {
  const data = listarOperaciones();
  guardarLista(KEYS.operaciones, [operacion, ...data]);
}

export type PreferenciasNotificacion = {
  email: boolean;
  push: boolean;
};

export function leerPreferenciasNotificacion(): PreferenciasNotificacion {
  const raw = leerLista<PreferenciasNotificacion>(KEYS.preferenciasNotificacion);
  const fallback = { email: true, push: true };
  const primera = raw[0];
  if (!primera) return fallback;
  return { email: Boolean(primera.email), push: Boolean(primera.push) };
}

export function guardarPreferenciasNotificacion(preferencias: PreferenciasNotificacion) {
  guardarLista(KEYS.preferenciasNotificacion, [preferencias]);
}
