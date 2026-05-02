// ============================================================
// SERVICIO DE FAVORITOS
// Gestión de propiedades favoritas por usuario
// ============================================================

import { API_URL } from './api';

const BASE = `${API_URL}/favoritos`;

/** Obtener favoritos de un usuario */
export const getFavorites = async (usuario_id) => {
  const res = await fetch(`${BASE}/listar.php?usuario_id=${usuario_id}`);
  return res.json();
};

/** Agregar propiedad a favoritos */
export const addFavorite = async (usuario_id, propiedad_id) => {
  const res = await fetch(`${BASE}/crear.php`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ usuario_id, propiedad_id }),
  });
  return res.json();
};

/** Eliminar propiedad de favoritos */
export const removeFavorite = async (usuario_id, propiedad_id) => {
  const res = await fetch(
    `${BASE}/eliminar.php?usuario_id=${usuario_id}&propiedad_id=${propiedad_id}`,
    { method: 'DELETE' }
  );
  return res.json();
};
