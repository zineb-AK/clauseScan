import { NavLink, Outlet } from 'react-router';
import { useAuth } from '../../features/auth/AuthContext';
import Button from '../ui/Button';

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `text-sm font-medium transition-colors ${isActive ? 'text-primary-600' : 'text-secondary-600 hover:text-secondary-900'}`;

export default function AppLayout() {
    const { logout, user } = useAuth();

    return (
        <div className="flex min-h-screen flex-col bg-secondary-50">
            <header className="border-b border-secondary-200 bg-white">
                <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center gap-8">
                        <NavLink to="/" className="text-lg font-bold text-secondary-900">
                            ClauseScan
                        </NavLink>
                        <nav className="flex items-center gap-6">
                            <NavLink to="/contracts" className={navLinkClass}>
                                Contrats
                            </NavLink>
                            <NavLink to="/history" className={navLinkClass}>
                                Historique
                            </NavLink>
                        </nav>
                    </div>
                    <div className="flex items-center gap-4">
                        <span className="text-sm text-secondary-500">{user?.name}</span>
                        <Button variant="ghost" size="sm" onClick={logout}>
                            Déconnexion
                        </Button>
                    </div>
                </div>
            </header>

            <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
                <Outlet />
            </main>
        </div>
    );
}
