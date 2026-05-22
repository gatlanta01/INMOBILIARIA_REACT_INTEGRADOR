// ============================================================
// PÁGINA: DetallePropiedad
// Muestra información completa de una propiedad
// ============================================================

import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useProperty } from '../hooks/useProperty';
import { useFavorite } from '../hooks/useFavorite';
import { useAuth } from '../hooks/useAuth';
import Button from '../components/Button';
import { crearSolicitud } from '../services/solicitudService';

const formatPrice = (price) =>
  new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(price);

const DetallePropiedad = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { propiedadActual, obtenerPropiedad, cargando, error } = useProperty();
  const { agregarFavorito, eliminarFavorito, esFavorito } = useFavorite();
  const { usuario } = useAuth();

  // ── Estado del formulario de interés ────────────────────────
  const [mostrarForm, setMostrarForm] = useState(false);
  const [formData, setFormData] = useState({ telefono: '', mensaje: '' });
  const [enviando, setEnviando] = useState(false);
  const [formMsg, setFormMsg] = useState(null); // { tipo: 'success'|'error', texto }

  useEffect(() => {
    obtenerPropiedad(id);
  }, [id]);

  const handleFavorito = async () => {
    if (!usuario) { navigate('/login'); return; }
    if (esFavorito(id)) await eliminarFavorito(Number(id));
    else await agregarFavorito(Number(id));
  };

  // ── Enviar solicitud de interés ──────────────────────────────
  const handleSolicitud = async (e) => {
    e.preventDefault();
    if (!usuario) { navigate('/login'); return; }
    setEnviando(true);
    setFormMsg(null);
    const datos = {
      propiedad_id:   Number(id),
      cliente_id:     usuario.id,
      nombre_cliente: usuario.nombre,
      correo_cliente: usuario.correo,
      telefono:       formData.telefono,
      mensaje:        formData.mensaje,
    };
    const res = await crearSolicitud(datos);
    setEnviando(false);
    if (res.success) {
      setFormMsg({ tipo: 'success', texto: '¡Solicitud enviada! El asesor se pondrá en contacto contigo.' });
      setFormData({ telefono: '', mensaje: '' });
      setTimeout(() => { setMostrarForm(false); setFormMsg(null); }, 3000);
    } else {
      setFormMsg({ tipo: 'error', texto: res.message || 'Error al enviar la solicitud.' });
    }
  };

  if (cargando) {
    return <div className="loading-state"><div className="spinner"></div><p>Cargando propiedad...</p></div>;
  }

  if (!propiedadActual) {
    return (
      <div className="not-found-page">
        <h2>Propiedad no encontrada</h2>
        {error && <div className="alert alert-error section-alert">{error}</div>}
        <Link to="/propiedades" className="btn btn-primary">Volver a propiedades</Link>
      </div>
    );
  }

  const p = propiedadActual;
  const imagenSrc = p.imagen || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800';
  const esFav = esFavorito(id);

  return (
    <div className="detalle-page">
      <div className="page-container">
        {/* Breadcrumb */}
        <div className="breadcrumb">
          <Link to="/">Inicio</Link> / <Link to="/propiedades">Propiedades</Link> / <span>{p.titulo}</span>
        </div>

        <div className="detalle-grid">
          {/* Imagen principal */}
          <div className="detalle-imagen">
            <img src={imagenSrc} alt={p.titulo} />
            <div className="detalle-badges">
              <span className={`badge badge-${p.estado}`}>{p.estado}</span>
              <span className="badge badge-tipo">{p.tipo}</span>
            </div>
          </div>

          {/* Información */}
          <div className="detalle-info">
            <h1 className="detalle-titulo">{p.titulo}</h1>
            <p className="detalle-ubicacion">📍 {p.sector ? `${p.sector}, ` : ''}{p.ciudad}</p>
            <p className="detalle-precio">{formatPrice(p.precio)}</p>

            {/* Características */}
            <div className="detalle-features">
              <div className="feature-item">
                <span className="feature-icon">📐</span>
                <div><strong>{p.area} m²</strong><small>Área</small></div>
              </div>
              {p.habitaciones > 0 && (
                <div className="feature-item">
                  <span className="feature-icon">🛏</span>
                  <div><strong>{p.habitaciones}</strong><small>Habitaciones</small></div>
                </div>
              )}
              {p.banos > 0 && (
                <div className="feature-item">
                  <span className="feature-icon">🚿</span>
                  <div><strong>{p.banos}</strong><small>Baños</small></div>
                </div>
              )}
              {p.parqueaderos > 0 && (
                <div className="feature-item">
                  <span className="feature-icon">🚗</span>
                  <div><strong>{p.parqueaderos}</strong><small>Parqueaderos</small></div>
                </div>
              )}
            </div>

            {/* Descripción */}
            {p.descripcion && (
              <div className="detalle-descripcion">
                <h3>Descripción</h3>
                <p>{p.descripcion}</p>
              </div>
            )}

            {/* Agente */}
            {p.nombre_usuario && (
              <div className="detalle-agente">
                <p>👤 Publicado por: <strong>{p.nombre_usuario}</strong></p>
              </div>
            )}

            {/* Acciones */}
            <div className="detalle-actions">
              <Button
                variant={esFav ? 'danger' : 'outline'}
                onClick={handleFavorito}
              >
                {esFav ? '❤️ Quitar de favoritos' : '🤍 Agregar a favoritos'}
              </Button>

              {/* Botón "Me interesa" solo para clientes */}
              {usuario?.rol === 'cliente' && (
                <Button variant="primary" onClick={() => setMostrarForm((v) => !v)}>
                  📩 Me interesa esta propiedad
                </Button>
              )}

              {/* Formulario de solicitud de interés */}
              {mostrarForm && usuario?.rol === 'cliente' && (
                <form className="solicitud-form" onSubmit={handleSolicitud} data-testid="solicitud-form">
                  <h3>Enviar solicitud al asesor</h3>
                  <p className="solicitud-info">
                    Tus datos: <strong>{usuario.nombre}</strong> — {usuario.correo}
                  </p>

                  <div className="form-group">
                    <label htmlFor="sol-telefono">Teléfono de contacto</label>
                    <input
                      id="sol-telefono"
                      type="tel"
                      className="form-control"
                      placeholder="Ej: 300 123 4567"
                      value={formData.telefono}
                      onChange={(e) => setFormData((d) => ({ ...d, telefono: e.target.value }))}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="sol-mensaje">Mensaje (opcional)</label>
                    <textarea
                      id="sol-mensaje"
                      className="form-control"
                      rows={3}
                      placeholder="Escribe tu mensaje o preguntas al asesor..."
                      value={formData.mensaje}
                      onChange={(e) => setFormData((d) => ({ ...d, mensaje: e.target.value }))}
                    />
                  </div>

                  {formMsg && (
                    <div className={`alert alert-${formMsg.tipo === 'success' ? 'success' : 'error'} section-alert`}>
                      {formMsg.texto}
                    </div>
                  )}

                  <div className="solicitud-actions">
                    <Button type="submit" variant="primary" disabled={enviando}>
                      {enviando ? 'Enviando...' : '✉️ Enviar solicitud'}
                    </Button>
                    <Button type="button" variant="outline" onClick={() => setMostrarForm(false)}>
                      Cancelar
                    </Button>
                  </div>
                </form>
              )}

              {!usuario && (
                <Link to="/login" className="btn btn-outline">📩 Me interesa — Inicia sesión</Link>
              )}
            </div>

            {/* Acciones admin */}
            {usuario?.rol === 'admin' && (
              <div className="detalle-admin">
                <Link to={`/editar-propiedad/${p.id}`} className="btn btn-secondary btn-sm">
                  ✏️ Editar propiedad
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetallePropiedad;
