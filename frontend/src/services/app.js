// Aplicación principal
const app = {
    currentView: 'list',
    currentFilters: {},
    userLocation: null,
    allParks: [],
    parkLocationMap: null,
    parkMarker: null,

    async init() {
        console.log('🌳 Iniciando Parks Social Network...');

        // Verificar autenticación
        if (!api.auth.isAuthenticated()) {
            this.showLoginModal();
            return;
        }

        // Verificar token válido
        const isValid = await api.verifyToken();
        if (!isValid) {
            this.showLoginModal();
            return;
        }

        // Mostrar info del usuario
        this.updateUserInfo();

        // Cargar parques
        await this.loadParks();

        // Intentar obtener ubicación del usuario automáticamente
        this.tryGetUserLocation();
    },

    showLoginModal() {
        document.getElementById('loginModal').style.display = 'block';
    },

    hideLoginModal() {
        document.getElementById('loginModal').style.display = 'none';
    },

    updateUserInfo() {
        const user = api.auth.getUser();
        if (user) {
            document.getElementById('userEmail').textContent = user.email;
            document.getElementById('logoutBtn').style.display = 'inline-block';
        }
    },

    async handleLogin(event) {
        event.preventDefault();
        const form = event.target;
        const email = form.email.value;

        try {
            await api.login(email);
            this.hideLoginModal();
            this.updateUserInfo();
            await this.loadParks();
            this.tryGetUserLocation();
        } catch (error) {
            alert('Error al iniciar sesión: ' + error.message);
        }
    },

    logout() {
        if (confirm('¿Seguro que quieres cerrar sesión?')) {
            api.logout();
        }
    },

    checkAuth() {
        if (!api.auth.isAuthenticated()) {
            alert('Debes iniciar sesión para realizar esta acción');
            this.showLoginModal();
            return false;
        }
        return true;
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
                    ${api.auth.isAuthenticated()
                        ? 'No hay parques aún. ¡Sé el primero en añadir uno!'
                        : 'No se encontraron parques'}
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
        if (!this.checkAuth()) return;

        const modal = document.getElementById('addParkModal');
        modal.style.display = 'block';

        // Limpiar coordenadas
        document.getElementById('parkLat').value = '';
        document.getElementById('parkLng').value = '';
        document.getElementById('selectedCoords').innerHTML = '<span data-i18n="noLocationSelected">Selecciona una ubicación en el mapa</span>';

        // Inicializar mapa después de que el modal sea visible
        setTimeout(() => {
            this.initParkLocationMap();
        }, 100);
    },

    initParkLocationMap() {
        // Destruir mapa anterior si existe
        if (this.parkLocationMap) {
            this.parkLocationMap.remove();
            this.parkLocationMap = null;
            this.parkMarker = null;
        }

        // Coordenadas por defecto (Madrid, España)
        const defaultLat = this.userLocation ? this.userLocation.lat : 40.4168;
        const defaultLng = this.userLocation ? this.userLocation.lng : -3.7038;

        // Crear mapa
        this.parkLocationMap = L.map('parkLocationMap').setView([defaultLat, defaultLng], 13);

        // Añadir capa de tiles
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors',
            maxZoom: 19
        }).addTo(this.parkLocationMap);

        // Crear icono personalizado para el marcador
        const customIcon = L.icon({
            iconUrl: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMiIgaGVpZ2h0PSI0MCI+PHBhdGggZmlsbD0iIzI1OGE1NyIgZD0iTTE2IDBDNy4xNiAwIDAgNy4xNiAwIDE2YzAgMTIgMTYgMjQgMTYgMjRzMTYtMTIgMTYtMjRjMC04Ljg0LTcuMTYtMTYtMTYtMTZ6bTAgMjJjLTMuMzEgMC02LTIuNjktNi02czIuNjktNiA2LTYgNiAyLjY5IDYgNi0yLjY5IDYtNiA2eiIvPjwvc3ZnPg==',
            iconSize: [32, 40],
            iconAnchor: [16, 40],
            popupAnchor: [0, -40]
        });

        // Añadir marcador arrastrable
        this.parkMarker = L.marker([defaultLat, defaultLng], {
            draggable: true,
            icon: customIcon
        }).addTo(this.parkLocationMap);

        // Actualizar coordenadas cuando se arrastra el marcador
        this.parkMarker.on('dragend', (e) => {
            const position = e.target.getLatLng();
            this.updateParkCoordinates(position.lat, position.lng);
        });

        // Permitir hacer clic en el mapa para mover el marcador
        this.parkLocationMap.on('click', (e) => {
            this.parkMarker.setLatLng(e.latlng);
            this.updateParkCoordinates(e.latlng.lat, e.latlng.lng);
        });

        // Si hay ubicación del usuario, mostrar su posición
        if (this.userLocation) {
            this.updateParkCoordinates(this.userLocation.lat, this.userLocation.lng);
        }
    },

    updateParkCoordinates(lat, lng) {
        // Actualizar campos ocultos
        document.getElementById('parkLat').value = lat.toFixed(6);
        document.getElementById('parkLng').value = lng.toFixed(6);

        // Actualizar texto de coordenadas seleccionadas
        document.getElementById('selectedCoords').innerHTML =
            `📍 <strong>${lat.toFixed(6)}, ${lng.toFixed(6)}</strong>`;
    },

    centerMapOnUserLocation() {
        if (!this.userLocation) {
            alert('No se pudo obtener tu ubicación. Por favor, permite el acceso a la ubicación en tu navegador.');
            this.getCurrentLocation().then(() => {
                if (this.userLocation && this.parkLocationMap) {
                    this.parkLocationMap.setView([this.userLocation.lat, this.userLocation.lng], 15);
                    this.parkMarker.setLatLng([this.userLocation.lat, this.userLocation.lng]);
                    this.updateParkCoordinates(this.userLocation.lat, this.userLocation.lng);
                }
            });
            return;
        }

        if (this.parkLocationMap) {
            this.parkLocationMap.setView([this.userLocation.lat, this.userLocation.lng], 15);
            this.parkMarker.setLatLng([this.userLocation.lat, this.userLocation.lng]);
            this.updateParkCoordinates(this.userLocation.lat, this.userLocation.lng);
        }
    },

    async submitPark(event) {
        event.preventDefault();

        if (!this.checkAuth()) return;

        const form = event.target;
        const formData = new FormData(form);

        // Construir objeto de parque
        const parkData = {
            name: formData.get('name'),
            description: formData.get('description') || '',
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
            condition: formData.get('condition')
        };

        // Procesar elementos
        const elements = formData.getAll('elements');
        ['swings', 'slides', 'sandbox', 'water_play', 'climbing_structure', 'zipline', 'seesaw', 'baby_area', 'picnic_tables'].forEach(el => {
            parkData.elements[el] = elements.includes(el);
        });

        // Procesar amenidades
        const amenities = formData.getAll('amenities');
        ['water_fountain', 'restrooms', 'parking', 'wheelchair_accessible', 'fenced', 'nearby_cafe', 'cafe_with_playground_view', 'nearby_supermarket'].forEach(am => {
            parkData.amenities[am] = amenities.includes(am);
        });

        // Procesar elementos personalizados
        const customElementsText = formData.get('custom_elements') || '';
        if (customElementsText.trim()) {
            parkData.custom_elements = customElementsText
                .split(',')
                .map(el => el.trim())
                .filter(el => el.length > 0);
        } else {
            parkData.custom_elements = [];
        }

        try {
            const newPark = await api.createPark(parkData);
            alert('¡Parque añadido correctamente!');
            this.closeModal('addParkModal');
            form.reset();
            await this.loadParks(this.currentFilters);
        } catch (error) {
            console.error('Error creating park:', error);
            alert('Error al añadir el parque: ' + error.message);
        }
    },

    async submitComment(event, parkId) {
        event.preventDefault();

        if (!this.checkAuth()) return;

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
            alert('Error al añadir comentario: ' + error.message);
        }
    },

    async likeComment(parkId, commentId) {
        if (!this.checkAuth()) return;

        try {
            await api.likeComment(parkId, commentId);
            await renderParkDetail(parkId);
        } catch (error) {
            console.error('Error liking comment:', error);
            alert('Error al dar me gusta: ' + error.message);
        }
    },

    async ratePark(parkId, rating) {
        if (!this.checkAuth()) return;

        try {
            await api.ratePark(parkId, rating);
            alert(`Has valorado este parque con ${rating} estrellas`);
            await renderParkDetail(parkId);
            await this.loadParks(this.currentFilters);
        } catch (error) {
            console.error('Error rating park:', error);
            alert('Error al valorar el parque: ' + error.message);
        }
    },

    // Funciones del Tablón de Anuncios
    toggleBulletinForm(parkId) {
        const form = document.getElementById(`bulletinFormContent-${parkId}`);
        if (form) {
            form.style.display = form.style.display === 'none' ? 'block' : 'none';
        }
    },

    async submitBulletin(event, parkId) {
        event.preventDefault();

        if (!this.checkAuth()) return;

        const form = event.target;
        const formData = new FormData(form);

        const timeStart = formData.get('timeStart');
        const timeEnd = formData.get('timeEnd');
        const contactName = formData.get('contactName');
        const contactPhone = formData.get('contactPhone');

        const bulletinData = {
            type: formData.get('type'),
            title: formData.get('title'),
            description: formData.get('description'),
            ageRange: formData.get('ageRange') || null,
            timeRange: (timeStart && timeEnd) ? { start: timeStart, end: timeEnd } : null,
            contactInfo: (contactName || contactPhone) ? {
                name: contactName || null,
                phone: contactPhone || null
            } : null,
            daysToExpire: 30
        };

        try {
            await api.createBulletin(parkId, bulletinData);
            form.reset();
            this.toggleBulletinForm(parkId);
            alert('Anuncio publicado exitosamente');
            // Recargar los detalles del parque para mostrar el nuevo anuncio
            await renderParkDetail(parkId);
        } catch (error) {
            console.error('Error creating bulletin:', error);
            alert('Error al publicar anuncio: ' + error.message);
        }
    },

    async deleteBulletin(parkId, bulletinId) {
        if (!this.checkAuth()) return;

        if (!confirm('¿Estás seguro de que quieres eliminar este anuncio?')) {
            return;
        }

        try {
            await api.deleteBulletin(parkId, bulletinId);
            alert('Anuncio eliminado exitosamente');
            // Recargar los detalles del parque
            await renderParkDetail(parkId);
        } catch (error) {
            console.error('Error deleting bulletin:', error);
            alert('Error al eliminar anuncio: ' + error.message);
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
