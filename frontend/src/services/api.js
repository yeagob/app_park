// API Service para comunicación con el backend
const API_BASE_URL = 'http://localhost:3001/api';

const api = {
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
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(parkData)
        });

        if (!response.ok) {
            throw new Error('Error al crear el parque');
        }

        return await response.json();
    },

    async updatePark(parkId, parkData) {
        const response = await fetch(`${API_BASE_URL}/parks/${parkId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
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
            headers: {
                'Content-Type': 'application/json'
            },
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
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(commentData)
        });

        if (!response.ok) {
            throw new Error('Error al añadir comentario');
        }

        return await response.json();
    },

    async likeComment(parkId, commentId) {
        const response = await fetch(`${API_BASE_URL}/comments/${parkId}/${commentId}/like`, {
            method: 'POST'
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

        const response = await fetch(`${API_BASE_URL}/photos/${parkId}/main`, {
            method: 'POST',
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

        const response = await fetch(`${API_BASE_URL}/photos/${parkId}/gallery`, {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            throw new Error('Error al subir foto');
        }

        return await response.json();
    }
};
