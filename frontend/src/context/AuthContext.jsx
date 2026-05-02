// @refresh reset
// ============================================================
// CONTEXT: AuthContext
// Maneja autenticación, login, registro y logout
// Persiste sesión en LocalStorage
// ============================================================

import { createContext, useContext, useState, useEffect } from 'react';
import { loginUser, registerUser } from '../services/authService';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(null);
  const [cargando, setCargando] = useState(true);

  // Al cargar la app, recuperar sesión guardada en LocalStorage
  useEffect(() => {
    const sesionGuardada = localStorage.getItem('usuario_inmobiliaria');
    if (sesionGuardada) {
      try {
        setUsuario(JSON.parse(sesionGuardada));
      } catch {
        localStorage.removeItem('usuario_inmobiliaria');
      }
    }
    setCargando(false);
  }, []);

  /** Iniciar sesión */
  const login = async (correo, password) => {
    const data = await loginUser(correo, password);
    if (data.success) {
      setUsuario(data.usuario);
      localStorage.setItem('usuario_inmobiliaria', JSON.stringify(data.usuario));
    }
    return data;
  };

  /** Registrar nuevo usuario */
  const registro = async (userData) => {
    const data = await registerUser(userData);
    return data;
  };

  /** Cerrar sesión */
  const logout = () => {
    setUsuario(null);
    localStorage.removeItem('usuario_inmobiliaria');
  };

  /** Verificar si hay sesión activa */
  const isAuthenticated = () => !!usuario;

  return (
    <AuthContext.Provider value={{ usuario, login, registro, logout, isAuthenticated, cargando }}>
      {children}
    </AuthContext.Provider>
  );
};


