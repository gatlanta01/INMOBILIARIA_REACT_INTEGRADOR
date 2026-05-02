// ============================================================
// PÁGINA: CrearPropiedad (protegida)
// Formulario para crear nueva propiedad
// ============================================================

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProperty } from '../hooks/useProperty';
import { useAuth } from '../hooks/useAuth';
import PropertyForm from '../components/PropertyForm';

const CrearPropiedad = () => {
  const { crearPropiedad } = useProperty();
  const { usuario } = useAuth();
  const navigate = useNavigate();
  const [mensaje, setMensaje] = useState({ texto: '', tipo: '' });
  const [cargando, setCargando] = useState(false);

  const handleSubmit = async (formData) => {
    setCargando(true);
    setMensaje({ texto: '', tipo: '' });
    try {
      const data = await crearPropiedad({ ...formData, usuario_id: usuario.id });
      if (data.success) {
        setMensaje({ texto: '✅ Propiedad creada correctamente', tipo: 'success' });
        setTimeout(() => navigate('/dashboard'), 1500);
      } else {
        setMensaje({ texto: data.message || 'Error al crear', tipo: 'error' });
      }
    } catch {
      setMensaje({ texto: 'Error de conexión con el servidor', tipo: 'error' });
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="form-page">
      <div className="page-container">
        <div className="page-header">
          <h1 className="page-title">➕ Crear Propiedad</h1>
          <p className="page-subtitle">Completa el formulario para publicar una nueva propiedad</p>
        </div>

        {mensaje.texto && (
          <div className={`alert alert-${mensaje.tipo}`}>{mensaje.texto}</div>
        )}

        <div className="form-card">
          <PropertyForm onSubmit={handleSubmit} cargando={cargando} />
        </div>
      </div>
    </div>
  );
};

export default CrearPropiedad;
