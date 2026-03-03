export type Moneda = 'ARS' | 'USD' | 'EUR';

export type Gasto = {
  id: string;
  fecha: string;
  concepto: string;
  monto: number;
  moneda: Moneda;
  categoria: string;
  entidad: string;
};

export type Prestamo = {
  id: string;
  fecha: string;
  contraparte: string;
  monto: number;
  moneda: Moneda;
  cuotas: number;
  tasaAnual: number;
};

export type Operacion = {
  id: string;
  fecha: string;
  tipo: 'compra' | 'venta' | 'transferencia';
  descripcion: string;
  monto: number;
  moneda: Moneda;
};
