import { Link, useSearchParams } from 'react-router';

const errorMessages: Record<string, { title: string; message: string }> = {
    '403': {
        title: 'Accès refusé',
        message: 'Vous n\'avez pas les permissions nécessaires pour accéder à cette ressource.',
    },
    '500': {
        title: 'Erreur serveur',
        message: 'Une erreur inattendue est survenue. Veuillez réessayer plus tard.',
    },
};

export default function ErrorPage() {
    const [searchParams] = useSearchParams();
    const code = searchParams.get('code') ?? '500';
    const error = errorMessages[code] ?? errorMessages['500'];

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-secondary-50">
            <h1 className="text-6xl font-bold text-danger-400">{code}</h1>
            <p className="mt-4 text-lg text-secondary-600">{error.title}</p>
            <p className="mt-2 text-sm text-secondary-400">{error.message}</p>
            <Link
                to="/"
                className="mt-6 rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-700"
            >
                Retour à l'accueil
            </Link>
        </div>
    );
}
