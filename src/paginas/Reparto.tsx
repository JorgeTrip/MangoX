import { useMemo, useState } from 'react';
import { useProgresoSuave } from '../hooks/useProgresoSuave';
import { actualizarPagado, balanceIndividual, crearEvento, finalizarEvento, guardarEvento, listarEventos } from '../servicios/reparto';
import type { EventoReparto, Moneda } from '../types/finanzas';
import { useTranslation } from 'react-i18next';
import { toast } from '../notificaciones/toast';

type Fila = { nombre: string; montoAportado: string; personasAdicionales: string };

export default function Reparto() {
  const { t } = useTranslation();
  const [nombre, setNombre] = useState('');
  const [moneda, setMoneda] = useState<Moneda>('ARS');
  const [filas, setFilas] = useState<Fila[]>([{ nombre: '', montoAportado: '', personasAdicionales: '0' }]);
  const [evento, setEvento] = useState<EventoReparto | null>(null);
  const [historial, setHistorial] = useState<EventoReparto[]>(() => listarEventos());
  const [tab, setTab] = useState<'nuevo' | 'historial'>('nuevo');
  const { cargando, run } = useProgresoSuave(1200);

  const activos = useMemo(() => historial.filter((e) => !e.finalizado), [historial]);
  const finalizados = useMemo(() => historial.filter((e) => e.finalizado), [historial]);

  const agregarFila = () => setFilas((f) => [...f, { nombre: '', montoAportado: '', personasAdicionales: '0' }]);
  const quitarFila = (i: number) => setFilas((f) => f.filter((_, idx) => idx !== i));

  const crear = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const entradas = filas
      .map((f) => ({ nombre: f.nombre.trim(), montoAportado: Number(f.montoAportado), personasAdicionales: Number(f.personasAdicionales) }))
      .filter((f) => f.nombre && f.montoAportado >= 0 && !Number.isNaN(f.montoAportado));
    if (!nombre.trim() || entradas.length === 0) return;
    const ev = crearEvento(nombre, moneda, entradas);
    await run(async () => true);
    setEvento(ev);
    guardarEvento(ev);
    setHistorial((h) => [ev, ...h]);
  };

  const marcarPagado = (aportanteId: string, valor: boolean) => {
    if (!evento) return;
    setEvento({ ...evento, aportantes: evento.aportantes.map((a) => (a.id === aportanteId ? { ...a, pagado: valor } : a)) });
    actualizarPagado(evento.id, aportanteId, valor);
    setHistorial(listarEventos());
    toast(valor ? 'Marcado como pagado' : 'Marcado como pendiente');
  };

  const finalizar = async () => {
    if (!evento) return;
    await run(async () => true);
    finalizarEvento(evento.id);
    setHistorial(listarEventos());
    setEvento(null);
    setTab('historial');
    toast('Evento finalizado');
  };

  return (
    <div className="grid gap-4">
      <div className="rounded-3xl p-6 glass dark:glass-dark surface-card">
        <div className="flex items-center gap-2 mb-3">
          <button onClick={() => setTab('nuevo')} className={`rounded-full px-3 py-1 text-sm ${tab === 'nuevo' ? 'bg-black/80 text-white dark:bg-white/15' : 'bg-black/10 dark:bg-white/10'}`}>{t('reparto.nuevo')}</button>
          <button onClick={() => setTab('historial')} className={`rounded-full px-3 py-1 text-sm ${tab === 'historial' ? 'bg-black/80 text-white dark:bg-white/15' : 'bg-black/10 dark:bg-white/10'}`}>{t('reparto.historial')}</button>
        </div>
        {tab === 'nuevo' ? (
          <form onSubmit={crear} className="grid gap-3">
            <input value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder={t('reparto.nombre_evento')} className="rounded-lg px-3 py-2 bg-white/80 dark:bg-white/10" />
            <select value={moneda} onChange={(e) => setMoneda(e.target.value as Moneda)} className="rounded-lg px-3 py-2 bg-white/80 dark:bg-white/10 w-40" aria-label={t('reparto.moneda')}>
              <option value="ARS">ARS</option>
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
            </select>
            <div className="rounded-xl p-3 bg-white/30 dark:bg-white/5">
              <div className="grid grid-cols-[2fr_1fr_1fr_auto] gap-2 items-center mb-2 text-sm opacity-70">
                <div>{t('reparto.nombre')}</div>
                <div>{t('reparto.monto_aportado')}</div>
                <div>{t('reparto.personas_adic')}</div>
                <div />
              </div>
              {filas.map((fila, i) => (
                <div key={i} className="grid grid-cols-[2fr_1fr_1fr_auto] gap-2 items-center mb-2">
                  <input value={fila.nombre} onChange={(e) => setFilas((f) => f.map((x, idx) => (idx === i ? { ...x, nombre: e.target.value } : x)))} placeholder={t('reparto.nombre')} className="rounded-lg px-3 py-2 bg-white/80 dark:bg-white/10" />
                  <input value={fila.montoAportado} onChange={(e) => setFilas((f) => f.map((x, idx) => (idx === i ? { ...x, montoAportado: e.target.value } : x)))} placeholder={t('reparto.monto_aportado')} inputMode="decimal" className="rounded-lg px-3 py-2 bg-white/80 dark:bg-white/10" />
                  <input value={fila.personasAdicionales} onChange={(e) => setFilas((f) => f.map((x, idx) => (idx === i ? { ...x, personasAdicionales: e.target.value } : x)))} placeholder="0" inputMode="numeric" className="rounded-lg px-3 py-2 bg-white/80 dark:bg-white/10" />
                  <button type="button" onClick={() => quitarFila(i)} className="rounded-md px-3 py-2 bg-black/10 dark:bg-white/10">{t('reparto.quitar')}</button>
                </div>
              ))}
              <button type="button" onClick={agregarFila} className="rounded-md px-3 py-2 bg-black/10 dark:bg-white/10 mt-1">{t('reparto.agregar')}</button>
            </div>
            <button className="btn-primary" disabled={cargando}>{cargando ? 'Calculando…' : t('reparto.calcular')}</button>
          </form>
        ) : (
          <div className="grid gap-3">
            <div className="text-sm opacity-80">{t('reparto.activos')}</div>
            <ListaEventos eventos={activos} />
            <div className="text-sm opacity-60 mt-2">{t('reparto.finalizados')}</div>
            <ListaEventos eventos={finalizados} finalizados />
          </div>
        )}
      </div>
      {evento ? (
        <div className="rounded-3xl p-6 glass dark:glass-dark surface-card space-y-3">
          <div className="flex items-center justify-between">
            <div className="font-medium">{t('reparto.resultados')}</div>
            <span className="chip">{evento.nombre}</span>
          </div>
          <div className="text-sm opacity-80">{t('reparto.equitativo')}: {evento.moneda} {evento.montoEquitativo.toLocaleString('es-AR', { maximumFractionDigits: 2 })}</div>
          <ul className="grid gap-2">
            {evento.aportantes.map((a) => {
              const bal = balanceIndividual(evento, a);
              const positivo = bal > 0;
              return (
                <li key={a.id} className={`rounded-lg px-3 py-2 flex items-center justify-between gap-3 ${positivo ? 'bg-emerald-500/15' : 'bg-rose-500/15'}`}>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{a.nombre}</span>
                    <span className="text-xs opacity-70">({evento.moneda} {a.montoAportado.toLocaleString('es-AR', { maximumFractionDigits: 2 })})</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={positivo ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}>
                      {positivo ? t('reparto.cobra') : t('reparto.paga')} {evento.moneda} {Math.abs(bal).toLocaleString('es-AR', { maximumFractionDigits: 2 })}
                    </span>
                    <label className="flex items-center gap-2 text-sm">
                      <input type="checkbox" checked={a.pagado} onChange={(e) => marcarPagado(a.id, e.target.checked)} />
                      {t('reparto.pagado')}
                    </label>
                  </div>
                </li>
              );
            })}
          </ul>
          <div className="flex gap-2">
            <button onClick={finalizar} className="btn-primary" disabled={cargando}>{cargando ? 'Finalizando…' : t('reparto.finalizar')}</button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function ListaEventos({ eventos, finalizados = false }: { eventos: EventoReparto[]; finalizados?: boolean }) {
  const { t } = useTranslation();
  if (eventos.length === 0) return <div className="rounded-lg px-3 py-2 bg-white/30 dark:bg-white/5 opacity-70 text-sm">{t('reparto.sin_eventos')}</div>;
  return (
    <ul className="grid gap-2">
      {eventos.map((e) => (
        <li key={e.id} className={`rounded-lg px-3 py-2 ${finalizados ? 'opacity-70' : ''} ${finalizados ? 'bg-white/20 dark:bg-white/5' : 'bg-white/30 dark:bg-white/10'}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-medium">{e.nombre}</span>
              <span className="text-xs opacity-70">{new Date(e.creadoEn).toLocaleString('es-AR')}</span>
            </div>
            <span className="text-sm">{e.moneda} {e.total.toLocaleString('es-AR', { maximumFractionDigits: 2 })}</span>
          </div>
        </li>
      ))}
    </ul>
  );
}
