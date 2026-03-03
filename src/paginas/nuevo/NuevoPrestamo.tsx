import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FormularioBase from '../../componentes/FormularioBase';
import { agregarPrestamo } from '../../servicios/almacenLocal';
import { calcularCuotaSistemaFrances, calcularCuotaUva, fijarPrestamoDolarizado } from '../../servicios/prestamos';
import { obtenerUvaActual } from '../../servicios/uva';
import type { ModalidadPrestamo, Moneda, TipoPrestamo } from '../../types/finanzas';

export default function NuevoPrestamo() {
  const navigate = useNavigate();
  const [contraparte, setContraparte] = useState('');
  const [monto, setMonto] = useState('');
  const [cuotas, setCuotas] = useState('12');
  const [tasaAnual, setTasaAnual] = useState('50');
  const [moneda, setMoneda] = useState<Moneda>('ARS');
  const [tipo, setTipo] = useState<TipoPrestamo>('pedido');
  const [modalidad, setModalidad] = useState<ModalidadPrestamo>('tasa_fija');
  const [valorUvaOrigen, setValorUvaOrigen] = useState('');
  const [tipoCambioFijacion, setTipoCambioFijacion] = useState('');
  const [ajusteManual, setAjusteManual] = useState('');

  const cuotaPreview = useMemo(() => {
    const valueMonto = Number(monto);
    const valueCuotas = Number(cuotas);
    const valueTasa = Number(tasaAnual);
    if (!valueMonto || !valueCuotas) return null;
    if (modalidad === 'tasa_fija') return calcularCuotaSistemaFrances({ monto: valueMonto, cuotas: valueCuotas, tasaAnual: valueTasa || 0 });
    if (modalidad === 'tercero_dolarizado') return fijarPrestamoDolarizado(valueMonto, Number(tipoCambioFijacion));
    const origen = Number(valorUvaOrigen);
    if (!origen) return null;
    return calcularCuotaUva(valueMonto, origen, origen);
  }, [modalidad, monto, cuotas, tasaAnual, tipoCambioFijacion, valorUvaOrigen]);

  const guardar = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const valueMonto = Number(monto);
    const valueCuotas = Number(cuotas);
    const valueTasa = Number(tasaAnual);
    const valueAjusteManual = Number(ajusteManual);
    const valueUvaOrigen = Number(valorUvaOrigen);
    const valueTipoCambio = Number(tipoCambioFijacion);
    if (!contraparte || valueMonto <= 0 || valueCuotas <= 0 || Number.isNaN(valueTasa)) return;
    let cuotaEstimada = calcularCuotaSistemaFrances({ monto: valueMonto, cuotas: valueCuotas, tasaAnual: valueTasa });
    let montoFijadoUsd: number | undefined;
    if (modalidad === 'uva') {
      const valorUvaActual = await obtenerUvaActual();
      if (valueUvaOrigen > 0 && valorUvaActual) {
        cuotaEstimada = calcularCuotaUva(valueMonto, valueUvaOrigen, valorUvaActual);
      }
    }
    if (modalidad === 'tercero_dolarizado') {
      montoFijadoUsd = valueTipoCambio > 0 ? fijarPrestamoDolarizado(valueMonto, valueTipoCambio) : undefined;
      cuotaEstimada = montoFijadoUsd ?? cuotaEstimada;
    }
    agregarPrestamo({
      id: crypto.randomUUID(),
      fecha: new Date().toISOString(),
      contraparte,
      monto: valueMonto,
      moneda,
      cuotas: valueCuotas,
      tasaAnual: valueTasa,
      tipo,
      modalidad,
      valorUvaOrigen: valueUvaOrigen > 0 ? valueUvaOrigen : undefined,
      cuotaEstimada,
      montoFijadoUsd,
      ajusteManual: valueAjusteManual > 0 ? valueAjusteManual : undefined,
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
      <div className="grid sm:grid-cols-2 gap-3">
        <select value={tipo} onChange={(e) => setTipo(e.target.value as TipoPrestamo)} className="rounded-lg px-3 py-2 bg-white/80 dark:bg-white/10">
          <option value="pedido">Préstamo pedido</option>
          <option value="otorgado">Préstamo otorgado</option>
        </select>
        <select value={modalidad} onChange={(e) => setModalidad(e.target.value as ModalidadPrestamo)} className="rounded-lg px-3 py-2 bg-white/80 dark:bg-white/10">
          <option value="tasa_fija">Tasa fija</option>
          <option value="uva">UVA</option>
          <option value="tercero_dolarizado">Tercero dolarizado</option>
        </select>
      </div>
      {modalidad === 'uva' ? (
        <input value={valorUvaOrigen} onChange={(e) => setValorUvaOrigen(e.target.value)} placeholder="Valor UVA al origen" inputMode="decimal" className="rounded-lg px-3 py-2 bg-white/80 dark:bg-white/10" />
      ) : null}
      {modalidad === 'tercero_dolarizado' ? (
        <input value={tipoCambioFijacion} onChange={(e) => setTipoCambioFijacion(e.target.value)} placeholder="Tipo de cambio inicial ARS/USD" inputMode="decimal" className="rounded-lg px-3 py-2 bg-white/80 dark:bg-white/10" />
      ) : null}
      <input value={ajusteManual} onChange={(e) => setAjusteManual(e.target.value)} placeholder="Ajuste manual de cuota (opcional)" inputMode="decimal" className="rounded-lg px-3 py-2 bg-white/80 dark:bg-white/10" />
      <div className="rounded-xl px-3 py-2 bg-white/60 dark:bg-white/5 text-sm">
        Cuota estimada: {cuotaPreview ? cuotaPreview.toLocaleString('es-AR', { maximumFractionDigits: 2 }) : '—'}
      </div>
    </FormularioBase>
  );
}
