import { useMemo, useState } from 'react';
import { eliminarGasto, listarGastos } from '../servicios/almacenLocal';

export default function ActividadReciente() {
  const inicial = useMemo(() => listarGastos().slice(0, 5), []);
  const [gastos, setGastos] = useState(inicial);

  const borrar = (id: string) => {
    setGastos((actual) => actual.filter((g) => g.id !== id));
    eliminarGasto(id);
  };

  return (
    <ul className="grid gap-2 text-sm">
      {gastos.map((g) => (
        <li key={g.id} className="rounded-lg px-3 py-2 bg-white/30 dark:bg-white/5 flex items-center justify-between gap-3">
          <span className="truncate">{g.concepto} · {g.moneda} {g.monto.toLocaleString('es-AR')}</span>
          <button onClick={() => borrar(g.id)} className="text-xs rounded-md px-2 py-1 bg-black/10 dark:bg-white/10 hover:bg-black/20 dark:hover:bg-white/20">
            Borrar
          </button>
        </li>
      ))}
      {gastos.length === 0 ? <li className="rounded-lg px-3 py-2 bg-white/30 dark:bg-white/5 opacity-70">Sin movimientos recientes</li> : null}
    </ul>
  );
}
