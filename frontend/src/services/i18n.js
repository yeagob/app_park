// Sistema de internacionalización (i18n)
const translations = {
    es: {
        // Header
        appName: 'Parks Social',
        addPark: 'Añadir Parque',
        logout: 'Salir',

        // Login
        welcome: 'Bienvenido a Parks Social',
        loginSubtitle: 'Ingresa tu email para comenzar a explorar y añadir parques',
        email: 'Email',
        emailPlaceholder: 'tu@email.com',
        enter: 'Ingresar',
        noPasswordNeeded: 'No necesitas contraseña. Solo tu email.',

        // Search and Filters
        searchPlaceholder: 'Buscar parques por nombre o ubicación...',
        nearMe: 'Cerca de mí',
        advancedFilters: 'Filtros avanzados',

        // View Toggle
        listView: 'Lista',
        mapView: 'Mapa',

        // Filter Categories
        elements: 'Elementos',
        services: 'Servicios',
        policies: 'Políticas',
        minRating: 'Valoración mínima',
        all: 'Todas',

        // Park Elements
        swings: 'Columpios',
        slides: 'Toboganes',
        sandbox: 'Arenero',
        waterPlay: 'Zona de agua',
        climbingStructure: 'Estructura de escalada',
        zipline: 'Tirolina',
        seesaw: 'Balancines',
        babyArea: 'Zona bebés',
        picnicTables: 'Mesas picnic',

        // Amenities
        waterFountain: 'Fuente de agua',
        restrooms: 'Baños',
        parking: 'Parking',
        wheelchairAccessible: 'Accesible',
        fenced: 'Vallado',
        nearbyCafe: 'Bar cerca',
        cafeWithView: 'Bar con vista a los niños',
        nearbySupermarket: 'Supermercado cerca',

        // Policies
        dogsAllowed: 'Perros permitidos',
        skatingAllowed: 'Patines/bicicletas permitidos',

        // Park Details
        location: 'Ubicación',
        address: 'Dirección',
        city: 'Ciudad',
        schedule: 'Horario',
        alwaysOpen: 'Abierto 24/7',
        parkElements: 'Elementos del Parque',
        servicesAndAmenities: 'Servicios y Comodidades',
        additionalInfo: 'Información Adicional',
        surface: 'Superficie',
        condition: 'Condición',
        recommendedAge: 'Edad recomendada',
        years: 'años',
        dogs: 'Perros',
        allowed: 'permitidos',
        notAllowed: 'no permitidos',
        skating: 'Patines/bicicletas',

        // Surface Types
        rubber: 'Caucho',
        sand: 'Arena',
        grass: 'Césped',
        mixed: 'Mixto',
        unknown: 'Desconocido',

        // Conditions
        excellent: 'Excelente',
        good: 'Buena',
        fair: 'Regular',
        needsMaintenance: 'Necesita mantenimiento',

        // Rating
        rateThisPark: 'Valorar este parque',
        ratings: 'valoraciones',

        // Comments
        comments: 'Comentarios',
        noCommentsYet: 'Aún no hay comentarios. ¡Sé el primero en comentar!',
        shareExperience: 'Comparte tu experiencia en este parque...',
        yourName: 'Tu nombre',
        publishComment: 'Publicar Comentario',
        likes: 'Me gusta',
        today: 'Hoy',
        yesterday: 'Ayer',
        daysAgo: 'días',
        weeksAgo: 'semanas',
        ago: 'Hace',

        // Add Park Form
        addNewPark: 'Añadir Nuevo Parque',
        basicInfo: 'Información Básica',
        parkName: 'Nombre del Parque',
        latitude: 'Latitud',
        longitude: 'Longitud',
        country: 'País',
        useCurrentLocation: 'Usar mi ubicación actual',
        description: 'Descripción y comentarios',
        customElements: 'Elementos personalizados',
        customElementsHelp: 'Añade elementos personalizados separados por comas (ej: "Rocódromo, Pista de skate, Cancha de baloncesto")',
        parkElements: 'Elementos del Parque',
        additionalInformation: 'Información Adicional',
        surfaceType: 'Tipo de superficie',
        parkCondition: 'Condición',
        cancel: 'Cancelar',
        addParkButton: 'Añadir Parque',

        // Messages
        loading: 'Cargando parques...',
        noParksFound: 'No se encontraron parques con los filtros seleccionados',
        noParksYet: 'No hay parques aún. ¡Sé el primero en añadir uno!',
        parkAddedSuccessfully: '¡Parque añadido correctamente!',
        errorAddingPark: 'Error al añadir el parque',
        errorLoadingParks: 'Error al cargar los parques. Asegúrate de que el servidor backend esté corriendo.',
        mustLogin: 'Debes iniciar sesión para realizar esta acción',
        confirmLogout: '¿Seguro que quieres cerrar sesión?',
        ratedWith: 'Has valorado este parque con',
        stars: 'estrellas',
        errorRating: 'Error al valorar el parque',
        errorAddingComment: 'Error al añadir comentario',
        errorLiking: 'Error al dar me gusta',
        gettingLocation: 'Obteniendo ubicación...',
        nearMyLocation: 'Cerca de mi ubicación',
        locationError: 'No se pudo obtener tu ubicación. Por favor, permite el acceso a la ubicación.',
        viewDetails: 'Ver Detalles',

        // Empty states
        required: '*'
    },
    en: {
        // Header
        appName: 'Parks Social',
        addPark: 'Add Park',
        logout: 'Logout',

        // Login
        welcome: 'Welcome to Parks Social',
        loginSubtitle: 'Enter your email to start exploring and adding parks',
        email: 'Email',
        emailPlaceholder: 'your@email.com',
        enter: 'Enter',
        noPasswordNeeded: 'No password needed. Just your email.',

        // Search and Filters
        searchPlaceholder: 'Search parks by name or location...',
        nearMe: 'Near me',
        advancedFilters: 'Advanced filters',

        // View Toggle
        listView: 'List',
        mapView: 'Map',

        // Filter Categories
        elements: 'Elements',
        services: 'Services',
        policies: 'Policies',
        minRating: 'Minimum rating',
        all: 'All',

        // Park Elements
        swings: 'Swings',
        slides: 'Slides',
        sandbox: 'Sandbox',
        waterPlay: 'Water play area',
        climbingStructure: 'Climbing structure',
        zipline: 'Zipline',
        seesaw: 'Seesaw',
        babyArea: 'Baby area',
        picnicTables: 'Picnic tables',

        // Amenities
        waterFountain: 'Water fountain',
        restrooms: 'Restrooms',
        parking: 'Parking',
        wheelchairAccessible: 'Wheelchair accessible',
        fenced: 'Fenced',
        nearbyCafe: 'Nearby café',
        cafeWithView: 'Café with playground view',
        nearbySupermarket: 'Nearby supermarket',

        // Policies
        dogsAllowed: 'Dogs allowed',
        skatingAllowed: 'Skating/bikes allowed',

        // Park Details
        location: 'Location',
        address: 'Address',
        city: 'City',
        schedule: 'Schedule',
        alwaysOpen: 'Open 24/7',
        parkElements: 'Park Elements',
        servicesAndAmenities: 'Services and Amenities',
        additionalInfo: 'Additional Information',
        surface: 'Surface',
        condition: 'Condition',
        recommendedAge: 'Recommended age',
        years: 'years',
        dogs: 'Dogs',
        allowed: 'allowed',
        notAllowed: 'not allowed',
        skating: 'Skating/bikes',

        // Surface Types
        rubber: 'Rubber',
        sand: 'Sand',
        grass: 'Grass',
        mixed: 'Mixed',
        unknown: 'Unknown',

        // Conditions
        excellent: 'Excellent',
        good: 'Good',
        fair: 'Fair',
        needsMaintenance: 'Needs maintenance',

        // Rating
        rateThisPark: 'Rate this park',
        ratings: 'ratings',

        // Comments
        comments: 'Comments',
        noCommentsYet: 'No comments yet. Be the first to comment!',
        shareExperience: 'Share your experience at this park...',
        yourName: 'Your name',
        publishComment: 'Publish Comment',
        likes: 'Likes',
        today: 'Today',
        yesterday: 'Yesterday',
        daysAgo: 'days',
        weeksAgo: 'weeks',
        ago: 'Ago',

        // Add Park Form
        addNewPark: 'Add New Park',
        basicInfo: 'Basic Information',
        parkName: 'Park Name',
        latitude: 'Latitude',
        longitude: 'Longitude',
        country: 'Country',
        useCurrentLocation: 'Use my current location',
        description: 'Description and comments',
        customElements: 'Custom elements',
        customElementsHelp: 'Add custom elements separated by commas (e.g., "Rock climbing wall, Skate park, Basketball court")',
        parkElements: 'Park Elements',
        additionalInformation: 'Additional Information',
        surfaceType: 'Surface type',
        parkCondition: 'Condition',
        cancel: 'Cancel',
        addParkButton: 'Add Park',

        // Messages
        loading: 'Loading parks...',
        noParksFound: 'No parks found with the selected filters',
        noParksYet: 'No parks yet. Be the first to add one!',
        parkAddedSuccessfully: 'Park added successfully!',
        errorAddingPark: 'Error adding park',
        errorLoadingParks: 'Error loading parks. Make sure the backend server is running.',
        mustLogin: 'You must log in to perform this action',
        confirmLogout: 'Are you sure you want to log out?',
        ratedWith: 'You rated this park with',
        stars: 'stars',
        errorRating: 'Error rating park',
        errorAddingComment: 'Error adding comment',
        errorLiking: 'Error liking',
        gettingLocation: 'Getting location...',
        nearMyLocation: 'Near my location',
        locationError: 'Could not get your location. Please allow location access.',
        viewDetails: 'View Details',

        // Empty states
        required: '*'
    }
};

// Sistema i18n
const i18n = {
    currentLang: 'es',

    init() {
        // Cargar idioma guardado o detectar idioma del navegador
        const savedLang = localStorage.getItem('parks_language');
        if (savedLang && translations[savedLang]) {
            this.currentLang = savedLang;
        } else {
            // Detectar idioma del navegador
            const browserLang = navigator.language.split('-')[0];
            this.currentLang = translations[browserLang] ? browserLang : 'es';
        }
    },

    setLanguage(lang) {
        if (translations[lang]) {
            this.currentLang = lang;
            localStorage.setItem('parks_language', lang);
            // Recargar la página para aplicar traducciones
            window.location.reload();
        }
    },

    t(key) {
        return translations[this.currentLang][key] || key;
    },

    getLanguage() {
        return this.currentLang;
    },

    getAvailableLanguages() {
        return Object.keys(translations);
    }
};

// Inicializar i18n
i18n.init();
