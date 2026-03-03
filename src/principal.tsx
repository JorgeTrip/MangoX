import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import Rutas from './rutas';
import { IdiomaProveedor } from './proveedores/IdiomaProveedor';
import { TemaProveedor } from './proveedores/TemaProveedor';
import { SesionProveedor } from './proveedores/SesionProveedor';

const root = document.getElementById('root')!;

createRoot(root).render(
  <StrictMode>
    <IdiomaProveedor>
      <SesionProveedor>
        <TemaProveedor>
          <Rutas />
        </TemaProveedor>
      </SesionProveedor>
    </IdiomaProveedor>
  </StrictMode>
);
