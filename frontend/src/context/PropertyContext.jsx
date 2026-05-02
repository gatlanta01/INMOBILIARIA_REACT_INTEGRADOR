// @refresh reset
// ============================================================
// CONTEXT: PropertyContext
// CRUD completo de propiedades, búsqueda y filtros
// ============================================================

import { createContext, useContext, useState, useEffect } from 'react';
import {
  getProperties,
  getPropertyById,
  createProperty,
  updateProperty,
  deleteProperty,
  searchProperties,
  filterProperties,
} from '../services/propertyService';

export const PropertyContext = createContext();

export const PropertyProvider = ({ children }) => {
  const [propiedades, setPropiedades] = useState([]);
  const [propiedadActual, setPropiedadActual] = useState(null);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);

  // Cargar propiedades al montar el contexto
  useEffect(() => {
    cargarPropiedades();
  }, []);

  /** Cargar listado completo */
  const cargarPropiedades = async () => {
    setCargando(true);
    setError(null);
    try {
      const data = await getProperties();
      setPropiedades(data.propiedades || []);
      return data;
    } catch (err) {
      setPropiedades([]);
      setError(err.message || 'Error al cargar propiedades');
      return { success: false, message: err.message };
    } finally {
      setCargando(false);
    }
  };

  /** Obtener propiedad por ID */
  const obtenerPropiedad = async (id) => {
    setCargando(true);
    setError(null);
    try {
      const data = await getPropertyById(id);
      setPropiedadActual(data.propiedad || null);
      return data;
    } catch (err) {
      setPropiedadActual(null);
      setError(err.message || 'Error al obtener propiedad');
      return { success: false, message: err.message };
    } finally {
      setCargando(false);
    }
  };

  /** Crear propiedad */
  const crearPropiedad = async (propertyData) => {
    setError(null);
    try {
      const data = await createProperty(propertyData);
      await cargarPropiedades();
      return data;
    } catch (err) {
      setError(err.message || 'Error al crear propiedad');
      return { success: false, message: err.message };
    }
  };

  /** Editar propiedad */
  const editarPropiedad = async (propertyData) => {
    setError(null);
    try {
      const data = await updateProperty(propertyData);
      await cargarPropiedades();
      return data;
    } catch (err) {
      setError(err.message || 'Error al actualizar propiedad');
      return { success: false, message: err.message };
    }
  };

  /** Eliminar propiedad */
  const eliminarPropiedad = async (id) => {
    setError(null);
    try {
      const data = await deleteProperty(id);
      setPropiedades((prev) => prev.filter((p) => p.id !== id));
      return data;
    } catch (err) {
      setError(err.message || 'Error al eliminar propiedad');
      return { success: false, message: err.message };
    }
  };

  /** Buscar propiedades */
  const buscarPropiedades = async (query) => {
    setCargando(true);
    setError(null);
    try {
      const data = await searchProperties(query);
      setPropiedades(data.propiedades || []);
      return data;
    } catch (err) {
      setPropiedades([]);
      setError(err.message || 'Error al buscar propiedades');
      return { success: false, message: err.message };
    } finally {
      setCargando(false);
    }
  };

  /** Filtrar propiedades */
  const filtrarPropiedades = async (filters) => {
    setCargando(true);
    setError(null);
    try {
      const data = await filterProperties(filters);
      setPropiedades(data.propiedades || []);
      return data;
    } catch (err) {
      setPropiedades([]);
      setError(err.message || 'Error al filtrar propiedades');
      return { success: false, message: err.message };
    } finally {
      setCargando(false);
    }
  };

  return (
    <PropertyContext.Provider
      value={{
        propiedades,
        propiedadActual,
        cargando,
        error,
        cargarPropiedades,
        obtenerPropiedad,
        crearPropiedad,
        editarPropiedad,
        eliminarPropiedad,
        buscarPropiedades,
        filtrarPropiedades,
      }}
    >
      {children}
    </PropertyContext.Provider>
  );
};


