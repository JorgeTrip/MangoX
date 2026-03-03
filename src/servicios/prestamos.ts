import type { ModalidadPrestamo, Prestamo } from '../types/finanzas';

type BasePrestamo = {
  monto: number;
  cuotas: number;
  tasaAnual: number;
};

export function calcularCuotaSistemaFrances({ monto, cuotas, tasaAnual }: BasePrestamo) {
  const i = tasaAnual / 12 / 100;
  if (i <= 0) return monto / cuotas;
  return (monto * i) / (1 - (1 + i) ** -cuotas);
}

export function calcularCuotaUva(montoOriginal: number, valorUvaOrigen: number, valorUvaActual: number) {
  if (valorUvaOrigen <= 0 || valorUvaActual <= 0) return 0;
  return (montoOriginal / valorUvaOrigen) * valorUvaActual;
}

export function fijarPrestamoDolarizado(montoPesos: number, tipoCambioInicial: number) {
  if (tipoCambioInicial <= 0) return 0;
  return montoPesos / tipoCambioInicial;
}

export function estimarCuotaPrestamo(prestamo: Prestamo, valorUvaActual: number | null) {
  const modalidad = prestamo.modalidad ?? 'tasa_fija';
  const calculada = estimarPorModalidad(prestamo, modalidad, valorUvaActual);
  return prestamo.ajusteManual && prestamo.ajusteManual > 0 ? prestamo.ajusteManual : calculada;
}

function estimarPorModalidad(prestamo: Prestamo, modalidad: ModalidadPrestamo, valorUvaActual: number | null) {
  if (modalidad === 'uva') {
    if (!valorUvaActual || !prestamo.valorUvaOrigen) return prestamo.cuotaEstimada ?? 0;
    return calcularCuotaUva(prestamo.monto, prestamo.valorUvaOrigen, valorUvaActual);
  }
  if (modalidad === 'tercero_dolarizado') {
    return (prestamo.montoFijadoUsd ?? 0) > 0 ? prestamo.montoFijadoUsd ?? 0 : prestamo.monto;
  }
  return calcularCuotaSistemaFrances(prestamo);
}
