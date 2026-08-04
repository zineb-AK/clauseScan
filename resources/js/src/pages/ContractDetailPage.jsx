import { Link, useLocation } from 'react-router-dom';

const sourceLabels = {
    pdf: 'PDF',
    text: 'Texte',
};

const statusLabels = {
    pending: 'En attente',
    processing: 'En cours d\'analyse',
    done: 'Analysé',
    failed: 'Échec',
};

export function ContractDetailPage() {
    const location = useLocation();
    const contract = location.state?.contract;

    if (!contract) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
                <h1 className="text-3xl font-bold text-primary">Contrat introuvable</h1>
                <p className="mt-2 text-gray-500">
                    Ce contrat n&apos;a pas pu être récupéré. Revenez à la liste de vos contrats.
                </p>
                <Link
                    to="/contracts"
                    className="mt-8 px-6 py-3 rounded-xl text-sm font-semibold text-white bg-primary hover:bg-blue-700 transition-all duration-200"
                >
                    Retour à mes contrats
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 py-10">
            <div className="w-full max-w-2xl">
                <Link to="/contracts" className="text-sm font-medium text-primary hover:underline mb-6 inline-block">
                    ← Retour à mes contrats
                </Link>

                <div className="bg-white rounded-2xl shadow-2xl p-8">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                            <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-primary">{contract.title}</h1>
                            <p className="text-sm text-gray-500">
                                Contrat importé avec succès.
                            </p>
                        </div>
                    </div>

                    <dl className="grid sm:grid-cols-2 gap-4 mt-6">
                        <div className="rounded-xl bg-gray-50 p-4">
                            <dt className="text-xs font-medium text-gray-500 uppercase tracking-wider">Source</dt>
                            <dd className="mt-1 text-sm font-semibold text-gray-900">
                                {sourceLabels[contract.source_type] ?? contract.source_type}
                            </dd>
                        </div>
                        <div className="rounded-xl bg-gray-50 p-4">
                            <dt className="text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</dt>
                            <dd className="mt-1">
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
                                    {statusLabels[contract.status] ?? contract.status}
                                </span>
                            </dd>
                        </div>
                        <div className="rounded-xl bg-gray-50 p-4 sm:col-span-2">
                            <dt className="text-xs font-medium text-gray-500 uppercase tracking-wider">Créé le</dt>
                            <dd className="mt-1 text-sm font-semibold text-gray-900">
                                {new Date(contract.created_at).toLocaleDateString('fr-FR', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                })}
                            </dd>
                        </div>
                    </dl>

                    <div className="mt-8">
                        <Link
                            to="/contracts"
                            className="inline-flex px-6 py-3 rounded-xl text-sm font-semibold text-white bg-primary hover:bg-blue-700 transition-all duration-200 shadow-lg shadow-blue-500/20"
                        >
                            Voir mes contrats
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}