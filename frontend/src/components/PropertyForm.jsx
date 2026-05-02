// ============================================================
// COMPONENTE: PropertyForm
// Formulario reutilizable para crear y editar propiedades
// Props: initialData, onSubmit, isEditing, cargando
// ============================================================

import { useState, useEffect } from 'react';
import Input from './Input';
import Button from './Button';

const camposVacios = {
  titulo: '',
  descripcion: '',
  tipo: '',
  ciudad: '',
  sector: '',
  precio: '',
  area: '',
  habitaciones: '',
  banos: '',
  parqueaderos: '',
  imagen: '',
  estado: 'disponible',
};

const PropertyForm = ({ initialData = {}, onSubmit, isEditing = false, cargando = false }) => {
  const [form, setForm] = useState({ ...camposVacios, ...initialData });
  const [errores, setErrores] = useState({});

  // Sincronizar datos cuando initialData cambia (modo editar)
  useEffect(() => {
    if (initialData && Object.keys(initialData).length > 0) {
      setForm({ ...camposVacios, ...initialData });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    // Limpiar error del campo al escribir
    if (errores[name]) setErrores((prev) => ({ ...prev, [name]: '' }));
  };

  const validar = () => {
    const nuevosErrores = {};
    if (!form.titulo.trim()) nuevosErrores.titulo = 'El título es obligatorio';
    if (!form.tipo) nuevosErrores.tipo = 'El tipo es obligatorio';
    if (!form.ciudad.trim()) nuevosErrores.ciudad = 'La ciudad es obligatoria';
    if (!form.precio || Number(form.precio) <= 0) nuevosErrores.precio = 'El precio debe ser mayor a 0';
    return nuevosErrores;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const erroresValidacion = validar();
    if (Object.keys(erroresValidacion).length > 0) {
      setErrores(erroresValidacion);
      return;
    }
    onSubmit(form);
  };

  return (
    <form className="property-form" onSubmit={handleSubmit}>
      <div className="form-grid">
        <Input
          label="Título de la propiedad"
          name="titulo"
          value={form.titulo}
          onChange={handleChange}
          placeholder="Ej: Apartamento moderno en Chapinero"
          error={errores.titulo}
          required
        />

        <div className="form-group">
          <label className="form-label">Tipo <span className="required">*</span></label>
          <select name="tipo" value={form.tipo} onChange={handleChange} className={`form-input ${errores.tipo ? 'input-error' : ''}`}>
            <option value="">Seleccionar tipo</option>
            <option value="Apartamento">Apartamento</option>
            <option value="Casa">Casa</option>
            <option value="Local Comercial">Local Comercial</option>
            <option value="Oficina">Oficina</option>
            <option value="Finca">Finca</option>
            <option value="Apartaestudio">Apartaestudio</option>
          </select>
          {errores.tipo && <span className="error-msg">{errores.tipo}</span>}
        </div>

        <Input
          label="Ciudad"
          name="ciudad"
          value={form.ciudad}
          onChange={handleChange}
          placeholder="Ej: Bogotá"
          error={errores.ciudad}
          required
        />

        <Input
          label="Sector / Barrio"
          name="sector"
          value={form.sector}
          onChange={handleChange}
          placeholder="Ej: Chapinero"
        />

        <Input
          label="Precio (COP)"
          name="precio"
          type="number"
          value={form.precio}
          onChange={handleChange}
          placeholder="Ej: 350000000"
          error={errores.precio}
          required
        />

        <Input
          label="Área (m²)"
          name="area"
          type="number"
          value={form.area}
          onChange={handleChange}
          placeholder="Ej: 85"
        />

        <Input
          label="Habitaciones"
          name="habitaciones"
          type="number"
          value={form.habitaciones}
          onChange={handleChange}
          placeholder="0"
        />

        <Input
          label="Baños"
          name="banos"
          type="number"
          value={form.banos}
          onChange={handleChange}
          placeholder="0"
        />

        <Input
          label="Parqueaderos"
          name="parqueaderos"
          type="number"
          value={form.parqueaderos}
          onChange={handleChange}
          placeholder="0"
        />

        <div className="form-group">
          <label className="form-label">Estado</label>
          <select name="estado" value={form.estado} onChange={handleChange} className="form-input">
            <option value="disponible">Disponible</option>
            <option value="vendido">Vendido</option>
            <option value="arriendo">En arriendo</option>
          </select>
        </div>
      </div>

      <Input
        label="URL de imagen"
        name="imagen"
        value={form.imagen}
        onChange={handleChange}
        placeholder="https://ejemplo.com/imagen.jpg"
      />

      <div className="form-group">
        <label className="form-label">Descripción</label>
        <textarea
          name="descripcion"
          value={form.descripcion}
          onChange={handleChange}
          placeholder="Describe la propiedad..."
          className="form-input form-textarea"
          rows={4}
        />
      </div>

      <div className="form-submit">
        <Button type="submit" variant="primary" fullWidth disabled={cargando}>
          {cargando ? 'Guardando...' : isEditing ? '💾 Actualizar propiedad' : '➕ Crear propiedad'}
        </Button>
      </div>
    </form>
  );
};

export default PropertyForm;
