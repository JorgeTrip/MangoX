import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import LayoutBase from './componentes/LayoutBase';
import Landing from './paginas/Landing';
import Inicio from './paginas/Inicio';
import Onboarding from './paginas/Onboarding';
import Acerca from './paginas/Acerca';
import SelectorEntidad from './paginas/SelectorEntidad';
import Configuracion from './paginas/Configuracion';
import NuevoGasto from './paginas/nuevo/NuevoGasto';
import NuevoPrestamo from './paginas/nuevo/NuevoPrestamo';
import NuevaOperacion from './paginas/nuevo/NuevaOperacion';

const router = createBrowserRouter([
  {
    path: '/',
    element: <LayoutBase />,
    children: [
      { index: true, element: <Landing /> },
      { path: '/inicio', element: <Inicio /> },
      { path: '/onboarding', element: <Onboarding /> },
      { path: '/acerca', element: <Acerca /> },
      { path: '/selector-entidad', element: <SelectorEntidad /> },
      { path: '/nuevo/gasto', element: <NuevoGasto /> },
      { path: '/nuevo/prestamo', element: <NuevoPrestamo /> },
      { path: '/nuevo/operacion', element: <NuevaOperacion /> },
    ],
  },
  { path: '/configuracion', element: <LayoutBase />, children: [{ index: true, element: <Configuracion /> }] },
]);

export default function Rutas() {
  return <RouterProvider router={router} />;
}
