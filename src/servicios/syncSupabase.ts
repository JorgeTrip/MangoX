import type { CategoriaPresupuesto } from '../types/finanzas';
import { supabase } from '../supabase/cliente';

export async function sincronizarCategoriasDesdeSupabase(): Promise<CategoriaPresupuesto[] | null> {
  if (!supabase) return null;
  try {
    const { data, error } = await supabase.from('categorias').select('id,nombre,emoticon,tipo,techoPresupuesto');
    if (error || !data) return null;
    return data as CategoriaPresupuesto[];
  } catch {
    return null;
  }
}

export async function subirCategoriasASupabase(categorias: CategoriaPresupuesto[]): Promise<boolean> {
  if (!supabase) return false;
  try {
    const upserts = categorias.map((c) => ({
      id: c.id,
      nombre: c.nombre,
      emoticon: c.emoticon,
      tipo: c.tipo,
      techoPresupuesto: c.techoPresupuesto ?? null,
    }));
    const { error } = await supabase.from('categorias').upsert(upserts, { onConflict: 'id' });
    return !error;
  } catch {
    return false;
  }
}
