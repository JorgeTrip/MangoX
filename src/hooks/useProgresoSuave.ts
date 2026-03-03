import { useState } from 'react';

export function useProgresoSuave(duracion = 1200) {
  const [cargando, setCargando] = useState(false);
  const run = async <T,>(tarea: () => Promise<T> | T) => {
    setCargando(true);
    const inicio = performance.now();
    let resultado: T;
    try {
      resultado = await Promise.resolve(tarea());
    } finally {
      const transcurrido = performance.now() - inicio;
      const restante = Math.max(0, duracion - transcurrido);
      await new Promise((r) => setTimeout(r, restante));
      setCargando(false);
    }
    return resultado!;
  };
  return { cargando, run };
}
