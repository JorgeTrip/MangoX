import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

export type PuntoGrafico = {
  mes: string;
  ingreso: number;
  gasto: number;
};

export default function GraficoIngresosGastos({ datos, modo = 'linea' }: { datos: PuntoGrafico[]; modo?: 'linea' | 'barras' }) {
  return (
    <div className="h-72">
      <ResponsiveContainer width="100%" height="100%">
        {modo === 'linea' ? (
          <LineChart data={datos}>
            <XAxis dataKey="mes" stroke="#9ca3af" />
            <YAxis stroke="#9ca3af" />
            <Tooltip />
            <Line type="monotone" dataKey="ingreso" stroke="#10b981" strokeWidth={2.4} dot={false} />
            <Line type="monotone" dataKey="gasto" stroke="#ef4444" strokeWidth={2.4} dot={false} />
          </LineChart>
        ) : (
          <BarChart data={datos}>
            <XAxis dataKey="mes" stroke="#9ca3af" />
            <YAxis stroke="#9ca3af" />
            <Tooltip />
            <Bar dataKey="ingreso" stackId="a" fill="#10b981" />
            <Bar dataKey="gasto" stackId="a" fill="#ef4444" />
          </BarChart>
        )}
      </ResponsiveContainer>
    </div>
  );
}
