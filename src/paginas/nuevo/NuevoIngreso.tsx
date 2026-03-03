import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FormularioBase from '../../componentes/FormularioBase';
import { agregarIngreso } from '../../servicios/almacenLocal';
import { sugerirTasaCambioAPesos } from '../../servicios/cotizaciones';
import type { DestinoIngreso, Moneda } from '../../types/finanzas';

export default function NuevoIngreso() {
  const navigate = useNavigate();
  const [fuente, setFuente] = useState('');
  const [monto, setMonto] = useState('');
  const [moneda, setMoneda] = useState<Moneda>('ARS');
  const [propietarioId, setPropietarioId] = useState('hogar-principal');
  const [esFijo, setEsFijo] = useState(false);
  const [mesAjuste, setMesAjuste] = useState('');
  const [destino, setDestino] = useState<DestinoIngreso>('gasto');
  const [tasaCambioPesos, setTasaCambioPesos] = useState('');
  const [esCobroReal, setEsCobroReal] = useState(true);
  const [cargandoTasa, setCargandoTasa] = useState(false);
  const [metaTasa, setMetaTasa] = useState('');

  const guardar = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const valueMonto = Number(monto);
    const valueTasa = Number(tasaCambioPesos);
    if (!fuente || Number.isNaN(valueMonto) || valueMonto <= 0) return;
    agregarIngreso({
      id: crypto.randomUUID(),
      fecha: new Date().toISOString(),
      fuente,
      monto: valueMonto,
      moneda,
      propietarioId,
      esFijo,
      mesAjuste: mesAjuste || undefined,
      destino,
      tasaCambioPesos: destino === 'cambio_a_pesos_tasa' && valueTasa > 0 ? valueTasa : undefined,
      esCobroReal,
    });
    navigate('/inicio');
  };

  const cargarTasaSugerida = async () => {
    setCargandoTasa(true);
    setMetaTasa('');
    try {
      const sugerida = await sugerirTasaCambioAPesos(moneda);
      setTasaCambioPesos(String(sugerida.tasa));
      setMetaTasa(`${sugerida.fuente} · ${new Date(sugerida.fecha).toLocaleString('es-AR')}`);
    } catch (e) {
      void e;
      setMetaTasa('No se pudo obtener cotización');
    } finally {
      setCargandoTasa(false);
    }
  };

  return (
    <FormularioBase titulo="Nuevo Ingreso" descripcion="Registrá ingresos ARS/USD/EUR con destino y ajustes." onSubmit={guardar}>
      <input value={fuente} onChange={(e) => setFuente(e.target.value)} placeholder="Fuente (ej. Sueldo)" className="rounded-lg px-3 py-2 bg-white/80 dark:bg-white/10" />
      <div className="grid sm:grid-cols-2 gap-3">
        <input value={monto} onChange={(e) => setMonto(e.target.value)} placeholder="Monto" inputMode="decimal" className="rounded-lg px-3 py-2 bg-white/80 dark:bg-white/10" />
        <select value={moneda} onChange={(e) => setMoneda(e.target.value as Moneda)} className="rounded-lg px-3 py-2 bg-white/80 dark:bg-white/10">
          <option value="ARS">ARS</option>
          <option value="USD">USD</option>
          <option value="EUR">EUR</option>
        </select>
      </div>
      <div className="grid sm:grid-cols-2 gap-3">
        <input value={propietarioId} onChange={(e) => setPropietarioId(e.target.value)} placeholder="Propietario del ingreso" className="rounded-lg px-3 py-2 bg-white/80 dark:bg-white/10" />
        <select value={destino} onChange={(e) => setDestino(e.target.value as DestinoIngreso)} className="rounded-lg px-3 py-2 bg-white/80 dark:bg-white/10">
          <option value="gasto">Destino: gasto</option>
          <option value="ahorro">Destino: ahorro</option>
          <option value="cambio_a_pesos_tasa">Destino: cambio a pesos</option>
        </select>
      </div>
      {destino === 'cambio_a_pesos_tasa' ? (
        <div className="grid gap-2">
          <div className="grid sm:grid-cols-[1fr_auto] gap-2">
            <input value={tasaCambioPesos} onChange={(e) => setTasaCambioPesos(e.target.value)} placeholder="Tasa de cambio a pesos" inputMode="decimal" className="rounded-lg px-3 py-2 bg-white/80 dark:bg-white/10" />
            <button type="button" onClick={() => void cargarTasaSugerida()} disabled={cargandoTasa} className="rounded-lg px-3 py-2 bg-black/10 dark:bg-white/10">
              {cargandoTasa ? 'Consultando…' : 'Usar tasa sugerida'}
            </button>
          </div>
          {metaTasa ? <div className="text-xs opacity-70">{metaTasa}</div> : null}
        </div>
      ) : null}
      <label className="flex items-center gap-2 rounded-lg px-3 py-2 bg-white/60 dark:bg-white/5">
        <input type="checkbox" checked={esFijo} onChange={(e) => setEsFijo(e.target.checked)} />
        Marcar como ingreso fijo
      </label>
      {esFijo ? <input type="month" value={mesAjuste} onChange={(e) => setMesAjuste(e.target.value)} className="rounded-lg px-3 py-2 bg-white/80 dark:bg-white/10" /> : null}
      <label className="flex items-center gap-2 rounded-lg px-3 py-2 bg-white/60 dark:bg-white/5">
        <input type="checkbox" checked={esCobroReal} onChange={(e) => setEsCobroReal(e.target.checked)} />
        Registrar como cobro real
      </label>
    </FormularioBase>
  );
}
