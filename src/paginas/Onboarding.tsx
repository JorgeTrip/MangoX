import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Onboarding() {
  const [nombre, setNombre] = useState('');
  const navegar = useNavigate();
  return (
    <div className="max-w-xl mx-auto rounded-2xl p-6 glass dark:glass-dark shadow">
      <h2 className="text-xl font-semibold">¿Cómo te llamamos?</h2>
      <input value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Tu nombre" className="mt-4 w-full rounded-lg px-3 py-2 bg-white/80 dark:bg-white/10" />
      <div className="mt-6 flex gap-2">
        <button onClick={() => navegar('/inicio')} className="rounded-lg px-4 py-2 bg-black/80 text-white dark:bg-white/10">
          Continuar
        </button>
        <button onClick={() => navegar('/inicio')} className="rounded-lg px-4 py-2 bg-black/10 dark:bg-white/10">
          Saltar
        </button>
      </div>
    </div>
  );
}
