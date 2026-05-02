// ============================================================
// SERVICIO DE PROPIEDADES
// CRUD completo usando fetch + async/await + promesas
// ============================================================

import { API_URL } from './api';
import { mockProperties } from '../data/mockProperties';

const BASE = `${API_URL}/propiedades`;

const buildSuccess = (payload) => ({ success: true, ...payload, source: 'mock' });

const normalizeText = (value) =>
  String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();

const requestJson = async (url, options) => {
  const res = await fetch(url, options);
  const raw = await res.text();

  let data;
  try {
    data = raw ? JSON.parse(raw) : {};
  } catch {
    throw new Error('La API respondió con un formato inválido. Verifica XAMPP y PHP.');
  }

  if (!res.ok || data.success === false) {
    throw new Error(data.message || 'No se pudo completar la operación con el servidor.');
  }

  return data;
};

/** Listar todas las propiedades */
export const getProperties = async () => {
  try {
    return await requestJson(`${BASE}/listar.php`);
  } catch {
    return buildSuccess({ propiedades: mockProperties });
  }
};

/** Obtener propiedad por ID */
export const getPropertyById = async (id) => {
  try {
    return await requestJson(`${BASE}/obtener.php?id=${id}`);
  } catch {
    const propiedad = mockProperties.find((item) => String(item.id) === String(id));
    if (!propiedad) {
      throw new Error('No se encontro la propiedad solicitada.');
    }

    return buildSuccess({ propiedad });
  }
};

/** Crear nueva propiedad */
export const createProperty = async (propertyData) => {
  return requestJson(`${BASE}/crear.php`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(propertyData),
  });
};

/** Actualizar propiedad existente */
export const updateProperty = async (propertyData) => {
  return requestJson(`${BASE}/actualizar.php`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(propertyData),
  });
};

/** Eliminar propiedad por ID */
export const deleteProperty = async (id) => {
  return requestJson(`${BASE}/eliminar.php?id=${id}`, {
    method: 'DELETE',
  });
};

/** Buscar propiedades por texto */
export const searchProperties = async (query) => {
  try {
    return await requestJson(`${BASE}/buscar.php?q=${encodeURIComponent(query)}`);
  } catch {
    const normalizedQuery = normalizeText(query);
    const propiedades = mockProperties.filter((item) => {
      const hayMatch = [item.titulo, item.ciudad, item.sector].some((field) =>
        normalizeText(field).includes(normalizedQuery)
      );
      return hayMatch;
    });

    return buildSuccess({ propiedades });
  }
};

/** Filtrar propiedades */
export const filterProperties = async (filters) => {
  const params = new URLSearchParams(filters).toString();
  try {
    return await requestJson(`${BASE}/filtrar.php?${params}`);
  } catch {
    const propiedades = mockProperties.filter((item) => {
      const matchesTipo = !filters.tipo || item.tipo === filters.tipo;
      const matchesCiudad = !filters.ciudad || normalizeText(item.ciudad).includes(normalizeText(filters.ciudad));
      const matchesSector = !filters.sector || normalizeText(item.sector).includes(normalizeText(filters.sector));
      const matchesEstado = !filters.estado || item.estado === filters.estado;
      const matchesPrecioMin = !filters.precio_min || Number(item.precio) >= Number(filters.precio_min);
      const matchesPrecioMax = !filters.precio_max || Number(item.precio) <= Number(filters.precio_max);

      return matchesTipo && matchesCiudad && matchesSector && matchesEstado && matchesPrecioMin && matchesPrecioMax;
    });

    return buildSuccess({ propiedades });
  }
};
