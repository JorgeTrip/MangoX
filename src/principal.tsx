import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import Rutas from './rutas';
import { IdiomaProveedor } from './proveedores/IdiomaProveedor';
import { TemaProveedor } from './proveedores/TemaProveedor';

const root = document.getElementById('root')!;

createRoot(root).render(
  <StrictMode>
    <IdiomaProveedor>
      <TemaProveedor>
        <Rutas />
      </TemaProveedor>
    </IdiomaProveedor>
  </StrictMode>
);

