// ============================================================
// PÁGINA: Login
// Formulario de inicio de sesión con validación
// ============================================================

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Input from '../components/Input';
import Button from '../components/Button';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ correo: '', password: '' });
  const [errores, setErrores] = useState({});
  const [mensaje, setMensaje] = useState('');
  const [cargando, setCargando] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errores[name]) setErrores((prev) => ({ ...prev, [name]: '' }));
  };

  const validar = () => {
    const errs = {};
    if (!form.correo.trim()) errs.correo = 'El correo es obligatorio';
    else if (!/\S+@\S+\.\S+/.test(form.correo)) errs.correo = 'Formato de correo inválido';
    if (!form.password.trim()) errs.password = 'La contraseña es obligatoria';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validar();
    if (Object.keys(errs).length > 0) { setErrores(errs); return; }

    setCargando(true);
    setMensaje('');
    try {
      const data = await login(form.correo, form.password);
      if (data.success) {
        navigate('/dashboard');
      } else {
        setMensaje(data.message || 'Credenciales incorrectas');
      }
    } catch {
      setMensaje('Error de conexión. Verifica que XAMPP esté activo.');
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <h1 className="auth-title">🏠 Iniciar sesión</h1>
          <p className="auth-subtitle">Bienvenido de vuelta a InmoReact</p>
        </div>

        {mensaje && <div className="alert alert-error">{mensaje}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
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
            placeholder="Tu contraseña"
            error={errores.password}
            required
          />

          <Button type="submit" variant="primary" fullWidth disabled={cargando}>
            {cargando ? 'Ingresando...' : 'Iniciar sesión'}
          </Button>
        </form>

        <div className="auth-info">
          <p className="hint-text">
            <strong>Usuarios de prueba:</strong><br />
            Admin: admin@inmobiliaria.com / password<br />
            Cliente: cliente@inmobiliaria.com / password
          </p>
        </div>

        <p className="auth-footer">
          ¿No tienes cuenta? <Link to="/registro">Regístrate gratis</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
