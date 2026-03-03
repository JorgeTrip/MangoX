import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { lazy, Suspense, type ReactNode } from 'react';
import LayoutBase from './componentes/LayoutBase';
import CargaRuta from './componentes/CargaRuta';
import RutaProtegida from './componentes/RutaProtegida';

const Landing = lazy(() => import('./paginas/Landing'));
const Inicio = lazy(() => import('./paginas/Inicio'));
const Onboarding = lazy(() => import('./paginas/Onboarding'));
const Acerca = lazy(() => import('./paginas/Acerca'));
const SelectorEntidad = lazy(() => import('./paginas/SelectorEntidad'));
const Configuracion = lazy(() => import('./paginas/Configuracion'));
const NuevoGasto = lazy(() => import('./paginas/nuevo/NuevoGasto'));
const NuevoPrestamo = lazy(() => import('./paginas/nuevo/NuevoPrestamo'));
const NuevoIngreso = lazy(() => import('./paginas/nuevo/NuevoIngreso'));
const NuevaOperacion = lazy(() => import('./paginas/nuevo/NuevaOperacion'));
const Reparto = lazy(() => import('./paginas/Reparto'));
const Prestamos = lazy(() => import('./paginas/Prestamos'));

function conFallback(elemento: ReactNode) {
  return <Suspense fallback={<CargaRuta />}>{elemento}</Suspense>;
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <LayoutBase />,
    children: [
      { index: true, element: conFallback(<Landing />) },
      { path: '/inicio', element: conFallback(<RutaProtegida><Inicio /></RutaProtegida>) },
      { path: '/onboarding', element: conFallback(<Onboarding />) },
      { path: '/acerca', element: conFallback(<RutaProtegida><Acerca /></RutaProtegida>) },
      { path: '/selector-entidad', element: conFallback(<RutaProtegida><SelectorEntidad /></RutaProtegida>) },
      { path: '/reparto', element: conFallback(<RutaProtegida><Reparto /></RutaProtegida>) },
      { path: '/prestamos', element: conFallback(<RutaProtegida><Prestamos /></RutaProtegida>) },
      { path: '/nuevo/gasto', element: conFallback(<RutaProtegida><NuevoGasto /></RutaProtegida>) },
      { path: '/nuevo/prestamo', element: conFallback(<RutaProtegida><NuevoPrestamo /></RutaProtegida>) },
      { path: '/nuevo/ingreso', element: conFallback(<RutaProtegida><NuevoIngreso /></RutaProtegida>) },
      { path: '/nuevo/operacion', element: conFallback(<RutaProtegida><NuevaOperacion /></RutaProtegida>) },
    ],
  },
  { path: '/configuracion', element: <LayoutBase />, children: [{ index: true, element: conFallback(<RutaProtegida><Configuracion /></RutaProtegida>) }] },
]);

export default function Rutas() {
  return <RouterProvider router={router} />;
}
