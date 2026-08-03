import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '../features/auth/AuthContext';
import { loginSchema } from '../features/auth/schemas';

export function LoginPage() {
    const { user, login } = useAuth();
    const navigate = useNavigate();
    const [apiError, setApiError] = useState(null);

    const {
        register,
        handleSubmit,
        setError,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: zodResolver(loginSchema),
    });

    if (user) {
        return <Navigate to="/contracts" replace />;
    }

    const onSubmit = async (values) => {
        setApiError(null);

        try {
            await login(values);
            navigate('/contracts', { replace: true });
        } catch (error) {
            if (error.response?.status === 422 && error.response.data?.errors) {
                Object.entries(error.response.data.errors).forEach(([field, messages]) => {
                    setError(field, { type: 'server', message: messages[0] });
                });
            } else if (error.response?.status === 401) {
                setApiError(error.response.data?.message ?? 'Identifiants invalides.');
            } else {
                setApiError('Service indisponible, réessayez.');
            }
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-[--color-primary] via-[--color-primary-light] to-emerald-500 flex items-center justify-center px-4">
            <div className="w-full max-w-md">
                <div className="flex items-center justify-center gap-2 mb-8">
                    <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
                        <svg
                            className="w-6 h-6 text-white"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                            />
                        </svg>
                    </div>
                    <span className="text-2xl font-bold text-white">ClauseScan</span>
                </div>

                <div className="bg-white rounded-2xl shadow-2xl p-8">
                    <h1 className="text-2xl font-bold text-[--color-primary]">Connexion</h1>
                    <p className="mt-1 text-sm text-gray-500">
                        Accédez à votre espace pour analyser vos contrats.
                    </p>

                    {apiError && (
                        <div className="mt-4 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-sm text-red-700">
                            {apiError}
                        </div>
                    )}

                    <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-5" noValidate>
                        <div>
                            <label
                                htmlFor="email"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Adresse email
                            </label>
                            <input
                                id="email"
                                type="email"
                                autoComplete="email"
                                {...register('email')}
                                className={`mt-1.5 w-full px-4 py-2.5 rounded-xl border bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:bg-white ${
                                    errors.email ? 'border-red-400' : 'border-gray-200'
                                }`}
                                placeholder="vous@exemple.fr"
                            />
                            {errors.email && (
                                <p className="mt-1.5 text-sm text-red-600" role="alert">
                                    {errors.email.message}
                                </p>
                            )}
                        </div>

                        <div>
                            <label
                                htmlFor="password"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Mot de passe
                            </label>
                            <input
                                id="password"
                                type="password"
                                autoComplete="current-password"
                                {...register('password')}
                                className={`mt-1.5 w-full px-4 py-2.5 rounded-xl border bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:bg-white ${
                                    errors.password ? 'border-red-400' : 'border-gray-200'
                                }`}
                                placeholder="••••••••"
                            />
                            {errors.password && (
                                <p className="mt-1.5 text-sm text-red-600" role="alert">
                                    {errors.password.message}
                                </p>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full py-3 rounded-xl text-sm font-semibold text-white bg-[--color-primary] hover:bg-blue-800 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200 shadow-lg shadow-blue-500/20"
                        >
                            {isSubmitting ? 'Connexion…' : 'Se connecter'}
                        </button>
                    </form>

                    <p className="mt-6 text-center text-sm text-gray-500">
                        Pas encore de compte ?{' '}
                        <Link
                            to="/register"
                            className="font-semibold text-[--color-primary] hover:underline"
                        >
                            S'inscrire
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
