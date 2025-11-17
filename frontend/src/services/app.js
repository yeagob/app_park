// Aplicación principal
const app = {
    currentView: 'list',
    currentFilters: {},
    userLocation: null,
    allParks: [],

    async init() {
        console.log('🌳 Iniciando Parks Social Network...');
        await this.loadParks();

        // Intentar obtener ubicación del usuario automáticamente
        this.tryGetUserLocation();
    },

    async loadParks(filters = {}) {
        try {
            const data = await api.getParks(filters);
            this.allParks = data.parks;
            this.renderParksList(data.parks);
        } catch (error) {
            console.error('Error loading parks:', error);
            document.getElementById('parksList').innerHTML = `
                <div class="loading" style="color: var(--danger);">
                    Error al cargar los parques. Asegúrate de que el servidor backend esté corriendo.
                </div>
            `;
        }
    },

    renderParksList(parks) {
        const container = document.getElementById('parksList');

        if (parks.length === 0) {
            container.innerHTML = `
                <div class="loading">
                    No se encontraron parques con los filtros seleccionados
                </div>
            `;
            return;
        }

        container.innerHTML = '';
        parks.forEach(park => {
            const card = createParkCard(park);
            container.appendChild(card);
        });
    },

    async handleSearch() {
        const searchTerm = document.getElementById('searchInput').value;
        const filters = { ...this.currentFilters };

        if (searchTerm) {
            filters.search = searchTerm;
        }

        await this.loadParks(filters);

        if (this.currentView === 'map') {
            await loadParksOnMap(filters);
        }
    },

    toggleFilters() {
        const panel = document.getElementById('filterPanel');
        panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
    },

    async applyFilters() {
        const filters = {};

        // Elementos
        const elementCheckboxes = document.querySelectorAll('input[value^="swings"], input[value^="slides"], input[value^="sandbox"], input[value^="water_play"], input[value^="zipline"], input[value^="baby_area"]');
        const selectedElements = Array.from(elementCheckboxes)
            .filter(cb => cb.checked)
            .map(cb => cb.value);

        if (selectedElements.length > 0) {
            filters.elements = selectedElements.join(',');
        }

        // Amenidades
        const amenityCheckboxes = document.querySelectorAll('input[value^="water_fountain"], input[value^="restrooms"], input[value^="parking"], input[value^="wheelchair_accessible"], input[value^="fenced"], input[value^="nearby_cafe"]');
        const selectedAmenities = Array.from(amenityCheckboxes)
            .filter(cb => cb.checked)
            .map(cb => cb.value);

        if (selectedAmenities.length > 0) {
            filters.amenities = selectedAmenities.join(',');
        }

        // Perros permitidos
        const dogsAllowed = document.getElementById('dogsAllowed');
        if (dogsAllowed && dogsAllowed.checked) {
            filters.dogsAllowed = 'true';
        }

        // Valoración mínima
        const minRating = document.getElementById('minRating').value;
        if (minRating && minRating !== '0') {
            filters.minRating = minRating;
        }

        // Ubicación del usuario
        if (this.userLocation) {
            filters.lat = this.userLocation.lat;
            filters.lng = this.userLocation.lng;
        }

        this.currentFilters = filters;
        await this.loadParks(filters);

        if (this.currentView === 'map') {
            await loadParksOnMap(filters);
        }
    },

    async getCurrentLocation() {
        if (!navigator.geolocation) {
            alert('Tu navegador no soporta geolocalización');
            return;
        }

        document.getElementById('searchInput').value = 'Obteniendo ubicación...';

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                this.userLocation = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };

                document.getElementById('searchInput').value = 'Cerca de mi ubicación';

                const filters = {
                    ...this.currentFilters,
                    lat: this.userLocation.lat,
                    lng: this.userLocation.lng,
                    radius: 5 // 5 km de radio por defecto
                };

                await this.loadParks(filters);

                if (this.currentView === 'map') {
                    showUserLocation(this.userLocation.lat, this.userLocation.lng);
                    await loadParksOnMap(filters);
                }
            },
            (error) => {
                console.error('Error getting location:', error);
                alert('No se pudo obtener tu ubicación. Por favor, permite el acceso a la ubicación.');
                document.getElementById('searchInput').value = '';
            }
        );
    },

    tryGetUserLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    this.userLocation = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    };
                    console.log('✅ Ubicación del usuario obtenida');
                },
                (error) => {
                    console.log('ℹ️ No se pudo obtener la ubicación del usuario automáticamente');
                }
            );
        }
    },

    async switchView(view) {
        this.currentView = view;

        // Actualizar botones
        document.querySelectorAll('.btn-toggle').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-view="${view}"]`).classList.add('active');

        // Mostrar/ocultar vistas
        if (view === 'list') {
            document.getElementById('listView').style.display = 'block';
            document.getElementById('mapView').style.display = 'none';
        } else {
            document.getElementById('listView').style.display = 'none';
            document.getElementById('mapView').style.display = 'block';

            // Inicializar mapa si es necesario
            await loadParksOnMap(this.currentFilters);

            // Mostrar ubicación del usuario si está disponible
            if (this.userLocation) {
                showUserLocation(this.userLocation.lat, this.userLocation.lng);
            }
        }
    },

    async showParkDetail(parkId) {
        const modal = document.getElementById('parkDetailModal');
        modal.style.display = 'block';
        await renderParkDetail(parkId);
    },

    closeModal(modalId) {
        document.getElementById(modalId).style.display = 'none';
    },

    showAddParkModal() {
        const modal = document.getElementById('addParkModal');
        modal.style.display = 'block';

        // Pre-rellenar coordenadas si hay ubicación del usuario
        if (this.userLocation) {
            document.querySelector('input[name="lat"]').value = this.userLocation.lat;
            document.querySelector('input[name="lng"]').value = this.userLocation.lng;
        }
    },

    async submitPark(event) {
        event.preventDefault();
        const form = event.target;
        const formData = new FormData(form);

        // Construir objeto de parque
        const parkData = {
            name: formData.get('name'),
            location: {
                address: formData.get('address'),
                coordinates: {
                    lat: parseFloat(formData.get('lat')),
                    lng: parseFloat(formData.get('lng'))
                },
                city: formData.get('city'),
                country: formData.get('country')
            },
            elements: {},
            amenities: {},
            policies: {
                dogs_allowed: formData.get('dogs_allowed') === 'on',
                skating_allowed: false
            },
            surface: formData.get('surface'),
            condition: formData.get('condition'),
            created_by: 'user' // En una app real, esto vendría del sistema de autenticación
        };

        // Procesar elementos
        const elements = formData.getAll('elements');
        ['swings', 'slides', 'sandbox', 'water_play', 'climbing_structure', 'zipline', 'seesaw', 'baby_area', 'picnic_tables'].forEach(el => {
            parkData.elements[el] = elements.includes(el);
        });

        // Procesar amenidades
        const amenities = formData.getAll('amenities');
        ['water_fountain', 'restrooms', 'parking', 'wheelchair_accessible', 'fenced', 'nearby_cafe', 'nearby_supermarket'].forEach(am => {
            parkData.amenities[am] = amenities.includes(am);
        });

        try {
            const newPark = await api.createPark(parkData);
            alert('¡Parque añadido correctamente!');
            this.closeModal('addParkModal');
            form.reset();
            await this.loadParks(this.currentFilters);
        } catch (error) {
            console.error('Error creating park:', error);
            alert('Error al añadir el parque. Por favor, inténtalo de nuevo.');
        }
    },

    async submitComment(event, parkId) {
        event.preventDefault();
        const form = event.target;
        const formData = new FormData(form);

        const commentData = {
            author: formData.get('author'),
            text: formData.get('text')
        };

        try {
            await api.addComment(parkId, commentData);
            form.reset();
            // Recargar los comentarios
            await renderParkDetail(parkId);
        } catch (error) {
            console.error('Error adding comment:', error);
            alert('Error al añadir comentario');
        }
    },

    async likeComment(parkId, commentId) {
        try {
            await api.likeComment(parkId, commentId);
            await renderParkDetail(parkId);
        } catch (error) {
            console.error('Error liking comment:', error);
            alert('Error al dar me gusta');
        }
    },

    async ratePark(parkId, rating) {
        try {
            await api.ratePark(parkId, rating);
            alert(`Has valorado este parque con ${rating} estrellas`);
            await renderParkDetail(parkId);
            await this.loadParks(this.currentFilters);
        } catch (error) {
            console.error('Error rating park:', error);
            alert('Error al valorar el parque');
        }
    }
};

// Cerrar modales al hacer clic fuera
window.onclick = function(event) {
    if (event.target.classList.contains('modal')) {
        event.target.style.display = 'none';
    }
};

// Inicializar aplicación cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    app.init();
});
