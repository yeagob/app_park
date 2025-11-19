// API Service para comunicación con el backend
const API_BASE_URL = 'http://localhost:3001/api';

// Auth helpers
const auth = {
    getToken() {
        return localStorage.getItem('parks_token');
    },

    setToken(token) {
        localStorage.setItem('parks_token', token);
    },

    getUser() {
        const user = localStorage.getItem('parks_user');
        return user ? JSON.parse(user) : null;
    },

    setUser(user) {
        localStorage.setItem('parks_user', JSON.stringify(user));
    },

    clear() {
        localStorage.removeItem('parks_token');
        localStorage.removeItem('parks_user');
    },

    isAuthenticated() {
        return !!this.getToken();
    }
};

// Get headers with authentication
function getHeaders(includeAuth = true) {
    const headers = {
        'Content-Type': 'application/json'
    };

    if (includeAuth && auth.isAuthenticated()) {
        headers['Authorization'] = `Bearer ${auth.getToken()}`;
    }

    return headers;
}

const api = {
    // Auth exports
    auth,

    // Authentication endpoints
    async login(email) {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Error al iniciar sesión');
        }

        const data = await response.json();
        auth.setToken(data.user.token);
        auth.setUser(data.user);

        return data.user;
    },

    async verifyToken() {
        if (!auth.isAuthenticated()) {
            return false;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/auth/verify`, {
                headers: {
                    'Authorization': `Bearer ${auth.getToken()}`
                }
            });

            if (!response.ok) {
                auth.clear();
                return false;
            }

            return true;
        } catch (error) {
            auth.clear();
            return false;
        }
    },

    logout() {
        auth.clear();
        window.location.reload();
    },

    // Parks endpoints
    async getParks(filters = {}) {
        const params = new URLSearchParams();

        Object.entries(filters).forEach(([key, value]) => {
            if (value !== null && value !== undefined && value !== '') {
                params.append(key, value);
            }
        });

        const url = `${API_BASE_URL}/parks${params.toString() ? '?' + params.toString() : ''}`;
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error('Error al obtener parques');
        }

        return await response.json();
    },

    async getPark(parkId) {
        const response = await fetch(`${API_BASE_URL}/parks/${parkId}`);

        if (!response.ok) {
            throw new Error('Error al obtener el parque');
        }

        return await response.json();
    },

    async createPark(parkData) {
        const response = await fetch(`${API_BASE_URL}/parks`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(parkData)
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Error al crear el parque');
        }

        return await response.json();
    },

    async updatePark(parkId, parkData) {
        const response = await fetch(`${API_BASE_URL}/parks/${parkId}`, {
            method: 'PUT',
            headers: getHeaders(),
            body: JSON.stringify(parkData)
        });

        if (!response.ok) {
            throw new Error('Error al actualizar el parque');
        }

        return await response.json();
    },

    async ratePark(parkId, rating) {
        const response = await fetch(`${API_BASE_URL}/parks/${parkId}/rate`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify({ rating })
        });

        if (!response.ok) {
            throw new Error('Error al valorar el parque');
        }

        return await response.json();
    },

    // Comments endpoints
    async getComments(parkId) {
        const response = await fetch(`${API_BASE_URL}/comments/${parkId}`);

        if (!response.ok) {
            throw new Error('Error al obtener comentarios');
        }

        return await response.json();
    },

    async addComment(parkId, commentData) {
        const response = await fetch(`${API_BASE_URL}/comments/${parkId}`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(commentData)
        });

        if (!response.ok) {
            throw new Error('Error al añadir comentario');
        }

        return await response.json();
    },

    async likeComment(parkId, commentId) {
        const response = await fetch(`${API_BASE_URL}/comments/${parkId}/${commentId}/like`, {
            method: 'POST',
            headers: getHeaders()
        });

        if (!response.ok) {
            throw new Error('Error al dar me gusta');
        }

        return await response.json();
    },

    // Photos endpoints
    async uploadMainPhoto(parkId, file) {
        const formData = new FormData();
        formData.append('photo', file);

        const headers = {};
        if (auth.isAuthenticated()) {
            headers['Authorization'] = `Bearer ${auth.getToken()}`;
        }

        const response = await fetch(`${API_BASE_URL}/photos/${parkId}/main`, {
            method: 'POST',
            headers,
            body: formData
        });

        if (!response.ok) {
            throw new Error('Error al subir foto');
        }

        return await response.json();
    },

    async uploadGalleryPhoto(parkId, file) {
        const formData = new FormData();
        formData.append('photo', file);

        const headers = {};
        if (auth.isAuthenticated()) {
            headers['Authorization'] = `Bearer ${auth.getToken()}`;
        }

        const response = await fetch(`${API_BASE_URL}/photos/${parkId}/gallery`, {
            method: 'POST',
            headers,
            body: formData
        });

        if (!response.ok) {
            throw new Error('Error al subir foto');
        }

        return await response.json();
    },

    // Bulletins (Tablón de anuncios) endpoints
    async getBulletins(parkId) {
        const response = await fetch(`${API_BASE_URL}/bulletins/${parkId}`);

        if (!response.ok) {
            throw new Error('Error al obtener anuncios del tablón');
        }

        return await response.json();
    },

    async createBulletin(parkId, bulletinData) {
        const response = await fetch(`${API_BASE_URL}/bulletins/${parkId}`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(bulletinData)
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Error al crear anuncio');
        }

        return await response.json();
    },

    async updateBulletin(parkId, bulletinId, bulletinData) {
        const response = await fetch(`${API_BASE_URL}/bulletins/${parkId}/${bulletinId}`, {
            method: 'PUT',
            headers: getHeaders(),
            body: JSON.stringify(bulletinData)
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Error al actualizar anuncio');
        }

        return await response.json();
    },

    async deleteBulletin(parkId, bulletinId) {
        const response = await fetch(`${API_BASE_URL}/bulletins/${parkId}/${bulletinId}`, {
            method: 'DELETE',
            headers: getHeaders()
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Error al eliminar anuncio');
        }

        return await response.json();
    }
};
