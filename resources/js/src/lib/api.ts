import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL ?? '/api',
    headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
    },
});

let onUnauthorized: (() => void) | null = null;

export function setOnUnauthorized(callback: () => void) {
    onUnauthorized = callback;
}

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (!error.response) {
            return Promise.reject(error);
        }

        const { status } = error.response;

        if (status === 401) {
            localStorage.removeItem('auth_token');
            onUnauthorized?.();
        }

        if (status === 403) {
            window.location.href = '/error?code=403';
        }

        return Promise.reject(error);
    },
);

export default api;
