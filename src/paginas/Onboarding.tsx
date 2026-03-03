import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Onboarding() {
  const [nombre, setNombre] = useState('');
  const navegar = useNavigate();
  return (
    <div className="max-w-2xl mx-auto rounded-3xl p-7 glass dark:glass-dark surface-card">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold tracking-tight">Tu espacio financiero</h2>
        <span className="chip">Paso 1/3</span>
      </div>
      <p className="opacity-75 mt-1">Configura una base mínima y empieza a registrar movimientos en menos de un minuto.</p>
      <div className="grid md:grid-cols-2 gap-3 mt-5">
        <input value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="¿Cómo te llamamos?" className="w-full rounded-lg px-3 py-2 bg-white/80 dark:bg-white/10" />
        <input placeholder="Moneda principal (ej. ARS)" className="w-full rounded-lg px-3 py-2 bg-white/80 dark:bg-white/10" />
      </div>
      <div className="grid md:grid-cols-2 gap-3 mt-3">
        <input placeholder="Objetivo mensual de ahorro" className="w-full rounded-lg px-3 py-2 bg-white/80 dark:bg-white/10" />
        <input placeholder="Ingreso estimado mensual" className="w-full rounded-lg px-3 py-2 bg-white/80 dark:bg-white/10" />
      </div>
      <div className="mt-6 flex gap-2">
        <button onClick={() => navegar('/inicio')} className="btn-primary">
          Continuar
        </button>
        <button onClick={() => navegar('/inicio')} className="rounded-lg px-4 py-2 bg-black/10 dark:bg-white/10">
          Saltar
        </button>
      </div>
    </div>
  );
}
