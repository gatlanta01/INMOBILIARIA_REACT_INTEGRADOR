// ============================================================
// COMPONENTE: Footer
// ============================================================

import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-grid">
          {/* Columna 1: Logo y descripción */}
          <div className="footer-col">
            <h3 className="footer-logo">🏠 InmoReact</h3>
            <p className="footer-desc">
              Tu plataforma inmobiliaria de confianza. Encontramos el espacio perfecto para ti.
            </p>
          </div>

          {/* Columna 2: Navegación */}
          <div className="footer-col">
            <h4 className="footer-title">Navegación</h4>
            <ul className="footer-links">
              <li><Link to="/">Inicio</Link></li>
              <li><Link to="/propiedades">Propiedades</Link></li>
              <li><Link to="/contacto">Contacto</Link></li>
              <li><Link to="/registro">Registrarse</Link></li>
            </ul>
          </div>

          {/* Columna 3: Tipos de propiedad */}
          <div className="footer-col">
            <h4 className="footer-title">Propiedades</h4>
            <ul className="footer-links">
              <li><Link to="/propiedades">Apartamentos</Link></li>
              <li><Link to="/propiedades">Casas</Link></li>
              <li><Link to="/propiedades">Locales</Link></li>
              <li><Link to="/propiedades">Oficinas</Link></li>
            </ul>
          </div>

          {/* Columna 4: Contacto */}
          <div className="footer-col">
            <h4 className="footer-title">Contacto</h4>
            <p>📍 Bogotá, Colombia</p>
            <p>📞 +57 300 123 4567</p>
            <p>✉️ info@inmoreact.com</p>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} InmoReact. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
