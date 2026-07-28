import { Navigate, Outlet } from 'react-router';
import { useAuth } from './AuthContext';

export default function RequireAuth() {
    const { isAuthenticated } = useAuth();

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
}
