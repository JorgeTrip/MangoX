import { useContext, useEffect, useRef, useState } from 'react';
import { IdiomaContexto } from '../contextos/idioma';
import { TemaContexto } from '../contextos/tema';
import { guardarPreferenciasNotificacion, leerPreferenciasNotificacion, type PreferenciasNotificacion } from '../servicios/almacenLocal';
import { exportarPortabilidadJson, importarPortabilidadJson } from '../servicios/portabilidad';
import { listarCategorias, guardarCategoria, eliminarCategoria } from '../servicios/categorias';
import type { CategoriaPresupuesto } from '../types/finanzas';

export default function Configuracion() {
  const { idioma, cambiar } = useContext(IdiomaContexto);
  const { tema, alternar } = useContext(TemaContexto);
  const [preferencias, setPreferencias] = useState<PreferenciasNotificacion>(() => leerPreferenciasNotificacion());
  const [estadoPortabilidad, setEstadoPortabilidad] = useState('');
  const inputArchivoRef = useRef<HTMLInputElement | null>(null);
  const adminDev = import.meta.env.VITE_DEV_ADMIN === 'true';
  const [categorias, setCategorias] = useState<CategoriaPresupuesto[]>(() => listarCategorias());
  const [nuevaCat, setNuevaCat] = useState({ nombre: '', emoticon: '💼', tipo: 'egreso' as CategoriaPresupuesto['tipo'], techo: '' });

  useEffect(() => {
    guardarPreferenciasNotificacion(preferencias);
  }, [preferencias]);

  const exportar = () => {
    const contenido = exportarPortabilidadJson();
    const blob = new Blob([contenido], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mangox-export-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setEstadoPortabilidad('Exportación lista');
  };

  const importar = async (archivo: File) => {
    try {
      const texto = await archivo.text();
      importarPortabilidadJson(texto);
      setEstadoPortabilidad('Importación aplicada');
      location.reload();
    } catch (e) {
      void e;
      setEstadoPortabilidad('Archivo inválido');
    }
  };

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
      <div className="space-y-2 rounded-xl p-4 bg-white/30 dark:bg-white/5">
        <div className="text-sm opacity-80">Portabilidad</div>
        <div className="flex flex-wrap gap-2">
          <button onClick={exportar} className="btn-primary">Exportar JSON</button>
          <button onClick={() => inputArchivoRef.current?.click()} className="rounded-lg px-4 py-2 bg-black/10 dark:bg-white/10">Importar JSON</button>
        </div>
        <input
          ref={inputArchivoRef}
          type="file"
          accept="application/json"
          className="hidden"
          onChange={(e) => {
            const archivo = e.target.files?.[0];
            if (!archivo) return;
            void importar(archivo);
          }}
        />
        {estadoPortabilidad ? <div className="text-sm opacity-80">{estadoPortabilidad}</div> : null}
      </div>
      <div className="space-y-2 rounded-xl p-4 bg-white/30 dark:bg-white/5">
        <div className="text-sm opacity-80">Categorías y techos</div>
        <ul className="grid gap-2">
          {categorias.map((c) => (
            <li key={c.id} className="flex items-center gap-2">
              <span className="w-8 text-center">{c.emoticon}</span>
              <span className="flex-1">{c.nombre}</span>
              <input
                defaultValue={c.techoPresupuesto ?? ''}
                placeholder="Techo"
                inputMode="decimal"
                onBlur={(e) => {
                  const techo = Number(e.target.value);
                  const upd: CategoriaPresupuesto = { ...c, techoPresupuesto: Number.isNaN(techo) ? undefined : techo };
                  guardarCategoria(upd);
                  setCategorias(listarCategorias());
                }}
                className="w-28 rounded-md px-2 py-1 bg-white/80 dark:bg-white/10 text-sm"
              />
              <button
                onClick={() => {
                  eliminarCategoria(c.id);
                  setCategorias(listarCategorias());
                }}
                className="rounded-md px-2 py-1 bg-black/10 dark:bg-white/10 text-xs"
              >
                Quitar
              </button>
            </li>
          ))}
        </ul>
        <div className="grid sm:grid-cols-[1fr_auto_auto_auto] gap-2">
          <input value={nuevaCat.nombre} onChange={(e) => setNuevaCat((v) => ({ ...v, nombre: e.target.value }))} placeholder="Nueva categoría" className="rounded-md px-2 py-1 bg-white/80 dark:bg-white/10" />
          <input value={nuevaCat.emoticon} onChange={(e) => setNuevaCat((v) => ({ ...v, emoticon: e.target.value }))} placeholder="Emoji" className="w-24 rounded-md px-2 py-1 bg-white/80 dark:bg-white/10" />
          <select value={nuevaCat.tipo} onChange={(e) => setNuevaCat((v) => ({ ...v, tipo: e.target.value as CategoriaPresupuesto['tipo'] }))} className="w-36 rounded-md px-2 py-1 bg-white/80 dark:bg-white/10">
            <option value="egreso">Egreso</option>
            <option value="ingreso">Ingreso</option>
          </select>
          <button
            onClick={() => {
              if (!nuevaCat.nombre.trim()) return;
              const cat: CategoriaPresupuesto = { id: crypto.randomUUID(), nombre: nuevaCat.nombre.trim(), emoticon: nuevaCat.emoticon || '💼', tipo: nuevaCat.tipo, techoPresupuesto: nuevaCat.techo ? Number(nuevaCat.techo) : undefined };
              guardarCategoria(cat);
              setCategorias(listarCategorias());
              setNuevaCat({ nombre: '', emoticon: '💼', tipo: 'egreso', techo: '' });
            }}
            className="rounded-md px-3 py-1 bg-black/10 dark:bg:white/10"
          >
            Agregar
          </button>
        </div>
      </div>
    </div>
  );
}
