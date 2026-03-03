import FAB from '../componentes/FAB';
import { lazy, Suspense, useEffect, useState } from 'react';
import { GraficoSkeleton, ListaSkeleton, TarjetaSkeleton } from '../componentes/Esqueleto';
import { useProgresoSuave } from '../hooks/useProgresoSuave';
import { listarGastos, listarIngresos, listarOperaciones, listarPrestamos } from '../servicios/almacenLocal';
import { calcularAlertasPresupuesto, categoriasBase } from '../servicios/presupuestos';
import { motion } from 'framer-motion';
import ActividadReciente from '../componentes/ActividadReciente';

const GraficoIngresosGastos = lazy(() => import('../componentes/GraficoIngresosGastos'));

export default function Inicio() {
  const [cargando, setCargando] = useState(true);
  const [datos, setDatos] = useState<Array<{ mes: string; ingreso: number; gasto: number }>>([]);
  const [gastosMes, setGastosMes] = useState(0);
  const [ingresosMes, setIngresosMes] = useState(0);
  const [operaciones, setOperaciones] = useState(0);
  const [prestamos, setPrestamos] = useState(0);
  const [proximoVencimiento, setProximoVencimiento] = useState('Sin vencimientos');
  const [alertaPresupuesto, setAlertaPresupuesto] = useState<string | null>(null);
  const { cargando: sincr, run } = useProgresoSuave(1200);

  useEffect(() => {
    const timer = setTimeout(() => {
      const gastos = listarGastos();
      const ingresos = listarIngresos();
      const ops = listarOperaciones();
      const pres = listarPrestamos();
      const alertas = calcularAlertasPresupuesto(gastos, categoriasBase).filter((a) => a.estado !== 'normal');
      const pagosEstimados = gastos
        .map((g) => ({ entidad: g.entidad, pago: g.fechaPagoEstimada ? new Date(g.fechaPagoEstimada) : null }))
        .filter((i) => i.pago && i.pago >= new Date())
        .sort((a, b) => (a.pago!.getTime() - b.pago!.getTime()));
      const proximo = pagosEstimados[0];
      setGastosMes(gastos.reduce((acc, g) => acc + g.monto, 0));
      setIngresosMes(ingresos.reduce((acc, i) => acc + i.monto, 0));
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
      setDatos([
        { mes: 'Ene', ingreso: 120, gasto: 92 },
        { mes: 'Feb', ingreso: 134, gasto: 98 },
        { mes: 'Mar', ingreso: 128, gasto: 118 },
        { mes: 'Abr', ingreso: 154, gasto: 109 },
        { mes: 'May', ingreso: 162, gasto: 114 },
      ]);
      setCargando(false);
    }, 600);
    return () => clearTimeout(timer);
  }, []);

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
                <GraficoIngresosGastos datos={datos} />
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

function FilaResumen({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg px-3 py-2 bg-white/30 dark:bg-white/5 flex items-center justify-between gap-2">
      <span className="opacity-80">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}

function Barra({ label, valor }: { label: string; valor: number }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span>{label}</span>
        <span className="opacity-70">{valor}%</span>
      </div>
      <div className="h-2 rounded-full bg-black/10 dark:bg-white/10">
        <div className="h-full rounded-full bg-black/70 dark:bg-white/40" style={{ width: `${valor}%` }} />
      </div>
    </div>
  );
}

function Tarjeta({
  titulo,
  alto = false,
  contenido,
  delta,
  children,
  className,
  index = 0,
}: {
  titulo: string;
  alto?: boolean;
  contenido?: string;
  delta?: string;
  children?: React.ReactNode;
  className?: string;
  index?: number;
}) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 10, scale: 0.99 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.28, delay: index * 0.03, ease: 'easeOut' }}
      whileHover={{ y: -1 }}
      className={`rounded-2xl p-4 glass dark:glass-dark surface-card min-h-32 ${className ?? ''}`}
    >
      <div className="font-medium mb-1">{titulo}</div>
      {contenido && <div className="text-xl font-semibold">{contenido}</div>}
      {delta && <div className="opacity-70 text-sm mt-1">{delta}</div>}
      {alto ? <div className="mt-4">{children}</div> : null}
    </motion.article>
  );
}
