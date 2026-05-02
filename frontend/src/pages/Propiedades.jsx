// ============================================================
// PÁGINA: Propiedades
// Listado con búsqueda y filtros
// ============================================================

import { useEffect } from 'react';
import { useProperty } from '../hooks/useProperty';
import { useFavorite } from '../hooks/useFavorite';
import { useAuth } from '../hooks/useAuth';
import PropertyList from '../components/PropertyList';
import SearchBar from '../components/SearchBar';
import FilterBar from '../components/FilterBar';

const Propiedades = () => {
  const { propiedades, cargarPropiedades, buscarPropiedades, filtrarPropiedades, cargando, error } = useProperty();
  const { agregarFavorito, eliminarFavorito, esFavorito, favoritos } = useFavorite();
  const { usuario } = useAuth();

  useEffect(() => {
    cargarPropiedades();
  }, []);

  const favoritosIds = favoritos.map((f) => String(f.id));

  const handleSearch = (query) => {
    if (!query.trim()) cargarPropiedades();
    else buscarPropiedades(query);
  };

  const handleFilter = (filtros) => filtrarPropiedades(filtros);

  const handleReset = () => cargarPropiedades();

  const handleFavorito = async (id) => {
    if (!usuario) return;
    if (esFavorito(id)) await eliminarFavorito(id);
    else await agregarFavorito(id);
  };

  return (
    <div className="propiedades-page">
      <div className="page-container">
        {/* Encabezado */}
        <div className="page-header">
          <h1 className="page-title">🏘️ Propiedades</h1>
          <p className="page-subtitle">Explora nuestra selección de propiedades disponibles</p>
        </div>

        {/* Búsqueda */}
        <SearchBar onSearch={handleSearch} />

        {/* Filtros */}
        <FilterBar onFilter={handleFilter} onReset={handleReset} />

        {/* Resultados */}
        <div className="results-info">
          <p>{propiedades.length} propiedad{propiedades.length !== 1 ? 'es' : ''} encontrada{propiedades.length !== 1 ? 's' : ''}</p>
        </div>

        {error && <div className="alert alert-error section-alert">{error}</div>}

        {cargando ? (
          <div className="loading-state"><div className="spinner"></div><p>Buscando propiedades...</p></div>
        ) : (
          <PropertyList
            propiedades={propiedades}
            onFavorito={usuario ? handleFavorito : null}
            favoritosIds={favoritosIds}
          />
        )}
      </div>
    </div>
  );
};

export default Propiedades;
