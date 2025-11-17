// Mapa interactivo con Leaflet
let map = null;
let markers = [];
let userMarker = null;

function initMap() {
    if (map) {
        map.remove();
    }

    // Crear mapa centrado en Madrid por defecto
    map = L.map('map').setView([40.4168, -3.7038], 12);

    // Añadir capa de OpenStreetMap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19
    }).addTo(map);

    return map;
}

async function loadParksOnMap(filters = {}) {
    if (!map) {
        initMap();
    }

    // Limpiar marcadores anteriores
    markers.forEach(marker => marker.remove());
    markers = [];

    try {
        const data = await api.getParks(filters);
        const parks = data.parks;

        if (parks.length === 0) {
            alert('No se encontraron parques con los filtros seleccionados');
            return;
        }

        // Crear marcadores para cada parque
        parks.forEach(park => {
            const marker = L.marker([park.location.coordinates.lat, park.location.coordinates.lng])
                .addTo(map);

            // Popup con información del parque
            const popupContent = `
                <div style="min-width: 200px;">
                    <h3 style="margin: 0 0 0.5rem 0; color: var(--dark);">${park.name}</h3>
                    <div style="margin-bottom: 0.5rem;">
                        <span style="background: var(--warning); color: white; padding: 0.2rem 0.5rem; border-radius: 10px; font-size: 0.85rem;">
                            ⭐ ${park.rating.average.toFixed(1)}
                        </span>
                    </div>
                    <p style="margin: 0.5rem 0; color: var(--gray); font-size: 0.9rem;">
                        ${park.location.address}
                    </p>
                    <button
                        onclick="app.showParkDetail('${park.id}')"
                        style="background: var(--primary); color: white; border: none; padding: 0.5rem 1rem; border-radius: 4px; cursor: pointer; width: 100%; margin-top: 0.5rem;"
                    >
                        Ver Detalles
                    </button>
                </div>
            `;

            marker.bindPopup(popupContent);
            markers.push(marker);
        });

        // Ajustar vista del mapa para mostrar todos los marcadores
        if (markers.length > 0) {
            const group = L.featureGroup(markers);
            map.fitBounds(group.getBounds().pad(0.1));
        }
    } catch (error) {
        console.error('Error loading parks on map:', error);
        alert('Error al cargar los parques en el mapa');
    }
}

function showUserLocation(lat, lng) {
    if (!map) {
        initMap();
    }

    // Eliminar marcador de usuario anterior
    if (userMarker) {
        userMarker.remove();
    }

    // Crear icono personalizado para el usuario
    const userIcon = L.divIcon({
        className: 'user-location-marker',
        html: '<div style="background: #3498db; width: 20px; height: 20px; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 10px rgba(0,0,0,0.3);"></div>',
        iconSize: [20, 20],
        iconAnchor: [10, 10]
    });

    // Añadir marcador de usuario
    userMarker = L.marker([lat, lng], { icon: userIcon })
        .addTo(map)
        .bindPopup('📍 Tu ubicación');

    // Centrar mapa en la ubicación del usuario
    map.setView([lat, lng], 14);
}
