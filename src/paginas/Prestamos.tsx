import { useEffect, useMemo, useState } from 'react';
import { actualizarPrestamo, listarPrestamos } from '../servicios/almacenLocal';
import { estimarCuotaPrestamo } from '../servicios/prestamos';
import { obtenerUvaActual } from '../servicios/uva';
import type { Prestamo } from '../types/finanzas';
import { useTranslation } from 'react-i18next';
import { toast } from '../notificaciones/toast';

export default function Prestamos() {
  const { t } = useTranslation();
  const [prestamos, setPrestamos] = useState<Prestamo[]>(() => listarPrestamos());
  const [valorUva, setValorUva] = useState<number | null>(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    obtenerUvaActual().then((v) => setValorUva(v)).finally(() => setCargando(false));
  }, []);

  const activos = useMemo(() => prestamos, [prestamos]);

  const setAjuste = (p: Prestamo, ajusteStr: string) => {
    const ajuste = Number(ajusteStr);
    const upd: Prestamo = { ...p, ajusteManual: Number.isNaN(ajuste) || ajuste <= 0 ? undefined : ajuste };
    actualizarPrestamo(upd);
    setPrestamos(listarPrestamos());
  };

  const marcarPagada = (p: Prestamo) => {
    const pagadas = (p.cuotasPagadas ?? 0) + 1;
    const upd: Prestamo = { ...p, cuotasPagadas: Math.min(pagadas, p.cuotas) };
    actualizarPrestamo(upd);
    setPrestamos(listarPrestamos());
    toast('Cuota marcada como pagada');
  };

  const postergar = (p: Prestamo, dias: number) => {
    const fecha = new Date();
    fecha.setDate(fecha.getDate() + dias);
    const upd: Prestamo = { ...p, postergadoHasta: fecha.toISOString() };
    actualizarPrestamo(upd);
    setPrestamos(listarPrestamos());
    toast(`Cuota postergada ${dias} días`);
  };

  return (
    <div className="grid gap-4">
      <div className="rounded-3xl p-6 glass dark:glass-dark surface-card">
        <div className="flex items-center justify-between">
          <div className="font-medium">{t('prestamos.titulo')}</div>
          <span className="chip">{cargando ? t('prestamos.cargando') : t('prestamos.actualizado')}</span>
        </div>
      </div>
      <ul className="grid gap-3">
        {activos.map((p) => {
          const cuota = estimarCuotaPrestamo(p, valorUva);
          const restante = p.cuotas - (p.cuotasPagadas ?? 0);
          return (
            <li key={p.id} className="rounded-2xl p-4 glass dark:glass-dark surface-card">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="font-medium">{p.contraparte}</div>
                  <div className="opacity-70 text-sm">{p.moneda} {p.monto.toLocaleString('es-AR', { maximumFractionDigits: 2 })} · {p.modalidad ?? 'tasa_fija'}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm opacity-70">{t('prestamos.cuota_estimada')}</div>
                  <div className="text-lg font-semibold">{p.moneda} {cuota.toLocaleString('es-AR', { maximumFractionDigits: 2 })}</div>
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-2 mt-3">
                <div className="rounded-lg px-3 py-2 bg-white/30 dark:bg-white/5 text-sm">
                  {t('prestamos.restantes')}: {restante} / {p.cuotas} {p.postergadoHasta ? `· ${t('prestamos.postergado_hasta')} ${new Date(p.postergadoHasta).toLocaleDateString('es-AR')}` : ''}
                </div>
                <div className="grid grid-cols-[1fr_auto_auto_auto] gap-2">
                  <input defaultValue={p.ajusteManual ?? ''} onBlur={(e) => setAjuste(p, e.target.value)} placeholder={t('prestamos.ajuste_manual')} inputMode="decimal" className="rounded-lg px-3 py-2 bg-white/80 dark:bg-white/10" />
                  <button onClick={() => marcarPagada(p)} className="rounded-lg px-3 py-2 bg-black/10 dark:bg-white/10 text-sm">{t('prestamos.marcar_pagada')}</button>
                  <button onClick={() => postergar(p, 15)} className="rounded-lg px-3 py-2 bg-black/10 dark:bg:white/10 text-sm">{t('prestamos.mas_15')}</button>
                  <button onClick={() => postergar(p, 30)} className="rounded-lg px-3 py-2 bg-black/10 dark:bg:white/10 text-sm">{t('prestamos.mas_1_mes')}</button>
                </div>
              </div>
            </li>
          );
        })}
        {activos.length === 0 ? <li className="rounded-2xl p-4 glass dark:glass-dark surface-card opacity-70">{t('prestamos.sin_prestamos')}</li> : null}
      </ul>
    </div>
  );
}
