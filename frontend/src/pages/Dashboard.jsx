// ============================================================
// PÁGINA: Dashboard (protegida)
// Panel administrativo con resumen y tabla de propiedades
// ============================================================

import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useProperty } from '../hooks/useProperty';
import PropertyList from '../components/PropertyList';

const Dashboard = () => {
  const { usuario } = useAuth();
  const { propiedades, cargarPropiedades, eliminarPropiedad, cargando } = useProperty();
  const navigate = useNavigate();

  useEffect(() => {
    cargarPropiedades();
  }, []);

  const totalPropiedades  = propiedades.length;
  const disponibles       = propiedades.filter((p) => p.estado === 'disponible').length;
  const vendidas          = propiedades.filter((p) => p.estado === 'vendido').length;
  const arrendadas        = propiedades.filter((p) => p.estado === 'arriendo').length;

  const handleEditar = (id) => navigate(`/editar-propiedad/${id}`);

  const handleEliminar = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar esta propiedad?')) return;
    const data = await eliminarPropiedad(id);
    if (!data.success) alert('Error al eliminar: ' + data.message);
  };

  return (
    <div className="dashboard-page">
      <div className="dashboard-container">
        {/* Encabezado */}
        <div className="dashboard-header">
          <div>
            <h1 className="dashboard-title">Panel de control</h1>
            <p className="dashboard-subtitle">
              Bienvenido, <strong>{usuario?.nombre}</strong> ({usuario?.rol})
            </p>
          </div>
          <Link to="/crear-propiedad" className="btn btn-primary">
            ➕ Nueva propiedad
          </Link>
        </div>

        {/* Tarjetas de resumen */}
        <div className="stats-grid">
          <div className="stat-box stat-total">
            <span className="stat-icon">🏘️</span>
            <div>
              <h3>{totalPropiedades}</h3>
              <p>Total propiedades</p>
            </div>
          </div>
          <div className="stat-box stat-disponible">
            <span className="stat-icon">✅</span>
            <div>
              <h3>{disponibles}</h3>
              <p>Disponibles</p>
            </div>
          </div>
          <div className="stat-box stat-vendido">
            <span className="stat-icon">🏆</span>
            <div>
              <h3>{vendidas}</h3>
              <p>Vendidas</p>
            </div>
          </div>
          <div className="stat-box stat-arriendo">
            <span className="stat-icon">🔑</span>
            <div>
              <h3>{arrendadas}</h3>
              <p>En arriendo</p>
            </div>
          </div>
        </div>

        {/* Tabla de propiedades */}
        <div className="dashboard-section">
          <h2 className="section-title">Administrar propiedades</h2>

          {cargando ? (
            <div className="loading-state"><div className="spinner"></div><p>Cargando...</p></div>
          ) : (
            <div className="table-responsive">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Título</th>
                    <th>Tipo</th>
                    <th>Ciudad</th>
                    <th>Precio</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {propiedades.map((p) => (
                    <tr key={p.id}>
                      <td>#{p.id}</td>
                      <td>{p.titulo}</td>
                      <td>{p.tipo}</td>
                      <td>{p.ciudad}</td>
                      <td>
                        {new Intl.NumberFormat('es-CO', {
                          style: 'currency',
                          currency: 'COP',
                          maximumFractionDigits: 0,
                        }).format(p.precio)}
                      </td>
                      <td>
                        <span className={`badge badge-${p.estado}`}>{p.estado}</span>
                      </td>
                      <td className="table-actions">
                        <button className="btn btn-outline btn-xs" onClick={() => navigate(`/propiedades/${p.id}`)}>
                          👁️ Ver
                        </button>
                        <button className="btn btn-secondary btn-xs" onClick={() => handleEditar(p.id)}>
                          ✏️ Editar
                        </button>
                        <button className="btn btn-danger btn-xs" onClick={() => handleEliminar(p.id)}>
                          🗑️ Eliminar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Acceso rápido */}
        <div className="quick-access">
          <h2 className="section-title">Acceso rápido</h2>
          <div className="quick-grid">
            <Link to="/crear-propiedad" className="quick-card">
              <span>➕</span><p>Crear propiedad</p>
            </Link>
            <Link to="/propiedades" className="quick-card">
              <span>🏘️</span><p>Ver propiedades</p>
            </Link>
            <Link to="/favoritos" className="quick-card">
              <span>❤️</span><p>Mis favoritos</p>
            </Link>
            <Link to="/contacto" className="quick-card">
              <span>📞</span><p>Contacto</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
