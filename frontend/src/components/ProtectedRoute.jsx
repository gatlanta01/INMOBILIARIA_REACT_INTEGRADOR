// ============================================================
// COMPONENTE: ProtectedRoute
// Redirige a /login si el usuario no está autenticado
// ============================================================

import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const ProtectedRoute = () => {
  const { isAuthenticated, cargando } = useAuth();

  // Esperar a que cargue la sesión desde LocalStorage
  if (cargando) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
        <p>Verificando sesión...</p>
      </div>
    );
  }

  // Si no está autenticado, redirigir a login
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  // Si está autenticado, renderizar la ruta protegida
  return <Outlet />;
};

export default ProtectedRoute;
