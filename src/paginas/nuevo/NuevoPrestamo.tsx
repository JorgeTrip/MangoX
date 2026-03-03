import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FormularioBase from '../../componentes/FormularioBase';
import { agregarPrestamo } from '../../servicios/almacenLocal';
import type { Moneda } from '../../types/finanzas';

export default function NuevoPrestamo() {
  const navigate = useNavigate();
  const [contraparte, setContraparte] = useState('');
  const [monto, setMonto] = useState('');
  const [cuotas, setCuotas] = useState('12');
  const [tasaAnual, setTasaAnual] = useState('50');
  const [moneda, setMoneda] = useState<Moneda>('ARS');

  const guardar = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const valueMonto = Number(monto);
    const valueCuotas = Number(cuotas);
    const valueTasa = Number(tasaAnual);
    if (!contraparte || valueMonto <= 0 || valueCuotas <= 0 || Number.isNaN(valueTasa)) return;
    agregarPrestamo({
      id: crypto.randomUUID(),
      fecha: new Date().toISOString(),
      contraparte,
      monto: valueMonto,
      moneda,
      cuotas: valueCuotas,
      tasaAnual: valueTasa,
    });
    navigate('/inicio');
  };

  return (
    <FormularioBase titulo="Nuevo Préstamo" descripcion="Cargá los datos principales para seguimiento." onSubmit={guardar}>
      <input value={contraparte} onChange={(e) => setContraparte(e.target.value)} placeholder="Contraparte" className="rounded-lg px-3 py-2 bg-white/80 dark:bg-white/10" />
      <div className="grid sm:grid-cols-2 gap-3">
        <input value={monto} onChange={(e) => setMonto(e.target.value)} placeholder="Monto" inputMode="decimal" className="rounded-lg px-3 py-2 bg-white/80 dark:bg-white/10" />
        <select value={moneda} onChange={(e) => setMoneda(e.target.value as Moneda)} className="rounded-lg px-3 py-2 bg-white/80 dark:bg-white/10">
          <option value="ARS">ARS</option>
          <option value="USD">USD</option>
          <option value="EUR">EUR</option>
        </select>
      </div>
      <div className="grid sm:grid-cols-2 gap-3">
        <input value={cuotas} onChange={(e) => setCuotas(e.target.value)} placeholder="Cuotas" inputMode="numeric" className="rounded-lg px-3 py-2 bg-white/80 dark:bg-white/10" />
        <input value={tasaAnual} onChange={(e) => setTasaAnual(e.target.value)} placeholder="Tasa anual %" inputMode="decimal" className="rounded-lg px-3 py-2 bg-white/80 dark:bg-white/10" />
      </div>
    </FormularioBase>
  );
}
