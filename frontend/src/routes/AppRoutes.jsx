// ============================================================
// RUTAS: AppRoutes
// Navegación dinámica con React Router DOM
// Rutas protegidas para páginas privadas
// ============================================================

import { Routes, Route } from 'react-router-dom';
import Layout from '../components/Layout';
import ProtectedRoute from '../components/ProtectedRoute';

// Páginas públicas
import Home from '../pages/Home';
import Login from '../pages/Login';
import Registro from '../pages/Registro';
import Propiedades from '../pages/Propiedades';
import DetallePropiedad from '../pages/DetallePropiedad';
import Contacto from '../pages/Contacto';
import NotFound from '../pages/NotFound';

// Páginas protegidas (requieren autenticación)
import Dashboard from '../pages/Dashboard';
import CrearPropiedad from '../pages/CrearPropiedad';
import EditarPropiedad from '../pages/EditarPropiedad';
import Favoritos from '../pages/Favoritos';
import BandejaSolicitudes from '../pages/BandejaSolicitudes';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Layout envuelve todas las páginas con Navbar y Footer */}
      <Route path="/" element={<Layout />}>
        
        {/* Rutas públicas */}
        <Route index element={<Home />} />
        <Route path="login" element={<Login />} />
        <Route path="registro" element={<Registro />} />
        <Route path="propiedades" element={<Propiedades />} />
        <Route path="propiedades/:id" element={<DetallePropiedad />} />
        <Route path="contacto" element={<Contacto />} />

        {/* Rutas protegidas — requieren sesión activa */}
        <Route element={<ProtectedRoute />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="crear-propiedad" element={<CrearPropiedad />} />
          <Route path="editar-propiedad/:id" element={<EditarPropiedad />} />
          <Route path="favoritos" element={<Favoritos />} />
          <Route path="bandeja-solicitudes" element={<BandejaSolicitudes />} />
        </Route>

        {/* Ruta 404 */}
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
