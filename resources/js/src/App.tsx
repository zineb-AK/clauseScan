import { Routes, Route } from 'react-router';
import RequireAuth from './features/auth/RequireAuth';
import AppLayout from './components/layout/AppLayout';
import NotFoundPage from './pages/NotFoundPage';
import ErrorPage from './pages/ErrorPage';

export default function App() {
    return (
        <Routes>
            <Route element={<RequireAuth />}>
                <Route element={<AppLayout />}>
                    <Route index element={<div>Dashboard</div>} />
                    <Route path="contracts" element={<div>Contracts</div>} />
                    <Route path="history" element={<div>History</div>} />
                </Route>
            </Route>
            <Route path="login" element={<div>Login</div>} />
            <Route path="register" element={<div>Register</div>} />
            <Route path="error" element={<ErrorPage />} />
            <Route path="*" element={<NotFoundPage />} />
        </Routes>
    );
}
