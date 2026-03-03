import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { SesionContexto } from '../contextos/sesion';

export default function RutaProtegida({ children }: { children: React.ReactNode }) {
  const { autenticado } = useContext(SesionContexto);
  if (!autenticado) return <Navigate to="/" replace />;
  return <>{children}</>;
}
