// ============================================================
// COMPONENTE: PropertyCard
// Recibe datos de una propiedad por PROPS desde PropertyList
// Props: propiedad, onEditar, onEliminar, onFavorito, esFavorito, mostrarAcciones
// ============================================================

import { Link } from 'react-router-dom';
import Button from './Button';

const formatPrice = (price) =>
  new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(price);

const PropertyCard = ({ propiedad, onEditar, onEliminar, onFavorito, esFavorito = false, mostrarAcciones = false }) => {
  const {
    id,
    titulo,
    tipo,
    ciudad,
    sector,
    precio,
    area,
    habitaciones,
    banos,
    parqueaderos,
    imagen,
    estado,
  } = propiedad;

  const estadoClass = {
    disponible: 'badge-disponible',
    vendido: 'badge-vendido',
    arriendo: 'badge-arriendo',
  }[estado] || 'badge-disponible';

  const imagenSrc = imagen || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800';

  return (
    <div className="property-card">
      {/* Imagen */}
      <div className="card-image">
        <img src={imagenSrc} alt={titulo} loading="lazy" />
        <span className={`badge ${estadoClass}`}>{estado}</span>
        <span className="badge badge-tipo">{tipo}</span>
      </div>

      {/* Contenido */}
      <div className="card-content">
        <h3 className="card-title">{titulo}</h3>
        <p className="card-location">
          📍 {sector ? `${sector}, ` : ''}{ciudad}
        </p>
        <p className="card-price">{formatPrice(precio)}</p>

        {/* Características */}
        <div className="card-features">
          <span>📐 {area} m²</span>
          {habitaciones > 0 && <span>🛏 {habitaciones} hab.</span>}
          {banos > 0 && <span>🚿 {banos} baños</span>}
          {parqueaderos > 0 && <span>🚗 {parqueaderos} pk.</span>}
        </div>

        {/* Acciones */}
        <div className="card-actions">
          <Link to={`/propiedades/${id}`} className="btn btn-primary btn-sm">
            Ver detalle
          </Link>

          {/* Botón favorito - enviado como prop desde padre */}
          {onFavorito && (
            <button
              className={`btn-icon ${esFavorito ? 'favorito-activo' : ''}`}
              onClick={() => onFavorito(id)}
              title={esFavorito ? 'Quitar de favoritos' : 'Agregar a favoritos'}
            >
              {esFavorito ? '❤️' : '🤍'}
            </button>
          )}

          {/* Acciones admin - enviadas como props desde Dashboard */}
          {mostrarAcciones && (
            <>
              <button className="btn btn-outline btn-sm" onClick={() => onEditar(id)}>
                ✏️ Editar
              </button>
              <button className="btn btn-danger btn-sm" onClick={() => onEliminar(id)}>
                🗑️ Eliminar
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;
