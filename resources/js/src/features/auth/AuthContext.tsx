import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';
import { useNavigate } from 'react-router';
import api, { setOnUnauthorized } from '../../lib/api';

interface User {
    id: number;
    name: string;
    email: string;
}

interface AuthContextValue {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(() => localStorage.getItem('auth_token'));
    const navigate = useNavigate();

    const logout = useCallback(async () => {
        try {
            await api.post('/logout');
        } catch {
            // Even if the API call fails, clear local state
        }
        localStorage.removeItem('auth_token');
        setToken(null);
        setUser(null);
        navigate('/login');
    }, [navigate]);

    useEffect(() => {
        setOnUnauthorized(() => {
            setToken(null);
            setUser(null);
            navigate('/login');
        });
    }, [navigate]);

    useEffect(() => {
        if (token) {
            api.get('/user')
                .then((res) => setUser(res.data))
                .catch(() => {
                    localStorage.removeItem('auth_token');
                    setToken(null);
                    setUser(null);
                });
        }
    }, [token]);

    const login = useCallback(async (email: string, password: string) => {
        const response = await api.post('/login', { email, password });
        const { token: newToken, data: newUser } = response.data;
        localStorage.setItem('auth_token', newToken);
        setToken(newToken);
        setUser(newUser);
    }, []);

    return (
        <AuthContext.Provider value={{ user, token, isAuthenticated: !!token, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth(): AuthContextValue {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
