// ============================================================
// PÁGINA: Home
// Banner principal, propiedades destacadas y llamadas a la acción
// ============================================================

import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useProperty } from '../hooks/useProperty';
import { useFavorite } from '../hooks/useFavorite';
import { useAuth } from '../hooks/useAuth';
import PropertyCard from '../components/PropertyCard';

const Home = () => {
  const { propiedades, cargarPropiedades, cargando, error } = useProperty();
  const { agregarFavorito, eliminarFavorito, esFavorito, favoritos } = useFavorite();
  const { usuario } = useAuth();

  useEffect(() => {
    cargarPropiedades();
  }, []);

  const propiedadesDestacadas = propiedades.slice(0, 3);
  const favoritosIds = favoritos.map((f) => String(f.id));

  const handleFavorito = async (id) => {
    if (!usuario) return;
    if (esFavorito(id)) {
      await eliminarFavorito(id);
    } else {
      await agregarFavorito(id);
    }
  };

  return (
    <div className="home-page">
      {/* Hero / Banner */}
      <section className="hero">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <h1 className="hero-title">
            Encuentra el hogar <span className="highlight">perfecto</span> para ti
          </h1>
          <p className="hero-subtitle">
            Más de 500 propiedades disponibles en Colombia. Compra, arrienda o invierte con confianza.
          </p>
          <div className="hero-buttons">
            <Link to="/propiedades" className="btn btn-primary btn-lg">Ver propiedades</Link>
            {!usuario && (
              <Link to="/registro" className="btn btn-outline-white btn-lg">Registrarse gratis</Link>
            )}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="stats-section">
        <div className="stats-container">
          <div className="stat-card">
            <span className="stat-number">500+</span>
            <span className="stat-label">Propiedades</span>
          </div>
          <div className="stat-card">
            <span className="stat-number">200+</span>
            <span className="stat-label">Clientes felices</span>
          </div>
          <div className="stat-card">
            <span className="stat-number">15+</span>
            <span className="stat-label">Ciudades</span>
          </div>
          <div className="stat-card">
            <span className="stat-number">10+</span>
            <span className="stat-label">Años de experiencia</span>
          </div>
        </div>
      </section>

      {/* Propiedades destacadas */}
      <section className="featured-section">
        <div className="section-container">
          <div className="section-header">
            <h2 className="section-title">Propiedades Destacadas</h2>
            <p className="section-subtitle">Seleccionadas especialmente para ti</p>
          </div>

          {error && <div className="alert alert-error section-alert">{error}</div>}

          {cargando ? (
            <div className="loading-state">
              <div className="spinner"></div>
              <p>Cargando propiedades...</p>
            </div>
          ) : (
            <div className="property-grid">
              {propiedadesDestacadas.map((propiedad) => (
                <PropertyCard
                  key={propiedad.id}
                  propiedad={propiedad}
                  onFavorito={usuario ? handleFavorito : null}
                  esFavorito={favoritosIds.includes(String(propiedad.id))}
                />
              ))}
            </div>
          )}

          <div className="section-cta">
            <Link to="/propiedades" className="btn btn-primary btn-lg">
              Ver todas las propiedades →
            </Link>
          </div>
        </div>
      </section>

      {/* Sección de servicios */}
      <section className="services-section">
        <div className="section-container">
          <h2 className="section-title">¿Por qué elegirnos?</h2>
          <div className="services-grid">
            <div className="service-card">
              <div className="service-icon">🏆</div>
              <h3>Experiencia comprobada</h3>
              <p>Más de 10 años en el mercado inmobiliario colombiano.</p>
            </div>
            <div className="service-card">
              <div className="service-icon">🔒</div>
              <h3>Transacciones seguras</h3>
              <p>Todas nuestras transacciones son verificadas y seguras.</p>
            </div>
            <div className="service-card">
              <div className="service-icon">📊</div>
              <h3>Mejores precios</h3>
              <p>Encuentra las mejores ofertas del mercado inmobiliario.</p>
            </div>
            <div className="service-card">
              <div className="service-icon">💬</div>
              <h3>Asesoría personalizada</h3>
              <p>Nuestros asesores te guían durante todo el proceso.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA registro */}
      {!usuario && (
        <section className="cta-section">
          <div className="cta-content">
            <h2>¿Listo para encontrar tu propiedad ideal?</h2>
            <p>Regístrate gratis y accede a todas las funcionalidades de nuestra plataforma.</p>
            <Link to="/registro" className="btn btn-primary btn-lg">Crear cuenta gratis</Link>
          </div>
        </section>
      )}
    </div>
  );
};

export default Home;
