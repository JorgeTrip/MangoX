import { categoriasBase } from './presupuestos';
import type { CategoriaPresupuesto } from '../types/finanzas';

const KEY = 'mangox-categorias';

export function listarCategorias(): CategoriaPresupuesto[] {
  const guardadas = leer();
  const mapa = new Map<string, CategoriaPresupuesto>();
  [...categoriasBase, ...guardadas].forEach((c) => {
    mapa.set(c.id, c);
  });
  return Array.from(mapa.values());
}

export function guardarCategoria(categoria: CategoriaPresupuesto) {
  const actuales = leer();
  const nuevas = [categoria, ...actuales.filter((c) => c.id !== categoria.id)];
  escribir(nuevas);
}

export function eliminarCategoria(id: string) {
  const actuales = leer();
  escribir(actuales.filter((c) => c.id !== id));
}

function leer(): CategoriaPresupuesto[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const data = JSON.parse(raw) as CategoriaPresupuesto[];
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

function escribir(data: CategoriaPresupuesto[]) {
  localStorage.setItem(KEY, JSON.stringify(data));
}
