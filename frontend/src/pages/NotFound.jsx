// ============================================================
// PÁGINA: NotFound (404)
// ============================================================

import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="not-found-page">
      <div className="not-found-content">
        <h1 className="not-found-code">404</h1>
        <h2>Página no encontrada</h2>
        <p>Lo sentimos, la página que buscas no existe o fue movida.</p>
        <div className="not-found-actions">
          <Link to="/" className="btn btn-primary">🏠 Volver al inicio</Link>
          <Link to="/propiedades" className="btn btn-outline">Ver propiedades</Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
