// Componente: Park Detail
async function renderParkDetail(parkId) {
    const container = document.getElementById('parkDetailContent');
    container.innerHTML = '<div class="loading">Cargando detalles...</div>';

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
                        <span style="font-size: 0.9rem;">(${park.rating.count} valoraciones)</span>
                    </div>
                </div>

                <div class="info-section">
                    <h3>📍 Ubicación</h3>
                    <p><strong>Dirección:</strong> ${park.location.address}</p>
                    <p><strong>Ciudad:</strong> ${park.location.city}, ${park.location.country}</p>
                    ${park.hours.always_open
                        ? '<p><strong>Horario:</strong> Abierto 24/7</p>'
                        : `<p><strong>Horario:</strong> ${park.hours.schedule}</p>`
                    }
                </div>

                <div class="info-section">
                    <h3>🎪 Elementos del Parque</h3>
                    <div class="info-grid">
                        ${elementsHtml}
                    </div>
                </div>

                <div class="info-section">
                    <h3>🛠️ Servicios y Comodidades</h3>
                    <div class="info-grid">
                        ${amenitiesHtml}
                    </div>
                </div>

                <div class="info-section">
                    <h3>ℹ️ Información Adicional</h3>
                    <div class="info-grid">
                        <div class="info-item">
                            <span>Superficie: ${translateSurface(park.surface)}</span>
                        </div>
                        <div class="info-item">
                            <span>Condición: ${translateCondition(park.condition)}</span>
                        </div>
                        <div class="info-item">
                            <span>Edad recomendada: ${park.age_range} años</span>
                        </div>
                        <div class="info-item ${park.policies.dogs_allowed ? 'available' : 'not-available'}">
                            <span>${park.policies.dogs_allowed ? '✅' : '❌'} Perros ${park.policies.dogs_allowed ? 'permitidos' : 'no permitidos'}</span>
                        </div>
                        <div class="info-item ${park.policies.skating_allowed ? 'available' : 'not-available'}">
                            <span>${park.policies.skating_allowed ? '✅' : '❌'} Patines/bicicletas ${park.policies.skating_allowed ? 'permitidos' : 'no permitidos'}</span>
                        </div>
                    </div>
                </div>

                <div class="info-section">
                    <h3>⭐ Valorar este parque</h3>
                    <div style="display: flex; gap: 0.5rem; margin-top: 1rem;">
                        ${[1, 2, 3, 4, 5].map(rating => `
                            <button class="btn btn-icon" onclick="app.ratePark('${parkId}', ${rating})" style="font-size: 1.5rem;">
                                ${rating}⭐
                            </button>
                        `).join('')}
                    </div>
                </div>

                <div class="comments-section">
                    <h3>💬 Comentarios (${commentsData.total})</h3>

                    <div class="comment-form">
                        <form onsubmit="app.submitComment(event, '${parkId}')">
                            <div class="form-group">
                                <input type="text" name="author" placeholder="Tu nombre" required style="margin-bottom: 0.5rem;">
                                <textarea name="text" placeholder="Comparte tu experiencia en este parque..." required></textarea>
                            </div>
                            <div class="comment-form-actions">
                                <button type="submit" class="btn btn-primary">Publicar Comentario</button>
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
            <div class="loading" style="color: var(--danger);">
                Error al cargar los detalles del parque
            </div>
        `;
    }
}

function renderElements(elements) {
    const elementsList = {
        swings: '🎠 Columpios',
        slides: '🛝 Toboganes',
        sandbox: '🏖️ Arenero',
        water_play: '💧 Zona de agua',
        climbing_structure: '🧗 Escalada',
        zipline: '🎢 Tirolina',
        seesaw: '⚖️ Balancines',
        baby_area: '👶 Zona bebés',
        picnic_tables: '🪑 Mesas picnic'
    };

    return Object.entries(elementsList)
        .map(([key, label]) => {
            const available = elements[key];
            const className = available ? 'info-item available' : 'info-item not-available';
            const icon = available ? '✅' : '❌';
            return `<div class="${className}">${icon} ${label}</div>`;
        })
        .join('');
}

function renderAmenities(amenities) {
    const amenitiesList = {
        water_fountain: '🚰 Fuente de agua',
        restrooms: '🚻 Baños',
        parking: '🅿️ Parking',
        wheelchair_accessible: '♿ Accesible',
        fenced: '🚧 Vallado',
        nearby_cafe: '☕ Bar cerca',
        nearby_supermarket: '🛒 Supermercado cerca'
    };

    return Object.entries(amenitiesList)
        .map(([key, label]) => {
            const available = amenities[key];
            const className = available ? 'info-item available' : 'info-item not-available';
            const icon = available ? '✅' : '❌';
            return `<div class="${className}">${icon} ${label}</div>`;
        })
        .join('');
}

function renderComments(comments, parkId) {
    if (comments.length === 0) {
        return '<p class="text-center" style="color: var(--gray); padding: 2rem;">Aún no hay comentarios. ¡Sé el primero en comentar!</p>';
    }

    return comments.map(comment => `
        <div class="comment">
            <div class="comment-header">
                <span class="comment-author">${comment.author}</span>
                <span class="comment-date">${formatDate(comment.created_at)}</span>
            </div>
            ${comment.rating ? `<div style="margin-bottom: 0.5rem;">⭐ ${comment.rating}/5</div>` : ''}
            <div class="comment-text">${comment.text}</div>
            <div class="comment-actions">
                <button class="like-btn" onclick="app.likeComment('${parkId}', '${comment.id}')">
                    ❤️ ${comment.likes} Me gusta
                </button>
            </div>
        </div>
    `).join('');
}

function translateSurface(surface) {
    const translations = {
        rubber: 'Caucho',
        sand: 'Arena',
        grass: 'Césped',
        mixed: 'Mixto',
        unknown: 'Desconocido'
    };
    return translations[surface] || surface;
}

function translateCondition(condition) {
    const translations = {
        excellent: 'Excelente',
        good: 'Buena',
        fair: 'Regular',
        needs_maintenance: 'Necesita mantenimiento'
    };
    return translations[condition] || condition;
}

function formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Hoy';
    if (diffDays === 1) return 'Ayer';
    if (diffDays < 7) return `Hace ${diffDays} días`;
    if (diffDays < 30) return `Hace ${Math.floor(diffDays / 7)} semanas`;

    return date.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}
