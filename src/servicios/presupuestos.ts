import type { AlertaPresupuesto, CategoriaPresupuesto, Gasto } from '../types/finanzas';

export const categoriasBase: CategoriaPresupuesto[] = [
  { id: 'hogar', nombre: 'Hogar', emoticon: '🏠', tipo: 'egreso', techoPresupuesto: 300000 },
  { id: 'tarjetas', nombre: 'Tarjetas', emoticon: '💳', tipo: 'egreso', techoPresupuesto: 250000 },
  { id: 'ocio', nombre: 'Ocio', emoticon: '🎯', tipo: 'egreso', techoPresupuesto: 120000 },
  { id: 'inversiones', nombre: 'Inversiones', emoticon: '📈', tipo: 'egreso', techoPresupuesto: 200000 },
];

export function calcularAlertasPresupuesto(gastos: Gasto[], categorias: CategoriaPresupuesto[]) {
  const acumulado = acumularPorCategoria(gastos);
  const alertas: AlertaPresupuesto[] = [];
  categorias.forEach((cat) => {
    if (!cat.techoPresupuesto || cat.techoPresupuesto <= 0) return;
    const gastado = acumulado.get(cat.nombre.toLowerCase()) ?? 0;
    const porcentaje = (gastado / cat.techoPresupuesto) * 100;
    const estado = porcentaje >= 100 ? 'excedido' : porcentaje >= 80 ? 'advertencia' : 'normal';
    alertas.push({ categoria: cat.nombre, gastado, techo: cat.techoPresupuesto, porcentaje, estado });
  });
  return alertas.sort((a, b) => b.porcentaje - a.porcentaje);
}

function acumularPorCategoria(gastos: Gasto[]) {
  const mapa = new Map<string, number>();
  gastos.forEach((g) => {
    const key = g.categoria.trim().toLowerCase();
    mapa.set(key, (mapa.get(key) ?? 0) + g.monto);
  });
  return mapa;
}
