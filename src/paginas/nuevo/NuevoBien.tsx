import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FormularioBase from '../../componentes/FormularioBase';
import { agregarBien } from '../../servicios/almacenLocal';
import { listarEntidadesFinancieras } from '../../servicios/entidades';
import type { Moneda, OperacionBien, TipoBien } from '../../types/finanzas';

/**
 * Formulario para registrar una compra o venta de bien patrimonial.
 * Identifica moneda, comprador, vendedor, tipo de bien, cuotas y fecha.
 */
export default function NuevoBien() {
    const navigate = useNavigate();
    const [tipo, setTipo] = useState<TipoBien>('Auto');
    const [operacion, setOperacion] = useState<OperacionBien>('Compra');
    const [descripcion, setDescripcion] = useState('');
    const [comprador, setComprador] = useState('');
    const [vendedor, setVendedor] = useState('');
    const [montoTotal, setMontoTotal] = useState('');
    const [moneda, setMoneda] = useState<Moneda>('ARS');
    const [cuotasTotales, setCuotasTotales] = useState('1');
    const [fechaOperacion, setFechaOperacion] = useState(new Date().toISOString().slice(0, 10));
    const [sugeridas, setSugeridas] = useState<string[]>([]);

    useEffect(() => {
        let m = true;
        listarEntidadesFinancieras().then((l) => m && setSugeridas(l));
        return () => { m = false; };
    }, []);

    const guardar = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const valor = Number(montoTotal);
        const cuotas = Number(cuotasTotales);
        if (!descripcion || !comprador || !vendedor || valor <= 0 || cuotas <= 0) return;
        agregarBien({
            id: crypto.randomUUID(), tipo, descripcion, operacion,
            comprador, vendedor, montoTotal: valor, moneda,
            cuotasTotales: cuotas, cuotasPagadas: 0, fechaOperacion,
        });
        navigate('/bienes');
    };

    return (
        <FormularioBase titulo="Nueva Compra/Venta" descripcion="Registrá una operación patrimonial." onSubmit={guardar}>
            <div className="grid sm:grid-cols-2 gap-3">
                <select value={tipo} onChange={(e) => setTipo(e.target.value as TipoBien)} className="rounded-lg px-3 py-2 bg-white/80 dark:bg-white/10">
                    <option value="Auto">Auto</option>
                    <option value="Inmueble">Inmueble</option>
                    <option value="Otro">Otro</option>
                </select>
                <select value={operacion} onChange={(e) => setOperacion(e.target.value as OperacionBien)} className="rounded-lg px-3 py-2 bg-white/80 dark:bg-white/10">
                    <option value="Compra">Compra</option>
                    <option value="Venta">Venta</option>
                </select>
            </div>
            <input value={descripcion} onChange={(e) => setDescripcion(e.target.value)} placeholder="Descripción del bien" className="rounded-lg px-3 py-2 bg-white/80 dark:bg-white/10" />
            <div className="grid sm:grid-cols-2 gap-3">
                <div>
                    <input value={comprador} onChange={(e) => setComprador(e.target.value)} placeholder="Comprador" className="w-full rounded-lg px-3 py-2 bg-white/80 dark:bg-white/10" list="lista-entidades-bien" />
                    <datalist id="lista-entidades-bien">
                        {sugeridas.map((s) => <option key={s} value={s} />)}
                    </datalist>
                </div>
                <input value={vendedor} onChange={(e) => setVendedor(e.target.value)} placeholder="Vendedor" className="rounded-lg px-3 py-2 bg-white/80 dark:bg-white/10" />
            </div>
            <div className="grid sm:grid-cols-3 gap-3">
                <input value={montoTotal} onChange={(e) => setMontoTotal(e.target.value)} placeholder="Monto total" inputMode="decimal" className="rounded-lg px-3 py-2 bg-white/80 dark:bg-white/10" />
                <select value={moneda} onChange={(e) => setMoneda(e.target.value as Moneda)} className="rounded-lg px-3 py-2 bg-white/80 dark:bg-white/10">
                    <option value="ARS">ARS</option>
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                </select>
                <input value={cuotasTotales} onChange={(e) => setCuotasTotales(e.target.value)} placeholder="Cuotas" inputMode="numeric" className="rounded-lg px-3 py-2 bg-white/80 dark:bg-white/10" />
            </div>
            <input type="date" value={fechaOperacion} onChange={(e) => setFechaOperacion(e.target.value)} className="rounded-lg px-3 py-2 bg-white/80 dark:bg-white/10" />
        </FormularioBase>
    );
}
