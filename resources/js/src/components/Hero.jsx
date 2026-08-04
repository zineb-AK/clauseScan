import { Link } from 'react-router-dom';

export function Hero() {
    return (
        <section id="hero" className="relative min-h-screen flex items-center overflow-hidden">
            <div className="absolute inset-0">
                <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/95 to-gray-900" />
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-400 rounded-full blur-3xl" />
                    <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-400 rounded-full blur-3xl" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-500 rounded-full blur-3xl opacity-50" />
                </div>
                <div
                    className="absolute inset-0 opacity-[0.03]"
                    style={{
                        backgroundImage: 'radial-gradient(circle at 25px 25px, white 1px, transparent 0)',
                        backgroundSize: '50px 50px',
                    }}
                />
            </div>

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 lg:py-40">
                <div className="max-w-3xl mx-auto text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-8">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        <span className="text-sm font-medium text-white/80">Analyse intelligente par IA</span>
                    </div>

                    <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-white leading-tight mb-6">
                        Analysez vos contrats
                        <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 to-blue-300">
                            en quelques secondes
                        </span>
                    </h1>

                    <p className="text-lg sm:text-xl text-white/70 max-w-2xl mx-auto mb-10 leading-relaxed">
                        Importez un PDF ou collez votre contrat. ClauseScan extrait automatiquement les clauses importantes,
                        détecte les risques et fournit des explications simples.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link
                            to="/register"
                            className="w-full sm:w-auto px-8 py-4 text-base font-semibold text-white bg-emerald-500 hover:bg-emerald-600 rounded-2xl transition-all duration-200 shadow-xl shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:-translate-y-0.5"
                        >
                            Commencer maintenant
                        </Link>
                        <a
                            href="#how-it-works"
                            className="w-full sm:w-auto px-8 py-4 text-base font-semibold text-white bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-2xl transition-all duration-200 border border-white/20"
                        >
                            Voir une démonstration
                        </a>
                    </div>

                    <div className="mt-16 flex items-center justify-center gap-8 sm:gap-12 text-white/50">
                        <div className="text-center">
                            <div className="text-2xl font-bold text-white">100+</div>
                            <div className="text-sm mt-1">Contrats analysés</div>
                        </div>
                        <div className="w-px h-10 bg-white/20" />
                        <div className="text-center">
                            <div className="text-2xl font-bold text-white">99%</div>
                            <div className="text-sm mt-1">De précision</div>
                        </div>
                        <div className="w-px h-10 bg-white/20" />
                        <div className="text-center">
                            <div className="text-2xl font-bold text-white">5 min</div>
                            <div className="text-sm mt-1">Analyse moyenne</div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
