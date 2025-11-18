const fs = require('fs').promises;
const path = require('path');

const DATA_DIR = path.join(__dirname, 'data');
const PARKS_DIR = path.join(DATA_DIR, 'parks');
const COMMENTS_DIR = path.join(DATA_DIR, 'comments');
const INDEX_FILE = path.join(DATA_DIR, 'index.json');

const sampleParks = [
  {
    id: 'park_001',
    name: 'Parque del Retiro',
    location: {
      address: 'Plaza de la Independencia, 7, Madrid',
      coordinates: {
        lat: 40.4153,
        lng: -3.6844
      },
      city: 'Madrid',
      country: 'España'
    },
    hours: {
      always_open: false,
      schedule: '06:00 - 00:00'
    },
    rating: {
      average: 4.7,
      count: 156
    },
    photos: {
      main: null,
      gallery: []
    },
    elements: {
      swings: true,
      slides: true,
      sandbox: true,
      water_play: false,
      climbing_structure: true,
      zipline: false,
      seesaw: true,
      baby_area: true,
      picnic_tables: true
    },
    amenities: {
      water_fountain: true,
      restrooms: true,
      parking: true,
      wheelchair_accessible: true,
      shade: 'abundant',
      fenced: true,
      nearby_cafe: true,
      nearby_supermarket: false
    },
    policies: {
      dogs_allowed: true,
      skating_allowed: false
    },
    surface: 'sand',
    condition: 'excellent',
    weather_notes: {
      drainage: 'good',
      sun_exposure: 'partial_shade'
    },
    age_range: '1-12',
    created_at: '2025-01-10T10:00:00Z',
    updated_at: '2025-01-15T14:30:00Z',
    created_by: 'maria_garcia'
  },
  {
    id: 'park_002',
    name: 'Parque de la Dehesa de la Villa',
    location: {
      address: 'Calle Francos Rodríguez, Madrid',
      coordinates: {
        lat: 40.4689,
        lng: -3.7242
      },
      city: 'Madrid',
      country: 'España'
    },
    hours: {
      always_open: true,
      schedule: '24/7'
    },
    rating: {
      average: 4.5,
      count: 87
    },
    photos: {
      main: null,
      gallery: []
    },
    elements: {
      swings: true,
      slides: true,
      sandbox: false,
      water_play: false,
      climbing_structure: true,
      zipline: true,
      seesaw: false,
      baby_area: false,
      picnic_tables: true
    },
    amenities: {
      water_fountain: true,
      restrooms: false,
      parking: true,
      wheelchair_accessible: false,
      shade: 'partial',
      fenced: false,
      nearby_cafe: false,
      nearby_supermarket: false
    },
    policies: {
      dogs_allowed: true,
      skating_allowed: true
    },
    surface: 'rubber',
    condition: 'good',
    weather_notes: {
      drainage: 'excellent',
      sun_exposure: 'sunny'
    },
    age_range: '3-12',
    created_at: '2025-01-12T09:15:00Z',
    updated_at: '2025-01-12T09:15:00Z',
    created_by: 'juan_lopez'
  },
  {
    id: 'park_003',
    name: 'Parque del Oeste',
    location: {
      address: 'Paseo del Pintor Rosales, Madrid',
      coordinates: {
        lat: 40.4278,
        lng: -3.7187
      },
      city: 'Madrid',
      country: 'España'
    },
    hours: {
      always_open: true,
      schedule: '24/7'
    },
    rating: {
      average: 4.3,
      count: 64
    },
    photos: {
      main: null,
      gallery: []
    },
    elements: {
      swings: true,
      slides: true,
      sandbox: true,
      water_play: true,
      climbing_structure: false,
      zipline: false,
      seesaw: true,
      baby_area: true,
      picnic_tables: false
    },
    amenities: {
      water_fountain: true,
      restrooms: true,
      parking: false,
      wheelchair_accessible: true,
      shade: 'partial',
      fenced: true,
      nearby_cafe: true,
      nearby_supermarket: true
    },
    policies: {
      dogs_allowed: false,
      skating_allowed: false
    },
    surface: 'mixed',
    condition: 'good',
    weather_notes: {
      drainage: 'fair',
      sun_exposure: 'partial_shade'
    },
    age_range: '0-8',
    created_at: '2025-01-08T16:45:00Z',
    updated_at: '2025-01-14T11:20:00Z',
    created_by: 'ana_martinez'
  },
  {
    id: 'park_004',
    name: 'Parque de Berlin',
    location: {
      address: 'Calle Ramón y Cajal, Madrid',
      coordinates: {
        lat: 40.4514,
        lng: -3.6825
      },
      city: 'Madrid',
      country: 'España'
    },
    hours: {
      always_open: true,
      schedule: '24/7'
    },
    rating: {
      average: 4.8,
      count: 203
    },
    photos: {
      main: null,
      gallery: []
    },
    elements: {
      swings: true,
      slides: true,
      sandbox: true,
      water_play: true,
      climbing_structure: true,
      zipline: true,
      seesaw: true,
      baby_area: true,
      picnic_tables: true
    },
    amenities: {
      water_fountain: true,
      restrooms: true,
      parking: true,
      wheelchair_accessible: true,
      shade: 'abundant',
      fenced: true,
      nearby_cafe: true,
      nearby_supermarket: true
    },
    policies: {
      dogs_allowed: true,
      skating_allowed: true
    },
    surface: 'rubber',
    condition: 'excellent',
    weather_notes: {
      drainage: 'excellent',
      sun_exposure: 'partial_shade'
    },
    age_range: '0-12',
    created_at: '2025-01-05T08:00:00Z',
    updated_at: '2025-01-16T10:00:00Z',
    created_by: 'pedro_sanchez'
  },
  {
    id: 'park_005',
    name: 'Jardines de Sabatini',
    location: {
      address: 'Calle Bailén, 2, Madrid',
      coordinates: {
        lat: 40.4189,
        lng: -3.7142
      },
      city: 'Madrid',
      country: 'España'
    },
    hours: {
      always_open: false,
      schedule: '09:00 - 22:00'
    },
    rating: {
      average: 3.9,
      count: 42
    },
    photos: {
      main: null,
      gallery: []
    },
    elements: {
      swings: false,
      slides: false,
      sandbox: false,
      water_play: false,
      climbing_structure: false,
      zipline: false,
      seesaw: false,
      baby_area: false,
      picnic_tables: true
    },
    amenities: {
      water_fountain: true,
      restrooms: true,
      parking: false,
      wheelchair_accessible: true,
      shade: 'partial',
      fenced: false,
      nearby_cafe: true,
      nearby_supermarket: false
    },
    policies: {
      dogs_allowed: false,
      skating_allowed: false
    },
    surface: 'grass',
    condition: 'good',
    weather_notes: {
      drainage: 'good',
      sun_exposure: 'sunny'
    },
    age_range: 'all',
    created_at: '2025-01-11T13:30:00Z',
    updated_at: '2025-01-11T13:30:00Z',
    created_by: 'lucia_fernandez'
  }
];

const sampleComments = {
  park_001: {
    parkId: 'park_001',
    comments: [
      {
        id: 'comment_001',
        author: 'Carlos M.',
        text: 'Excelente parque para ir con niños. Muy bien cuidado y con muchas zonas de sombra. Los columpios están en perfecto estado.',
        rating: 5,
        likes: 12,
        created_at: '2025-01-14T10:30:00Z',
        updated_at: '2025-01-14T10:30:00Z'
      },
      {
        id: 'comment_002',
        author: 'Laura P.',
        text: 'Nos encanta este parque. La zona para bebés está vallada y es muy segura. Hay baños cerca y varias fuentes de agua.',
        rating: 5,
        likes: 8,
        created_at: '2025-01-13T16:45:00Z',
        updated_at: '2025-01-13T16:45:00Z'
      },
      {
        id: 'comment_003',
        author: 'Miguel A.',
        text: 'Buen parque aunque a veces está muy lleno los fines de semana. Recomiendo ir por la mañana temprano.',
        rating: 4,
        likes: 5,
        created_at: '2025-01-12T09:20:00Z',
        updated_at: '2025-01-12T09:20:00Z'
      }
    ]
  },
  park_002: {
    parkId: 'park_002',
    comments: [
      {
        id: 'comment_004',
        author: 'Isabel R.',
        text: 'La tirolina es el elemento favorito de mis hijos. El parque es grande y nunca está demasiado lleno.',
        rating: 5,
        likes: 6,
        created_at: '2025-01-15T11:15:00Z',
        updated_at: '2025-01-15T11:15:00Z'
      },
      {
        id: 'comment_005',
        author: 'Roberto G.',
        text: 'Buen parque pero le faltan baños públicos. Por lo demás, muy recomendable.',
        rating: 4,
        likes: 3,
        created_at: '2025-01-13T14:00:00Z',
        updated_at: '2025-01-13T14:00:00Z'
      }
    ]
  },
  park_003: {
    parkId: 'park_003',
    comments: [
      {
        id: 'comment_006',
        author: 'Sandra L.',
        text: '¡La zona de agua es genial para el verano! Los niños se lo pasan en grande. Muy limpio todo.',
        rating: 5,
        likes: 15,
        created_at: '2025-01-14T17:30:00Z',
        updated_at: '2025-01-14T17:30:00Z'
      }
    ]
  },
  park_004: {
    parkId: 'park_004',
    comments: [
      {
        id: 'comment_007',
        author: 'David S.',
        text: 'Sin duda el mejor parque infantil de Madrid. Tiene de todo y está impecable. Parking cercano y cafeterías alrededor.',
        rating: 5,
        likes: 23,
        created_at: '2025-01-16T12:00:00Z',
        updated_at: '2025-01-16T12:00:00Z'
      },
      {
        id: 'comment_008',
        author: 'Patricia V.',
        text: 'Perfecto para todas las edades. Mis hijos de 2 y 8 años disfrutan por igual. Muy recomendable.',
        rating: 5,
        likes: 18,
        created_at: '2025-01-15T09:45:00Z',
        updated_at: '2025-01-15T09:45:00Z'
      },
      {
        id: 'comment_009',
        author: 'Jorge M.',
        text: 'Excelente mantenimiento. Se nota que lo cuidan muy bien. La tirolina y las estructuras de escalada son top.',
        rating: 5,
        likes: 11,
        created_at: '2025-01-14T15:20:00Z',
        updated_at: '2025-01-14T15:20:00Z'
      }
    ]
  },
  park_005: {
    parkId: 'park_005',
    comments: [
      {
        id: 'comment_010',
        author: 'Carmen T.',
        text: 'Es más un jardín que un parque infantil. Bonito para pasear pero hay pocos elementos para niños pequeños.',
        rating: 3,
        likes: 4,
        created_at: '2025-01-12T10:30:00Z',
        updated_at: '2025-01-12T10:30:00Z'
      }
    ]
  }
};

async function seed() {
  console.log('🌱 Iniciando seed de datos...');

  try {
    // Crear directorios si no existen
    await fs.mkdir(PARKS_DIR, { recursive: true });
    await fs.mkdir(COMMENTS_DIR, { recursive: true });

    // Guardar parques
    for (const park of sampleParks) {
      const filePath = path.join(PARKS_DIR, `${park.id}.json`);
      await fs.writeFile(filePath, JSON.stringify(park, null, 2));
      console.log(`✓ Creado: ${park.id} - ${park.name}`);
    }

    // Guardar comentarios
    for (const [parkId, commentsData] of Object.entries(sampleComments)) {
      const filePath = path.join(COMMENTS_DIR, `${parkId}_comments.json`);
      await fs.writeFile(filePath, JSON.stringify(commentsData, null, 2));
      console.log(`✓ Comentarios creados para: ${parkId}`);
    }

    // Crear índice
    const index = {
      parks: sampleParks.map(p => p.id),
      lastId: sampleParks.length
    };
    await fs.writeFile(INDEX_FILE, JSON.stringify(index, null, 2));
    console.log('✓ Índice creado');

    console.log('\n✅ Seed completado exitosamente!');
    console.log(`📊 Total de parques: ${sampleParks.length}`);
    console.log(`💬 Total de comentarios: ${Object.values(sampleComments).reduce((acc, curr) => acc + curr.comments.length, 0)}`);
  } catch (error) {
    console.error('❌ Error durante el seed:', error);
    process.exit(1);
  }
}

// Ejecutar seed
seed();
