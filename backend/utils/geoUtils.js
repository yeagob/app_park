const { getDistance, isPointWithinRadius } = require('geolib');

/**
 * Calcula la distancia entre dos coordenadas en metros
 * @param {Object} coord1 - {lat, lng}
 * @param {Object} coord2 - {lat, lng}
 * @returns {number} Distancia en metros
 */
function calculateDistance(coord1, coord2) {
  return getDistance(
    { latitude: coord1.lat, longitude: coord1.lng },
    { latitude: coord2.lat, longitude: coord2.lng }
  );
}

/**
 * Filtra parques dentro de un radio específico
 * @param {Array} parks - Lista de parques
 * @param {Object} center - Coordenadas centrales {lat, lng}
 * @param {number} radiusInMeters - Radio en metros
 * @returns {Array} Parques filtrados con distancia añadida
 */
function filterParksByRadius(parks, center, radiusInMeters) {
  return parks
    .map(park => {
      const distance = calculateDistance(center, park.location.coordinates);
      return {
        ...park,
        distance
      };
    })
    .filter(park => park.distance <= radiusInMeters)
    .sort((a, b) => a.distance - b.distance);
}

/**
 * Ordena parques por distancia desde un punto
 * @param {Array} parks - Lista de parques
 * @param {Object} center - Coordenadas centrales {lat, lng}
 * @returns {Array} Parques ordenados por distancia
 */
function sortParksByDistance(parks, center) {
  return parks
    .map(park => {
      const distance = calculateDistance(center, park.location.coordinates);
      return {
        ...park,
        distance
      };
    })
    .sort((a, b) => a.distance - b.distance);
}

/**
 * Convierte metros a kilómetros con formato legible
 * @param {number} meters
 * @returns {string}
 */
function formatDistance(meters) {
  if (meters < 1000) {
    return `${Math.round(meters)} m`;
  }
  return `${(meters / 1000).toFixed(1)} km`;
}

module.exports = {
  calculateDistance,
  filterParksByRadius,
  sortParksByDistance,
  formatDistance
};
