import { Link } from 'react-router-dom';

export function CtaSection() {
    return (
        <section className="py-24 lg:py-32 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary to-blue-700 p-8 sm:p-12 lg:p-16">
                    <div className="absolute inset-0 opacity-10">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-400 rounded-full blur-3xl" />
                        <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-300 rounded-full blur-3xl" />
                    </div>

                    <div className="relative text-center max-w-2xl mx-auto">
                        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                            Prêt à simplifier vos analyses de contrats ?
                        </h2>
                        <p className="text-lg text-white/80 mb-10">
                            Commencez gratuitement votre première analyse dès maintenant. Aucune carte bancaire requise.
                        </p>
                        <Link
                            to="/register"
                            className="inline-flex items-center gap-2 px-8 py-4 text-base font-semibold text-primary bg-white hover:bg-gray-50 rounded-2xl transition-all duration-200 shadow-xl shadow-black/10 hover:-translate-y-0.5"
                        >
                            Commencez gratuitement
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                            </svg>
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}
