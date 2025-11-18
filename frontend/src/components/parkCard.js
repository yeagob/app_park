// Componente: Park Card
function createParkCard(park) {
    const card = document.createElement('div');
    card.className = 'park-card';
    card.onclick = () => app.showParkDetail(park.id);

    // Obtener las características destacadas
    const features = [];
    if (park.elements.swings) features.push('🎠 ' + i18n.t('swings'));
    if (park.elements.slides) features.push('🛝 ' + i18n.t('slides'));
    if (park.elements.sandbox) features.push('🏖️ ' + i18n.t('sandbox'));
    if (park.elements.water_play) features.push('💧 ' + i18n.t('waterPlay'));
    if (park.elements.zipline) features.push('🎢 ' + i18n.t('zipline'));
    if (park.amenities.restrooms) features.push('🚻 ' + i18n.t('restrooms'));
    if (park.amenities.parking) features.push('🅿️ ' + i18n.t('parking'));
    if (park.amenities.cafe_with_playground_view) features.push('👀☕ ' + i18n.t('cafeWithView'));

    const displayFeatures = features.slice(0, 4);

    // Calcular imagen (placeholder por ahora)
    const imageUrl = park.photos.main
        ? `http://localhost:3001/photos/${park.id}/${park.photos.main}`
        : '';

    const distanceHtml = park.distance
        ? `<div class="park-distance">📍 ${formatDistance(park.distance)}</div>`
        : '';

    card.innerHTML = `
        ${imageUrl ? `<img src="${imageUrl}" alt="${park.name}" class="park-image">` : '<div class="park-image"></div>'}
        <div class="park-content">
            <div class="park-header">
                <h3 class="park-name">${park.name}</h3>
                <div class="park-rating">
                    ⭐ ${park.rating.average.toFixed(1)}
                    <span style="font-size: 0.8rem;">(${park.rating.count})</span>
                </div>
            </div>
            <div class="park-location">📍 ${park.location.address}</div>
            ${distanceHtml}
            <div class="park-features">
                ${displayFeatures.map(f => `<span class="feature-tag">${f}</span>`).join('')}
                ${features.length > 4 ? `<span class="feature-tag">+${features.length - 4} más</span>` : ''}
            </div>
        </div>
    `;

    return card;
}

function formatDistance(meters) {
    if (meters < 1000) {
        return `${Math.round(meters)} m`;
    }
    return `${(meters / 1000).toFixed(1)} km`;
}
