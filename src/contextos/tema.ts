import { createContext } from 'react';

export type Tema = 'claro' | 'oscuro';

export const TemaContexto = createContext<{ tema: Tema; alternar: () => void }>({
  tema: 'claro',
  alternar: () => {},
});
