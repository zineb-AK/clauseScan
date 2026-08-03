import { beforeEach, describe, expect, it } from 'vitest';
import api from './api';
import { setSession } from './auth';

function requestInterceptor() {
    return api.interceptors.request.handlers[0].fulfilled;
}

function responseInterceptor() {
    return api.interceptors.response.handlers[0].rejected;
}

describe('api axios instance', () => {
    beforeEach(() => {
        localStorage.clear();
        Object.defineProperty(window, 'location', {
            writable: true,
            configurable: true,
            value: { pathname: '/current', href: 'http://localhost/current' },
        });
    });

    it('attaches the Bearer token to every request when a token is stored', () => {
        setSession({ token: 'token-123', user: { id: 1, name: 'Marie', email: 'marie@exemple.fr' } });

        const config = requestInterceptor()({ headers: {} });

        expect(config.headers.Authorization).toBe('Bearer token-123');
    });

    it('does not attach an Authorization header when no token is stored', () => {
        const config = requestInterceptor()({ headers: {} });

        expect(config.headers.Authorization).toBeUndefined();
    });

    it('clears the session and redirects to /login on a 401 response', async () => {
        setSession({ token: 'token-123', user: { id: 1, name: 'Marie', email: 'marie@exemple.fr' } });

        await expect(
            responseInterceptor()({ response: { status: 401 } }),
        ).rejects.toBeTruthy();

        expect(localStorage.getItem('clausescan_token')).toBeNull();
        expect(localStorage.getItem('clausescan_user')).toBeNull();
        expect(window.location.href).toBe('/login');
    });

    it('does not redirect when already on /login', async () => {
        window.location.href = '/login';

        await expect(
            responseInterceptor()({ response: { status: 401 } }),
        ).rejects.toBeTruthy();

        expect(window.location.href).toBe('/login');
    });

    it('rejects 422 errors as-is so forms can read validation errors', async () => {
        const error = {
            response: {
                status: 422,
                data: { errors: { email: ['Cette adresse email est déjà utilisée.'] } },
            },
        };

        await expect(responseInterceptor()(error)).rejects.toBe(error);
    });
});
