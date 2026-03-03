import type { Gasto, MarcaTarjeta, Moneda } from '../types/finanzas';

export type NuevoGastoTarjeta = {
  concepto: string;
  montoTotal: number;
  moneda: Moneda;
  categoria: string;
  entidad: string;
  fechaCompra: string;
  cuotasTotales: number;
  marcaTarjeta: MarcaTarjeta;
  diaCierreTarjeta: number;
  diaVencimientoTarjeta: number;
  esGastoFijo: boolean;
};

export function crearGastosDesdeTarjeta(input: NuevoGastoTarjeta): Gasto[] {
  const totalCuotas = Math.max(1, Math.trunc(input.cuotasTotales));
  const montoCuota = roundMoneda(input.montoTotal / totalCuotas);
  const gastoRaizId = crypto.randomUUID();
  const fechaCompra = new Date(input.fechaCompra);
  const primeraFechaPago = calcularPrimerPago(fechaCompra, input.diaCierreTarjeta, input.diaVencimientoTarjeta);
  const gastos: Gasto[] = [];
  for (let i = 1; i <= totalCuotas; i += 1) {
    const fechaPago = sumarMesesConDia(primeraFechaPago, i - 1, input.diaVencimientoTarjeta);
    gastos.push({
      id: crypto.randomUUID(),
      fecha: fechaCompra.toISOString(),
      concepto: input.concepto,
      monto: i === totalCuotas ? ajustarUltimaCuota(input.montoTotal, montoCuota, totalCuotas) : montoCuota,
      moneda: input.moneda,
      categoria: input.categoria,
      entidad: input.entidad,
      cuotaN: i,
      cuotasTotales: totalCuotas,
      gastoRaizId,
      marcaTarjeta: input.marcaTarjeta,
      diaCierreTarjeta: input.diaCierreTarjeta,
      diaVencimientoTarjeta: input.diaVencimientoTarjeta,
      fechaPagoEstimada: fechaPago.toISOString(),
      esGastoFijo: input.esGastoFijo,
    });
  }
  return gastos;
}

function calcularPrimerPago(fechaCompra: Date, diaCierre: number, diaVencimiento: number) {
  const compraDia = fechaCompra.getDate();
  const corrimientoMeses = compraDia > diaCierre ? 2 : 1;
  return sumarMesesConDia(fechaCompra, corrimientoMeses, diaVencimiento);
}

function sumarMesesConDia(base: Date, meses: number, dia: number) {
  const d = new Date(base);
  const year = d.getFullYear();
  const month = d.getMonth() + meses;
  const target = new Date(year, month, 1);
  const ultimoDia = new Date(target.getFullYear(), target.getMonth() + 1, 0).getDate();
  target.setDate(Math.min(Math.max(1, dia), ultimoDia));
  return target;
}

function roundMoneda(valor: number) {
  return Math.round((valor + Number.EPSILON) * 100) / 100;
}

function ajustarUltimaCuota(total: number, montoCuota: number, cuotas: number) {
  const acumulado = roundMoneda(montoCuota * (cuotas - 1));
  return roundMoneda(total - acumulado);
}
