import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../features/auth/AuthContext';
import api from '../lib/api';
import AuthLayout from '../components/layout/AuthLayout';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import type { AxiosError } from 'axios';

const registerSchema = z
    .object({
        name: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
        email: z.string().min(1, "L'email est requis").email('Email invalide'),
        password: z.string().min(8, 'Le mot de passe doit contenir au moins 8 caractères'),
        password_confirmation: z.string().min(1, 'La confirmation du mot de passe est requise'),
    })
    .refine((data) => data.password === data.password_confirmation, {
        message: 'Les mots de passe ne correspondent pas',
        path: ['password_confirmation'],
    });

type RegisterForm = z.infer<typeof registerSchema>;

export default function RegisterPage() {
    const [apiError, setApiError] = useState<string | null>(null);
    const { login } = useAuth();
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        setError,
        formState: { errors, isSubmitting },
    } = useForm<RegisterForm>({
        resolver: zodResolver(registerSchema),
    });

    const onSubmit = async (data: RegisterForm) => {
        setApiError(null);

        try {
            await api.post('/register', {
                name: data.name,
                email: data.email,
                password: data.password,
                password_confirmation: data.password_confirmation,
            });

            await login(data.email, data.password);
            navigate('/contracts');
        } catch (err) {
            const axiosError = err as AxiosError<{ message: string; errors?: Record<string, string[]> }>;

            if (axiosError.response?.status === 422 && axiosError.response.data?.errors) {
                for (const [field, messages] of Object.entries(axiosError.response.data.errors)) {
                    const formField = field === 'password_confirmation' ? 'password_confirmation' : field;
                    setError(formField as keyof RegisterForm, { message: messages[0] });
                }
            } else {
                setApiError('Une erreur est survenue. Veuillez réessayer.');
            }
        }
    };

    return (
        <AuthLayout title="Créer un compte">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {apiError && (
                    <div className="rounded-lg border border-danger-200 bg-danger-50 px-4 py-3 text-sm text-danger-700">
                        {apiError}
                    </div>
                )}

                <Input
                    label="Nom"
                    type="text"
                    placeholder="Votre nom"
                    error={errors.name?.message}
                    {...register('name')}
                />

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
                    placeholder="Au moins 8 caractères"
                    error={errors.password?.message}
                    {...register('password')}
                />

                <Input
                    label="Confirmer le mot de passe"
                    type="password"
                    placeholder="Répétez le mot de passe"
                    error={errors.password_confirmation?.message}
                    {...register('password_confirmation')}
                />

                <Button type="submit" loading={isSubmitting} className="w-full">
                    Créer un compte
                </Button>

                <p className="text-center text-sm text-secondary-500">
                    Déjà un compte ?{' '}
                    <Link to="/login" className="font-medium text-primary-600 hover:text-primary-500">
                        Se connecter
                    </Link>
                </p>
            </form>
        </AuthLayout>
    );
}
