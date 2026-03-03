import { useEffect, useMemo, useState } from 'react';
import { TemaContexto, type Tema } from '../contextos/tema';

export function TemaProveedor({ children }: { children: React.ReactNode }) {
  const preferido = useMemo<Tema>(() => {
    if (typeof window === 'undefined') return 'claro';
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'oscuro' : 'claro';
  }, []);

  const [tema, setTema] = useState<Tema>(preferido);

  useEffect(() => {
    const mql = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = (e: MediaQueryListEvent) => setTema(e.matches ? 'oscuro' : 'claro');
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', tema === 'oscuro');
    document.body.classList.toggle('bg-app-claro', tema === 'claro');
    document.body.classList.toggle('bg-app-oscuro', tema === 'oscuro');
  }, [tema]);

  const alternar = () => setTema((t) => (t === 'claro' ? 'oscuro' : 'claro'));

  return <TemaContexto.Provider value={{ tema, alternar }}>{children}</TemaContexto.Provider>;
}
