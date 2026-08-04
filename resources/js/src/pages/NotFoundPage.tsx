import { Link } from 'react-router';

export default function NotFoundPage() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-secondary-50">
            <h1 className="text-6xl font-bold text-secondary-300">404</h1>
            <p className="mt-4 text-lg text-secondary-600">Page introuvable</p>
            <p className="mt-2 text-sm text-secondary-400">La page que vous cherchez n'existe pas ou a été déplacée.</p>
            <Link
                to="/"
                className="mt-6 rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-700"
            >
                Retour à l'accueil
            </Link>
        </div>
    );
}
