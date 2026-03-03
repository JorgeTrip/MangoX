import FAB from '../componentes/FAB';
import { useEffect, useState } from 'react';
import { TarjetaSkeleton } from '../componentes/Esqueleto';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useProgresoSuave } from '../hooks/useProgresoSuave';

export default function Inicio() {
  const [cargando, setCargando] = useState(true);
  const [datos, setDatos] = useState<Array<{ mes: string; ingreso: number; gasto: number }>>([]);
  const { cargando: sincr, run } = useProgresoSuave(1200);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDatos([
        { mes: 'Ene', ingreso: 100, gasto: 80 },
        { mes: 'Feb', ingreso: 110, gasto: 90 },
        { mes: 'Mar', ingreso: 105, gasto: 120 },
        { mes: 'Abr', ingreso: 130, gasto: 100 },
      ]);
      setCargando(false);
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="grid gap-4">
      <div className="grid md:grid-cols-2 gap-4">
        {cargando ? <TarjetaSkeleton /> : <Tarjeta titulo="Saldo consolidado" contenido="$ 1.000.000" />}
        {cargando ? <TarjetaSkeleton /> : <Tarjeta titulo="Próximos vencimientos" contenido="Visa - 05/04" />}
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        <Tarjeta titulo="Ingresos vs Gastos" alto>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={datos}>
                <XAxis dataKey="mes" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="ingreso" stroke="#10b981" strokeWidth={2} />
                <Line type="monotone" dataKey="gasto" stroke="#ef4444" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Tarjeta>
        <Tarjeta titulo="Acción rápida" alto>
          <button
            onClick={() => run(async () => Promise.resolve(true))}
            className="rounded-lg px-4 py-2 bg-black/80 text-white dark:bg-white/10"
            disabled={sincr}
          >
            {sincr ? 'Sincronizando…' : 'Sincronizar ahora'}
          </button>
        </Tarjeta>
      </div>
      <FAB />
    </div>
  );
}

function Tarjeta({ titulo, alto = false, contenido, children }: { titulo: string; alto?: boolean; contenido?: string; children?: React.ReactNode }) {
  return (
    <div className="rounded-2xl p-4 glass dark:glass-dark shadow min-h-32">
      <div className="font-medium mb-1">{titulo}</div>
      {contenido && <div className="opacity-80">{contenido}</div>}
      {alto ? <div>{children}</div> : null}
    </div>
  );
}
