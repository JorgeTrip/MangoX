import { useEffect, useState } from 'react';
import { SesionContexto } from '../contextos/sesion';
import { supabase } from '../supabase/cliente';

const KEY = 'mangox-auth';

export function SesionProveedor({ children }: { children: React.ReactNode }) {
  const [autenticado, setAutenticado] = useState(() => {
    try {
      return localStorage.getItem(KEY) === '1';
    } catch (e) {
      void e;
      return false;
    }
  });
  useEffect(() => {
    let activo = true;
    supabase?.auth.getSession().then((s) => {
      if (!activo) return;
      if (s.data.session) {
        setAutenticado(true);
      }
    });
    const sub = supabase?.auth.onAuthStateChange((_e, s) => {
      setAutenticado(Boolean(s));
      try {
        if (s) localStorage.setItem(KEY, '1');
        else localStorage.removeItem(KEY);
      } catch {
        void 0;
      }
    });
    return () => {
      activo = false;
      sub?.data.subscription.unsubscribe();
    };
  }, []);

  const iniciarSesion = () => {
    setAutenticado(true);
    try {
      localStorage.setItem(KEY, '1');
    } catch (e) {
      void e;
    }
  };

  const cerrarSesion = () => {
    setAutenticado(false);
    try {
      localStorage.removeItem(KEY);
    } catch (e) {
      void e;
    }
    void supabase?.auth.signOut();
  };

  return <SesionContexto.Provider value={{ autenticado, iniciarSesion, cerrarSesion }}>{children}</SesionContexto.Provider>;
}
