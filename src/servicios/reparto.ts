import type { AportanteEvento, EventoReparto, Moneda } from '../types/finanzas';

const KEY = 'mangox-reparto-eventos';

export function crearEvento(nombre: string, moneda: Moneda, aportantes: Array<{ nombre: string; montoAportado: number; personasAdicionales: number }>): EventoReparto {
  const normalizados: AportanteEvento[] = aportantes.map((a) => ({
    id: crypto.randomUUID(),
    nombre: a.nombre.trim(),
    montoAportado: Number(a.montoAportado) || 0,
    personasAdicionales: Math.max(0, Math.trunc(a.personasAdicionales) || 0),
    pagado: false,
  }));
  const totalPersonas = normalizados.reduce((acc, a) => acc + 1 + a.personasAdicionales, 0);
  const total = normalizados.reduce((acc, a) => acc + a.montoAportado, 0);
  const montoEquitativo = totalPersonas > 0 ? total / totalPersonas : 0;
  return {
    id: crypto.randomUUID(),
    nombre: nombre.trim(),
    moneda,
    aportantes: normalizados,
    total,
    totalPersonas,
    montoEquitativo,
    creadoEn: new Date().toISOString(),
    finalizado: false,
  };
}

export function balanceIndividual(evento: EventoReparto, aportante: AportanteEvento) {
  const factor = 1 + aportante.personasAdicionales;
  const equitativo = evento.montoEquitativo * factor;
  return aportante.montoAportado - equitativo;
}

export function listarEventos(): EventoReparto[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const data = JSON.parse(raw) as EventoReparto[];
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

export function guardarEvento(evento: EventoReparto) {
  const data = listarEventos();
  const updated = [evento, ...data.filter((e) => e.id !== evento.id)];
  localStorage.setItem(KEY, JSON.stringify(updated));
}

export function actualizarPagado(eventoId: string, aportanteId: string, pagado: boolean) {
  const data = listarEventos();
  const ev = data.find((e) => e.id === eventoId);
  if (!ev) return;
  ev.aportantes = ev.aportantes.map((a) => (a.id === aportanteId ? { ...a, pagado } : a));
  guardarEvento(ev);
}

export function finalizarEvento(eventoId: string) {
  const data = listarEventos();
  const ev = data.find((e) => e.id === eventoId);
  if (!ev) return;
  ev.finalizado = true;
  guardarEvento(ev);
}
