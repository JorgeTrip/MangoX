import { useMemo, useState } from 'react';

const billeteras = [
  'Mercado Pago',
  'Ualá',
  'Personal Pay',
  'Naranja X',
  'Prex',
  'Lemon Cash',
  'Belo',
  'Modo',
  'Buenbit',
  'Ripio',
  "Let'sBit",
  'Fiwind',
  'TiendaCrypto',
  'Vibrant',
  'Astropay',
  'PayPal',
  'Skrill',
  'Wise',
  'Payoneer',
  'Nexo',
  'Binance',
];

export default function SelectorEntidad() {
  const [q, setQ] = useState('');
  const [custom, setCustom] = useState<string | null>(null);
  const opciones = useMemo(() => billeteras.filter((b) => b.toLowerCase().includes(q.toLowerCase())), [q]);

  return (
    <div className="max-w-2xl mx-auto rounded-3xl p-6 glass dark:glass-dark surface-card space-y-3">
      <div className="flex items-center justify-between">
        <div className="font-medium">Seleccionar Entidad</div>
        <span className="chip">Top 20 + personalizada</span>
      </div>
      <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar..." className="w-full rounded-lg px-3 py-2 bg-white/80 dark:bg-white/10" />
      <div className="max-h-60 overflow-auto rounded-lg border border-white/10">
        {opciones.map((b) => (
          <button key={b} onClick={() => setCustom(b)} className="w-full text-left px-3 py-2 hover:bg-black/5 dark:hover:bg-white/10">
            {b}
          </button>
        ))}
        {opciones.length === 0 && <div className="px-3 py-2 opacity-70 text-sm">Sin resultados</div>}
      </div>
      <div className="opacity-80 text-sm">¿No está en la lista? Crea una:</div>
      <input value={custom ?? ''} onChange={(e) => setCustom(e.target.value)} placeholder="Nombre personalizado" className="w-full rounded-lg px-3 py-2 bg-white/80 dark:bg-white/10" />
      <button className="btn-primary">Usar entidad seleccionada</button>
    </div>
  );
}
