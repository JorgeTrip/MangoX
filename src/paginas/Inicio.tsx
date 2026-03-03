import FAB from '../componentes/FAB';
import { lazy, Suspense, useEffect, useState } from 'react';
import { GraficoSkeleton, ListaSkeleton, TarjetaSkeleton } from '../componentes/Esqueleto';
import { useProgresoSuave } from '../hooks/useProgresoSuave';
import { listarGastos, listarIngresos, listarOperaciones, listarPrestamos } from '../servicios/almacenLocal';
import { calcularAlertasPresupuesto } from '../servicios/presupuestos';
import { listarCategorias } from '../servicios/categorias';
import ActividadReciente from '../componentes/ActividadReciente';
import { asegurarGastosFijosDelMes } from '../servicios/gastosFijos';
import { Tarjeta, Barra, FilaResumen } from '../componentes/TarjetaPanel';

const GraficoIngresosGastos = lazy(() => import('../componentes/GraficoIngresosGastos'));

export default function Inicio() {
  const [cargando, setCargando] = useState(true);
  const [datos, setDatos] = useState<Array<{ mes: string; ingreso: number; gasto: number }>>([]);
  const [modoGrafico, setModoGrafico] = useState<'linea' | 'barras'>('linea');
  const [offsetMes, setOffsetMes] = useState(0);

  const generarSerie = (desplazamiento: number) => {
    const base = [
      { mes: 'Ene', ingreso: 120, gasto: 92 },
      { mes: 'Feb', ingreso: 134, gasto: 98 },
      { mes: 'Mar', ingreso: 128, gasto: 118 },
      { mes: 'Abr', ingreso: 154, gasto: 109 },
      { mes: 'May', ingreso: 162, gasto: 114 },
      { mes: 'Jun', ingreso: 140, gasto: 120 },
      { mes: 'Jul', ingreso: 158, gasto: 127 },
      { mes: 'Ago', ingreso: 170, gasto: 135 },
      { mes: 'Sep', ingreso: 165, gasto: 130 },
      { mes: 'Oct', ingreso: 172, gasto: 140 },
      { mes: 'Nov', ingreso: 168, gasto: 138 },
      { mes: 'Dic', ingreso: 180, gasto: 150 },
    ];
    const size = 6;
    const inicio = ((desplazamiento % 12) + 12) % 12;
    const sec = [...base.slice(inicio), ...base.slice(0, inicio)];
    return sec.slice(0, size);
  };
  const [gastosMes, setGastosMes] = useState(0);
  const [ingresosMes, setIngresosMes] = useState(0);
  const [ingresosFijos, setIngresosFijos] = useState(0);
  const [ingresosPendientes, setIngresosPendientes] = useState(0);
  const [operaciones, setOperaciones] = useState(0);
  const [prestamos, setPrestamos] = useState(0);
  const [proximoVencimiento, setProximoVencimiento] = useState('Sin vencimientos');
  const [alertaPresupuesto, setAlertaPresupuesto] = useState<string | null>(null);
  const { cargando: sincr, run } = useProgresoSuave(1200);

  useEffect(() => {
    const timer = setTimeout(() => {
      asegurarGastosFijosDelMes();
      const gastos = listarGastos();
      const ingresos = listarIngresos();
      const ops = listarOperaciones();
      const pres = listarPrestamos();
      const alertas = calcularAlertasPresupuesto(gastos, listarCategorias()).filter((a) => a.estado !== 'normal');
      const pagosEstimados = gastos
        .map((g) => ({ entidad: g.entidad, pago: g.fechaPagoEstimada ? new Date(g.fechaPagoEstimada) : null }))
        .filter((i) => i.pago && i.pago >= new Date())
        .sort((a, b) => (a.pago!.getTime() - b.pago!.getTime()));
      const proximo = pagosEstimados[0];
      setGastosMes(gastos.reduce((acc, g) => acc + g.monto, 0));
      setIngresosMes(ingresos.reduce((acc, i) => acc + i.monto, 0));
      setIngresosFijos(ingresos.filter((i) => i.esFijo).length);
      setIngresosPendientes(ingresos.filter((i) => !i.esCobroReal).length);
      setOperaciones(ops.length);
      setPrestamos(pres.length);
      setAlertaPresupuesto(
        alertas[0]
          ? `${alertas[0].categoria}: ${Math.round(alertas[0].porcentaje)}% del techo`
          : null
      );
      setProximoVencimiento(
        proximo ? `${proximo.entidad} · ${proximo.pago!.toLocaleDateString('es-AR')}` : 'Sin vencimientos'
      );
      setDatos(generarSerie(offsetMes));
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
      <div className="grid xl:grid-cols-12 gap-4 items-start">
        <div className="grid gap-4 xl:col-span-8">
          <div className="grid md:grid-cols-3 gap-4">
            {cargando ? <TarjetaSkeleton /> : <Tarjeta titulo="Saldo consolidado" contenido="$ 1.246.300" delta="+6.2% vs mes anterior" index={1} />}
            {cargando ? <TarjetaSkeleton /> : <Tarjeta titulo="Gastos del mes" contenido={`$ ${gastosMes.toLocaleString('es-AR') || '0'}`} delta={alertaPresupuesto ?? 'Controlado'} index={2} />}
            {cargando ? <TarjetaSkeleton /> : <Tarjeta titulo="Próximo vencimiento" contenido={proximoVencimiento} delta="Calculado por cierre de tarjeta" index={3} />}
          </div>
          {cargando ? (
            <GraficoSkeleton />
          ) : (
            <Tarjeta titulo="Ingresos vs Gastos" alto index={4}>
              <Suspense fallback={<GraficoSkeleton />}>
                <div className="flex items-center gap-2 mb-2">
                  <div className="rounded-full bg-white/40 dark:bg-white/10 px-2 py-1 text-xs">
                    Vista:
                    <button onClick={() => setModoGrafico('linea')} className={`ml-2 px-2 py-0.5 rounded-full ${modoGrafico === 'linea' ? 'bg-black/80 text-white dark:bg-white/15' : ''}`}>Línea</button>
                    <button onClick={() => setModoGrafico('barras')} className={`ml-1 px-2 py-0.5 rounded-full ${modoGrafico === 'barras' ? 'bg-black/80 text-white dark:bg-white/15' : ''}`}>Barras</button>
                  </div>
                  <div className="ml-auto flex items-center gap-2">
                    <button onClick={() => setOffsetMes((o) => (o + 11) % 12)} className="rounded-md px-2 py-1 bg-black/10 dark:bg-white/10 text-xs">◀</button>
                    <button onClick={() => setOffsetMes((o) => (o + 1) % 12)} className="rounded-md px-2 py-1 bg-black/10 dark:bg-white/10 text-xs">▶</button>
                  </div>
                </div>
                <GraficoIngresosGastos datos={datos} modo={modoGrafico} />
              </Suspense>
            </Tarjeta>
          )}
          {cargando ? (
            <ListaSkeleton lineas={4} />
          ) : (
            <Tarjeta titulo="Distribución por rubro" alto index={5}>
              <div className="grid gap-2 text-sm">
                <Barra label="Hogar" valor={42} />
                <Barra label="Tarjetas" valor={28} />
                <Barra label="Inversiones" valor={18} />
                <Barra label="Ocio" valor={12} />
              </div>
            </Tarjeta>
          )}
        </div>
        <aside className="grid gap-4 xl:col-span-4 xl:sticky xl:top-28">
          {cargando ? (
            <ListaSkeleton lineas={3} />
          ) : (
            <Tarjeta titulo="Resumen rápido" alto index={6}>
              <div className="grid gap-3">
                <FilaResumen label="Operaciones registradas" value={String(operaciones)} />
                <FilaResumen label="Préstamos activos" value={String(prestamos)} />
                <FilaResumen label="Ingresos estimados vs gastos" value={`$ ${ingresosMes.toLocaleString('es-AR')} / $ ${gastosMes.toLocaleString('es-AR')}`} />
                <FilaResumen label="Ingresos fijos registrados" value={String(ingresosFijos)} />
                <FilaResumen label="Ingresos pendientes de cobro" value={String(ingresosPendientes)} />
                <FilaResumen label="Monedas activas" value="ARS · USD · EUR" />
              </div>
            </Tarjeta>
          )}
          {cargando ? (
            <ListaSkeleton lineas={3} />
          ) : (
            <Tarjeta titulo="Actividad reciente" alto index={7}><ActividadReciente /></Tarjeta>
          )}
        </aside>
      </div>
      <FAB />
    </div>
  );
}
