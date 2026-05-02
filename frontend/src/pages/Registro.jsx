// ============================================================
// PÁGINA: Registro
// Formulario de registro de nuevos usuarios
// ============================================================

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Input from '../components/Input';
import Button from '../components/Button';

const Registro = () => {
  const { registro } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ nombre: '', correo: '', password: '', confirmar: '', rol: 'cliente' });
  const [errores, setErrores] = useState({});
  const [mensaje, setMensaje] = useState({ texto: '', tipo: '' });
  const [cargando, setCargando] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errores[name]) setErrores((prev) => ({ ...prev, [name]: '' }));
  };

  const validar = () => {
    const errs = {};
    if (!form.nombre.trim()) errs.nombre = 'El nombre es obligatorio';
    if (!form.correo.trim()) errs.correo = 'El correo es obligatorio';
    else if (!/\S+@\S+\.\S+/.test(form.correo)) errs.correo = 'Formato de correo inválido';
    if (!form.password) errs.password = 'La contraseña es obligatoria';
    else if (form.password.length < 6) errs.password = 'Mínimo 6 caracteres';
    if (form.password !== form.confirmar) errs.confirmar = 'Las contraseñas no coinciden';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validar();
    if (Object.keys(errs).length > 0) { setErrores(errs); return; }

    setCargando(true);
    setMensaje({ texto: '', tipo: '' });
    try {
      const data = await registro({ nombre: form.nombre, correo: form.correo, password: form.password, rol: form.rol });
      if (data.success) {
        setMensaje({ texto: '¡Registro exitoso! Redirigiendo al login...', tipo: 'success' });
        setTimeout(() => navigate('/login'), 2000);
      } else {
        setMensaje({ texto: data.message || 'Error al registrar', tipo: 'error' });
      }
    } catch {
      setMensaje({ texto: 'Error de conexión. Verifica que XAMPP esté activo.', tipo: 'error' });
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <h1 className="auth-title">📝 Crear cuenta</h1>
          <p className="auth-subtitle">Únete a InmoReact hoy</p>
        </div>

        {mensaje.texto && (
          <div className={`alert alert-${mensaje.tipo}`}>{mensaje.texto}</div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <Input
            label="Nombre completo"
            name="nombre"
            value={form.nombre}
            onChange={handleChange}
            placeholder="Juan Pérez"
            error={errores.nombre}
            required
          />

          <Input
            label="Correo electrónico"
            name="correo"
            type="email"
            value={form.correo}
            onChange={handleChange}
            placeholder="tu@correo.com"
            error={errores.correo}
            required
          />

          <Input
            label="Contraseña"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Mínimo 6 caracteres"
            error={errores.password}
            required
          />

          <Input
            label="Confirmar contraseña"
            name="confirmar"
            type="password"
            value={form.confirmar}
            onChange={handleChange}
            placeholder="Repite tu contraseña"
            error={errores.confirmar}
            required
          />

          <div className="form-group">
            <label className="form-label">Tipo de cuenta</label>
            <select name="rol" value={form.rol} onChange={handleChange} className="form-input">
              <option value="cliente">Cliente</option>
              <option value="admin">Administrador</option>
            </select>
          </div>

          <Button type="submit" variant="primary" fullWidth disabled={cargando}>
            {cargando ? 'Registrando...' : 'Crear cuenta'}
          </Button>
        </form>

        <p className="auth-footer">
          ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
        </p>
      </div>
    </div>
  );
};

export default Registro;
