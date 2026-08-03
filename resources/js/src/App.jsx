import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './features/auth/AuthContext';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';

function ContractsPlaceholder() {
    return (
        <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4">
            <h1 className="text-3xl font-bold text-[--color-primary]">Mes contrats</h1>
            <p className="mt-2 text-gray-500">
                Cette page est en cours de développement. Elle vous permettra bientôt
                d'importer et d'analyser vos contrats.
            </p>
        </div>
    );
}

export function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/contracts" element={<ContractsPlaceholder />} />
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
}
