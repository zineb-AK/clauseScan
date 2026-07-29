import { Link } from 'react-router';

export default function ContractsPage() {
    return (
        <div>
            <div className="mb-6 flex items-center justify-between">
                <h1 className="text-2xl font-bold text-secondary-900">Mes contrats</h1>
                <Link
                    to="/contracts/new"
                    className="inline-flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-700"
                >
                    <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Nouveau contrat
                </Link>
            </div>

            <div className="rounded-xl border border-secondary-200 bg-white p-12 text-center">
                <p className="text-secondary-500">Vous n'avez pas encore de contrat.</p>
                <Link to="/contracts/new" className="mt-2 inline-block text-sm font-medium text-primary-600 hover:text-primary-500">
                    Importer votre premier contrat
                </Link>
            </div>
        </div>
    );
}
