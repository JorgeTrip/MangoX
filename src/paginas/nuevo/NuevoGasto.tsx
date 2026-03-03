import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FormularioBase from '../../componentes/FormularioBase';
import { agregarGasto } from '../../servicios/almacenLocal';
import type { Moneda } from '../../types/finanzas';

export default function NuevoGasto() {
  const navigate = useNavigate();
  const [concepto, setConcepto] = useState('');
  const [monto, setMonto] = useState('');
  const [categoria, setCategoria] = useState('General');
  const [entidad, setEntidad] = useState('Efectivo');
  const [moneda, setMoneda] = useState<Moneda>('ARS');

  const guardar = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const value = Number(monto);
    if (!concepto || Number.isNaN(value) || value <= 0) return;
    agregarGasto({
      id: crypto.randomUUID(),
      fecha: new Date().toISOString(),
      concepto,
      monto: value,
      moneda,
      categoria,
      entidad,
    });
    navigate('/inicio');
  };

  return (
    <FormularioBase titulo="Nuevo Gasto" descripcion="Registrá un gasto personal o familiar." onSubmit={guardar}>
      <input value={concepto} onChange={(e) => setConcepto(e.target.value)} placeholder="Concepto" className="rounded-lg px-3 py-2 bg-white/80 dark:bg-white/10" />
      <input value={monto} onChange={(e) => setMonto(e.target.value)} placeholder="Monto" inputMode="decimal" className="rounded-lg px-3 py-2 bg-white/80 dark:bg-white/10" />
      <div className="grid sm:grid-cols-3 gap-3">
        <input value={categoria} onChange={(e) => setCategoria(e.target.value)} placeholder="Categoría" className="rounded-lg px-3 py-2 bg-white/80 dark:bg-white/10" />
        <input value={entidad} onChange={(e) => setEntidad(e.target.value)} placeholder="Entidad" className="rounded-lg px-3 py-2 bg-white/80 dark:bg-white/10" />
        <select value={moneda} onChange={(e) => setMoneda(e.target.value as Moneda)} className="rounded-lg px-3 py-2 bg-white/80 dark:bg-white/10">
          <option value="ARS">ARS</option>
          <option value="USD">USD</option>
          <option value="EUR">EUR</option>
        </select>
      </div>
    </FormularioBase>
  );
}
