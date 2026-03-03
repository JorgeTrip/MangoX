import { createContext } from 'react';

export const IdiomaContexto = createContext<{ idioma: string; cambiar: (lng: string) => void }>({
  idioma: 'es',
  cambiar: () => {},
});
