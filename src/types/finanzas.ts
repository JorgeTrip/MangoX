export type Moneda = 'ARS' | 'USD' | 'EUR';

export type MarcaTarjeta = 'Visa' | 'Mastercard' | 'Amex' | 'Otra';

export type TipoPrestamo = 'pedido' | 'otorgado';
export type ModalidadPrestamo = 'tasa_fija' | 'uva' | 'tercero_dolarizado';

export type EstadoPresupuesto = 'normal' | 'advertencia' | 'excedido';

export type Gasto = {
  id: string;
  fecha: string;
  concepto: string;
  monto: number;
  moneda: Moneda;
  categoria: string;
  entidad: string;
  cuotaN?: number;
  cuotasTotales?: number;
  gastoRaizId?: string;
  marcaTarjeta?: MarcaTarjeta;
  diaCierreTarjeta?: number;
  diaVencimientoTarjeta?: number;
  fechaPagoEstimada?: string;
  esGastoFijo?: boolean;
};

export type Prestamo = {
  id: string;
  fecha: string;
  contraparte: string;
  monto: number;
  moneda: Moneda;
  cuotas: number;
  tasaAnual: number;
  tipo?: TipoPrestamo;
  modalidad?: ModalidadPrestamo;
  valorUvaOrigen?: number;
  cuotaEstimada?: number;
  montoFijadoUsd?: number;
  ajusteManual?: number;
};

export type Operacion = {
  id: string;
  fecha: string;
  tipo: 'compra' | 'venta' | 'transferencia';
  descripcion: string;
  monto: number;
  moneda: Moneda;
};

export type CategoriaPresupuesto = {
  id: string;
  nombre: string;
  emoticon: string;
  tipo: 'ingreso' | 'egreso';
  techoPresupuesto?: number;
};

export type AlertaPresupuesto = {
  categoria: string;
  gastado: number;
  techo: number;
  porcentaje: number;
  estado: EstadoPresupuesto;
};
