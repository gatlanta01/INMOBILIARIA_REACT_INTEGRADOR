// ============================================================
// TESTS: solicitudService
// Pruebas unitarias del servicio de solicitudes con mock fetch
// ============================================================
import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  crearSolicitud,
  listarSolicitudes,
  actualizarEstadoSolicitud,
  eliminarSolicitud,
} from '../services/solicitudService';

// ── Helper: mockear fetch global ─────────────────────────────
const mockFetch = (data, ok = true) => {
  global.fetch = vi.fn().mockResolvedValue({
    ok,
    json: () => Promise.resolve(data),
  });
};

describe('solicitudService', () => {
  beforeEach(() => { vi.resetAllMocks(); });

  // ── crearSolicitud ────────────────────────────────────────
  describe('crearSolicitud', () => {
    it('retorna éxito cuando el backend responde correctamente', async () => {
      mockFetch({ success: true, id: 1, message: 'Solicitud creada' });

      const res = await crearSolicitud({
        propiedad_id: 1,
        cliente_id: 2,
        nombre_cliente: 'Juan Pérez',
        correo_cliente: 'juan@test.com',
        telefono: '3001234567',
        mensaje: 'Me interesa la propiedad',
      });

      expect(res.success).toBe(true);
      expect(fetch).toHaveBeenCalledOnce();
    });

    it('usa el fallback mock cuando fetch falla', async () => {
      global.fetch = vi.fn().mockRejectedValue(new Error('Network error'));

      const res = await crearSolicitud({
        propiedad_id: 1,
        cliente_id: 2,
        nombre_cliente: 'Ana López',
        correo_cliente: 'ana@test.com',
      });

      expect(res.success).toBe(true);
      expect(res.source).toBe('mock');
    });
  });

  // ── listarSolicitudes ─────────────────────────────────────
  describe('listarSolicitudes', () => {
    it('devuelve lista de solicitudes del backend', async () => {
      const solicitudesMock = [
        { id: 1, nombre_cliente: 'Juan', estado: 'sin_leer' },
        { id: 2, nombre_cliente: 'Ana',  estado: 'pendiente' },
      ];
      mockFetch({ success: true, solicitudes: solicitudesMock, total: 2 });

      const res = await listarSolicitudes();

      expect(res.success).toBe(true);
      expect(res.solicitudes).toHaveLength(2);
    });

    it('filtra por estado cuando se pasa parámetro', async () => {
      mockFetch({ success: true, solicitudes: [{ id: 1, estado: 'sin_leer' }], total: 1 });

      await listarSolicitudes('sin_leer');

      expect(fetch).toHaveBeenCalledWith(expect.stringContaining('estado=sin_leer'));
    });

    it('usa mock cuando el backend no está disponible', async () => {
      global.fetch = vi.fn().mockRejectedValue(new Error('offline'));

      const res = await listarSolicitudes();

      expect(res.success).toBe(true);
      expect(Array.isArray(res.solicitudes)).toBe(true);
    });
  });

  // ── actualizarEstadoSolicitud ─────────────────────────────
  describe('actualizarEstadoSolicitud', () => {
    it('actualiza el estado correctamente', async () => {
      mockFetch({ success: true, message: 'Estado actualizado' });

      const res = await actualizarEstadoSolicitud(1, 'pendiente');

      expect(res.success).toBe(true);
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('actualizar_estado.php'),
        expect.objectContaining({ method: 'PUT' })
      );
    });

    it('usa mock en caso de error de red', async () => {
      global.fetch = vi.fn().mockRejectedValue(new Error('timeout'));

      const res = await actualizarEstadoSolicitud(999, 'ejecutada');

      // El mock retorna not-found para IDs que no existen en el mock store
      expect(typeof res.success).toBe('boolean');
    });
  });

  // ── eliminarSolicitud ─────────────────────────────────────
  describe('eliminarSolicitud', () => {
    it('elimina una solicitud correctamente', async () => {
      mockFetch({ success: true, message: 'Solicitud eliminada' });

      const res = await eliminarSolicitud(1);

      expect(res.success).toBe(true);
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('eliminar.php'),
        expect.objectContaining({ method: 'DELETE' })
      );
    });

    it('usa mock cuando hay error de red', async () => {
      global.fetch = vi.fn().mockRejectedValue(new Error('Network error'));

      const res = await eliminarSolicitud(5);

      expect(res.success).toBe(true);
      expect(res.source).toBe('mock');
    });
  });
});
