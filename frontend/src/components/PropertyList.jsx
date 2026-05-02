// ============================================================
// COMPONENTE: PropertyList
// Lista propiedades y pasa datos a PropertyCard por PROPS
// Props: propiedades, onEditar, onEliminar, onFavorito, favoritosIds, mostrarAcciones
// ============================================================

import PropertyCard from './PropertyCard';

const PropertyList = ({
  propiedades = [],
  onEditar,
  onEliminar,
  onFavorito,
  favoritosIds = [],
  mostrarAcciones = false,
}) => {
  if (propiedades.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">🏠</div>
        <h3>No se encontraron propiedades</h3>
        <p>Intenta cambiar los filtros o realiza una nueva búsqueda.</p>
      </div>
    );
  }

  return (
    <div className="property-grid">
      {propiedades.map((propiedad) => (
        // Pasamos datos e información a PropertyCard como PROPS
        <PropertyCard
          key={propiedad.id}
          propiedad={propiedad}
          onEditar={onEditar}
          onEliminar={onEliminar}
          onFavorito={onFavorito}
          esFavorito={favoritosIds.includes(String(propiedad.id))}
          mostrarAcciones={mostrarAcciones}
        />
      ))}
    </div>
  );
};

export default PropertyList;
