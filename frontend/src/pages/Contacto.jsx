// ============================================================
// PÁGINA: Contacto
// Formulario de contacto — dirige al asesor seleccionado
// ============================================================

import { useState, useEffect } from 'react';
import Input from '../components/Input';
import Button from '../components/Button';
import { crearSolicitud, listarAsesores } from '../services/solicitudService';
import { useAuth } from '../hooks/useAuth';

const Contacto = () => {
  const { usuario } = useAuth();
  const [form, setForm] = useState({
    nombre: '',
    correo: '',
    telefono: '',
    mensaje: '',
    asesor_id: '',
  });
  const [asesores, setAsesores]   = useState([]);
  const [enviado,  setEnviado]    = useState(false);
  const [error,    setError]      = useState(null);
  const [enviando, setEnviando]   = useState(false);

  // Pre-rellenar datos del usuario autenticado
  useEffect(() => {
    if (usuario) {
      setForm((prev) => ({
        ...prev,
        nombre: usuario.nombre || '',
        correo: usuario.correo || '',
      }));
    }
  }, [usuario]);

  // Cargar lista de asesores disponibles
  useEffect(() => {
    listarAsesores().then((res) => {
      if (res.success) setAsesores(res.asesores);
    });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setEnviando(true);
    setError(null);

    const datos = {
      nombre_cliente: form.nombre,
      correo_cliente: form.correo,
      telefono:       form.telefono,
      mensaje:        form.mensaje,
      asesor_id:      form.asesor_id ? Number(form.asesor_id) : null,
      cliente_id:     usuario ? usuario.id : null,
      propiedad_id:   null,
      titulo_propiedad: 'Consulta general',
    };

    const res = await crearSolicitud(datos);
    setEnviando(false);

    if (res.success) {
      setEnviado(true);
      setTimeout(() => setEnviado(false), 5000);
      setForm({ nombre: '', correo: '', telefono: '', mensaje: '', asesor_id: '' });
    } else {
      setError(res.message || 'Error al enviar el mensaje.');
    }
  };

  return (
    <div className="contacto-page">
      <div className="page-container">
        <div className="page-header">
          <h1 className="page-title">📞 Contáctanos</h1>
          <p className="page-subtitle">Estamos aquí para ayudarte a encontrar la propiedad perfecta</p>
        </div>

        <div className="contacto-grid">
          {/* Información de contacto */}
          <div className="contacto-info">
            <h2>Información de contacto</h2>

            <div className="info-item">
              <span className="info-icon">📍</span>
              <div>
                <strong>Dirección</strong>
                <p>Av. El Dorado #68B-31, Bogotá, Colombia</p>
              </div>
            </div>

            <div className="info-item">
              <span className="info-icon">📞</span>
              <div>
                <strong>Teléfono</strong>
                <p>+57 (1) 300 123 4567</p>
              </div>
            </div>

            <div className="info-item">
              <span className="info-icon">✉️</span>
              <div>
                <strong>Correo</strong>
                <p>info@inmoreact.com</p>
              </div>
            </div>

            <div className="info-item">
              <span className="info-icon">🕐</span>
              <div>
                <strong>Horario de atención</strong>
                <p>Lunes a Viernes: 8am - 6pm</p>
                <p>Sábados: 9am - 2pm</p>
              </div>
            </div>

            <div className="redes-sociales">
              <h3>Redes sociales</h3>
              <div className="social-links">
                <a href="#" className="social-btn">📘 Facebook</a>
                <a href="#" className="social-btn">📸 Instagram</a>
                <a href="#" className="social-btn">💼 LinkedIn</a>
              </div>
            </div>
          </div>

          {/* Formulario */}
          <div className="contacto-form-card">
            <h2>Envíanos un mensaje</h2>

            {enviado && (
              <div className="alert alert-success">
                ✅ ¡Mensaje enviado! Tu solicitud llegará a la bandeja del asesor pronto.
              </div>
            )}
            {error && (
              <div className="alert alert-error">
                ❌ {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <Input
                label="Nombre completo"
                name="nombre"
                value={form.nombre}
                onChange={handleChange}
                placeholder="Tu nombre"
                required
              />

              <Input
                label="Correo electrónico"
                name="correo"
                type="email"
                value={form.correo}
                onChange={handleChange}
                placeholder="tu@correo.com"
                required
              />

              <Input
                label="Teléfono"
                name="telefono"
                type="tel"
                value={form.telefono}
                onChange={handleChange}
                placeholder="+57 300 000 0000"
              />

              {/* Selector de asesor */}
              <div className="form-group">
                <label className="form-label">Asesor preferido <span style={{ color: '#888', fontWeight: 400 }}>(opcional)</span></label>
                <select
                  name="asesor_id"
                  value={form.asesor_id}
                  onChange={handleChange}
                  className="form-input"
                >
                  <option value="">— Sin preferencia / Cualquier asesor —</option>
                  {asesores.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.nombre}{a.rol === 'admin' ? ' (Admin)' : ''}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Mensaje</label>
                <textarea
                  name="mensaje"
                  value={form.mensaje}
                  onChange={handleChange}
                  placeholder="¿En qué podemos ayudarte?"
                  className="form-input form-textarea"
                  rows={5}
                  required
                />
              </div>

              <Button type="submit" variant="primary" fullWidth disabled={enviando}>
                {enviando ? '⏳ Enviando...' : '📨 Enviar mensaje'}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contacto;

