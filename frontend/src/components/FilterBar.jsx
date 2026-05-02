// ============================================================
// COMPONENTE: FilterBar
// Filtros por tipo, ciudad, sector, estado y precio
// Props: onFilter, onReset
// ============================================================

import { useState } from 'react';
import Button from './Button';

const FilterBar = ({ onFilter, onReset }) => {
  const [filtros, setFiltros] = useState({
    tipo: '',
    ciudad: '',
    sector: '',
    estado: '',
    precio_min: '',
    precio_max: '',
  });

  const handleChange = (e) => {
    setFiltros((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Eliminar campos vacíos antes de enviar
    const filtrosActivos = Object.fromEntries(
      Object.entries(filtros).filter(([, v]) => v !== '')
    );
    onFilter(filtrosActivos);
  };

  const handleReset = () => {
    setFiltros({ tipo: '', ciudad: '', sector: '', estado: '', precio_min: '', precio_max: '' });
    onReset();
  };

  return (
    <form className="filter-bar" onSubmit={handleSubmit}>
      <div className="filter-grid">
        <select name="tipo" value={filtros.tipo} onChange={handleChange} className="filter-select">
          <option value="">Todos los tipos</option>
          <option value="Apartamento">Apartamento</option>
          <option value="Casa">Casa</option>
          <option value="Local Comercial">Local Comercial</option>
          <option value="Oficina">Oficina</option>
          <option value="Finca">Finca</option>
          <option value="Apartaestudio">Apartaestudio</option>
        </select>

        <input
          type="text"
          name="ciudad"
          value={filtros.ciudad}
          onChange={handleChange}
          placeholder="Ciudad"
          className="filter-input"
        />

        <input
          type="text"
          name="sector"
          value={filtros.sector}
          onChange={handleChange}
          placeholder="Sector / Barrio"
          className="filter-input"
        />

        <select name="estado" value={filtros.estado} onChange={handleChange} className="filter-select">
          <option value="">Todos los estados</option>
          <option value="disponible">Disponible</option>
          <option value="vendido">Vendido</option>
          <option value="arriendo">En arriendo</option>
        </select>

        <input
          type="number"
          name="precio_min"
          value={filtros.precio_min}
          onChange={handleChange}
          placeholder="Precio mínimo"
          className="filter-input"
          min="0"
        />

        <input
          type="number"
          name="precio_max"
          value={filtros.precio_max}
          onChange={handleChange}
          placeholder="Precio máximo"
          className="filter-input"
          min="0"
        />
      </div>

      <div className="filter-actions">
        <Button type="submit" variant="primary">Aplicar filtros</Button>
        <Button type="button" variant="outline" onClick={handleReset}>Limpiar</Button>
      </div>
    </form>
  );
};

export default FilterBar;
