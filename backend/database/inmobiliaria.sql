-- ============================================================
-- BASE DE DATOS: inmobiliaria_db
-- Proyecto: Plataforma Inmobiliaria React + PHP + MySQL
-- ============================================================

CREATE DATABASE IF NOT EXISTS inmobiliaria_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE inmobiliaria_db;

-- ============================================================
-- TABLA: usuarios
-- ============================================================
CREATE TABLE IF NOT EXISTS usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    correo VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    rol VARCHAR(50) DEFAULT 'cliente',
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- TABLA: propiedades
-- ============================================================
CREATE TABLE IF NOT EXISTS propiedades (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(150) NOT NULL,
    descripcion TEXT,
    tipo VARCHAR(80),
    ciudad VARCHAR(80),
    sector VARCHAR(80),
    precio DECIMAL(15,2),
    area DECIMAL(10,2),
    habitaciones INT DEFAULT 0,
    banos INT DEFAULT 0,
    parqueaderos INT DEFAULT 0,
    imagen VARCHAR(255),
    estado VARCHAR(50) DEFAULT 'disponible',
    usuario_id INT,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- TABLA: favoritos
-- ============================================================
CREATE TABLE IF NOT EXISTS favoritos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    propiedad_id INT NOT NULL,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (propiedad_id) REFERENCES propiedades(id) ON DELETE CASCADE,
    UNIQUE KEY unique_favorito (usuario_id, propiedad_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- DATOS INICIALES: usuarios
-- Contraseña admin123 hasheada con password_hash de PHP
-- ============================================================
INSERT INTO usuarios (nombre, correo, password, rol) VALUES
('Administrador', 'admin@inmobiliaria.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin'),
('Carlos López', 'cliente@inmobiliaria.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'cliente');

-- ============================================================
-- DATOS INICIALES: propiedades
-- ============================================================
INSERT INTO propiedades (titulo, descripcion, tipo, ciudad, sector, precio, area, habitaciones, banos, parqueaderos, imagen, estado, usuario_id) VALUES
(
    'Moderno Apartamento en Zona Rosa',
    'Hermoso apartamento completamente remodelado en el corazón de la Zona Rosa. Cuenta con acabados de lujo, cocina integral, balcón con vista a la ciudad y gimnasio en el edificio.',
    'Apartamento',
    'Bogotá',
    'Zona Rosa',
    350000000.00,
    85.00,
    3,
    2,
    1,
    'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800',
    'disponible',
    1
),
(
    'Casa Familiar en El Poblado',
    'Amplia casa de dos pisos en el exclusivo barrio El Poblado. Jardín privado, piscina, cuarto de servicio y excelente ubicación cerca a centros comerciales y colegios.',
    'Casa',
    'Medellín',
    'El Poblado',
    850000000.00,
    220.00,
    4,
    3,
    2,
    'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800',
    'arriendo',
    1
),
(
    'Local Comercial Centro Histórico',
    'Excelente local comercial en pleno centro histórico de Cartagena. Alta afluencia de turistas, ideal para restaurante, boutique o cualquier actividad comercial.',
    'Local Comercial',
    'Cartagena',
    'Centro Histórico',
    420000000.00,
    60.00,
    0,
    1,
    0,
    'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800',
    'disponible',
    1
),
(
    'Oficina Ejecutiva Torre Empresarial',
    'Elegante oficina en torre empresarial clase A. Incluye sala de juntas, recepción, parking, vigilancia 24/7 y acceso a zonas comunes con cafetería y terraza.',
    'Oficina',
    'Bogotá',
    'Chapinero',
    280000000.00,
    45.00,
    0,
    1,
    1,
    'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800',
    'disponible',
    1
),
(
    'Finca de Recreo Cundinamarca',
    'Bella finca de recreo a solo 45 minutos de Bogotá. Piscina, kiosco, cancha de fútbol, caballeriza, zona de cultivos y hermosas vistas a las montañas. Ideal para descanso familiar.',
    'Finca',
    'Bogotá',
    'Cundinamarca',
    1200000000.00,
    5000.00,
    6,
    4,
    10,
    'https://images.unsplash.com/photo-1510798831971-661eb04b3739?w=800',
    'disponible',
    1
),
(
    'Apartaestudio Moderno Laureles',
    'Acogedor apartaestudio completamente amoblado y equipado en el tranquilo barrio Laureles. Ideal para profesionales o parejas. Cerca a universidades y parques.',
    'Apartaestudio',
    'Medellín',
    'Laureles',
    180000000.00,
    38.00,
    1,
    1,
    0,
    'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800',
    'vendido',
    1
);
