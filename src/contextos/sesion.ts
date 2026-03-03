import { createContext } from 'react';

export const SesionContexto = createContext<{
  autenticado: boolean;
  iniciarSesion: () => void;
  cerrarSesion: () => void;
}>({
  autenticado: false,
  iniciarSesion: () => {},
  cerrarSesion: () => {},
});
