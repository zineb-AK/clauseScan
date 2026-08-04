import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../features/auth/AuthContext';
import AuthLayout from '../components/layout/AuthLayout';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import type { AxiosError } from 'axios';

const loginSchema = z.object({
    email: z.string().min(1, 'L\'email est requis').email('Email invalide'),
    password: z.string().min(1, 'Le mot de passe est requis'),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
    const [apiError, setApiError] = useState<string | null>(null);
    const { login } = useAuth();
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        setError,
        formState: { errors, isSubmitting },
    } = useForm<LoginForm>({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = async (data: LoginForm) => {
        setApiError(null);

        try {
            await login(data.email, data.password);
            navigate('/contracts');
        } catch (err) {
            const axiosError = err as AxiosError<{ message: string; errors?: Record<string, string[]> }>;

            if (axiosError.response?.status === 422 && axiosError.response.data?.errors) {
                for (const [field, messages] of Object.entries(axiosError.response.data.errors)) {
                    setError(field as keyof LoginForm, { message: messages[0] });
                }
            } else if (axiosError.response?.status === 401) {
                setApiError('Email ou mot de passe incorrect');
            } else {
                setApiError('Une erreur est survenue. Veuillez réessayer.');
            }
        }
    };

    return (
        <AuthLayout title="Connexion">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {apiError && (
                    <div className="rounded-lg border border-danger-200 bg-danger-50 px-4 py-3 text-sm text-danger-700">
                        {apiError}
                    </div>
                )}

                <Input
                    label="Email"
                    type="email"
                    placeholder="vous@exemple.com"
                    error={errors.email?.message}
                    {...register('email')}
                />

                <Input
                    label="Mot de passe"
                    type="password"
                    placeholder="Votre mot de passe"
                    error={errors.password?.message}
                    {...register('password')}
                />

                <Button type="submit" loading={isSubmitting} className="w-full">
                    Se connecter
                </Button>

                <p className="text-center text-sm text-secondary-500">
                    Pas encore de compte ?{' '}
                    <Link to="/register" className="font-medium text-primary-600 hover:text-primary-500">
                        Créer un compte
                    </Link>
                </p>
            </form>
        </AuthLayout>
    );
}
