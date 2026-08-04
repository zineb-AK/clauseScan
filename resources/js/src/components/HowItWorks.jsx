const steps = [
    {
        number: '1',
        title: 'Importez votre contrat',
        description: 'Téléchargez un fichier PDF ou collez directement le texte de votre contrat. Aucune inscription complexe, lancez-vous en un clic.',
        icon: (
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
            </svg>
        ),
    },
    {
        number: '2',
        title: 'Lancez l\'analyse IA',
        description: 'Notre intelligence artificielle examine chaque clause, identifie les informations clés et détecte les risques potentiels.',
        icon: (
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z" />
            </svg>
        ),
    },
    {
        number: '3',
        title: 'Consultez les résultats',
        description: 'Obtenez une analyse structurée : clauses importantes, niveaux de risque et explications en langage simple.',
        icon: (
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.125 2.25h-4.5c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125v-9M10.125 2.25h.375a9 9 0 019 9v.375M10.125 2.25A3.375 3.375 0 0113.5 5.625v1.5c0 .621.504 1.125 1.125 1.125h1.5a3.375 3.375 0 013.375 3.375M9 15l2.25 2.25L15 12" />
            </svg>
        ),
    },
];

export function HowItWorks() {
    return (
        <section id="how-it-works" className="py-24 lg:py-32 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <h2 className="text-3xl sm:text-4xl font-bold text-primary mb-4">
                        Comment ça marche
                    </h2>
                    <p className="text-lg text-gray-600">
                        Trois étapes simples pour obtenir une analyse complète de votre contrat.
                    </p>
                </div>

                <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
                    {steps.map((step, index) => (
                        <div key={step.number} className="relative text-center lg:text-left">
                            {index < steps.length - 1 && (
                                <div className="hidden lg:block absolute top-12 left-[60%] w-full h-px border-t-2 border-dashed border-gray-200" />
                            )}
                            <div className="inline-flex items-center justify-center w-24 h-24 rounded-2xl bg-gradient-to-br from-blue-50 to-emerald-50 text-primary mb-6 lg:mx-0 mx-auto">
                                {step.icon}
                            </div>
                            <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-primary text-white text-sm font-bold mb-4 lg:mx-0 mx-auto">
                                {step.number}
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-3">{step.title}</h3>
                            <p className="text-gray-600 leading-relaxed">{step.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
