import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import type { AxiosError } from 'axios';
import api, { setOnUnauthorized } from '@/lib/api';

vi.mock('react-router', async () => {
    const actual = await vi.importActual('react-router');
    return { ...actual, useNavigate: () => vi.fn() };
});

let originalAdapter: typeof api.defaults.adapter;

beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    originalAdapter = api.defaults.adapter;
});

afterEach(() => {
    api.defaults.adapter = originalAdapter;
});

describe('Axios 401 interceptor', () => {
    function mockErrorResponse(status: number) {
        api.defaults.adapter = async () => {
            const error = new Error(`Request failed with status code ${status}`) as AxiosError;
            error.response = {
                data: { message: 'Error' },
                status,
                statusText: 'Error',
                headers: {},
                config: {},
            };
            error.isAxiosError = true;
            throw error;
        };
    }

    it('clears token from localStorage on 401 response', async () => {
        localStorage.setItem('auth_token', 'test-token');
        const onUnauthorized = vi.fn();
        setOnUnauthorized(onUnauthorized);
        mockErrorResponse(401);

        await expect(api.get('/user')).rejects.toThrow();
        expect(localStorage.getItem('auth_token')).toBeNull();
    });

    it('calls onUnauthorized callback on 401 response', async () => {
        const onUnauthorized = vi.fn();
        setOnUnauthorized(onUnauthorized);
        mockErrorResponse(401);

        await expect(api.get('/user')).rejects.toThrow();
        expect(onUnauthorized).toHaveBeenCalledOnce();
    });

    it('does not call onUnauthorized for non-401 errors', async () => {
        const onUnauthorized = vi.fn();
        setOnUnauthorized(onUnauthorized);
        mockErrorResponse(404);

        await expect(api.get('/unknown')).rejects.toThrow();
        expect(onUnauthorized).not.toHaveBeenCalled();
    });

    it('passes through non-error responses', async () => {
        api.defaults.adapter = async () => ({
            data: { id: 1, name: 'Test' },
            status: 200,
            statusText: 'OK',
            headers: {},
            config: {},
        });

        const response = await api.get('/user');
        expect(response.status).toBe(200);
        expect(response.data).toEqual({ id: 1, name: 'Test' });
    });
});
