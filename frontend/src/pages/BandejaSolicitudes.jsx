// ============================================================
// PÁGINA: BandejaSolicitudes (admin ve todo / asesor ve lo suyo)
// Inbox estilo correo electrónico con gestión de estado
// ============================================================

import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import {
  listarSolicitudes,
  actualizarEstadoSolicitud,
  eliminarSolicitud,
} from '../services/solicitudService';

const ESTADOS = [
  { valor: '',          etiqueta: 'Todas',     icono: '📬' },
  { valor: 'sin_leer',  etiqueta: 'Sin leer',  icono: '🔵' },
  { valor: 'pendiente', etiqueta: 'Pendiente', icono: '🟡' },
  { valor: 'ejecutada', etiqueta: 'Ejecutada', icono: '✅' },
];

const BADGE_CLASS = {
  sin_leer:  'badge-sinleer',
  pendiente: 'badge-pendiente',
  ejecutada: 'badge-ejecutada',
};

const formatFecha = (iso) =>
  new Date(iso).toLocaleString('es-CO', {
    year: 'numeric', month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });

const BandejaSolicitudes = () => {
  const { usuario } = useAuth();
  const navigate    = useNavigate();

  const [solicitudes, setSolicitudes]     = useState([]);
  const [cargando,    setCargando]        = useState(true);
  const [filtroEstado, setFiltroEstado]   = useState('');
  const [seleccionada, setSeleccionada]   = useState(null);
  const [actualizando, setActualizando]   = useState(false);
  const [mensaje,      setMensaje]        = useState(null);

  // Redirigir si no es admin ni asesor
  useEffect(() => {
    if (usuario && usuario.rol !== 'admin' && usuario.rol !== 'asesor') navigate('/dashboard');
  }, [usuario]);

  // Admin ve todas; asesor ve solo las suyas
  const asesorId = usuario?.rol === 'asesor' ? usuario.id : 0;

  const cargar = useCallback(async () => {
    setCargando(true);
    const data = await listarSolicitudes(filtroEstado, asesorId);
    setSolicitudes(data.solicitudes || []);
    setCargando(false);
  }, [filtroEstado, asesorId]);

  useEffect(() => { cargar(); }, [cargar]);

  const cambiarEstado = async (id, nuevoEstado) => {
    setActualizando(true);
    const res = await actualizarEstadoSolicitud(id, nuevoEstado);
    if (res.success) {
      setSolicitudes((prev) =>
        prev.map((s) => s.id === id ? { ...s, estado: nuevoEstado } : s)
      );
      if (seleccionada?.id === id) setSeleccionada((s) => ({ ...s, estado: nuevoEstado }));
      setMensaje({ tipo: 'success', texto: 'Estado actualizado correctamente' });
    } else {
      setMensaje({ tipo: 'error', texto: res.message || 'Error al actualizar' });
    }
    setActualizando(false);
    setTimeout(() => setMensaje(null), 2500);
  };

  const handleEliminar = async (id) => {
    if (!window.confirm('¿Eliminar esta solicitud?')) return;
    const res = await eliminarSolicitud(id);
    if (res.success) {
      setSolicitudes((prev) => prev.filter((s) => s.id !== id));
      if (seleccionada?.id === id) setSeleccionada(null);
    }
  };

  const abrirSolicitud = async (sol) => {
    setSeleccionada(sol);
    if (sol.estado === 'sin_leer') await cambiarEstado(sol.id, 'pendiente');
  };

  const sinLeer    = solicitudes.filter((s) => s.estado === 'sin_leer').length;
  const pendientes = solicitudes.filter((s) => s.estado === 'pendiente').length;
  const ejecutadas = solicitudes.filter((s) => s.estado === 'ejecutada').length;

  return (
    <div className="bandeja-page">
      <div className="bandeja-container">

        {/* ── Encabezado ── */}
        <div className="bandeja-header">
          <div>
            <h1 className="bandeja-title">📬 Bandeja de solicitudes</h1>
            <p className="bandeja-subtitle">
              {usuario?.rol === 'asesor'
                ? `Solicitudes asignadas a ti — ${usuario.nombre}`
                : 'Gestiona todas las solicitudes de los clientes'}
            </p>
          </div>
          <button className="btn btn-outline btn-sm" onClick={cargar}>🔄 Actualizar</button>
        </div>

        {/* ── Resumen ── */}
        <div className="bandeja-stats">
          <div className="bstat bstat-sinleer">
            <span className="bstat-num">{sinLeer}</span>
            <span>Sin leer</span>
          </div>
          <div className="bstat bstat-pendiente">
            <span className="bstat-num">{pendientes}</span>
            <span>Pendientes</span>
          </div>
          <div className="bstat bstat-ejecutada">
            <span className="bstat-num">{ejecutadas}</span>
            <span>Ejecutadas</span>
          </div>
          <div className="bstat bstat-total">
            <span className="bstat-num">{solicitudes.length}</span>
            <span>Total</span>
          </div>
        </div>

        {/* ── Mensaje de estado ── */}
        {mensaje && (
          <div className={`alert alert-${mensaje.tipo === 'success' ? 'success' : 'error'} section-alert`}>
            {mensaje.texto}
          </div>
        )}

        <div className="bandeja-layout">
          {/* ── Panel izquierdo: lista ── */}
          <aside className="bandeja-sidebar">
            {/* Filtros */}
            <div className="bandeja-filtros">
              {ESTADOS.map((e) => (
                <button
                  key={e.valor}
                  className={`filtro-btn${filtroEstado === e.valor ? ' filtro-btn--activo' : ''}`}
                  onClick={() => { setFiltroEstado(e.valor); setSeleccionada(null); }}
                  data-testid={`filtro-${e.valor || 'todas'}`}
                >
                  {e.icono} {e.etiqueta}
                </button>
              ))}
            </div>

            {/* Lista */}
            {cargando ? (
              <div className="loading-state"><div className="spinner" /><p>Cargando...</p></div>
            ) : solicitudes.length === 0 ? (
              <div className="bandeja-vacia">
                <p>📭 No hay solicitudes</p>
              </div>
            ) : (
              <ul className="solicitud-lista" role="list">
                {solicitudes.map((sol) => (
                  <li
                    key={sol.id}
                    role="button"
                    tabIndex={0}
                    className={`solicitud-item${sol.estado === 'sin_leer' ? ' solicitud-item--nueva' : ''}${seleccionada?.id === sol.id ? ' solicitud-item--activa' : ''}`}
                    onClick={() => abrirSolicitud(sol)}
                    onKeyDown={(e) => e.key === 'Enter' && abrirSolicitud(sol)}
                    data-testid={`solicitud-item-${sol.id}`}
                  >
                    <div className="sol-item-top">
                      <span className="sol-nombre">
                        {sol.estado === 'sin_leer' && <span className="punto-nuevo" aria-label="Nueva" />}
                        {sol.nombre_cliente}
                      </span>
                      <span className={`badge ${BADGE_CLASS[sol.estado]}`}>{sol.estado.replace('_', ' ')}</span>
                    </div>
                    <p className="sol-propiedad">{sol.titulo_propiedad || 'Consulta general'}</p>
                    {sol.nombre_asesor && (
                      <p className="sol-asesor">👤 {sol.nombre_asesor}</p>
                    )}
                    <p className="sol-fecha">{formatFecha(sol.fecha_envio)}</p>
                  </li>
                ))}
              </ul>
            )}
          </aside>

          {/* ── Panel derecho: detalle ── */}
          <section className="bandeja-detalle" aria-live="polite">
            {!seleccionada ? (
              <div className="bandeja-empty-detail">
                <p>✉️ Selecciona una solicitud para ver el detalle</p>
              </div>
            ) : (
              <div className="solicitud-detalle" data-testid="solicitud-detalle">
                {/* Cabecera */}
                <div className="sol-det-header">
                  <div>
                    <h2 className="sol-det-nombre">{seleccionada.nombre_cliente}</h2>
                    <p className="sol-det-meta">
                      <a href={`mailto:${seleccionada.correo_cliente}`}>{seleccionada.correo_cliente}</a>
                      {seleccionada.telefono && <> · 📞 {seleccionada.telefono}</>}
                    </p>
                    <p className="sol-det-propiedad">
                      Propiedad: <strong>{seleccionada.titulo_propiedad || 'Consulta general'}</strong>
                      {seleccionada.ciudad && <> — {seleccionada.ciudad}</>}
                    </p>
                    {seleccionada.nombre_asesor && (
                      <p className="sol-det-asesor">
                        👤 Asesor asignado: <strong>{seleccionada.nombre_asesor}</strong>
                      </p>
                    )}
                    <p className="sol-det-fecha">Recibida: {formatFecha(seleccionada.fecha_envio)}</p>
                  </div>
                  <span className={`badge badge-lg ${BADGE_CLASS[seleccionada.estado]}`}>
                    {seleccionada.estado.replace('_', ' ')}
                  </span>
                </div>

                {/* Mensaje */}
                <div className="sol-det-mensaje">
                  <h3>Mensaje</h3>
                  <p>{seleccionada.mensaje || <em>Sin mensaje</em>}</p>
                </div>

                {/* Cambiar estado */}
                <div className="sol-det-acciones">
                  <h3>Cambiar estado</h3>
                  <div className="estado-botones">
                    {['sin_leer', 'pendiente', 'ejecutada'].map((est) => (
                      <button
                        key={est}
                        className={`estado-btn${seleccionada.estado === est ? ' estado-btn--activo' : ''}`}
                        onClick={() => cambiarEstado(seleccionada.id, est)}
                        disabled={actualizando || seleccionada.estado === est}
                        data-testid={`cambiar-estado-${est}`}
                      >
                        {est === 'sin_leer' && '🔵'}
                        {est === 'pendiente' && '🟡'}
                        {est === 'ejecutada' && '✅'}
                        {' '}{est.replace('_', ' ')}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Imagen propiedad */}
                {seleccionada.imagen && (
                  <div className="sol-det-imagen">
                    <img src={seleccionada.imagen} alt={seleccionada.titulo_propiedad} />
                  </div>
                )}

                {/* Eliminar */}
                <button
                  className="btn btn-danger btn-sm sol-det-eliminar"
                  onClick={() => handleEliminar(seleccionada.id)}
                  data-testid="eliminar-solicitud"
                >
                  🗑️ Eliminar solicitud
                </button>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
};

export default BandejaSolicitudes;
