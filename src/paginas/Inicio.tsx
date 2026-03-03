import FAB from '../componentes/FAB';
import { useEffect, useState } from 'react';
import { TarjetaSkeleton } from '../componentes/Esqueleto';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useProgresoSuave } from '../hooks/useProgresoSuave';
import { listarGastos, listarOperaciones, listarPrestamos } from '../servicios/almacenLocal';

export default function Inicio() {
  const [cargando, setCargando] = useState(true);
  const [datos, setDatos] = useState<Array<{ mes: string; ingreso: number; gasto: number }>>([]);
  const [gastosMes, setGastosMes] = useState(0);
  const [operaciones, setOperaciones] = useState(0);
  const [prestamos, setPrestamos] = useState(0);
  const { cargando: sincr, run } = useProgresoSuave(1200);

  useEffect(() => {
    const timer = setTimeout(() => {
      const gastos = listarGastos();
      const ops = listarOperaciones();
      const pres = listarPrestamos();
      setGastosMes(gastos.reduce((acc, g) => acc + g.monto, 0));
      setOperaciones(ops.length);
      setPrestamos(pres.length);
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
            {cargando ? <TarjetaSkeleton /> : <Tarjeta titulo="Saldo consolidado" contenido="$ 1.246.300" delta="+6.2% vs mes anterior" />}
            {cargando ? <TarjetaSkeleton /> : <Tarjeta titulo="Gastos del mes" contenido={`$ ${gastosMes.toLocaleString('es-AR') || '0'}`} delta="Controlado" />}
            {cargando ? <TarjetaSkeleton /> : <Tarjeta titulo="Próximo vencimiento" contenido="Visa Platinum · 05/04" delta="En 9 días" />}
          </div>
          <Tarjeta titulo="Ingresos vs Gastos" alto>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={datos}>
                  <XAxis dataKey="mes" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip />
                  <Line type="monotone" dataKey="ingreso" stroke="#10b981" strokeWidth={2.4} dot={false} />
                  <Line type="monotone" dataKey="gasto" stroke="#ef4444" strokeWidth={2.4} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Tarjeta>
          <Tarjeta titulo="Distribución por rubro" alto>
            <div className="grid gap-2 text-sm">
              <Barra label="Hogar" valor={42} />
              <Barra label="Tarjetas" valor={28} />
              <Barra label="Inversiones" valor={18} />
              <Barra label="Ocio" valor={12} />
            </div>
          </Tarjeta>
        </div>
        <aside className="grid gap-4 xl:col-span-4 xl:sticky xl:top-28">
          <Tarjeta titulo="Resumen rápido" alto>
            <div className="grid gap-3">
              <FilaResumen label="Operaciones registradas" value={String(operaciones)} />
              <FilaResumen label="Préstamos activos" value={String(prestamos)} />
              <FilaResumen label="Monedas activas" value="ARS · USD · EUR" />
            </div>
          </Tarjeta>
          <Tarjeta titulo="Actividad reciente" alto>
            <ul className="grid gap-2 text-sm">
              <li className="rounded-lg px-3 py-2 bg-white/30 dark:bg-white/5">Compra supermercado · ARS 24.500</li>
              <li className="rounded-lg px-3 py-2 bg-white/30 dark:bg-white/5">Transferencia ahorro · USD 120</li>
              <li className="rounded-lg px-3 py-2 bg-white/30 dark:bg-white/5">Pago tarjeta · ARS 80.000</li>
            </ul>
          </Tarjeta>
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
}: {
  titulo: string;
  alto?: boolean;
  contenido?: string;
  delta?: string;
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`rounded-2xl p-4 glass dark:glass-dark surface-card min-h-32 ${className ?? ''}`}>
      <div className="font-medium mb-1">{titulo}</div>
      {contenido && <div className="text-xl font-semibold">{contenido}</div>}
      {delta && <div className="opacity-70 text-sm mt-1">{delta}</div>}
      {alto ? <div className="mt-4">{children}</div> : null}
    </div>
  );
}
