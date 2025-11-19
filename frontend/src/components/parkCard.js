// Componente: Park Card - Enhanced Design
function createParkCard(park) {
    const card = document.createElement('div');
    card.className = 'park-card';
    card.onclick = () => app.showParkDetail(park.id);

    // Add staggered animation
    card.style.opacity = '0';
    card.style.animation = 'fadeInUp 0.6s ease-out forwards';

    // Obtener las características destacadas
    const features = [];
    if (park.elements.swings) features.push({ icon: '🎠', label: i18n.t('swings'), color: 'primary' });
    if (park.elements.slides) features.push({ icon: '🛝', label: i18n.t('slides'), color: 'secondary' });
    if (park.elements.sandbox) features.push({ icon: '🏖️', label: i18n.t('sandbox'), color: 'accent' });
    if (park.elements.water_play) features.push({ icon: '💧', label: i18n.t('waterPlay'), color: 'info' });
    if (park.elements.zipline) features.push({ icon: '🎢', label: i18n.t('zipline'), color: 'primary' });
    if (park.elements.baby_area) features.push({ icon: '👶', label: i18n.t('babyArea'), color: 'accent' });
    if (park.amenities.restrooms) features.push({ icon: '🚻', label: i18n.t('restrooms'), color: 'secondary' });
    if (park.amenities.parking) features.push({ icon: '🅿️', label: i18n.t('parking'), color: 'secondary' });
    if (park.amenities.cafe_with_playground_view) features.push({ icon: '👀☕', label: i18n.t('cafeWithView'), color: 'accent' });
    if (park.amenities.wheelchair_accessible) features.push({ icon: '♿', label: i18n.t('wheelchairAccessible'), color: 'success' });

    const displayFeatures = features.slice(0, 5);

    // Calcular imagen (placeholder por ahora)
    const imageUrl = park.photos.main
        ? `http://localhost:3001/photos/${park.id}/${park.photos.main}`
        : '';

    const distanceHtml = park.distance
        ? `<div class="park-distance">📍 ${formatDistance(park.distance)}</div>`
        : '';

    // Determinar badge de rating
    const ratingClass = park.rating.average >= 4.5 ? 'excellent' : park.rating.average >= 4.0 ? 'good' : park.rating.average >= 3.0 ? 'fair' : 'poor';

    card.innerHTML = `
        ${imageUrl ? `<img src="${imageUrl}" alt="${park.name}" class="park-image" loading="lazy">` : '<div class="park-image"></div>'}
        <div class="park-content">
            <div class="park-header">
                <h3 class="park-name">${park.name}</h3>
                <div class="park-rating rating-${ratingClass}">
                    ⭐ ${park.rating.average.toFixed(1)}
                    <span style="font-size: 0.75rem; opacity: 0.9;">(${park.rating.count})</span>
                </div>
            </div>
            <div class="park-location">📍 ${park.location.city}, ${park.location.country}</div>
            ${distanceHtml}
            <div class="park-features">
                ${displayFeatures.map(f => `<span class="feature-tag feature-${f.color}">${f.icon} ${f.label}</span>`).join('')}
                ${features.length > 5 ? `<span class="feature-tag feature-more">+${features.length - 5} más</span>` : ''}
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
