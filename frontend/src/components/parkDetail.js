// Componente: Park Detail - Enhanced Design
async function renderParkDetail(parkId) {
    const container = document.getElementById('parkDetailContent');
    container.innerHTML = '<div class="loading">Cargando detalles del parque...</div>';

    try {
        const park = await api.getPark(parkId);
        const commentsData = await api.getComments(parkId);

        const elementsHtml = renderElements(park.elements);
        const amenitiesHtml = renderAmenities(park.amenities);
        const commentsHtml = renderComments(commentsData.comments, parkId);

        container.innerHTML = `
            <div class="park-detail">
                <div class="park-detail-header">
                    <h2 class="park-detail-title">${park.name}</h2>
                    <div class="park-detail-rating">
                        ⭐ ${park.rating.average.toFixed(1)} / 5.0
                        <span style="font-size: 0.875rem; opacity: 0.95;">(${park.rating.count} ${i18n.t('ratings') || 'valoraciones'})</span>
                    </div>
                </div>

                <div class="info-section">
                    <h3>📍 ${i18n.t('location') || 'Ubicación'}</h3>
                    <div class="location-details">
                        <div class="info-card">
                            <div class="info-icon">🏠</div>
                            <div>
                                <strong>${i18n.t('address') || 'Dirección'}:</strong><br>
                                ${park.location.address}
                            </div>
                        </div>
                        <div class="info-card">
                            <div class="info-icon">🌆</div>
                            <div>
                                <strong>${i18n.t('city') || 'Ciudad'}:</strong><br>
                                ${park.location.city}, ${park.location.country}
                            </div>
                        </div>
                        <div class="info-card">
                            <div class="info-icon">🕒</div>
                            <div>
                                <strong>${i18n.t('schedule') || 'Horario'}:</strong><br>
                                ${park.hours.always_open
                                    ? i18n.t('open247') || 'Abierto 24/7'
                                    : park.hours.schedule || 'Horario variable'
                                }
                            </div>
                        </div>
                    </div>
                </div>

                <div class="info-section">
                    <h3>🎪 ${i18n.t('parkElements') || 'Elementos del Parque'}</h3>
                    <div class="info-grid">
                        ${elementsHtml}
                    </div>
                </div>

                <div class="info-section">
                    <h3>🛠️ ${i18n.t('servicesAndAmenities') || 'Servicios y Comodidades'}</h3>
                    <div class="info-grid">
                        ${amenitiesHtml}
                    </div>
                </div>

                <div class="info-section">
                    <h3>ℹ️ ${i18n.t('additionalInformation') || 'Información Adicional'}</h3>
                    <div class="info-grid">
                        <div class="info-item available">
                            <span class="info-icon-sm">🏗️</span>
                            <span><strong>${i18n.t('surface') || 'Superficie'}:</strong> ${translateSurface(park.surface)}</span>
                        </div>
                        <div class="info-item available">
                            <span class="info-icon-sm">⚙️</span>
                            <span><strong>${i18n.t('condition') || 'Condición'}:</strong> ${translateCondition(park.condition)}</span>
                        </div>
                        <div class="info-item available">
                            <span class="info-icon-sm">👶</span>
                            <span><strong>${i18n.t('ageRange') || 'Edad recomendada'}:</strong> ${park.age_range} ${i18n.t('years') || 'años'}</span>
                        </div>
                        <div class="info-item ${park.policies.dogs_allowed ? 'available' : 'not-available'}">
                            <span class="info-icon-sm">${park.policies.dogs_allowed ? '✅' : '❌'}</span>
                            <span><strong>${i18n.t('dogs') || 'Perros'}:</strong> ${park.policies.dogs_allowed ? (i18n.t('allowed') || 'permitidos') : (i18n.t('notAllowed') || 'no permitidos')}</span>
                        </div>
                        <div class="info-item ${park.policies.skating_allowed ? 'available' : 'not-available'}">
                            <span class="info-icon-sm">${park.policies.skating_allowed ? '✅' : '❌'}</span>
                            <span><strong>${i18n.t('skating') || 'Patines/bicicletas'}:</strong> ${park.policies.skating_allowed ? (i18n.t('allowed') || 'permitidos') : (i18n.t('notAllowed') || 'no permitidos')}</span>
                        </div>
                    </div>
                </div>

                <div class="info-section">
                    <h3>⭐ ${i18n.t('ratePark') || 'Valorar este parque'}</h3>
                    <div class="rating-buttons">
                        ${[1, 2, 3, 4, 5].map(rating => `
                            <button class="btn btn-rating" onclick="app.ratePark('${parkId}', ${rating})" title="${rating} ${i18n.t('stars') || 'estrellas'}">
                                ${rating}⭐
                            </button>
                        `).join('')}
                    </div>
                </div>

                <div class="comments-section">
                    <h3>💬 ${i18n.t('comments') || 'Comentarios'} (${commentsData.total})</h3>

                    <div class="comment-form">
                        <h4 style="margin-bottom: 1rem; color: var(--gray-700);">✍️ ${i18n.t('shareExperience') || 'Comparte tu experiencia'}</h4>
                        <form onsubmit="app.submitComment(event, '${parkId}')">
                            <div class="form-group">
                                <input type="text" name="author" placeholder="${i18n.t('yourName') || 'Tu nombre'}" required style="margin-bottom: 0.75rem;">
                                <textarea name="text" placeholder="${i18n.t('shareExperiencePlaceholder') || 'Comparte tu experiencia en este parque...'}" required></textarea>
                            </div>
                            <div class="comment-form-actions">
                                <button type="submit" class="btn btn-primary">
                                    📝 ${i18n.t('publishComment') || 'Publicar Comentario'}
                                </button>
                            </div>
                        </form>
                    </div>

                    <div id="commentsList">
                        ${commentsHtml}
                    </div>
                </div>
            </div>
        `;
    } catch (error) {
        console.error('Error loading park details:', error);
        container.innerHTML = `
            <div class="error-message">
                <div class="error-icon">⚠️</div>
                <h3>${i18n.t('error') || 'Error'}</h3>
                <p>${i18n.t('errorLoadingPark') || 'Error al cargar los detalles del parque'}</p>
            </div>
        `;
    }
}

function renderElements(elements) {
    const elementsList = {
        swings: { icon: '🎠', label: i18n.t('swings') || 'Columpios' },
        slides: { icon: '🛝', label: i18n.t('slides') || 'Toboganes' },
        sandbox: { icon: '🏖️', label: i18n.t('sandbox') || 'Arenero' },
        water_play: { icon: '💧', label: i18n.t('waterPlay') || 'Zona de agua' },
        climbing_structure: { icon: '🧗', label: i18n.t('climbingStructure') || 'Escalada' },
        zipline: { icon: '🎢', label: i18n.t('zipline') || 'Tirolina' },
        seesaw: { icon: '⚖️', label: i18n.t('seesaw') || 'Balancines' },
        baby_area: { icon: '👶', label: i18n.t('babyArea') || 'Zona bebés' },
        picnic_tables: { icon: '🪑', label: i18n.t('picnicTables') || 'Mesas picnic' }
    };

    return Object.entries(elementsList)
        .map(([key, data]) => {
            const available = elements[key];
            const className = available ? 'info-item available' : 'info-item not-available';
            const icon = available ? '✅' : '❌';
            return `<div class="${className}">${icon} ${data.icon} ${data.label}</div>`;
        })
        .join('');
}

function renderAmenities(amenities) {
    const amenitiesList = {
        water_fountain: { icon: '🚰', label: i18n.t('waterFountain') || 'Fuente de agua' },
        restrooms: { icon: '🚻', label: i18n.t('restrooms') || 'Baños' },
        parking: { icon: '🅿️', label: i18n.t('parking') || 'Parking' },
        wheelchair_accessible: { icon: '♿', label: i18n.t('wheelchairAccessible') || 'Accesible' },
        fenced: { icon: '🚧', label: i18n.t('fenced') || 'Vallado' },
        nearby_cafe: { icon: '☕', label: i18n.t('nearbyCafe') || 'Bar cerca' },
        cafe_with_playground_view: { icon: '👀☕', label: i18n.t('cafeWithView') || 'Bar con vista a los niños' },
        nearby_supermarket: { icon: '🛒', label: i18n.t('nearbySupermarket') || 'Supermercado cerca' }
    };

    return Object.entries(amenitiesList)
        .map(([key, data]) => {
            const available = amenities[key];
            const className = available ? 'info-item available' : 'info-item not-available';
            const icon = available ? '✅' : '❌';
            return `<div class="${className}">${icon} ${data.icon} ${data.label}</div>`;
        })
        .join('');
}

function renderComments(comments, parkId) {
    if (comments.length === 0) {
        return `
            <div class="no-comments">
                <div class="no-comments-icon">💬</div>
                <p>${i18n.t('noComments') || 'Aún no hay comentarios'}</p>
                <p class="no-comments-subtitle">${i18n.t('beFirst') || '¡Sé el primero en comentar!'}</p>
            </div>
        `;
    }

    return comments.map((comment, index) => `
        <div class="comment" style="animation: fadeInUp 0.4s ease-out ${index * 0.1}s backwards;">
            <div class="comment-header">
                <div class="comment-author-section">
                    <div class="comment-avatar">${comment.author.charAt(0).toUpperCase()}</div>
                    <div>
                        <div class="comment-author">${comment.author}</div>
                        <div class="comment-date">📅 ${formatDate(comment.created_at)}</div>
                    </div>
                </div>
                ${comment.rating ? `<div class="comment-rating">⭐ ${comment.rating}/5</div>` : ''}
            </div>
            <div class="comment-text">${comment.text}</div>
            <div class="comment-actions">
                <button class="like-btn ${comment.likes > 0 ? 'liked' : ''}" onclick="app.likeComment('${parkId}', '${comment.id}')">
                    ${comment.likes > 0 ? '❤️' : '🤍'} ${comment.likes} ${i18n.t('likes') || 'Me gusta'}
                </button>
            </div>
        </div>
    `).join('');
}

function translateSurface(surface) {
    const translations = {
        rubber: i18n.t('rubber') || 'Caucho',
        sand: i18n.t('sand') || 'Arena',
        grass: i18n.t('grass') || 'Césped',
        mixed: i18n.t('mixed') || 'Mixto',
        unknown: i18n.t('unknown') || 'Desconocido'
    };
    return translations[surface] || surface;
}

function translateCondition(condition) {
    const translations = {
        excellent: i18n.t('excellent') || 'Excelente',
        good: i18n.t('good') || 'Buena',
        fair: i18n.t('fair') || 'Regular',
        needs_maintenance: i18n.t('needsMaintenance') || 'Necesita mantenimiento'
    };
    return translations[condition] || condition;
}

function formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    const lang = i18n.getLanguage ? i18n.getLanguage() : 'es';

    if (diffDays === 0) return i18n.t('today') || 'Hoy';
    if (diffDays === 1) return i18n.t('yesterday') || 'Ayer';
    if (diffDays < 7) return `${i18n.t('daysAgo') || 'Hace'} ${diffDays} ${i18n.t('days') || 'días'}`;
    if (diffDays < 30) {
        const weeks = Math.floor(diffDays / 7);
        return `${i18n.t('weeksAgo') || 'Hace'} ${weeks} ${weeks === 1 ? (i18n.t('week') || 'semana') : (i18n.t('weeks') || 'semanas')}`;
    }

    return date.toLocaleDateString(lang === 'en' ? 'en-US' : 'es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}
