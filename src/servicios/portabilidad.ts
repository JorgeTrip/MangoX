import { clavesAlmacenMangoX } from './almacenLocal';

type Snapshot = {
  version: 1;
  exportadoEn: string;
  datos: Record<string, unknown>;
};

export function exportarPortabilidadJson() {
  const datos: Record<string, unknown> = {};
  clavesAlmacenMangoX().forEach((clave) => {
    const raw = localStorage.getItem(clave);
    if (!raw) return;
    try {
      datos[clave] = JSON.parse(raw) as unknown;
    } catch (e) {
      void e;
    }
  });
  const snapshot: Snapshot = { version: 1, exportadoEn: new Date().toISOString(), datos };
  return JSON.stringify(snapshot, null, 2);
}

export function importarPortabilidadJson(contenido: string) {
  const parsed = JSON.parse(contenido) as Snapshot;
  if (!parsed || parsed.version !== 1 || typeof parsed.datos !== 'object') {
    throw new Error('Formato no compatible');
  }
  clavesAlmacenMangoX().forEach((clave) => {
    const valor = parsed.datos[clave];
    if (valor === undefined) return;
    localStorage.setItem(clave, JSON.stringify(valor));
  });
}
