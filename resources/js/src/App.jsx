import { BrowserRouter, Link, Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './features/auth/AuthContext';
import { RequireAuth } from './components/RequireAuth';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { ContractNewPage } from './pages/ContractNewPage';
import { ContractDetailPage } from './pages/ContractDetailPage';

function ContractsPlaceholder() {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/');
    };

    return (
        <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4">
            <h1 className="text-3xl font-bold text-primary">Mes contrats</h1>
            <p className="mt-2 text-gray-500">
                Cette page est en cours de développement. Elle vous permettra bientôt
                d'importer et d'analyser vos contrats.
            </p>
            <Link
                to="/contracts/new"
                className="mt-8 px-6 py-3 rounded-xl text-sm font-semibold text-white bg-primary hover:bg-blue-700 transition-all duration-200 shadow-lg shadow-blue-500/20"
            >
                Nouveau contrat
            </Link>
            <button
                onClick={handleLogout}
                className="mt-8 px-5 py-2.5 text-sm font-medium text-white bg-red-500 hover:bg-red-600 rounded-xl transition-all duration-200"
            >
                Déconnexion
            </button>
            <Link to="/" className="mt-4 text-sm font-medium text-primary hover:underline">
                Retour à l'accueil
            </Link>
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
                    <Route element={<RequireAuth />}>
                        <Route path="/contracts" element={<ContractsPlaceholder />} />
                        <Route path="/contracts/new" element={<ContractNewPage />} />
                        <Route path="/contracts/:id" element={<ContractDetailPage />} />
                    </Route>
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
}
