import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export type PuntoGrafico = {
  mes: string;
  ingreso: number;
  gasto: number;
};

export default function GraficoIngresosGastos({ datos }: { datos: PuntoGrafico[] }) {
  return (
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
  );
}
