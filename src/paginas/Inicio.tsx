import FAB from '../componentes/FAB';
import { lazy, Suspense, useEffect, useState } from 'react';
import { GraficoSkeleton, ListaSkeleton, TarjetaSkeleton } from '../componentes/Esqueleto';
import { useProgresoSuave } from '../hooks/useProgresoSuave';
import { listarGastos, listarIngresos, listarOperaciones, listarPrestamos, listarBienes } from '../servicios/almacenLocal';
import { calcularAlertasPresupuesto } from '../servicios/presupuestos';
import { listarCategorias } from '../servicios/categorias';
import ActividadReciente from '../componentes/ActividadReciente';
import { asegurarGastosFijosDelMes } from '../servicios/gastosFijos';
import { Tarjeta, FilaResumen } from '../componentes/TarjetaPanel';
import { saldoPendiente } from '../servicios/bienes';

const GraficoIngresosGastos = lazy(() => import('../componentes/GraficoIngresosGastos'));
const GraficoTortaCategoria = lazy(() => import('../componentes/GraficoTortaCategoria'));

/**
 * Pantalla de inicio / Overview.
 * Muestra saldo consolidado, gastos del mes, vencimientos,
 * gráficos de ingresos vs gastos, torta por categoría,
 * y resumen lateral con datos reales de localStorage.
 */
export default function Inicio() {
  const [cargando, setCargando] = useState(true);
  const [modoGrafico, setModoGrafico] = useState<'linea' | 'barras'>('linea');
  const [offsetMes, setOffsetMes] = useState(0);
  const { cargando: sincr, run } = useProgresoSuave(1200);

  // Datos reales cargados de localStorage
  const [gastosMes, setGastosMes] = useState(0);
  const [ingresosMes, setIngresosMes] = useState(0);
  const [ingresosFijos, setIngresosFijos] = useState(0);
  const [ingresosPendientes, setIngresosPendientes] = useState(0);
  const [totalOperaciones, setTotalOperaciones] = useState(0);
  const [totalPrestamos, setTotalPrestamos] = useState(0);
  const [proximoVencimiento, setProximoVencimiento] = useState('Sin vencimientos');
  const [alertaPresupuesto, setAlertaPresupuesto] = useState<string | null>(null);
  const [patrimonioNeto, setPatrimonioNeto] = useState(0);
  const [porCategoria, setPorCategoria] = useState<Map<string, number>>(new Map());
  const [datosGrafico, setDatosGrafico] = useState<Array<{ mes: string; ingreso: number; gasto: number }>>([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      asegurarGastosFijosDelMes();
      const gastos = listarGastos();
      const ingresos = listarIngresos();
      const ops = listarOperaciones();
      const pres = listarPrestamos();
      const bienes = listarBienes();
      const alertas = calcularAlertasPresupuesto(gastos, listarCategorias()).filter((a) => a.estado !== 'normal');

      // Calcular montos reales del mes actual ajustado por offset
      const hoy = new Date();
      const mesObj = new Date(hoy.getFullYear(), hoy.getMonth() - offsetMes, 1);
      const mesKey = `${mesObj.getFullYear()}-${String(mesObj.getMonth() + 1).padStart(2, '0')}`;
      const gastosMesArr = gastos.filter((g) => g.fecha.startsWith(mesKey));
      const ingresosMesArr = ingresos.filter((i) => i.fecha.startsWith(mesKey));

      // Serie real de 6 meses para el gráfico
      const serie = generarSerieReal(gastos, ingresos, offsetMes);
      setDatosGrafico(serie);

      // Gasto por categoría para la torta
      const mapa = new Map<string, number>();
      gastosMesArr.forEach((g) => {
        const key = g.categoria || 'Sin categoría';
        mapa.set(key, (mapa.get(key) ?? 0) + g.monto);
      });
      setPorCategoria(mapa);

      // Próximo vencimiento real
      const pagosEstimados = gastos
        .map((g) => ({ entidad: g.entidad, pago: g.fechaPagoEstimada ? new Date(g.fechaPagoEstimada) : null }))
        .filter((i) => i.pago && i.pago >= new Date())
        .sort((a, b) => a.pago!.getTime() - b.pago!.getTime());
      const proximo = pagosEstimados[0];

      // Patrimonio neto: ingresos - gastos + saldo pendiente de ventas - saldo pendiente de compras
      const bienesVenta = bienes.filter((b) => b.operacion === 'Venta');
      const bienesCompra = bienes.filter((b) => b.operacion === 'Compra');
      const patrimonioVentas = bienesVenta.reduce((a, b) => a + saldoPendiente(b), 0);
      const patrimonioCompras = bienesCompra.reduce((a, b) => a + saldoPendiente(b), 0);
      const totalIngresos = ingresos.reduce((a, i) => a + i.monto, 0);
      const totalGastos = gastos.reduce((a, g) => a + g.monto, 0);

      setGastosMes(gastosMesArr.reduce((a, g) => a + g.monto, 0));
      setIngresosMes(ingresosMesArr.reduce((a, i) => a + i.monto, 0));
      setIngresosFijos(ingresos.filter((i) => i.esFijo).length);
      setIngresosPendientes(ingresos.filter((i) => !i.esCobroReal).length);
      setTotalOperaciones(ops.length);
      setTotalPrestamos(pres.length);
      setPatrimonioNeto(totalIngresos - totalGastos + patrimonioVentas - patrimonioCompras);
      setAlertaPresupuesto(alertas[0] ? `${alertas[0].categoria}: ${Math.round(alertas[0].porcentaje)}% del techo` : null);
      setProximoVencimiento(proximo ? `${proximo.entidad} · ${proximo.pago!.toLocaleDateString('es-AR')}` : 'Sin vencimientos');
      setCargando(false);
    }, 600);
    return () => clearTimeout(timer);
  }, [offsetMes]);

  return (
    <div className="grid gap-5">
      <section className="rounded-3xl p-6 glass dark:glass-dark surface-card">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">Panel financiero</h1>
            <p className="opacity-70 text-sm mt-1">Una vista consolidada de patrimonio, liquidez y movimientos.</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="chip">Actualizado hoy</span>
            <button onClick={() => run(async () => Promise.resolve(true))} className="btn-primary" disabled={sincr}>
              {sincr ? 'Sincronizando…' : 'Sincronizar'}
            </button>
          </div>
        </div>
      </section>
      <InicioContenido
        cargando={cargando} gastosMes={gastosMes} ingresosMes={ingresosMes}
        proximoVencimiento={proximoVencimiento} alertaPresupuesto={alertaPresupuesto}
        patrimonioNeto={patrimonioNeto} datosGrafico={datosGrafico}
        modoGrafico={modoGrafico} setModoGrafico={setModoGrafico}
        offsetMes={offsetMes} setOffsetMes={setOffsetMes}
        porCategoria={porCategoria} totalOperaciones={totalOperaciones}
        totalPrestamos={totalPrestamos} ingresosFijos={ingresosFijos}
        ingresosPendientes={ingresosPendientes}
      />
      <FAB />
    </div>
  );
}

/* Sub-componente extraído para respetar límite de 200 líneas */
function InicioContenido(props: {
  cargando: boolean; gastosMes: number; ingresosMes: number;
  proximoVencimiento: string; alertaPresupuesto: string | null;
  patrimonioNeto: number; datosGrafico: Array<{ mes: string; ingreso: number; gasto: number }>;
  modoGrafico: 'linea' | 'barras'; setModoGrafico: (m: 'linea' | 'barras') => void;
  offsetMes: number; setOffsetMes: (fn: (o: number) => number) => void;
  porCategoria: Map<string, number>; totalOperaciones: number;
  totalPrestamos: number; ingresosFijos: number; ingresosPendientes: number;
}) {
  const { cargando: c, gastosMes, ingresosMes, proximoVencimiento, alertaPresupuesto,
    patrimonioNeto, datosGrafico, modoGrafico, setModoGrafico, setOffsetMes, porCategoria,
    totalOperaciones, totalPrestamos, ingresosFijos, ingresosPendientes } = props;

  return (
    <div className="grid xl:grid-cols-12 gap-4 items-start">
      <div className="grid gap-4 xl:col-span-8">
        <div className="grid md:grid-cols-3 gap-4">
          {c ? <TarjetaSkeleton /> : <Tarjeta titulo="Patrimonio neto" contenido={`$ ${patrimonioNeto.toLocaleString('es-AR')}`} delta="Ingresos - Gastos + Bienes" index={1} />}
          {c ? <TarjetaSkeleton /> : <Tarjeta titulo="Gastos del mes" contenido={`$ ${gastosMes.toLocaleString('es-AR')}`} delta={alertaPresupuesto ?? 'Controlado'} index={2} />}
          {c ? <TarjetaSkeleton /> : <Tarjeta titulo="Próximo vencimiento" contenido={proximoVencimiento} delta="Calculado por cierre de tarjeta" index={3} />}
        </div>
        {c ? <GraficoSkeleton /> : (
          <Tarjeta titulo="Ingresos vs Gastos" alto index={4}>
            <Suspense fallback={<GraficoSkeleton />}>
              <div className="flex items-center gap-2 mb-2">
                <div className="rounded-full bg-white/40 dark:bg-white/10 px-2 py-1 text-xs">
                  Vista:
                  <button onClick={() => setModoGrafico('linea')} className={`ml-2 px-2 py-0.5 rounded-full ${modoGrafico === 'linea' ? 'bg-black/80 text-white dark:bg-white/15' : ''}`}>Línea</button>
                  <button onClick={() => setModoGrafico('barras')} className={`ml-1 px-2 py-0.5 rounded-full ${modoGrafico === 'barras' ? 'bg-black/80 text-white dark:bg-white/15' : ''}`}>Barras</button>
                </div>
                <div className="ml-auto flex items-center gap-2">
                  <button onClick={() => setOffsetMes((o) => o + 1)} className="rounded-md px-2 py-1 bg-black/10 dark:bg-white/10 text-xs">◀</button>
                  <button onClick={() => setOffsetMes((o) => Math.max(0, o - 1))} className="rounded-md px-2 py-1 bg-black/10 dark:bg-white/10 text-xs">▶</button>
                </div>
              </div>
              <GraficoIngresosGastos datos={datosGrafico} modo={modoGrafico} />
            </Suspense>
          </Tarjeta>
        )}
        {c ? <GraficoSkeleton /> : (
          <Tarjeta titulo="Distribución por categoría" alto index={5}>
            <Suspense fallback={<GraficoSkeleton />}>
              <GraficoTortaCategoria gastosPorCategoria={porCategoria} />
            </Suspense>
          </Tarjeta>
        )}
      </div>
      <aside className="grid gap-4 xl:col-span-4 xl:sticky xl:top-28">
        {c ? <ListaSkeleton lineas={3} /> : (
          <Tarjeta titulo="Resumen rápido" alto index={6}>
            <div className="grid gap-3">
              <FilaResumen label="Operaciones registradas" value={String(totalOperaciones)} />
              <FilaResumen label="Préstamos activos" value={String(totalPrestamos)} />
              <FilaResumen label="Ingresos vs gastos" value={`$ ${ingresosMes.toLocaleString('es-AR')} / $ ${gastosMes.toLocaleString('es-AR')}`} />
              <FilaResumen label="Ingresos fijos" value={String(ingresosFijos)} />
              <FilaResumen label="Pendientes de cobro" value={String(ingresosPendientes)} />
              <FilaResumen label="Monedas activas" value="ARS · USD · EUR" />
            </div>
          </Tarjeta>
        )}
        {c ? <ListaSkeleton lineas={3} /> : (
          <Tarjeta titulo="Actividad reciente" alto index={7}><ActividadReciente /></Tarjeta>
        )}
      </aside>
    </div>
  );
}
/** Genera serie de 6 meses reales para el gráfico */
export function generarSerieReal(gastos: Array<{ fecha: string; monto: number }>, ingresos: Array<{ fecha: string; monto: number }>, offset: number) {
  const serie: Array<{ mes: string; ingreso: number; gasto: number }> = [];
  const hoy = new Date();
  for (let i = 5; i >= 0; i--) {
    const d = new Date(hoy.getFullYear(), hoy.getMonth() - offset - i, 1);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    const label = d.toLocaleDateString('es-AR', { month: 'short' });
    const gasto = gastos.filter((g) => g.fecha.startsWith(key)).reduce((a, g) => a + g.monto, 0);
    const ingreso = ingresos.filter((ing) => ing.fecha.startsWith(key)).reduce((a, ing) => a + ing.monto, 0);
    serie.push({ mes: label, ingreso: Math.round(ingreso / 1000), gasto: Math.round(gasto / 1000) });
  }
  return serie;
}
