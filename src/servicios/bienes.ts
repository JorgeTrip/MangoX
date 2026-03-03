import type { Bien } from '../types/finanzas';
import { actualizarBien } from './almacenLocal';

/**
 * Marca una cuota de un bien como pagada/cobrada.
 * Permite sobreescribir el monto real cobrado (ajuste manual)
 * para reflejar adelantos, descuentos u otros ajustes.
 */
export function marcarCuotaBien(bien: Bien, ajusteMonto?: number): Bien {
    const pagadas = Math.min(bien.cuotasPagadas + 1, bien.cuotasTotales);
    const actualizado: Bien = {
        ...bien,
        cuotasPagadas: pagadas,
        ajusteCobro: ajusteMonto && ajusteMonto > 0 ? ajusteMonto : bien.ajusteCobro,
    };
    actualizarBien(actualizado);
    return actualizado;
}

/** Calcula el monto esperado por cuota (sin ajuste) */
export function montoPorCuota(bien: Bien): number {
    if (bien.cuotasTotales <= 0) return bien.montoTotal;
    return Math.round((bien.montoTotal / bien.cuotasTotales) * 100) / 100;
}

/** Calcula el saldo pendiente de cobro/pago de un bien */
export function saldoPendiente(bien: Bien): number {
    const cuotasPendientes = bien.cuotasTotales - bien.cuotasPagadas;
    const valorCuota = bien.ajusteCobro ?? montoPorCuota(bien);
    return Math.round(valorCuota * cuotasPendientes * 100) / 100;
}
