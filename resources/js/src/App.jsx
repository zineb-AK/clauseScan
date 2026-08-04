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
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
            <div className="w-full max-w-xl bg-white rounded-2xl shadow-xl p-8 text-center">
                <div className="w-16 h-16 mx-auto rounded-2xl bg-blue-50 flex items-center justify-center">
                    <svg className="w-8 h-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                    </svg>
                </div>
                <h1 className="mt-6 text-2xl font-bold text-gray-900">Mes contrats</h1>
                <p className="mt-2 text-gray-500">
                    Aucun contrat pour le moment. Importez un PDF ou collez le texte d'un contrat
                    pour lancer une analyse par IA.
                </p>
                <Link
                    to="/contracts/new"
                    className="mt-8 inline-flex px-6 py-3 rounded-xl text-sm font-semibold text-white bg-primary hover:bg-blue-700 transition-all duration-200 shadow-lg shadow-blue-500/20"
                >
                    Importer mon premier contrat
                </Link>
                <div className="mt-6 flex items-center justify-center gap-6 text-sm">
                    <button
                        onClick={handleLogout}
                        className="font-medium text-gray-500 hover:text-red-600 transition-colors duration-200"
                    >
                        Déconnexion
                    </button>
                    <Link to="/" className="font-medium text-primary hover:underline">
                        Retour à l'accueil
                    </Link>
                </div>
            </div>
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
