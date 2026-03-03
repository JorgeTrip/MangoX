import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FormularioBase from '../../componentes/FormularioBase';
import { agregarOperacion } from '../../servicios/almacenLocal';
import type { Moneda, Operacion } from '../../types/finanzas';

export default function NuevaOperacion() {
  const navigate = useNavigate();
  const [tipo, setTipo] = useState<Operacion['tipo']>('transferencia');
  const [descripcion, setDescripcion] = useState('');
  const [monto, setMonto] = useState('');
  const [moneda, setMoneda] = useState<Moneda>('ARS');

  const guardar = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const value = Number(monto);
    if (!descripcion || value <= 0) return;
    agregarOperacion({
      id: crypto.randomUUID(),
      fecha: new Date().toISOString(),
      tipo,
      descripcion,
      monto: value,
      moneda,
    });
    navigate('/inicio');
  };

  return (
    <FormularioBase titulo="Nueva Operación" descripcion="Registrá una compra, venta o transferencia." onSubmit={guardar}>
      <div className="grid sm:grid-cols-2 gap-3">
        <select value={tipo} onChange={(e) => setTipo(e.target.value as Operacion['tipo'])} className="rounded-lg px-3 py-2 bg-white/80 dark:bg-white/10">
          <option value="compra">Compra</option>
          <option value="venta">Venta</option>
          <option value="transferencia">Transferencia</option>
        </select>
        <select value={moneda} onChange={(e) => setMoneda(e.target.value as Moneda)} className="rounded-lg px-3 py-2 bg-white/80 dark:bg-white/10">
          <option value="ARS">ARS</option>
          <option value="USD">USD</option>
          <option value="EUR">EUR</option>
        </select>
      </div>
      <input value={descripcion} onChange={(e) => setDescripcion(e.target.value)} placeholder="Descripción" className="rounded-lg px-3 py-2 bg-white/80 dark:bg-white/10" />
      <input value={monto} onChange={(e) => setMonto(e.target.value)} placeholder="Monto" inputMode="decimal" className="rounded-lg px-3 py-2 bg-white/80 dark:bg-white/10" />
    </FormularioBase>
  );
}
