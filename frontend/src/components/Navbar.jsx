// ============================================================
// COMPONENTE: Navbar
// Navegación principal con links dinámicos según autenticación
// ============================================================

import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const Navbar = () => {
  const { usuario, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMenuOpen(false);
  };

  const isActive = (path) => location.pathname === path ? 'nav-link active' : 'nav-link';

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo */}
        <Link to="/" className="navbar-logo" onClick={() => setMenuOpen(false)}>
          <span className="logo-icon">🏠</span>
          <span className="logo-text">InmoReact</span>
        </Link>

        {/* Botón hamburguesa para móvil */}
        <button
          className={`hamburger ${menuOpen ? 'open' : ''}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Menú"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        {/* Links de navegación */}
        <div className={`navbar-menu ${menuOpen ? 'menu-open' : ''}`}>
          <Link to="/" className={isActive('/')} onClick={() => setMenuOpen(false)}>Inicio</Link>
          <Link to="/propiedades" className={isActive('/propiedades')} onClick={() => setMenuOpen(false)}>Propiedades</Link>
          <Link to="/contacto" className={isActive('/contacto')} onClick={() => setMenuOpen(false)}>Contacto</Link>

          {usuario ? (
            <>
              <Link to="/dashboard" className={isActive('/dashboard')} onClick={() => setMenuOpen(false)}>Dashboard</Link>
              <Link to="/favoritos" className={isActive('/favoritos')} onClick={() => setMenuOpen(false)}>Favoritos</Link>
              <div className="navbar-user">
                <span className="user-greeting">Hola, {usuario.nombre}</span>
                <button className="btn btn-outline btn-sm" onClick={handleLogout}>Cerrar sesión</button>
              </div>
            </>
          ) : (
            <div className="navbar-auth">
              <Link to="/login" className="btn btn-outline btn-sm" onClick={() => setMenuOpen(false)}>Ingresar</Link>
              <Link to="/registro" className="btn btn-primary btn-sm" onClick={() => setMenuOpen(false)}>Registrarse</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
