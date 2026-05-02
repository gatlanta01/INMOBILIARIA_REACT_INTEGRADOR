// @refresh reset
// ============================================================
// CONTEXT: FavoriteContext
// Gestión de favoritos por usuario autenticado
// ============================================================

import { createContext, useContext, useState, useEffect } from 'react';
import { getFavorites, addFavorite, removeFavorite } from '../services/favoriteService';
import { useAuth } from '../hooks/useAuth';

export const FavoriteContext = createContext();

export const FavoriteProvider = ({ children }) => {
  const { usuario } = useAuth();
  const [favoritos, setFavoritos] = useState([]);
  const [cargando, setCargando] = useState(false);

  // Cargar favoritos cuando haya usuario autenticado
  useEffect(() => {
    if (usuario?.id) {
      cargarFavoritos();
    } else {
      setFavoritos([]);
    }
  }, [usuario]);

  /** Cargar favoritos del usuario actual */
  const cargarFavoritos = async () => {
    if (!usuario?.id) return;
    setCargando(true);
    try {
      const data = await getFavorites(usuario.id);
      if (data.success) setFavoritos(data.favoritos);
    } catch {
      console.error('Error al cargar favoritos');
    } finally {
      setCargando(false);
    }
  };

  /** Agregar propiedad a favoritos */
  const agregarFavorito = async (propiedad_id) => {
    if (!usuario?.id) return { success: false, message: 'Debes iniciar sesión' };
    const data = await addFavorite(usuario.id, propiedad_id);
    if (data.success) await cargarFavoritos();
    return data;
  };

  /** Eliminar propiedad de favoritos */
  const eliminarFavorito = async (propiedad_id) => {
    if (!usuario?.id) return;
    const data = await removeFavorite(usuario.id, propiedad_id);
    if (data.success) {
      setFavoritos((prev) => prev.filter((f) => f.id !== propiedad_id && f.favorito_id !== propiedad_id));
      await cargarFavoritos();
    }
    return data;
  };

  /** Verificar si una propiedad está en favoritos */
  const esFavorito = (propiedad_id) => {
    return favoritos.some((f) => String(f.id) === String(propiedad_id));
  };

  return (
    <FavoriteContext.Provider
      value={{ favoritos, cargando, cargarFavoritos, agregarFavorito, eliminarFavorito, esFavorito }}
    >
      {children}
    </FavoriteContext.Provider>
  );
};


