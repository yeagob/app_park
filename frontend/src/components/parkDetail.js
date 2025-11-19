// Componente: Park Detail
async function renderParkDetail(parkId) {
    const container = document.getElementById('parkDetailContent');
    container.innerHTML = '<div class="loading">Cargando detalles...</div>';

    try {
        const park = await api.getPark(parkId);
        const commentsData = await api.getComments(parkId);
        const bulletinsData = await api.getBulletins(parkId);

        const elementsHtml = renderElements(park.elements);
        const amenitiesHtml = renderAmenities(park.amenities);
        const bulletinsHtml = renderBulletins(bulletinsData.bulletins, parkId);
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
                    <p><strong>Coordenadas:</strong> ${park.location.coordinates.lat.toFixed(6)}, ${park.location.coordinates.lng.toFixed(6)}</p>
                    ${park.hours.always_open
                        ? '<p><strong>Horario:</strong> Abierto 24/7</p>'
                        : `<p><strong>Horario:</strong> ${park.hours.schedule}</p>`
                    }
                </div>

                ${park.description ? `
                <div class="info-section">
                    <h3>📝 Descripción</h3>
                    <p style="line-height: 1.6; white-space: pre-wrap;">${park.description}</p>
                </div>
                ` : ''}

                <div class="info-section">
                    <h3>🎪 Elementos del Parque</h3>
                    <div class="info-grid">
                        ${elementsHtml}
                    </div>
                    ${park.custom_elements && park.custom_elements.length > 0 ? `
                    <div style="margin-top: 1rem; padding: 1rem; background: var(--bg-secondary); border-radius: 8px;">
                        <h4 style="margin: 0 0 0.5rem 0; font-size: 0.9rem; color: var(--gray);">🎯 Elementos Personalizados:</h4>
                        <div style="display: flex; flex-wrap: wrap; gap: 0.5rem;">
                            ${park.custom_elements.map(el => `
                                <span style="padding: 0.25rem 0.75rem; background: var(--primary); color: white; border-radius: 16px; font-size: 0.9rem;">
                                    ${el}
                                </span>
                            `).join('')}
                        </div>
                    </div>
                    ` : ''}
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

                <div class="bulletins-section">
                    <h3>📌 Tablón de Anuncios (${bulletinsData.bulletins.length})</h3>
                    <p style="color: var(--gray); font-size: 0.9rem; margin-bottom: 1rem;">
                        Comparte anuncios con otros padres: busca compañeros de juegos, ofrece o busca cuidado de niños, o cualquier cosa relacionada con el parque.
                    </p>

                    ${api.auth.isAuthenticated() ? `
                    <div class="bulletin-form" id="bulletinForm-${parkId}">
                        <button class="btn btn-primary" onclick="app.toggleBulletinForm('${parkId}')" style="margin-bottom: 1rem;">
                            ➕ Añadir Anuncio
                        </button>
                        <form id="bulletinFormContent-${parkId}" onsubmit="app.submitBulletin(event, '${parkId}')" style="display: none;">
                            <div class="form-group">
                                <label>Tipo de anuncio:</label>
                                <select name="type" required style="margin-bottom: 0.5rem;">
                                    <option value="">Selecciona un tipo...</option>
                                    <option value="looking_for_playmate">🧒 Busco niños para jugar</option>
                                    <option value="looking_for_childcare">👶 Busco cuidador/a</option>
                                    <option value="offering_childcare">🤱 Ofrezco cuidado de niños</option>
                                    <option value="offering_service">🎨 Ofrezco servicio/actividad</option>
                                    <option value="other">📝 Otro</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label>Título:</label>
                                <input type="text" name="title" placeholder="Ej: Busco niños 5-7 años para jugar" required style="margin-bottom: 0.5rem;">
                            </div>
                            <div class="form-group">
                                <label>Descripción:</label>
                                <textarea name="description" placeholder="Describe tu anuncio..." required style="margin-bottom: 0.5rem;"></textarea>
                            </div>
                            <div class="form-group">
                                <label>Rango de edad (opcional):</label>
                                <input type="text" name="ageRange" placeholder="Ej: 5-7, 8+, 2-4" style="margin-bottom: 0.5rem;">
                            </div>
                            <div class="form-group">
                                <label>Horario (opcional):</label>
                                <div style="display: flex; gap: 0.5rem;">
                                    <input type="time" name="timeStart" placeholder="Desde" style="margin-bottom: 0.5rem;">
                                    <input type="time" name="timeEnd" placeholder="Hasta" style="margin-bottom: 0.5rem;">
                                </div>
                            </div>
                            <div class="form-group">
                                <label>Contacto (opcional):</label>
                                <input type="text" name="contactName" placeholder="Tu nombre" style="margin-bottom: 0.5rem;">
                                <input type="text" name="contactPhone" placeholder="Teléfono o email" style="margin-bottom: 0.5rem;">
                            </div>
                            <div class="bulletin-form-actions">
                                <button type="submit" class="btn btn-primary">Publicar Anuncio</button>
                                <button type="button" class="btn btn-secondary" onclick="app.toggleBulletinForm('${parkId}')">Cancelar</button>
                            </div>
                        </form>
                    </div>
                    ` : `
                    <div class="alert-info">
                        <p>Inicia sesión para publicar anuncios en el tablón</p>
                    </div>
                    `}

                    <div id="bulletinsList-${parkId}">
                        ${bulletinsHtml}
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
        water_fountain: '🚰 ' + i18n.t('waterFountain'),
        restrooms: '🚻 ' + i18n.t('restrooms'),
        parking: '🅿️ ' + i18n.t('parking'),
        wheelchair_accessible: '♿ ' + i18n.t('wheelchairAccessible'),
        fenced: '🚧 ' + i18n.t('fenced'),
        nearby_cafe: '☕ ' + i18n.t('nearbyCafe'),
        cafe_with_playground_view: '👀☕ ' + i18n.t('cafeWithView'),
        nearby_supermarket: '🛒 ' + i18n.t('nearbySupermarket')
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

function renderBulletins(bulletins, parkId) {
    if (bulletins.length === 0) {
        return '<p class="text-center" style="color: var(--gray); padding: 2rem;">No hay anuncios todavía. ¡Sé el primero en publicar!</p>';
    }

    return bulletins.map(bulletin => {
        const isOwner = api.auth.isAuthenticated() && api.auth.getUser().email === bulletin.createdBy;
        const bulletinTypeInfo = getBulletinTypeInfo(bulletin.type);

        return `
            <div class="bulletin-card ${bulletinTypeInfo.class}">
                <div class="bulletin-header">
                    <span class="bulletin-type">${bulletinTypeInfo.icon} ${bulletinTypeInfo.label}</span>
                    <span class="bulletin-date">${formatDate(bulletin.createdAt)}</span>
                </div>
                <h4 class="bulletin-title">${bulletin.title}</h4>
                <p class="bulletin-description">${bulletin.description}</p>
                ${bulletin.ageRange ? `
                    <div class="bulletin-info">
                        <span class="bulletin-tag">👶 Edad: ${bulletin.ageRange} años</span>
                    </div>
                ` : ''}
                ${bulletin.timeRange ? `
                    <div class="bulletin-info">
                        <span class="bulletin-tag">🕐 Horario: ${bulletin.timeRange.start} - ${bulletin.timeRange.end}</span>
                    </div>
                ` : ''}
                ${bulletin.contactInfo ? `
                    <div class="bulletin-contact">
                        <strong>📞 Contacto:</strong> ${bulletin.contactInfo.name || ''}${bulletin.contactInfo.phone ? ` - ${bulletin.contactInfo.phone}` : ''}
                    </div>
                ` : ''}
                ${isOwner ? `
                    <div class="bulletin-actions">
                        <button class="btn btn-danger btn-sm" onclick="app.deleteBulletin('${parkId}', '${bulletin.id}')">
                            🗑️ Eliminar
                        </button>
                    </div>
                ` : ''}
            </div>
        `;
    }).join('');
}

function getBulletinTypeInfo(type) {
    const types = {
        looking_for_playmate: {
            icon: '🧒',
            label: 'Busco compañero/a de juegos',
            class: 'bulletin-playmate'
        },
        looking_for_childcare: {
            icon: '👶',
            label: 'Busco cuidador/a',
            class: 'bulletin-childcare'
        },
        offering_childcare: {
            icon: '🤱',
            label: 'Ofrezco cuidado de niños',
            class: 'bulletin-offering'
        },
        offering_service: {
            icon: '🎨',
            label: 'Ofrezco servicio/actividad',
            class: 'bulletin-service'
        },
        other: {
            icon: '📝',
            label: 'Otro',
            class: 'bulletin-other'
        }
    };

    return types[type] || types.other;
}
