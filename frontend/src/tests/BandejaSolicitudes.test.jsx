// ============================================================
// TESTS: BandejaSolicitudes — componente de bandeja del asesor
// ============================================================
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import BandejaSolicitudes from '../pages/BandejaSolicitudes';
import { AuthContext } from '../context/AuthContext';
import * as solicitudService from '../services/solicitudService';

// ── Mock del servicio ─────────────────────────────────────────
vi.mock('../services/solicitudService');

const usuarioAdmin = { id: 1, nombre: 'Admin', correo: 'admin@test.com', rol: 'admin' };

const solicitudesMock = [
  {
    id: 1,
    nombre_cliente: 'Juan Pérez',
    correo_cliente: 'juan@test.com',
    telefono: '3001111111',
    mensaje: 'Estoy interesado',
    estado: 'sin_leer',
    titulo_propiedad: 'Casa en El Poblado',
    ciudad: 'Medellín',
    imagen: '',
    fecha_envio: new Date().toISOString(),
  },
  {
    id: 2,
    nombre_cliente: 'Ana López',
    correo_cliente: 'ana@test.com',
    telefono: '3002222222',
    mensaje: 'Quiero una cita',
    estado: 'pendiente',
    titulo_propiedad: 'Apartamento Chapinero',
    ciudad: 'Bogotá',
    imagen: '',
    fecha_envio: new Date().toISOString(),
  },
];

const renderBandeja = () => {
  return render(
    <MemoryRouter>
      <AuthContext.Provider value={{ usuario: usuarioAdmin }}>
        <BandejaSolicitudes />
      </AuthContext.Provider>
    </MemoryRouter>
  );
};

describe('BandejaSolicitudes', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    solicitudService.listarSolicitudes.mockResolvedValue({
      success: true,
      solicitudes: solicitudesMock,
      total: solicitudesMock.length,
    });
    solicitudService.actualizarEstadoSolicitud.mockResolvedValue({ success: true });
    solicitudService.eliminarSolicitud.mockResolvedValue({ success: true });
  });

  it('renderiza el título de la bandeja', async () => {
    renderBandeja();
    expect(await screen.findByText(/Bandeja de solicitudes/i)).toBeInTheDocument();
  });

  it('muestra las solicitudes cargadas', async () => {
    renderBandeja();
    expect(await screen.findByText('Juan Pérez')).toBeInTheDocument();
    expect(await screen.findByText('Ana López')).toBeInTheDocument();
  });

  it('muestra el contador de sin leer correctamente', async () => {
    renderBandeja();
    // El stat de "Sin leer" debería mostrar 1
    await waitFor(() => {
      const nums = screen.getAllByText('1');
      expect(nums.length).toBeGreaterThan(0);
    });
  });

  it('abre el detalle al hacer clic en una solicitud', async () => {
    solicitudService.actualizarEstadoSolicitud.mockResolvedValue({ success: true });
    renderBandeja();

    const item = await screen.findByTestId('solicitud-item-1');
    fireEvent.click(item);

    await waitFor(() => {
      expect(screen.getByTestId('solicitud-detalle')).toBeInTheDocument();
    });
    // Tras abrir el detalle hay más de un elemento con el nombre — verificamos el detalle
    expect(screen.getByRole('heading', { name: /Juan Pérez/i })).toBeInTheDocument();
  });

  it('permite cambiar el estado de una solicitud', async () => {
    renderBandeja();

    const item = await screen.findByTestId('solicitud-item-2');
    fireEvent.click(item);

    const btnEjecutada = await screen.findByTestId('cambiar-estado-ejecutada');
    fireEvent.click(btnEjecutada);

    await waitFor(() => {
      expect(solicitudService.actualizarEstadoSolicitud).toHaveBeenCalledWith(2, 'ejecutada');
    });
  });

  it('filtra solicitudes por estado al hacer clic en el botón de filtro', async () => {
    renderBandeja();
    // Esperar carga inicial
    await screen.findByText('Juan Pérez');

    // El botón "Todas" debe estar activo inicialmente
    const btnTodas = screen.getByTestId('filtro-todas');
    expect(btnTodas).toHaveClass('filtro-btn--activo');

    // Clic en el botón "Sin leer" usando testid
    const btnSinLeer = screen.getByTestId('filtro-sin_leer');
    fireEvent.click(btnSinLeer);

    // Verificar que el botón "Sin leer" se activa (cambio visual de estado)
    await waitFor(() => {
      expect(btnSinLeer).toHaveClass('filtro-btn--activo');
    });
  });
});
