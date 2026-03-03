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
  cuotasPagadas?: number;
  postergadoHasta?: string;
};

export type Operacion = {
  id: string;
  fecha: string;
  tipo: 'compra' | 'venta' | 'transferencia';
  descripcion: string;
  monto: number;
  moneda: Moneda;
};

export type DestinoIngreso = 'ahorro' | 'gasto' | 'cambio_a_pesos_tasa';

export type Ingreso = {
  id: string;
  fecha: string;
  fuente: string;
  monto: number;
  moneda: Moneda;
  propietarioId: string;
  esFijo: boolean;
  mesAjuste?: string;
  destino: DestinoIngreso;
  tasaCambioPesos?: number;
  esCobroReal: boolean;
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

export type AportanteEvento = {
  id: string;
  nombre: string;
  montoAportado: number;
  personasAdicionales: number;
  pagado: boolean;
};

export type EventoReparto = {
  id: string;
  nombre: string;
  moneda: Moneda;
  aportantes: AportanteEvento[];
  total: number;
  totalPersonas: number;
  montoEquitativo: number;
  creadoEn: string;
  finalizado: boolean;
};
