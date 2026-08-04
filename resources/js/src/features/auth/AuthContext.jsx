import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import api from '../../lib/api';
import { clearSession, getStoredUser, setSession } from '../../lib/auth';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(() => getStoredUser());

    const login = useCallback(async (credentials) => {
        const { data } = await api.post('/login', credentials);

        setSession({ token: data.token, user: data.data });
        setUser(data.data);

        return data;
    }, []);

    const register = useCallback(async (payload) => {
        const { data } = await api.post('/register', payload);

        setSession({ token: data.token, user: data.data });
        setUser(data.data);

        return data;
    }, []);

    const logout = useCallback(async () => {
        try {
            await api.post('/logout');
        } finally {
            clearSession();
            setUser(null);
        }
    }, []);

    const value = useMemo(
        () => ({ user, login, register, logout }),
        [user, login, register, logout],
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const context = useContext(AuthContext);

    if (context === null) {
        throw new Error('useAuth must be used within an AuthProvider');
    }

    return context;
}
