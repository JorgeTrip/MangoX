import { useState } from 'react';
import { SesionContexto } from '../contextos/sesion';

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
  };

  return <SesionContexto.Provider value={{ autenticado, iniciarSesion, cerrarSesion }}>{children}</SesionContexto.Provider>;
}
