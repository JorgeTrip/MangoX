import { lazy, Suspense, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { listarGastos, listarIngresos } from '../servicios/almacenLocal';
import { GraficoSkeleton } from '../componentes/Esqueleto';
import { Tarjeta } from '../componentes/TarjetaPanel';
import type { Gasto, Ingreso } from '../types/finanzas';

const GraficoIngresosGastos = lazy(() => import('../componentes/GraficoIngresosGastos'));
const GraficoTortaCategoria = lazy(() => import('../componentes/GraficoTortaCategoria'));

type Rango = 'dia' | 'semana' | 'mes';

/**
 * Dashboard analítico con navegación temporal (Día/Semana/Mes).
 * Muestra gráficos switchables, torta por categoría y tabla de desglose.
 */
export default function DashboardAnalitico() {
    const { t } = useTranslation();
    const [rango, setRango] = useState<Rango>('mes');
    const [offset, setOffset] = useState(0);
    const [modoGrafico, setModoGrafico] = useState<'linea' | 'barras'>('linea');

    const { gastosFiltrados, ingresosFiltrados, desde, hasta } = useMemo(() => {
        const hoy = new Date();
        const d = calcularDesdeHasta(hoy, rango, offset);
        const gastos = listarGastos().filter((g) => enRango(g.fecha, d.desde, d.hasta));
        const ingresos = listarIngresos().filter((i) => enRango(i.fecha, d.desde, d.hasta));
        return { gastosFiltrados: gastos, ingresosFiltrados: ingresos, ...d };
    }, [rango, offset]);

    const totalGastos = gastosFiltrados.reduce((a, g) => a + g.monto, 0);
    const totalIngresos = ingresosFiltrados.reduce((a, i) => a + i.monto, 0);

    // Agrupar gastos por categoría para la torta
    const porCategoria = useMemo(() => {
        const mapa = new Map<string, number>();
        gastosFiltrados.forEach((g) => {
            const key = g.categoria || 'Sin categoría';
            mapa.set(key, (mapa.get(key) ?? 0) + g.monto);
        });
        return mapa;
    }, [gastosFiltrados]);

    // Serie para el gráfico temporal
    const datosGrafico = useMemo(
        () => generarSerieReal(gastosFiltrados, ingresosFiltrados, rango),
        [gastosFiltrados, ingresosFiltrados, rango]
    );

    const labelPeriodo = formatearPeriodo(desde, hasta, rango);

    return (
        <div className="grid gap-4">
            {/* Controles de navegación temporal */}
            <div className="rounded-3xl p-5 glass dark:glass-dark surface-card">
                <div className="flex items-center justify-between gap-3 flex-wrap">
                    <h1 className="text-xl font-semibold tracking-tight">{t('dashboard.titulo')}</h1>
                    <div className="flex items-center gap-2">
                        {(['dia', 'semana', 'mes'] as Rango[]).map((r) => (
                            <button key={r} onClick={() => { setRango(r); setOffset(0); }}
                                className={`rounded-full px-3 py-1 text-sm ${rango === r ? 'bg-black/80 text-white dark:bg-white/15' : 'bg-black/10 dark:bg-white/10'}`}>
                                {t(`dashboard.${r}`)}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="flex items-center gap-3 mt-3">
                    <button onClick={() => setOffset((o) => o + 1)} className="rounded-md px-2 py-1 bg-black/10 dark:bg-white/10 text-xs">◀</button>
                    <span className="text-sm opacity-80 flex-1 text-center">{labelPeriodo}</span>
                    <button onClick={() => setOffset((o) => Math.max(0, o - 1))} disabled={offset === 0}
                        className="rounded-md px-2 py-1 bg-black/10 dark:bg-white/10 text-xs disabled:opacity-40">▶</button>
                </div>
            </div>

            {/* Tarjetas resumen */}
            <div className="grid md:grid-cols-3 gap-4">
                <Tarjeta titulo={t('dashboard.gastos_periodo')} contenido={`$ ${totalGastos.toLocaleString('es-AR')}`} delta={`${gastosFiltrados.length} movimientos`} index={1} />
                <Tarjeta titulo={t('dashboard.ingresos_periodo')} contenido={`$ ${totalIngresos.toLocaleString('es-AR')}`} delta={`${ingresosFiltrados.length} registros`} index={2} />
                <Tarjeta titulo={t('dashboard.balance')} contenido={`$ ${(totalIngresos - totalGastos).toLocaleString('es-AR')}`}
                    delta={totalIngresos >= totalGastos ? 'Superávit' : 'Déficit'} index={3} />
            </div>

            {/* Gráfico temporal switchable */}
            <Tarjeta titulo={t('dashboard.evolucion')} alto index={4}>
                <Suspense fallback={<GraficoSkeleton />}>
                    <div className="flex items-center gap-2 mb-2">
                        <div className="rounded-full bg-white/40 dark:bg-white/10 px-2 py-1 text-xs">
                            <button onClick={() => setModoGrafico('linea')} className={`px-2 py-0.5 rounded-full ${modoGrafico === 'linea' ? 'bg-black/80 text-white dark:bg-white/15' : ''}`}>Línea</button>
                            <button onClick={() => setModoGrafico('barras')} className={`ml-1 px-2 py-0.5 rounded-full ${modoGrafico === 'barras' ? 'bg-black/80 text-white dark:bg-white/15' : ''}`}>Barras</button>
                        </div>
                    </div>
                    <GraficoIngresosGastos datos={datosGrafico} modo={modoGrafico} />
                </Suspense>
            </Tarjeta>

            {/* Gráfico de torta por categoría */}
            <Tarjeta titulo={t('dashboard.por_categoria')} alto index={5}>
                <Suspense fallback={<GraficoSkeleton />}>
                    <GraficoTortaCategoria gastosPorCategoria={porCategoria} />
                </Suspense>
            </Tarjeta>

            {/* Tabla de desglose */}
            {gastosFiltrados.length > 0 ? (
                <Tarjeta titulo={t('dashboard.desglose')} alto index={6}>
                    <div className="overflow-auto max-h-60">
                        <table className="w-full text-sm">
                            <thead><tr className="opacity-60 text-left">
                                <th className="pb-2">Concepto</th><th className="pb-2">Categoría</th>
                                <th className="pb-2">Monto</th><th className="pb-2">Fecha</th>
                            </tr></thead>
                            <tbody>
                                {gastosFiltrados.slice(0, 20).map((g) => (
                                    <tr key={g.id} className="border-t border-white/10">
                                        <td className="py-1.5">{g.concepto}</td>
                                        <td className="py-1.5 opacity-70">{g.categoria}</td>
                                        <td className="py-1.5">{g.moneda} {g.monto.toLocaleString('es-AR')}</td>
                                        <td className="py-1.5 opacity-70">{new Date(g.fecha).toLocaleDateString('es-AR')}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Tarjeta>
            ) : (
                <div className="rounded-2xl p-4 glass dark:glass-dark surface-card opacity-70 text-center text-sm">
                    {t('dashboard.sin_datos')}
                </div>
            )}
        </div>
    );
}

/* --- Helpers de fechas y datos --- */

function calcularDesdeHasta(hoy: Date, rango: Rango, offset: number) {
    const d = new Date(hoy);
    if (rango === 'dia') {
        d.setDate(d.getDate() - offset);
        return { desde: startOfDay(d), hasta: endOfDay(d) };
    }
    if (rango === 'semana') {
        d.setDate(d.getDate() - offset * 7);
        const lunes = new Date(d); lunes.setDate(d.getDate() - d.getDay() + 1);
        const dom = new Date(lunes); dom.setDate(lunes.getDate() + 6);
        return { desde: startOfDay(lunes), hasta: endOfDay(dom) };
    }
    d.setMonth(d.getMonth() - offset);
    return { desde: new Date(d.getFullYear(), d.getMonth(), 1), hasta: new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59) };
}

function enRango(fecha: string, desde: Date, hasta: Date) {
    const f = new Date(fecha);
    return f >= desde && f <= hasta;
}

function startOfDay(d: Date) { return new Date(d.getFullYear(), d.getMonth(), d.getDate()); }
function endOfDay(d: Date) { return new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59); }

function formatearPeriodo(desde: Date, hasta: Date, rango: Rango) {
    const opts: Intl.DateTimeFormatOptions = rango === 'dia' ? { day: 'numeric', month: 'short', year: 'numeric' }
        : rango === 'semana' ? { day: 'numeric', month: 'short' } : { month: 'long', year: 'numeric' };
    if (rango === 'semana') return `${desde.toLocaleDateString('es-AR', opts)} – ${hasta.toLocaleDateString('es-AR', opts)}`;
    return desde.toLocaleDateString('es-AR', opts);
}

function generarSerieReal(gastos: Gasto[], ingresos: Ingreso[], rango: Rango) {
    if (rango === 'dia') {
        return [{ mes: 'Hoy', ingreso: ingresos.reduce((a, i) => a + i.monto, 0), gasto: gastos.reduce((a, g) => a + g.monto, 0) }];
    }
    const mapa = new Map<string, { ingreso: number; gasto: number }>();
    gastos.forEach((g) => { const k = etiqueta(g.fecha, rango); const v = mapa.get(k) ?? { ingreso: 0, gasto: 0 }; v.gasto += g.monto; mapa.set(k, v); });
    ingresos.forEach((i) => { const k = etiqueta(i.fecha, rango); const v = mapa.get(k) ?? { ingreso: 0, gasto: 0 }; v.ingreso += i.monto; mapa.set(k, v); });
    return Array.from(mapa.entries()).map(([mes, v]) => ({ mes, ...v })).sort((a, b) => a.mes.localeCompare(b.mes));
}

function etiqueta(fecha: string, rango: Rango) {
    const d = new Date(fecha);
    if (rango === 'semana') return d.toLocaleDateString('es-AR', { weekday: 'short' });
    return d.toLocaleDateString('es-AR', { day: 'numeric' });
}
