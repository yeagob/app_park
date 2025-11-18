# 🌳 Parks Social Network - MVP

Red social de parques infantiles que permite a las familias descubrir, compartir y evaluar parques en todo el mundo.

**🌍 Soporta Español e Inglés** | **🔐 Autenticación por Email** | **✅ 30 Tests Automatizados**

## 📋 Características Principales

### 🔐 Autenticación Simple
- **Login por email**: Acceso rápido sin contraseña
- **Sistema de tokens**: Autenticación segura con JWT-like tokens
- **Protección de rutas**: Solo usuarios autenticados pueden añadir/modificar contenido

### 🌍 Internacionalización (i18n)
- **Español e Inglés**: Interfaz completamente traducida
- **Cambio de idioma**: Selector de idioma en tiempo real
- **Detección automática**: Detecta el idioma del navegador

### 🔍 Descubrimiento de Parques
- **Geolocalización**: Encuentra parques cercanos usando tu ubicación GPS
- **Búsqueda global**: Busca parques en cualquier ciudad del mundo
- **Mapa interactivo**: Visualiza todos los parques en un mapa con Leaflet
- **Filtros avanzados**: Filtra por elementos, servicios, valoraciones y más

### 📝 Información Detallada
- Elementos del parque (columpios, toboganes, arenero, tirolina, etc.)
- Servicios (baños, parking, fuente de agua, accesibilidad)
- **Bares/Cafés**: Bar cerca, bar con vista a los niños jugando
- Condiciones (superficie, estado, drenaje, exposición al sol)
- Políticas (perros permitidos, zona de patinaje)
- Horarios de apertura
- Valoraciones y comentarios de la comunidad

### 👥 Red Social
- Añadir nuevos parques a la plataforma
- Valorar parques (1-5 estrellas)
- Escribir comentarios y compartir experiencias
- Dar "me gusta" a comentarios
- Galería de fotos colaborativa

### 🎯 Filtros Avanzados
- Por elementos específicos (ej: con arenero y fuente)
- Por edad recomendada
- Por valoración mínima
- Accesible para sillas de ruedas
- Perros permitidos
- Con baños públicos

## 🏗️ Arquitectura

### Backend (Node.js + Express)
- Sistema de archivos JSON (sin base de datos)
- API RESTful completa
- Geolocalización con geolib
- Subida de imágenes con multer
- CORS habilitado para desarrollo

### Frontend (HTML/CSS/JavaScript Vanilla)
- Diseño responsive (mobile-first)
- Mapa interactivo con Leaflet
- Sin frameworks pesados
- Experiencia de usuario moderna

### Estructura de Datos
```
/data
  /parks         → park_001.json, park_002.json...
  /photos        → /park_001/main.jpg, gallery_1.jpg...
  /comments      → park_001_comments.json...
  index.json     → Índice de todos los parques
```

## 🚀 Instalación y Uso

### Requisitos Previos
- Node.js 14+ instalado
- npm o yarn

### 1. Clonar el Repositorio
```bash
cd app_park
```

### 2. Instalar Dependencias del Backend
```bash
cd backend
npm install
```

### 3. Iniciar el Backend
```bash
# Modo producción
npm start

# Modo desarrollo (con auto-reload usando nodemon)
npm run dev
```

El backend se ejecutará en `http://localhost:3001`

### 4. Instalar Dependencias del Frontend
```bash
cd ../frontend
npm install
```

### 5. Iniciar el Frontend
```bash
# Abre automáticamente el navegador
npm start

# Modo desarrollo (sin abrir navegador)
npm run dev
```

El frontend se ejecutará en `http://localhost:3000`

### 6. Primer Acceso
Al abrir la aplicación por primera vez, verás el modal de login. Ingresa tu email para comenzar. El sistema:
- Genera automáticamente un token de autenticación
- No requiere contraseña
- Guarda tu sesión en localStorage
- La base de datos inicia vacía - ¡sé el primero en añadir un parque!

## 🧪 Testing

### Ejecutar Tests
```bash
cd backend
npm test
```

El proyecto incluye **30 tests automatizados** que cubren:
- ✅ Autenticación (login, verificación de tokens)
- ✅ CRUD de parques (crear, leer, actualizar, eliminar)
- ✅ Sistema de valoraciones
- ✅ Comentarios y "me gusta"
- ✅ Búsqueda por geolocalización
- ✅ Filtros avanzados
- ✅ Validación de datos

**Cobertura de código:** ~66% (statements, branches, functions, lines)

### Modo Watch (desarrollo)
```bash
npm run test:watch
```

## 📡 API Endpoints

### 🔐 Autenticación

#### POST `/api/auth/login`
Inicia sesión o registra un nuevo usuario con solo un email.

**Body:**
```json
{
  "email": "usuario@example.com"
}
```

**Response:**
```json
{
  "user": {
    "id": "uuid",
    "email": "usuario@example.com",
    "token": "generated-token"
  }
}
```

#### POST `/api/auth/verify`
Verifica si un token es válido.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "valid": true,
  "user": {
    "id": "uuid",
    "email": "usuario@example.com"
  }
}
```

#### POST `/api/auth/logout`
Invalida el token actual (cierra sesión).

**Headers:**
```
Authorization: Bearer <token>
```

---

**🔒 Rutas Protegidas:** Las siguientes operaciones requieren autenticación (header `Authorization: Bearer <token>`):
- POST `/api/parks` - Crear parque
- PUT `/api/parks/:id` - Actualizar parque
- DELETE `/api/parks/:id` - Eliminar parque
- POST `/api/parks/:id/rate` - Valorar parque
- POST `/api/comments/:parkId` - Añadir comentario
- PUT/DELETE comentarios
- POST like/unlike comentarios

---

### Parques

#### GET `/api/parks`
Obtiene todos los parques con filtros opcionales.

**Query Parameters:**
- `search` - Búsqueda por texto (nombre, dirección, ciudad)
- `lat`, `lng` - Coordenadas para búsqueda por proximidad
- `radius` - Radio en km para búsqueda por proximidad
- `elements` - Elementos requeridos (comma-separated: `swings,slides`)
- `amenities` - Servicios requeridos (comma-separated)
- `minRating` - Valoración mínima (1-5)
- `dogsAllowed` - Perros permitidos (true/false)
- `wheelchairAccessible` - Accesible (true/false)
- `sortBy` - Ordenar por: `rating`, `newest`, `name`, `distance`
- `page`, `limit` - Paginación

**Ejemplo:**
```bash
curl "http://localhost:3001/api/parks?elements=swings,slides&minRating=4"
```

#### GET `/api/parks/:id`
Obtiene un parque específico por ID.

#### POST `/api/parks`
Crea un nuevo parque.

**Body:**
```json
{
  "name": "Parque Central",
  "location": {
    "address": "Calle Mayor 123",
    "coordinates": { "lat": 40.4168, "lng": -3.7038 },
    "city": "Madrid",
    "country": "España"
  },
  "elements": {
    "swings": true,
    "slides": true,
    "sandbox": true
  },
  "amenities": {
    "water_fountain": true,
    "restrooms": true,
    "cafe_with_playground_view": true
  },
  "policies": {
    "dogs_allowed": true
  },
  "surface": "rubber",
  "condition": "excellent"
}
```

#### PUT `/api/parks/:id`
Actualiza un parque existente.

#### DELETE `/api/parks/:id`
Elimina un parque.

#### POST `/api/parks/:id/rate`
Añade una valoración a un parque.

**Body:**
```json
{
  "rating": 5
}
```

### Comentarios

#### GET `/api/comments/:parkId`
Obtiene todos los comentarios de un parque.

#### POST `/api/comments/:parkId`
Añade un comentario a un parque.

**Body:**
```json
{
  "author": "Juan Pérez",
  "text": "Excelente parque para niños pequeños",
  "rating": 5
}
```

#### PUT `/api/comments/:parkId/:commentId`
Edita un comentario.

#### DELETE `/api/comments/:parkId/:commentId`
Elimina un comentario.

#### POST `/api/comments/:parkId/:commentId/like`
Da "me gusta" a un comentario.

#### POST `/api/comments/:parkId/:commentId/unlike`
Quita "me gusta" de un comentario.

### Fotos

#### GET `/api/photos/:parkId`
Obtiene todas las fotos de un parque.

#### POST `/api/photos/:parkId/main`
Sube la foto principal del parque.

**Form Data:**
- `photo` - Archivo de imagen (JPEG, PNG, GIF, WebP, max 5MB)

#### POST `/api/photos/:parkId/gallery`
Añade una foto a la galería del parque.

#### DELETE `/api/photos/:parkId/gallery/:filename`
Elimina una foto de la galería.

## 🎨 Interfaz de Usuario

### Vista Lista
Muestra todos los parques en tarjetas con:
- Foto principal o placeholder
- Nombre y valoración
- Ubicación
- Distancia (si hay geolocalización)
- Elementos destacados

### Vista Mapa
Mapa interactivo con:
- Marcadores para cada parque
- Popup con información básica
- Botón para ver detalles
- Marcador de ubicación del usuario

### Detalle de Parque
Página completa con:
- Título y valoración
- Ubicación y horarios
- Lista completa de elementos
- Servicios disponibles
- Información adicional
- Sistema de valoración
- Formulario de comentarios
- Lista de comentarios con "me gusta"

### Formulario Añadir Parque
Formulario completo con:
- Información básica (nombre, dirección, coordenadas)
- Selección de elementos
- Selección de servicios
- Información adicional
- Validación de campos

## 🎯 Casos de Uso

### Como Padre/Madre
1. Abro la app y busco "parques cerca de mí"
2. Veo una lista ordenada por distancia
3. Filtro por "con arenero" y "baños disponibles"
4. Selecciono el parque más cercano
5. Leo comentarios de otros padres
6. Veo que tiene fuente de agua y zona de sombra
7. Decido ir y luego dejo mi valoración

### Como Visitante de una Ciudad
1. Busco "parques en Barcelona"
2. Cambio a vista de mapa
3. Exploro diferentes zonas
4. Leo valoraciones y comentarios
5. Encuentro uno con 4.8 estrellas cerca del hotel
6. Veo que permite perros (importante para mí)
7. Marco como favorito (funcionalidad futura)

### Como Contribuidor
1. Descubro un parque nuevo que no está en la app
2. Click en "Añadir Parque"
3. Tomo una foto
4. Relleno el formulario con todos los detalles
5. Marco los elementos que tiene
6. Indico que tiene parking y fuente de agua
7. Envío y el parque se añade inmediatamente

## 🔧 Tecnologías Utilizadas

### Backend
- **Node.js** - Entorno de ejecución
- **Express** - Framework web
- **Multer** - Subida de archivos
- **Geolib** - Cálculos geográficos
- **UUID** - Generación de IDs únicos y tokens
- **CORS** - Cross-Origin Resource Sharing
- **Jest** - Framework de testing
- **Supertest** - Testing de APIs HTTP
- **Nodemon** - Auto-reload en desarrollo

### Frontend
- **HTML5** - Estructura
- **CSS3** - Estilos (Grid, Flexbox)
- **JavaScript ES6+** - Lógica de aplicación
- **Leaflet** - Mapas interactivos
- **Fetch API** - Peticiones HTTP
- **i18n personalizado** - Sistema de internacionalización (ES/EN)
- **LocalStorage API** - Persistencia de sesión y preferencias

## 📱 Diseño Responsive

La aplicación está optimizada para:
- 📱 Móviles (320px - 767px)
- 📱 Tablets (768px - 1023px)
- 💻 Desktop (1024px+)

Características responsive:
- Menú adaptativo
- Grid flexible de tarjetas
- Formularios de una columna en móvil
- Mapa con altura ajustable
- Botones y textos legibles en todos los tamaños

## 🚧 Limitaciones del MVP

Este es un MVP (Minimum Viable Product) con algunas limitaciones:

1. **Almacenamiento en archivos**: Todo se almacena en archivos JSON (no base de datos)
2. **Autenticación básica**: Solo email sin contraseña (adecuado para MVP)
3. **Sin validación de coordenadas**: No verifica que las coordenadas sean válidas
4. **Sin edición de parques desde UI**: Solo se pueden crear (la API soporta PUT)
5. **Sin favoritos**: No se pueden marcar parques como favoritos
6. **Sin notificaciones**: No hay sistema de notificaciones
7. **Sin moderación**: No hay sistema de moderación de contenidos
8. **Sin recuperación de cuenta**: Si pierdes tu token, pierdes acceso a tu cuenta

## 🔮 Futuras Mejoras

### Corto Plazo
- [x] ~~Sistema de autenticación~~ ✅ **Completado**
- [x] ~~Internacionalización (ES/EN)~~ ✅ **Completado**
- [x] ~~Testing automatizado~~ ✅ **Completado**
- [ ] Edición de parques existentes desde UI
- [ ] Sistema de favoritos
- [ ] Compartir parques en redes sociales
- [ ] Subida de fotos desde la interfaz
- [ ] Recuperación de contraseña/token por email

### Medio Plazo
- [ ] Base de datos real (MongoDB/PostgreSQL)
- [ ] Sistema de reportes/moderación
- [ ] Notificaciones push
- [ ] Perfil de usuario completo con avatar
- [ ] Historial de parques visitados
- [ ] Rutas sugeridas con múltiples parques
- [ ] Tests de frontend (Jest + Testing Library)
- [ ] Más idiomas (Francés, Alemán, Portugués)

### Largo Plazo
- [ ] App móvil nativa (React Native/Flutter)
- [ ] Verificación de parques por moderadores
- [ ] Sistema de badges/gamificación
- [ ] Eventos en parques (meetups, actividades)
- [ ] Chat entre usuarios
- [ ] Integración con APIs de clima
- [ ] Recomendaciones personalizadas con IA
- [ ] Accesibilidad mejorada (WCAG AAA)

## 📄 Licencia

MIT License - Ver archivo LICENSE para más detalles

## 👥 Contribuir

Este es un proyecto MVP de demostración. Para contribuir:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📞 Soporte

Para preguntas o problemas:
- Abre un issue en GitHub
- Revisa la documentación de la API
- Consulta los ejemplos de código

---

**Hecho con 💚 para la comunidad de familias que buscan los mejores parques para sus hijos**
