import { describe, expect, it } from 'vitest';
import { clearSession, getStoredToken, getStoredUser, setSession } from './auth';

describe('auth storage helpers', () => {
    const user = { id: 1, name: 'Marie Dupont', email: 'marie@exemple.fr' };

    it('setSession stores the token and the user in localStorage', () => {
        setSession({ token: 'token-123', user });

        expect(localStorage.getItem('clausescan_token')).toBe('token-123');
        expect(JSON.parse(localStorage.getItem('clausescan_user'))).toEqual(user);
    });

    it('getStoredUser restores the user after a simulated refresh', () => {
        setSession({ token: 'token-123', user });

        expect(getStoredUser()).toEqual(user);
        expect(getStoredToken()).toBe('token-123');
    });

    it('getStoredUser returns null when nothing is stored', () => {
        expect(getStoredUser()).toBeNull();
        expect(getStoredToken()).toBeNull();
    });

    it('getStoredUser returns null when the stored JSON is malformed', () => {
        localStorage.setItem('clausescan_user', '{not-valid-json');

        expect(getStoredUser()).toBeNull();
    });

    it('clearSession removes the token and the user', () => {
        setSession({ token: 'token-123', user });

        clearSession();

        expect(localStorage.getItem('clausescan_token')).toBeNull();
        expect(localStorage.getItem('clausescan_user')).toBeNull();
    });
});
