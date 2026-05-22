// ============================================================
// TESTS: Formulario de solicitud de interés en DetallePropiedad
// ============================================================
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import DetallePropiedad from '../pages/DetallePropiedad';
import { AuthContext } from '../context/AuthContext';
import * as solicitudService from '../services/solicitudService';
import * as propertyHook from '../hooks/useProperty';
import * as favoriteHook from '../hooks/useFavorite';

vi.mock('../services/solicitudService');
vi.mock('../hooks/useProperty');
vi.mock('../hooks/useFavorite');

const propiedadMock = {
  id: 1,
  titulo: 'Apartamento en Chapinero',
  descripcion: 'Hermoso apartamento',
  tipo: 'Apartamento',
  ciudad: 'Bogotá',
  sector: 'Chapinero',
  precio: 350000000,
  area: 80,
  habitaciones: 3,
  banos: 2,
  parqueaderos: 1,
  imagen: '',
  estado: 'disponible',
  nombre_usuario: 'Admin',
};

const usuarioCliente = { id: 2, nombre: 'Cliente Demo', correo: 'cliente@test.com', rol: 'cliente' };

const renderDetalle = (usuario = usuarioCliente) =>
  render(
    <MemoryRouter initialEntries={['/propiedades/1']}>
      <AuthContext.Provider value={{ usuario }}>
        <Routes>
          <Route path="/propiedades/:id" element={<DetallePropiedad />} />
        </Routes>
      </AuthContext.Provider>
    </MemoryRouter>
  );

describe('DetallePropiedad — Formulario de solicitud', () => {
  beforeEach(() => {
    vi.resetAllMocks();

    propertyHook.useProperty.mockReturnValue({
      propiedadActual: propiedadMock,
      obtenerPropiedad: vi.fn(),
      cargando: false,
      error: null,
    });

    favoriteHook.useFavorite.mockReturnValue({
      agregarFavorito: vi.fn(),
      eliminarFavorito: vi.fn(),
      esFavorito: vi.fn().mockReturnValue(false),
    });

    solicitudService.crearSolicitud.mockResolvedValue({ success: true, message: 'Solicitud enviada' });
  });

  it('muestra el botón "Me interesa" para clientes', () => {
    renderDetalle();
    expect(screen.getByText(/Me interesa esta propiedad/i)).toBeInTheDocument();
  });

  it('no muestra el botón "Me interesa" para admin', () => {
    renderDetalle({ id: 1, nombre: 'Admin', correo: 'admin@test.com', rol: 'admin' });
    expect(screen.queryByText(/Me interesa esta propiedad/i)).not.toBeInTheDocument();
  });

  it('muestra el formulario al hacer clic en "Me interesa"', () => {
    renderDetalle();
    fireEvent.click(screen.getByText(/Me interesa esta propiedad/i));
    expect(screen.getByTestId('solicitud-form')).toBeInTheDocument();
  });

  it('envía la solicitud con los datos correctos', async () => {
    renderDetalle();
    fireEvent.click(screen.getByText(/Me interesa esta propiedad/i));

    fireEvent.change(screen.getByLabelText(/Teléfono/i), {
      target: { value: '3001234567' },
    });
    fireEvent.change(screen.getByLabelText(/Mensaje/i), {
      target: { value: 'Estoy muy interesado' },
    });

    // El botón de submit tiene role=button dentro del form
    fireEvent.click(screen.getByRole('button', { name: /Enviar solicitud/i }));

    await waitFor(() => {
      expect(solicitudService.crearSolicitud).toHaveBeenCalledWith(
        expect.objectContaining({
          propiedad_id: 1,
          cliente_id: 2,
          correo_cliente: 'cliente@test.com',
          telefono: '3001234567',
          mensaje: 'Estoy muy interesado',
        })
      );
    });
  });

  it('muestra mensaje de éxito tras envío correcto', async () => {
    renderDetalle();
    fireEvent.click(screen.getByText(/Me interesa esta propiedad/i));
    fireEvent.click(screen.getByRole('button', { name: /Enviar solicitud/i }));

    await waitFor(() => {
      expect(screen.getByText(/Solicitud enviada/i)).toBeInTheDocument();
    });
  });

  it('muestra mensaje de error cuando falla el envío', async () => {
    solicitudService.crearSolicitud.mockResolvedValue({ success: false, message: 'Error del servidor' });
    renderDetalle();
    fireEvent.click(screen.getByText(/Me interesa esta propiedad/i));
    fireEvent.click(screen.getByRole('button', { name: /Enviar solicitud/i }));

    await waitFor(() => {
      expect(screen.getByText(/Error del servidor/i)).toBeInTheDocument();
    });
  });
});
