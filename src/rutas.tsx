import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { lazy, Suspense, type ReactNode } from 'react';
import LayoutBase from './componentes/LayoutBase';
import CargaRuta from './componentes/CargaRuta';

const Landing = lazy(() => import('./paginas/Landing'));
const Inicio = lazy(() => import('./paginas/Inicio'));
const Onboarding = lazy(() => import('./paginas/Onboarding'));
const Acerca = lazy(() => import('./paginas/Acerca'));
const SelectorEntidad = lazy(() => import('./paginas/SelectorEntidad'));
const Configuracion = lazy(() => import('./paginas/Configuracion'));
const NuevoGasto = lazy(() => import('./paginas/nuevo/NuevoGasto'));
const NuevoPrestamo = lazy(() => import('./paginas/nuevo/NuevoPrestamo'));
const NuevaOperacion = lazy(() => import('./paginas/nuevo/NuevaOperacion'));

function conFallback(elemento: ReactNode) {
  return <Suspense fallback={<CargaRuta />}>{elemento}</Suspense>;
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <LayoutBase />,
    children: [
      { index: true, element: conFallback(<Landing />) },
      { path: '/inicio', element: conFallback(<Inicio />) },
      { path: '/onboarding', element: conFallback(<Onboarding />) },
      { path: '/acerca', element: conFallback(<Acerca />) },
      { path: '/selector-entidad', element: conFallback(<SelectorEntidad />) },
      { path: '/nuevo/gasto', element: conFallback(<NuevoGasto />) },
      { path: '/nuevo/prestamo', element: conFallback(<NuevoPrestamo />) },
      { path: '/nuevo/operacion', element: conFallback(<NuevaOperacion />) },
    ],
  },
  { path: '/configuracion', element: <LayoutBase />, children: [{ index: true, element: conFallback(<Configuracion />) }] },
]);

export default function Rutas() {
  return <RouterProvider router={router} />;
}
