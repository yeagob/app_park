const express = require('express');
const router = express.Router();
const { authenticate, optionalAuth } = require('../middleware/authMiddleware');
const {
  readIndex,
  writeIndex,
  readPark,
  writePark,
  deletePark,
  readAllParks,
  generateParkId
} = require('../utils/fileSystem');
const {
  filterParksByRadius,
  sortParksByDistance
} = require('../utils/geoUtils');

// GET /api/parks - Obtener todos los parques con filtros opcionales
router.get('/', async (req, res) => {
  try {
    let parks = await readAllParks();

    // Filtro por elementos
    if (req.query.elements) {
      const requiredElements = req.query.elements.split(',');
      parks = parks.filter(park => {
        return requiredElements.every(element => park.elements && park.elements[element] === true);
      });
    }

    // Filtro por amenidades
    if (req.query.amenities) {
      const requiredAmenities = req.query.amenities.split(',');
      parks = parks.filter(park => {
        return requiredAmenities.every(amenity => park.amenities && park.amenities[amenity] === true);
      });
    }

    // Filtro por valoración mínima
    if (req.query.minRating) {
      const minRating = parseFloat(req.query.minRating);
      parks = parks.filter(park => park.rating.average >= minRating);
    }

    // Filtro por perros permitidos
    if (req.query.dogsAllowed !== undefined) {
      const dogsAllowed = req.query.dogsAllowed === 'true';
      parks = parks.filter(park => park.policies.dogs_allowed === dogsAllowed);
    }

    // Filtro por accesibilidad
    if (req.query.wheelchairAccessible === 'true') {
      parks = parks.filter(park => park.amenities.wheelchair_accessible === true);
    }

    // Búsqueda por texto
    if (req.query.search) {
      const searchTerm = req.query.search.toLowerCase();
      parks = parks.filter(park =>
        park.name.toLowerCase().includes(searchTerm) ||
        park.location.address.toLowerCase().includes(searchTerm) ||
        park.location.city.toLowerCase().includes(searchTerm)
      );
    }

    // Filtro por proximidad
    if (req.query.lat && req.query.lng) {
      const center = {
        lat: parseFloat(req.query.lat),
        lng: parseFloat(req.query.lng)
      };

      if (req.query.radius) {
        const radiusInMeters = parseFloat(req.query.radius) * 1000; // convertir km a metros
        parks = filterParksByRadius(parks, center, radiusInMeters);
      } else {
        parks = sortParksByDistance(parks, center);
      }
    }

    // Ordenamiento
    if (req.query.sortBy) {
      switch (req.query.sortBy) {
        case 'rating':
          parks.sort((a, b) => b.rating.average - a.rating.average);
          break;
        case 'newest':
          parks.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
          break;
        case 'name':
          parks.sort((a, b) => a.name.localeCompare(b.name));
          break;
      }
    }

    // Paginación
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const paginatedParks = parks.slice(startIndex, endIndex);

    res.json({
      total: parks.length,
      page,
      limit,
      parks: paginatedParks
    });
  } catch (error) {
    console.error('Error fetching parks:', error);
    res.status(500).json({ error: 'Error al obtener parques' });
  }
});

// GET /api/parks/:id - Obtener un parque específico
router.get('/:id', async (req, res) => {
  try {
    const park = await readPark(req.params.id);
    res.json(park);
  } catch (error) {
    res.status(404).json({ error: 'Parque no encontrado' });
  }
});

// POST /api/parks - Crear un nuevo parque (requiere autenticación)
router.post('/', authenticate, async (req, res) => {
  try {
    const parkId = await generateParkId();
    const newPark = {
      id: parkId,
      name: req.body.name,
      location: req.body.location,
      description: req.body.description || '',
      hours: req.body.hours || { always_open: true, schedule: '24/7' },
      rating: {
        average: 0,
        count: 0
      },
      photos: req.body.photos || {
        main: null,
        gallery: []
      },
      elements: req.body.elements || {},
      custom_elements: req.body.custom_elements || [],
      amenities: req.body.amenities || {},
      policies: req.body.policies || {},
      surface: req.body.surface || 'unknown',
      condition: req.body.condition || 'good',
      weather_notes: req.body.weather_notes || {},
      age_range: req.body.age_range || '0-12',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      created_by: req.user.email
    };

    // Guardar parque
    await writePark(parkId, newPark);

    // Actualizar índice
    const index = await readIndex();
    index.parks.push(parkId);
    index.lastId = parseInt(parkId.split('_')[1]);
    await writeIndex(index);

    res.status(201).json(newPark);
  } catch (error) {
    console.error('Error creating park:', error);
    res.status(500).json({ error: 'Error al crear parque' });
  }
});

// PUT /api/parks/:id - Actualizar un parque (requiere autenticación)
router.put('/:id', authenticate, async (req, res) => {
  try {
    const existingPark = await readPark(req.params.id);

    const updatedPark = {
      ...existingPark,
      ...req.body,
      id: req.params.id, // Mantener el ID original
      created_at: existingPark.created_at, // Mantener fecha de creación
      updated_at: new Date().toISOString()
    };

    await writePark(req.params.id, updatedPark);
    res.json(updatedPark);
  } catch (error) {
    console.error('Error updating park:', error);
    res.status(404).json({ error: 'Parque no encontrado' });
  }
});

// DELETE /api/parks/:id - Eliminar un parque (requiere autenticación)
router.delete('/:id', authenticate, async (req, res) => {
  try {
    await deletePark(req.params.id);

    // Actualizar índice
    const index = await readIndex();
    index.parks = index.parks.filter(id => id !== req.params.id);
    await writeIndex(index);

    res.json({ message: 'Parque eliminado correctamente' });
  } catch (error) {
    console.error('Error deleting park:', error);
    res.status(404).json({ error: 'Parque no encontrado' });
  }
});

// POST /api/parks/:id/rate - Añadir valoración a un parque (requiere autenticación)
router.post('/:id/rate', authenticate, async (req, res) => {
  try {
    const park = await readPark(req.params.id);
    const newRating = parseFloat(req.body.rating);

    if (newRating < 1 || newRating > 5) {
      return res.status(400).json({ error: 'La valoración debe estar entre 1 y 5' });
    }

    // Calcular nuevo promedio
    const totalRating = park.rating.average * park.rating.count;
    const newCount = park.rating.count + 1;
    const newAverage = (totalRating + newRating) / newCount;

    park.rating.average = Math.round(newAverage * 10) / 10; // Redondear a 1 decimal
    park.rating.count = newCount;
    park.updated_at = new Date().toISOString();

    await writePark(req.params.id, park);
    res.json(park);
  } catch (error) {
    console.error('Error rating park:', error);
    res.status(404).json({ error: 'Parque no encontrado' });
  }
});

module.exports = router;
