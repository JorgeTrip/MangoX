import { useContext, useEffect, useState } from 'react';
import { IdiomaContexto } from '../contextos/idioma';
import { TemaContexto } from '../contextos/tema';
import { guardarPreferenciasNotificacion, leerPreferenciasNotificacion, type PreferenciasNotificacion } from '../servicios/almacenLocal';

export default function Configuracion() {
  const { idioma, cambiar } = useContext(IdiomaContexto);
  const { tema, alternar } = useContext(TemaContexto);
  const [preferencias, setPreferencias] = useState<PreferenciasNotificacion>(() => leerPreferenciasNotificacion());
  const adminDev = import.meta.env.VITE_DEV_ADMIN === 'true';

  useEffect(() => {
    guardarPreferenciasNotificacion(preferencias);
  }, [preferencias]);

  return (
    <div className="max-w-2xl mx-auto rounded-3xl p-6 glass dark:glass-dark surface-card space-y-4">
      <div className="flex items-center justify-between">
        <div className="font-medium text-lg">Configuración</div>
        <span className="chip">Preferencias</span>
      </div>
      <div className="space-y-1 rounded-xl p-4 bg-white/30 dark:bg-white/5">
        <div className="text-sm opacity-80">Idioma</div>
        <select value={idioma} onChange={(e) => cambiar(e.target.value)} className="bg-transparent rounded-md border border-white/20 px-2 py-1">
          <option value="es">ES</option>
          <option value="en">EN</option>
        </select>
      </div>
      <div className="space-y-1 rounded-xl p-4 bg-white/30 dark:bg-white/5">
        <div className="text-sm opacity-80">Tema</div>
        <button onClick={alternar} className="btn-primary">
          {tema === 'claro' ? 'Pasar a oscuro' : 'Pasar a claro'}
        </button>
      </div>
      <div className="space-y-1 rounded-xl p-4 bg-white/30 dark:bg-white/5">
        <div className="text-sm opacity-80">Notificaciones</div>
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={preferencias.email} onChange={(e) => setPreferencias((p) => ({ ...p, email: e.target.checked }))} />
          Email
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={preferencias.push} onChange={(e) => setPreferencias((p) => ({ ...p, push: e.target.checked }))} />
          Push in-app
        </label>
      </div>
      <div className="space-y-1 rounded-xl p-4 bg-white/30 dark:bg-white/5">
        <div className="text-sm opacity-80">Plan y acceso</div>
        <div className="text-sm">{adminDev ? 'Modo superusuario habilitado por entorno' : 'Modo usuario estándar'}</div>
      </div>
    </div>
  );
}
