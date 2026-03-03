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

/** Representa un bien patrimonial (auto, inmueble, otro) con seguimiento de cuotas */
export type TipoBien = 'Auto' | 'Inmueble' | 'Otro';
export type OperacionBien = 'Compra' | 'Venta';

export type Bien = {
  id: string;
  tipo: TipoBien;
  descripcion: string;
  operacion: OperacionBien;
  comprador: string;
  vendedor: string;
  montoTotal: number;
  moneda: Moneda;
  cuotasTotales: number;
  cuotasPagadas: number;
  fechaOperacion: string;
  /** Permite sobreescribir el monto real cobrado por cuota */
  ajusteCobro?: number;
};

/** Cuenta bancaria o billetera virtual */
export type TipoCuenta = 'Banco' | 'Billetera Virtual';

export type Cuenta = {
  id: string;
  nombreEntidad: string;
  saldoActual: number;
  moneda: Moneda;
  tipo: TipoCuenta;
};

/** Tarjeta de crédito vinculada a una entidad */
export type Tarjeta = {
  id: string;
  nombre: string;
  bancoEntidad: string;
  marca: MarcaTarjeta;
  diaCierre: number;
  diaVencimiento: number;
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
  /** Si el ingreso proviene de la venta de un bien */
  bienId?: string;
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
