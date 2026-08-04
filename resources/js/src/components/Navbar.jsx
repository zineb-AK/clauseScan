import { useState } from 'react';
import { Link } from 'react-router-dom';

const navLinks = [
    { label: 'Accueil', href: '#hero' },
    { label: 'Fonctionnalités', href: '#features' },
    { label: 'Comment ça marche', href: '#how-it-works' },
    { label: 'Historique', href: '/historique' },
];

export function Navbar() {
    const [mobileOpen, setMobileOpen] = useState(false);

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16 lg:h-20">
                    <Link to="/" className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-emerald-500 flex items-center justify-center">
                            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </div>
                        <span className="text-xl font-bold text-primary">ClauseScan</span>
                    </Link>

                    <div className="hidden lg:flex items-center gap-8">
                        {navLinks.map((link) => (
                            <a
                                key={link.label}
                                href={link.href}
                                className="text-sm font-medium text-gray-600 hover:text-primary transition-colors duration-200"
                            >
                                {link.label}
                            </a>
                        ))}
                    </div>

                    <div className="hidden lg:flex items-center gap-3">
                        <Link
                            to="/login"
                            className="px-5 py-2.5 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors duration-200"
                        >
                            Connexion
                        </Link>
                        <Link
                            to="/register"
                            className="px-5 py-2.5 text-sm font-medium text-white bg-primary hover:bg-blue-700 rounded-xl transition-all duration-200 shadow-lg shadow-blue-500/20"
                        >
                            S'inscrire
                        </Link>
                    </div>

                    <button
                        onClick={() => setMobileOpen(!mobileOpen)}
                        className="lg:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100"
                        aria-label="Menu"
                    >
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            {mobileOpen ? (
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                            )}
                        </svg>
                    </button>
                </div>
            </div>

            {mobileOpen && (
                <div className="lg:hidden border-t border-gray-100 bg-white">
                    <div className="px-4 py-4 space-y-3">
                        {navLinks.map((link) => (
                            <a
                                key={link.label}
                                href={link.href}
                                onClick={() => setMobileOpen(false)}
                                className="block text-sm font-medium text-gray-600 hover:text-primary transition-colors"
                            >
                                {link.label}
                            </a>
                        ))}
                        <hr className="border-gray-100" />
                        <Link
                            to="/login"
                            onClick={() => setMobileOpen(false)}
                            className="block text-sm font-medium text-gray-700 hover:text-gray-900"
                        >
                            Connexion
                        </Link>
                        <Link
                            to="/register"
                            onClick={() => setMobileOpen(false)}
                            className="block text-sm font-medium text-center text-white bg-primary hover:bg-blue-700 rounded-xl py-2.5 transition-all"
                        >
                            S'inscrire
                        </Link>
                    </div>
                </div>
            )}
        </nav>
    );
}
