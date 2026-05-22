// ============================================================
// SERVICIO: solicitudService
// Gestión de solicitudes de interés — cliente → asesor
// Con fallback a mock cuando el backend no está disponible
// ============================================================

import { API_URL } from './api';
import { demoUsers } from '../data/mockProperties';

// ── Mock local (se usa cuando el backend no responde) ─────────────
let mockSolicitudes = [];
let mockNextId = 1;

const mockCrear = (datos) => {
  const asesor = demoUsers.find((u) => u.id === datos.asesor_id) || null;
  const nueva = {
    ...datos,
    id: mockNextId++,
    estado: 'sin_leer',
    fecha_envio: new Date().toISOString(),
    titulo_propiedad: datos.titulo_propiedad || 'Consulta general',
    nombre_asesor: asesor ? asesor.nombre : null,
  };
  mockSolicitudes.push(nueva);
  return { success: true, message: 'Solicitud enviada (demo)', id: nueva.id, source: 'mock' };
};

const mockListar = (estado, asesor_id) => {
  let lista = [...mockSolicitudes];
  if (estado) lista = lista.filter((s) => s.estado === estado);
  if (asesor_id) lista = lista.filter((s) => s.asesor_id === asesor_id);
  return { success: true, solicitudes: lista, total: lista.length, source: 'mock' };
};

const mockActualizar = (id, estado) => {
  const s = mockSolicitudes.find((s) => s.id === id);
  if (!s) return { success: false, message: 'No encontrada' };
  s.estado = estado;
  return { success: true, message: 'Estado actualizado (demo)', source: 'mock' };
};

const mockEliminar = (id) => {
  mockSolicitudes = mockSolicitudes.filter((s) => s.id !== id);
  return { success: true, message: 'Eliminada (demo)', source: 'mock' };
};

// ── Helpers ───────────────────────────────────────────────────────
const BASE = `${API_URL}/solicitudes`;

// ── API pública ───────────────────────────────────────────────────

/**
 * Enviar solicitud de interés en una propiedad (o contacto general)
 * @param {{ propiedad_id?, cliente_id?, nombre_cliente, correo_cliente, telefono, mensaje, asesor_id? }} datos
 */
export const crearSolicitud = async (datos) => {
  try {
    const res = await fetch(`${BASE}/crear.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(datos),
    });
    return await res.json();
  } catch {
    return mockCrear(datos);
  }
};

/**
 * Obtener lista de solicitudes (asesor/admin)
 * @param {string} [estado]     - filtro: sin_leer | pendiente | ejecutada
 * @param {number} [asesor_id]  - si se pasa, filtra por asesor asignado
 */
export const listarSolicitudes = async (estado = '', asesor_id = 0) => {
  try {
    const params = new URLSearchParams();
    if (estado)    params.set('estado',    estado);
    if (asesor_id) params.set('asesor_id', asesor_id);
    const query = params.toString() ? `?${params}` : '';
    const res = await fetch(`${BASE}/listar.php${query}`);
    return await res.json();
  } catch {
    return mockListar(estado, asesor_id || 0);
  }
};

/**
 * Obtener lista de asesores y admins disponibles para asignar solicitudes
 */
export const listarAsesores = async () => {
  try {
    const [resAsesores, resAdmins] = await Promise.all([
      fetch(`${API_URL}/usuarios/listar.php?rol=asesor`),
      fetch(`${API_URL}/usuarios/listar.php?rol=admin`),
    ]);
    const [dataAsesores, dataAdmins] = await Promise.all([
      resAsesores.json(),
      resAdmins.json(),
    ]);
    const asesores = dataAsesores.success ? dataAsesores.usuarios : [];
    const admins   = dataAdmins.success   ? dataAdmins.usuarios   : [];
    return { success: true, asesores: [...asesores, ...admins] };
  } catch {
    const asesores = demoUsers.filter((u) => u.rol === 'asesor' || u.rol === 'admin');
    return { success: true, asesores, source: 'mock' };
  }
};

/**
 * Cambiar estado de una solicitud
 * @param {number} id
 * @param {'sin_leer'|'pendiente'|'ejecutada'} estado
 */
export const actualizarEstadoSolicitud = async (id, estado) => {
  try {
    const res = await fetch(`${BASE}/actualizar_estado.php`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, estado }),
    });
    return await res.json();
  } catch {
    return mockActualizar(id, estado);
  }
};

/**
 * Eliminar una solicitud
 * @param {number} id
 */
export const eliminarSolicitud = async (id) => {
  try {
    const res = await fetch(`${BASE}/eliminar.php`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    return await res.json();
  } catch {
    return mockEliminar(id);
  }
};
