/**
 * Servicio de datos demo para la landing page.
 * Inyecta datos realistas en localStorage para que el usuario
 * pueda explorar la app sin registrarse. Al iniciar sesión real,
 * se pueden limpiar estos datos.
 */
import { agregarGastos, agregarIngreso, agregarPrestamo, agregarBien } from './almacenLocal';
import { guardarCategoria } from './categorias';
import type { CategoriaPresupuesto, Gasto, Ingreso, Prestamo, Bien } from '../types/finanzas';

const KEY_DEMO = 'mangox-demo-activo';

/** Indica si la sesión actual es una demo */
export function esModoDemo(): boolean {
    return localStorage.getItem(KEY_DEMO) === 'true';
}

/** Limpia los datos demo y el flag */
export function limpiarDemo() {
    localStorage.removeItem(KEY_DEMO);
}

/** Inyecta datos demo realistas para explorar la app */
export function cargarDatosDemo() {
    localStorage.setItem(KEY_DEMO, 'true');
    const hoy = new Date();
    const mesActual = hoy.getMonth();
    const anio = hoy.getFullYear();

    // Categorías demo con techos
    const cats: CategoriaPresupuesto[] = [
        { id: 'demo-hogar', nombre: 'Hogar', emoticon: '🏠', tipo: 'egreso', techoPresupuesto: 320000 },
        { id: 'demo-super', nombre: 'Supermercado', emoticon: '🛒', tipo: 'egreso', techoPresupuesto: 180000 },
        { id: 'demo-transporte', nombre: 'Transporte', emoticon: '🚗', tipo: 'egreso', techoPresupuesto: 95000 },
        { id: 'demo-ocio', nombre: 'Ocio', emoticon: '🎬', tipo: 'egreso', techoPresupuesto: 120000 },
        { id: 'demo-salud', nombre: 'Salud', emoticon: '💊', tipo: 'egreso', techoPresupuesto: 60000 },
        { id: 'demo-sueldo', nombre: 'Sueldo', emoticon: '💰', tipo: 'ingreso' },
        { id: 'demo-freelance', nombre: 'Freelance', emoticon: '💻', tipo: 'ingreso' },
    ];
    cats.forEach((c) => guardarCategoria(c));

    // Gastos demo variados del mes
    const gastosDemo: Gasto[] = [
        g('Expensas edificio', 145000, 'Hogar', 'Banco Nación', mesActual, 3, true),
        g('Supermercado Carrefour', 48500, 'Supermercado', 'Visa Galicia', mesActual, 8),
        g('Nafta YPF', 32000, 'Transporte', 'Mastercard BBVA', mesActual, 5),
        g('Netflix + Spotify', 12800, 'Ocio', 'Visa Galicia', mesActual, 1),
        g('Farmacia', 18700, 'Salud', 'Mercado Pago', mesActual, 12),
        g('Supermercado Coto', 62300, 'Supermercado', 'Visa Galicia', mesActual, 15),
        g('Peaje Autopista', 8500, 'Transporte', 'Ualá', mesActual, 10),
        g('Cena restaurante', 35000, 'Ocio', 'Mastercard BBVA', mesActual, 18),
        g('Cochera mensual', 65000, 'Hogar', 'Banco Nación', mesActual, 1, true),
        g('Seguro auto', 42000, 'Transporte', 'Banco Nación', mesActual, 5, true),
    ];
    agregarGastos(gastosDemo);

    // Ingresos demo
    const ingresosDemo: Ingreso[] = [
        {
            id: crypto.randomUUID(), fecha: new Date(anio, mesActual, 1).toISOString(),
            fuente: 'Sueldo empresa', monto: 850000, moneda: 'ARS',
            propietarioId: 'demo-usuario', esFijo: true, destino: 'gasto', esCobroReal: true
        },
        {
            id: crypto.randomUUID(), fecha: new Date(anio, mesActual, 15).toISOString(),
            fuente: 'Freelance diseño', monto: 500, moneda: 'USD',
            propietarioId: 'demo-usuario', esFijo: false, destino: 'ahorro', esCobroReal: true
        },
    ];
    ingresosDemo.forEach((i) => agregarIngreso(i));

    // Préstamo demo UVA
    const prestamoDemo: Prestamo = {
        id: crypto.randomUUID(), fecha: new Date(anio, mesActual - 6, 1).toISOString(),
        contraparte: 'Banco Nación', monto: 5000000, moneda: 'ARS',
        cuotas: 60, tasaAnual: 8.5, tipo: 'pedido', modalidad: 'uva',
        valorUvaOrigen: 280, cuotasPagadas: 6,
    };
    agregarPrestamo(prestamoDemo);

    // Bien demo
    const bienDemo: Bien = {
        id: crypto.randomUUID(), tipo: 'Auto', descripcion: 'Fiat Cronos 2024',
        operacion: 'Compra', comprador: 'Demo', vendedor: 'Concesionario',
        montoTotal: 18000000, moneda: 'ARS', cuotasTotales: 24, cuotasPagadas: 8,
        fechaOperacion: new Date(anio - 1, 6, 15).toISOString(),
    };
    agregarBien(bienDemo);

    // Guardar perfil demo
    localStorage.setItem('mangox-perfil', JSON.stringify({
        nombre: 'Usuario Demo', monedaBase: 'ARS',
    }));
}

/** Helper para crear un gasto demo */
function g(
    concepto: string, monto: number, categoria: string,
    entidad: string, mes: number, dia: number, fijo = false
): Gasto {
    const anio = new Date().getFullYear();
    return {
        id: crypto.randomUUID(), fecha: new Date(anio, mes, dia).toISOString(),
        concepto, monto, moneda: 'ARS', categoria, entidad, esGastoFijo: fijo,
    };
}
