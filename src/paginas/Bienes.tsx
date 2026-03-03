import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { listarBienes, actualizarBien } from '../servicios/almacenLocal';
import { montoPorCuota, saldoPendiente } from '../servicios/bienes';
import { toast } from '../notificaciones/toast';
import type { Bien } from '../types/finanzas';
import { Link } from 'react-router-dom';

/**
 * Página de gestión de bienes patrimoniales (autos, inmuebles, otros).
 * Permite ver cuotas pagadas/pendientes, ajustar monto de cobro
 * manualmente antes de marcar como cobrada, y ver el saldo pendiente.
 */
export default function Bienes() {
    const { t } = useTranslation();
    const [bienes, setBienes] = useState<Bien[]>(() => listarBienes());
    const [ajustes, setAjustes] = useState<Record<string, string>>({});

    const marcarCuota = (bien: Bien) => {
        const ajusteStr = ajustes[bien.id];
        const ajuste = ajusteStr ? Number(ajusteStr) : undefined;
        const pagadas = Math.min(bien.cuotasPagadas + 1, bien.cuotasTotales);
        const upd: Bien = {
            ...bien, cuotasPagadas: pagadas,
            ajusteCobro: ajuste && ajuste > 0 ? ajuste : bien.ajusteCobro,
        };
        actualizarBien(upd);
        setBienes(listarBienes());
        toast(t('bienes.cuota_marcada'));
    };

    return (
        <div className="grid gap-4">
            <div className="rounded-3xl p-6 glass dark:glass-dark surface-card">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-semibold tracking-tight">{t('bienes.titulo')}</h1>
                        <p className="opacity-70 text-sm mt-1">{t('bienes.descripcion')}</p>
                    </div>
                    <Link to="/nuevo/bien" className="btn-primary">{t('bienes.nuevo')}</Link>
                </div>
            </div>
            <ul className="grid gap-3">
                {bienes.map((b) => (
                    <li key={b.id} className="rounded-2xl p-4 glass dark:glass-dark surface-card">
                        <div className="flex items-center justify-between gap-3 flex-wrap">
                            <div>
                                <div className="font-medium">{b.descripcion}</div>
                                <div className="opacity-70 text-sm">
                                    {b.operacion} · {b.tipo} · {b.moneda} {b.montoTotal.toLocaleString('es-AR')}
                                </div>
                            </div>
                            <div className="text-right text-sm">
                                <div className="opacity-70">{t('bienes.cuotas')}</div>
                                <div className="font-semibold">{b.cuotasPagadas}/{b.cuotasTotales}</div>
                            </div>
                        </div>
                        <div className="grid md:grid-cols-2 gap-2 mt-3">
                            <div className="rounded-lg px-3 py-2 bg-white/30 dark:bg-white/5 text-sm">
                                {t('bienes.cuota_valor')}: {b.moneda} {montoPorCuota(b).toLocaleString('es-AR')}
                                {b.ajusteCobro ? ` · ${t('bienes.ajustado')}: ${b.moneda} ${b.ajusteCobro.toLocaleString('es-AR')}` : ''}
                            </div>
                            <div className="rounded-lg px-3 py-2 bg-white/30 dark:bg-white/5 text-sm">
                                {t('bienes.pendiente')}: {b.moneda} {saldoPendiente(b).toLocaleString('es-AR')}
                            </div>
                        </div>
                        {b.cuotasPagadas < b.cuotasTotales ? (
                            <div className="grid grid-cols-[1fr_auto] gap-2 mt-3">
                                <input
                                    value={ajustes[b.id] ?? ''}
                                    onChange={(e) => setAjustes((a) => ({ ...a, [b.id]: e.target.value }))}
                                    placeholder={t('bienes.ajuste_placeholder')}
                                    inputMode="decimal"
                                    className="rounded-lg px-3 py-2 bg-white/80 dark:bg-white/10"
                                />
                                <button onClick={() => marcarCuota(b)} className="rounded-lg px-3 py-2 bg-black/10 dark:bg-white/10 text-sm">
                                    {t('bienes.marcar_cobrada')}
                                </button>
                            </div>
                        ) : (
                            <div className="mt-3 text-sm text-emerald-600 dark:text-emerald-400">
                                ✓ {t('bienes.completado')}
                            </div>
                        )}
                    </li>
                ))}
                {bienes.length === 0 ? (
                    <li className="rounded-2xl p-4 glass dark:glass-dark surface-card opacity-70 text-center">
                        {t('bienes.sin_bienes')}
                    </li>
                ) : null}
            </ul>
        </div>
    );
}
