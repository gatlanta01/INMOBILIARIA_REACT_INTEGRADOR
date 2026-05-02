// ============================================================
// PÁGINA: Contacto
// Formulario visual de contacto e información
// ============================================================

import { useState } from 'react';
import Input from '../components/Input';
import Button from '../components/Button';

const Contacto = () => {
  const [form, setForm] = useState({ nombre: '', correo: '', telefono: '', mensaje: '' });
  const [enviado, setEnviado] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulación de envío (en producción conectar con backend de emails)
    setEnviado(true);
    setTimeout(() => setEnviado(false), 4000);
    setForm({ nombre: '', correo: '', telefono: '', mensaje: '' });
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
                ✅ ¡Mensaje enviado! Te contactaremos pronto.
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

              <Button type="submit" variant="primary" fullWidth>
                📨 Enviar mensaje
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contacto;
