const benefits = [
    {
        icon: (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
            </svg>
        ),
        title: 'Rapide',
        description: 'Analyse complète en moins de 5 minutes. Fini l\'attente interminable des relectures manuelles.',
    },
    {
        icon: (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
            </svg>
        ),
        title: 'Sécurisé',
        description: 'Vos données sont chiffrées et protégées. Seul vous avez accès à vos contrats et analyses.',
    },
    {
        icon: (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12a7.5 7.5 0 1115 0 7.5 7.5 0 01-15 0zM12 9v3.75m0 0a.75.75 0 01.75.75v.75M12 16.5a.75.75 0 00.75-.75v-.75m-.75.75v.75m0-3.75h.75" />
            </svg>
        ),
        title: 'Précis',
        description: 'Notre IA atteint 99% de précision dans la détection des clauses importantes et des risques.',
    },
    {
        icon: (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
            </svg>
        ),
        title: 'Interface intuitive',
        description: 'Une expérience utilisateur fluide et agréable, conçue pour être utilisée par tous.',
    },
];

export function Benefits() {
    return (
        <section className="py-24 lg:py-32 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <h2 className="text-3xl sm:text-4xl font-bold text-[--color-primary] mb-4">
                        Pourquoi choisir ClauseScan ?
                    </h2>
                    <p className="text-lg text-gray-600">
                        Des avantages concrets pour une compréhension approfondie de vos contrats.
                    </p>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
                    {benefits.map((benefit) => (
                        <div
                            key={benefit.title}
                            className="text-center p-8 rounded-2xl bg-white shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100"
                        >
                            <div className="w-12 h-12 mx-auto rounded-full bg-gradient-to-br from-emerald-50 to-emerald-100 flex items-center justify-center text-emerald-600 mb-4">
                                {benefit.icon}
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">{benefit.title}</h3>
                            <p className="text-gray-600 text-sm leading-relaxed">{benefit.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
