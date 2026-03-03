import { useEffect, useState } from 'react';

type Cambio = { fecha: string; descripcion: string; tipo: 'feat' | 'fix' | 'chore' };

export default function Acerca() {
  const [cambios, setCambios] = useState<Cambio[]>([]);

  useEffect(() => {
    fetch('/changelog.json')
      .then((r) => r.json())
      .then((d) => setCambios(d.cambios ?? []))
      .catch(() => setCambios([]));
  }, []);

  return (
    <div className="grid gap-4">
      <div className="rounded-3xl p-6 glass dark:glass-dark surface-card">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-xl font-semibold tracking-tight">Acerca</h2>
          <span className="chip">Versión Beta</span>
        </div>
        <p className="opacity-80 mt-1">MangoX es una plataforma para gestión patrimonial personal y familiar.</p>
      </div>
      <div className="rounded-3xl p-6 glass dark:glass-dark surface-card">
        <h3 className="font-medium mb-3">Cambios recientes</h3>
        <ul className="space-y-2">
          {cambios.map((c, i) => (
            <li key={i} className="flex items-center gap-2 rounded-lg px-3 py-2 bg-white/30 dark:bg-white/5">
              <span className="text-xs px-2 py-0.5 rounded-full bg-black/10 dark:bg-white/10">{c.tipo}</span>
              <span className="opacity-70">{c.fecha}</span>
              <span>—</span>
              <span>{c.descripcion}</span>
            </li>
          ))}
          {cambios.length === 0 && <li className="opacity-70 text-sm">Sin cambios aún.</li>}
        </ul>
      </div>
    </div>
  );
}
