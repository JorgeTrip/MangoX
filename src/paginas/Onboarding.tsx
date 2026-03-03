import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SesionContexto } from '../contextos/sesion';
import { supabase } from '../supabase/cliente';

export default function Onboarding() {
  const [paso, setPaso] = useState(1);
  const [nombre, setNombre] = useState('');
  const [monedaBase, setMonedaBase] = useState('ARS');
  const [saldoInicial, setSaldoInicial] = useState('');
  const [tarjetaInicial, setTarjetaInicial] = useState('');
  const navegar = useNavigate();
  const { iniciarSesion } = useContext(SesionContexto);
  const [email, setEmail] = useState('');
  const [estadoEmail, setEstadoEmail] = useState('');

  const continuar = () => {
    if (!nombre.trim()) return;
    localStorage.setItem('mangox-perfil', JSON.stringify({ nombre: nombre.trim(), monedaBase, saldoInicial, tarjetaInicial }));
    iniciarSesion();
    navegar('/inicio');
  };

  return (
    <div className="max-w-2xl mx-auto rounded-3xl p-7 glass dark:glass-dark surface-card">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold tracking-tight">Tu espacio financiero</h2>
        <span className="chip">Paso {paso}/3</span>
      </div>
      <p className="opacity-75 mt-1">Configura una base mínima y empieza a registrar movimientos en menos de un minuto.</p>
      <div className="mt-4 flex gap-2">
        <button onClick={() => setPaso(1)} className={`rounded-full px-3 py-1 text-sm ${paso === 1 ? 'bg-black/80 text-white dark:bg-white/15' : 'bg-black/10 dark:bg-white/10'}`}>Nombre</button>
        <button onClick={() => setPaso(2)} className={`rounded-full px-3 py-1 text-sm ${paso === 2 ? 'bg-black/80 text-white dark:bg-white/15' : 'bg-black/10 dark:bg-white/10'}`}>Preferencias</button>
        <button onClick={() => setPaso(3)} className={`rounded-full px-3 py-1 text-sm ${paso === 3 ? 'bg-black/80 text-white dark:bg-white/15' : 'bg-black/10 dark:bg-white/10'}`}>Billetera/Tarjetas</button>
      </div>
      {paso === 1 ? <input value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="¿Cómo te llamamos?" className="w-full rounded-lg px-3 py-2 bg-white/80 dark:bg-white/10 mt-4" /> : null}
      {paso === 2 ? (
        <div className="grid md:grid-cols-2 gap-3 mt-4">
          <select value={monedaBase} onChange={(e) => setMonedaBase(e.target.value)} className="w-full rounded-lg px-3 py-2 bg-white/80 dark:bg-white/10">
            <option value="ARS">Moneda base ARS</option>
            <option value="USD">Moneda base USD</option>
            <option value="EUR">Moneda base EUR</option>
          </select>
          <input value={saldoInicial} onChange={(e) => setSaldoInicial(e.target.value)} placeholder="Saldo inicial de billetera" className="w-full rounded-lg px-3 py-2 bg-white/80 dark:bg-white/10" />
        </div>
      ) : null}
      {paso === 3 ? <input value={tarjetaInicial} onChange={(e) => setTarjetaInicial(e.target.value)} placeholder="Tarjeta principal (opcional)" className="w-full rounded-lg px-3 py-2 bg-white/80 dark:bg-white/10 mt-4" /> : null}
      <div className="mt-6 flex gap-2">
        <button onClick={continuar} className="btn-primary">
          Continuar
        </button>
        <button onClick={continuar} className="rounded-lg px-4 py-2 bg-black/10 dark:bg-white/10">
          Saltar
        </button>
        {supabase ? (
          <div className="ml-auto flex items-center gap-2">
            <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email para ingresar" className="rounded-lg px-3 py-2 bg-white/80 dark:bg-white/10" />
            <button
              onClick={async () => {
                if (!email.includes('@')) return;
                setEstadoEmail('Enviando enlace…');
                try {
                  await supabase!.auth.signInWithOtp({ email, options: { emailRedirectTo: location.origin } });
                  setEstadoEmail('Revisa tu email para continuar');
                } catch {
                  setEstadoEmail('No se pudo enviar el email');
                }
              }}
              className="rounded-lg px-4 py-2 bg-black/10 dark:bg-white/10"
            >
              Ingresar con email
            </button>
          </div>
        ) : null}
      </div>
      {estadoEmail ? <div className="opacity-70 text-sm mt-2">{estadoEmail}</div> : null}
    </div>
  );
}
