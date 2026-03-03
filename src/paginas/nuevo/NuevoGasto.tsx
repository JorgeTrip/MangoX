import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FormularioBase from '../../componentes/FormularioBase';
import { agregarGastos } from '../../servicios/almacenLocal';
import { crearGastosDesdeTarjeta } from '../../servicios/gastos';
import type { MarcaTarjeta, Moneda } from '../../types/finanzas';

export default function NuevoGasto() {
  const navigate = useNavigate();
  const [concepto, setConcepto] = useState('');
  const [monto, setMonto] = useState('');
  const [categoria, setCategoria] = useState('General');
  const [entidad, setEntidad] = useState('Tarjeta principal');
  const [moneda, setMoneda] = useState<Moneda>('ARS');
  const [fechaCompra, setFechaCompra] = useState(new Date().toISOString().slice(0, 10));
  const [cuotasTotales, setCuotasTotales] = useState('1');
  const [marcaTarjeta, setMarcaTarjeta] = useState<MarcaTarjeta>('Visa');
  const [diaCierreTarjeta, setDiaCierreTarjeta] = useState('28');
  const [diaVencimientoTarjeta, setDiaVencimientoTarjeta] = useState('5');
  const [esGastoFijo, setEsGastoFijo] = useState(false);

  const guardar = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const montoTotal = Number(monto);
    const cuotas = Number(cuotasTotales);
    const diaCierre = Number(diaCierreTarjeta);
    const diaVencimiento = Number(diaVencimientoTarjeta);
    if (!concepto || Number.isNaN(montoTotal) || montoTotal <= 0) return;
    if (Number.isNaN(cuotas) || cuotas <= 0) return;
    if (Number.isNaN(diaCierre) || diaCierre <= 0 || diaCierre > 31) return;
    if (Number.isNaN(diaVencimiento) || diaVencimiento <= 0 || diaVencimiento > 31) return;
    const gastos = crearGastosDesdeTarjeta({
      concepto,
      montoTotal,
      moneda,
      categoria,
      entidad,
      fechaCompra,
      cuotasTotales: cuotas,
      marcaTarjeta,
      diaCierreTarjeta: diaCierre,
      diaVencimientoTarjeta: diaVencimiento,
      esGastoFijo,
    });
    agregarGastos(gastos);
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
      <div className="grid sm:grid-cols-3 gap-3">
        <input type="date" value={fechaCompra} onChange={(e) => setFechaCompra(e.target.value)} className="rounded-lg px-3 py-2 bg-white/80 dark:bg-white/10" />
        <input value={cuotasTotales} onChange={(e) => setCuotasTotales(e.target.value)} placeholder="Cuotas totales" inputMode="numeric" className="rounded-lg px-3 py-2 bg-white/80 dark:bg-white/10" />
        <select value={marcaTarjeta} onChange={(e) => setMarcaTarjeta(e.target.value as MarcaTarjeta)} className="rounded-lg px-3 py-2 bg-white/80 dark:bg-white/10">
          <option value="Visa">Visa</option>
          <option value="Mastercard">Mastercard</option>
          <option value="Amex">Amex</option>
          <option value="Otra">Otra</option>
        </select>
      </div>
      <div className="grid sm:grid-cols-2 gap-3">
        <input value={diaCierreTarjeta} onChange={(e) => setDiaCierreTarjeta(e.target.value)} placeholder="Día de cierre tarjeta" inputMode="numeric" className="rounded-lg px-3 py-2 bg-white/80 dark:bg-white/10" />
        <input value={diaVencimientoTarjeta} onChange={(e) => setDiaVencimientoTarjeta(e.target.value)} placeholder="Día de vencimiento tarjeta" inputMode="numeric" className="rounded-lg px-3 py-2 bg-white/80 dark:bg-white/10" />
      </div>
      <label className="flex items-center gap-2 rounded-lg px-3 py-2 bg-white/60 dark:bg-white/5">
        <input type="checkbox" checked={esGastoFijo} onChange={(e) => setEsGastoFijo(e.target.checked)} />
        Marcar como gasto fijo mensual
      </label>
    </FormularioBase>
  );
}
