import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { listarCategorias } from '../servicios/categorias';

type Entrada = { nombre: string; valor: number; emoticon: string };

const COLORES = [
    '#6366F1', '#06B6D4', '#F59E0B', '#EF4444',
    '#10B981', '#8B5CF6', '#EC4899', '#F97316',
];

/**
 * Gráfico de torta por categoría de gasto con emoticonos,
 * porcentajes y tooltips detallados.
 */
export default function GraficoTortaCategoria({ gastosPorCategoria }: { gastosPorCategoria: Map<string, number> }) {
    const categorias = listarCategorias();
    const data: Entrada[] = [];
    gastosPorCategoria.forEach((valor, nombre) => {
        const cat = categorias.find((c) => c.nombre.toLowerCase() === nombre.toLowerCase());
        data.push({ nombre: cat?.nombre ?? nombre, valor, emoticon: cat?.emoticon ?? '💼' });
    });

    if (data.length === 0) {
        return <div className="opacity-60 text-sm text-center py-6">Sin datos de categorías</div>;
    }

    const total = data.reduce((acc, d) => acc + d.valor, 0);

    return (
        <div className="grid md:grid-cols-[1fr_200px] gap-4 items-center">
            <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                    <Pie data={data} dataKey="valor" nameKey="nombre" cx="50%" cy="50%" innerRadius={50} outerRadius={85} paddingAngle={3}>
                        {data.map((_, i) => (
                            <Cell key={i} fill={COLORES[i % COLORES.length]} />
                        ))}
                    </Pie>
                    <Tooltip
                        formatter={(value) => `$ ${Number(value ?? 0).toLocaleString('es-AR')}`}
                        contentStyle={{ borderRadius: '0.75rem', border: 'none', background: 'rgba(0,0,0,0.85)', color: '#fff', fontSize: '0.8rem' }}
                    />
                </PieChart>
            </ResponsiveContainer>
            <ul className="grid gap-1 text-sm">
                {data.map((d, i) => {
                    const pct = total > 0 ? Math.round((d.valor / total) * 100) : 0;
                    return (
                        <li key={d.nombre} className="flex items-center gap-2">
                            <span className="w-3 h-3 rounded-full" style={{ background: COLORES[i % COLORES.length] }} />
                            <span>{d.emoticon}</span>
                            <span className="flex-1 truncate">{d.nombre}</span>
                            <span className="opacity-70">{pct}%</span>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}
