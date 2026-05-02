# 🏠 InmoReact — Plataforma Inmobiliaria

Aplicación web completa para una **inmobiliaria real**, desarrollada con **React.js + PHP + MySQL**. Permite registrar usuarios, iniciar sesión, gestionar propiedades (CRUD completo), buscar, filtrar, guardar favoritos y administrar todo desde un dashboard.

---

## 🎯 Objetivo

Crear una plataforma inmobiliaria moderna y funcional donde los usuarios puedan:

- Registrarse e iniciar sesión de forma segura
- Consultar y buscar propiedades con filtros avanzados
- Ver el detalle completo de cada propiedad
- Guardar propiedades en favoritos
- Crear, editar y eliminar propiedades (CRUD)
- Administrar propiedades desde un panel de control

---

## 🛠️ Tecnologías utilizadas

| Categoría       | Tecnología                              |
|-----------------|-----------------------------------------|
| Frontend        | React.js (Vite), JavaScript, HTML, CSS  |
| Navegación      | React Router DOM v6                     |
| Estado global   | Context API (AuthContext, PropertyContext, FavoriteContext) |
| Hooks           | useState, useEffect, useContext         |
| Comunicación    | Fetch API, Promesas, async/await        |
| Sesión          | LocalStorage                            |
| Backend         | PHP 8+                                  |
| Base de datos   | MySQL (XAMPP / phpMyAdmin)              |
| Servidor local  | XAMPP (Apache + MySQL)                  |
| Control de versiones | Git + GitHub                       |

---

## 📁 Estructura de carpetas

```
inmobiliaria-react/
├── .gitignore
├── README.md
│
├── backend/
│   ├── config/
│   │   └── database.php          ← Conexión MySQL + CORS
│   ├── usuarios/
│   │   ├── registrar.php
│   │   ├── login.php
│   │   └── listar.php
│   ├── propiedades/
│   │   ├── crear.php
│   │   ├── listar.php
│   │   ├── obtener.php
│   │   ├── actualizar.php
│   │   ├── eliminar.php
│   │   ├── buscar.php
│   │   └── filtrar.php
│   ├── favoritos/
│   │   ├── crear.php
│   │   ├── listar.php
│   │   └── eliminar.php
│   └── database/
│       └── inmobiliaria.sql      ← Script SQL completo
│
└── frontend/
    ├── index.html
    ├── package.json
    ├── vite.config.js
    └── src/
        ├── App.jsx
        ├── main.jsx
        ├── styles/
        │   └── global.css
        ├── context/
        │   ├── AuthContext.jsx
        │   ├── PropertyContext.jsx
        │   └── FavoriteContext.jsx
        ├── services/
        │   ├── api.js
        │   ├── authService.js
        │   ├── propertyService.js
        │   └── favoriteService.js
        ├── routes/
        │   └── AppRoutes.jsx
        ├── components/
        │   ├── Navbar.jsx
        │   ├── Footer.jsx
        │   ├── Layout.jsx
        │   ├── ProtectedRoute.jsx
        │   ├── PropertyCard.jsx
        │   ├── PropertyList.jsx
        │   ├── PropertyForm.jsx
        │   ├── SearchBar.jsx
        │   ├── FilterBar.jsx
        │   ├── Button.jsx
        │   └── Input.jsx
        └── pages/
            ├── Home.jsx
            ├── Login.jsx
            ├── Registro.jsx
            ├── Dashboard.jsx
            ├── Propiedades.jsx
            ├── DetallePropiedad.jsx
            ├── CrearPropiedad.jsx
            ├── EditarPropiedad.jsx
            ├── Favoritos.jsx
            ├── Contacto.jsx
            └── NotFound.jsx
```

---

## 🗄️ Base de datos (MySQL)

### Nombre: `inmobiliaria_db`

### Tablas:

**usuarios**
| Campo | Tipo |
|-------|------|
| id | INT AUTO_INCREMENT PK |
| nombre | VARCHAR(100) |
| correo | VARCHAR(100) UNIQUE |
| password | VARCHAR(255) — hash bcrypt |
| rol | VARCHAR(50) |
| fecha_registro | TIMESTAMP |

**propiedades**
| Campo | Tipo |
|-------|------|
| id | INT AUTO_INCREMENT PK |
| titulo | VARCHAR(150) |
| descripcion | TEXT |
| tipo | VARCHAR(80) |
| ciudad | VARCHAR(80) |
| sector | VARCHAR(80) |
| precio | DECIMAL(15,2) |
| area | DECIMAL(10,2) |
| habitaciones | INT |
| banos | INT |
| parqueaderos | INT |
| imagen | VARCHAR(255) |
| estado | VARCHAR(50) |
| usuario_id | INT FK → usuarios |
| fecha_creacion | TIMESTAMP |

**favoritos**
| Campo | Tipo |
|-------|------|
| id | INT AUTO_INCREMENT PK |
| usuario_id | INT FK → usuarios |
| propiedad_id | INT FK → propiedades |
| fecha_creacion | TIMESTAMP |

---

## ⚙️ Instalación y ejecución

### 1. Requisitos previos

- [XAMPP](https://www.apachefriends.org/) instalado (Apache + MySQL)
- [Node.js](https://nodejs.org/) v18 o superior
- [Git](https://git-scm.com/) instalado

---

### 2. Configurar el backend (PHP + MySQL)

#### a) Abrir XAMPP y encender Apache y MySQL

Abre XAMPP Control Panel y haz clic en **Start** para:
- Apache
- MySQL

#### b) Copiar el backend a htdocs

Copia la carpeta completa `inmobiliaria-react` a:

```
C:\xampp\htdocs\
```

Resultado esperado:
```
C:\xampp\htdocs\inmobiliaria-react\backend\
```

#### c) Crear la base de datos en phpMyAdmin

1. Abre tu navegador y ve a: **http://localhost/phpmyadmin**
2. Haz clic en **"Nueva"** (o **"New"**)
3. Escribe el nombre: `inmobiliaria_db`
4. Selecciona cotejamiento: `utf8mb4_unicode_ci`
5. Haz clic en **"Crear"**

#### d) Importar el script SQL

1. En phpMyAdmin, selecciona la base de datos `inmobiliaria_db`
2. Haz clic en la pestaña **"Importar"**
3. Haz clic en **"Seleccionar archivo"**
4. Navega hasta: `inmobiliaria-react/backend/database/inmobiliaria.sql`
5. Haz clic en **"Continuar"** o **"Go"**
6. Verifica que se crearon las 3 tablas: `usuarios`, `propiedades`, `favoritos`

#### e) Verificar la conexión en database.php

Abre `backend/config/database.php` y confirma:

```php
define('DB_HOST', 'localhost');
define('DB_USER', 'root');
define('DB_PASS', '');          // Sin contraseña en XAMPP por defecto
define('DB_NAME', 'inmobiliaria_db');
```

Si tienes contraseña en MySQL, actualiza `DB_PASS`.

---

### 3. Configurar el frontend (React)

#### a) Entrar a la carpeta del frontend

```bash
cd inmobiliaria-react/frontend
```

#### b) Instalar dependencias

```bash
npm install
```

#### c) Ejecutar el servidor de desarrollo

```bash
npm run dev
```

#### d) Abrir en el navegador

```
http://localhost:5173
```

---

## 🗺️ Rutas disponibles

| Ruta | Página | Protegida |
|------|--------|-----------|
| `/` | Home | No |
| `/login` | Login | No |
| `/registro` | Registro | No |
| `/propiedades` | Listado de propiedades | No |
| `/propiedades/:id` | Detalle de propiedad | No |
| `/contacto` | Contacto | No |
| `/dashboard` | Panel de control | ✅ Sí |
| `/crear-propiedad` | Crear propiedad | ✅ Sí |
| `/editar-propiedad/:id` | Editar propiedad | ✅ Sí |
| `/favoritos` | Mis favoritos | ✅ Sí |
| `*` | 404 Not Found | No |

---

## 🔌 Endpoints PHP

### Usuarios
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/usuarios/registrar.php` | Registrar usuario |
| POST | `/usuarios/login.php` | Iniciar sesión |
| GET | `/usuarios/listar.php` | Listar usuarios |

### Propiedades
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/propiedades/listar.php` | Listar todas |
| GET | `/propiedades/obtener.php?id=1` | Obtener por ID |
| POST | `/propiedades/crear.php` | Crear propiedad |
| PUT | `/propiedades/actualizar.php` | Actualizar propiedad |
| DELETE | `/propiedades/eliminar.php?id=1` | Eliminar propiedad |
| GET | `/propiedades/buscar.php?q=texto` | Buscar |
| GET | `/propiedades/filtrar.php?tipo=Casa` | Filtrar |

### Favoritos
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/favoritos/crear.php` | Agregar favorito |
| GET | `/favoritos/listar.php?usuario_id=1` | Listar favoritos |
| DELETE | `/favoritos/eliminar.php?usuario_id=1&propiedad_id=2` | Eliminar favorito |

---

## 👥 Usuarios de prueba

| Rol | Correo | Contraseña |
|-----|--------|------------|
| Administrador | admin@inmobiliaria.com | password |
| Cliente | cliente@inmobiliaria.com | password |

> Las contraseñas están hasheadas con `password_hash()` de PHP (bcrypt).

---

## ✅ Funcionalidades principales

1. ✅ Registro de usuarios con validación
2. ✅ Login con verificación de contraseña segura (bcrypt)
3. ✅ Cierre de sesión
4. ✅ Rutas protegidas para usuarios autenticados
5. ✅ CRUD completo de propiedades
6. ✅ Listado de propiedades desde MySQL
7. ✅ Detalle de cada propiedad
8. ✅ Búsqueda por título, ciudad o sector
9. ✅ Filtros por tipo, ciudad, sector, estado y precio
10. ✅ Agregar y eliminar favoritos
11. ✅ Dashboard administrativo con tabla y estadísticas
12. ✅ Formularios validados con mensajes de error claros
13. ✅ Diseño responsive (móvil, tablet, escritorio)
14. ✅ Sesión persistida en LocalStorage

---

## 🔄 Flujo de Props

Los datos fluyen de componentes padres a hijos mediante **Props**:

```
PropertyList → PropertyCard (propiedad, onEditar, onEliminar, onFavorito, esFavorito)
Dashboard    → PropertyList (propiedades, mostrarAcciones)
Propiedades  → PropertyList (propiedades, favoritosIds, onFavorito)
Home         → PropertyCard (propiedad, onFavorito, esFavorito)
```

Componentes reutilizables con props:
- `Button` recibe: `variant`, `onClick`, `disabled`, `fullWidth`, `type`
- `Input` recibe: `label`, `name`, `value`, `onChange`, `type`, `error`, `required`
- `PropertyForm` recibe: `initialData`, `onSubmit`, `isEditing`, `cargando`

---

## 🌐 Context API

### AuthContext
- `usuario` — usuario autenticado
- `login(correo, password)` — iniciar sesión
- `registro(userData)` — registrar usuario
- `logout()` — cerrar sesión
- `isAuthenticated()` — verificar sesión

### PropertyContext
- `propiedades` — lista de propiedades
- `crearPropiedad()`, `editarPropiedad()`, `eliminarPropiedad()`
- `buscarPropiedades()`, `filtrarPropiedades()`
- `obtenerPropiedad(id)`

### FavoriteContext
- `favoritos` — lista de favoritos del usuario
- `agregarFavorito(propiedad_id)`
- `eliminarFavorito(propiedad_id)`
- `esFavorito(propiedad_id)`

---

## 💾 LocalStorage

Se usa exclusivamente para:
- **Guardar la sesión activa** al hacer login
- **Recuperar la sesión** al recargar la página
- **Limpiar la sesión** al cerrar sesión

> La información de usuarios y propiedades se almacena en MySQL, no en LocalStorage.

**Clave usada:** `usuario_inmobiliaria`

---

## 🔒 Páginas protegidas

El componente `ProtectedRoute` verifica si hay un usuario autenticado antes de mostrar una ruta. Si no hay sesión, redirige automáticamente a `/login`.

Páginas protegidas:
- `/dashboard`
- `/crear-propiedad`
- `/editar-propiedad/:id`
- `/favoritos`

---

## 📤 Subida del proyecto a GitHub

### Pasos para subir por primera vez:

```bash
# 1. Ir a la raíz del proyecto
cd inmobiliaria-react

# 2. Inicializar repositorio Git
git init

# 3. Agregar todos los archivos
git add .

# 4. Hacer el primer commit
git commit -m "Proyecto inmobiliaria React PHP MySQL"

# 5. Cambiar la rama a main
git branch -M main

# 6. Conectar con tu repositorio de GitHub
#    (reemplaza USUARIO por tu nombre de usuario de GitHub)
git remote add origin https://github.com/USUARIO/inmobiliaria-react.git

# 7. Subir el proyecto
git push -u origin main
```

### Actualizar el repositorio después de cambios:

```bash
git add .
git commit -m "Actualización del proyecto"
git push
```

> ⚠️ **Importante:** Este proyecto usa backend PHP y MySQL. Por eso **no funcionará completamente solo con GitHub Pages**, ya que GitHub Pages solo sirve frontend estático.
>
> Para ejecutar la aplicación completa se necesita **XAMPP localmente** (o un servidor que soporte PHP y MySQL).

### Entregable final

Enlace del repositorio de GitHub:
```
https://github.com/USUARIO/inmobiliaria-react
```

---

## 🚀 Posibles mejoras futuras

- Subida de imágenes al servidor (con PHP `move_uploaded_file`)
- Sistema de mensajería entre usuarios y asesores
- Mapa interactivo con Google Maps
- Sistema de notificaciones en tiempo real
- Panel de reportes y estadísticas avanzadas
- Integración con pasarela de pagos
- Sistema de citas para visitas a propiedades
- Rol de agente inmobiliario separado
- API REST completa con autenticación JWT
- Despliegue en servidor de producción (cPanel, DigitalOcean)

---

## 📋 Resumen de tecnologías aplicadas

| Tecnología | Uso |
|------------|-----|
| React.js + Vite | Aplicación frontend |
| React Router DOM | Navegación entre páginas y subpáginas |
| Context API | Estado global (auth, propiedades, favoritos) |
| Props | Flujo de datos entre componentes |
| useState | Formularios controlados, estados locales |
| useEffect | Cargar datos al montar componentes |
| useContext | Consumir contextos en componentes |
| Fetch API | Peticiones HTTP al backend PHP |
| async/await | Manejo asíncrono de peticiones |
| Promesas | Gestión de respuestas del servidor |
| LocalStorage | Persistencia de sesión |
| PHP | Backend y endpoints REST |
| MySQL | Base de datos relacional |
| XAMPP | Servidor local de desarrollo |
| Git | Control de versiones |
| GitHub | Repositorio remoto |
