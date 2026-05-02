// ============================================================
// PÁGINA: EditarPropiedad (protegida)
// Formulario para editar una propiedad existente
// ============================================================

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProperty } from '../hooks/useProperty';
import PropertyForm from '../components/PropertyForm';

const EditarPropiedad = () => {
  const { id } = useParams();
  const { obtenerPropiedad, editarPropiedad, propiedadActual, cargando } = useProperty();
  const navigate = useNavigate();
  const [mensaje, setMensaje] = useState({ texto: '', tipo: '' });
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    obtenerPropiedad(id);
  }, [id]);

  const handleSubmit = async (formData) => {
    setGuardando(true);
    setMensaje({ texto: '', tipo: '' });
    try {
      const data = await editarPropiedad({ ...formData, id: Number(id) });
      if (data.success) {
        setMensaje({ texto: '✅ Propiedad actualizada correctamente', tipo: 'success' });
        setTimeout(() => navigate('/dashboard'), 1500);
      } else {
        setMensaje({ texto: data.message || 'Error al actualizar', tipo: 'error' });
      }
    } catch {
      setMensaje({ texto: 'Error de conexión con el servidor', tipo: 'error' });
    } finally {
      setGuardando(false);
    }
  };

  if (cargando && !propiedadActual) {
    return <div className="loading-state"><div className="spinner"></div><p>Cargando propiedad...</p></div>;
  }

  return (
    <div className="form-page">
      <div className="page-container">
        <div className="page-header">
          <h1 className="page-title">✏️ Editar Propiedad</h1>
          <p className="page-subtitle">Modifica la información de la propiedad</p>
        </div>

        {mensaje.texto && (
          <div className={`alert alert-${mensaje.tipo}`}>{mensaje.texto}</div>
        )}

        <div className="form-card">
          {propiedadActual && (
            <PropertyForm
              initialData={propiedadActual}
              onSubmit={handleSubmit}
              isEditing={true}
              cargando={guardando}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default EditarPropiedad;
