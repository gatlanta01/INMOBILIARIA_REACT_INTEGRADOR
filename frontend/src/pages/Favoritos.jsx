// ============================================================
// PÁGINA: Favoritos (protegida)
// Muestra las propiedades guardadas como favoritas
// ============================================================

import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useFavorite } from '../hooks/useFavorite';
import PropertyCard from '../components/PropertyCard';

const Favoritos = () => {
  const { favoritos, cargarFavoritos, eliminarFavorito, cargando } = useFavorite();

  useEffect(() => {
    cargarFavoritos();
  }, []);

  const handleEliminar = async (propiedad_id) => {
    await eliminarFavorito(propiedad_id);
  };

  return (
    <div className="favoritos-page">
      <div className="page-container">
        <div className="page-header">
          <h1 className="page-title">❤️ Mis Favoritos</h1>
          <p className="page-subtitle">
            {favoritos.length > 0
              ? `Tienes ${favoritos.length} propiedad${favoritos.length !== 1 ? 'es' : ''} guardada${favoritos.length !== 1 ? 's' : ''}`
              : 'Aún no tienes propiedades guardadas'}
          </p>
        </div>

        {cargando ? (
          <div className="loading-state"><div className="spinner"></div><p>Cargando favoritos...</p></div>
        ) : favoritos.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🤍</div>
            <h3>Sin favoritos</h3>
            <p>Explora las propiedades y guarda las que más te gusten.</p>
            <Link to="/propiedades" className="btn btn-primary">Ver propiedades</Link>
          </div>
        ) : (
          <div className="property-grid">
            {favoritos.map((propiedad) => (
              <PropertyCard
                key={propiedad.favorito_id || propiedad.id}
                propiedad={propiedad}
                esFavorito={true}
                onFavorito={() => handleEliminar(propiedad.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Favoritos;
