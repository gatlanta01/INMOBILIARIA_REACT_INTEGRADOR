// ============================================================
// SERVICIO DE AUTENTICACIÓN
// Funciones para login y registro usando fetch + async/await
// ============================================================

import { API_URL } from './api';
import { demoUsers } from '../data/mockProperties';

const demoResponse = (usuario, message) => ({
  success: true,
  message,
  usuario: {
    id: usuario.id,
    nombre: usuario.nombre,
    correo: usuario.correo,
    rol: usuario.rol,
  },
  source: 'mock',
});

/**
 * Iniciar sesión de usuario
 * @param {string} correo
 * @param {string} password
 * @returns {Promise<Object>} respuesta del servidor
 */
export const loginUser = async (correo, password) => {
  try {
    const response = await fetch(`${API_URL}/usuarios/login.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ correo, password }),
    });

    const data = await response.json();
    return data;
  } catch {
    const usuario = demoUsers.find((item) => item.correo === correo && item.password === password);
    if (!usuario) {
      return { success: false, message: 'Credenciales incorrectas' };
    }

    return demoResponse(usuario, 'Login demo exitoso');
  }
};

/**
 * Registrar nuevo usuario
 * @param {Object} userData - { nombre, correo, password, rol }
 * @returns {Promise<Object>} respuesta del servidor
 */
export const registerUser = async (userData) => {
  try {
    const response = await fetch(`${API_URL}/usuarios/registrar.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });

    const data = await response.json();
    return data;
  } catch {
    return {
      success: true,
      message: 'Registro demo exitoso. Ya puedes iniciar sesion.',
      usuario: {
        nombre: userData.nombre,
        correo: userData.correo,
        rol: userData.rol || 'cliente',
      },
      source: 'mock',
    };
  }
};
