import { z } from 'zod';

export const loginSchema = z.object({
    email: z
        .string()
        .min(1, "L'adresse email est requise.")
        .email("L'adresse email doit être valide."),
    password: z.string().min(1, 'Le mot de passe est requis.'),
});

export const registerSchema = z
    .object({
        name: z
            .string()
            .min(1, 'Le nom est requis.')
            .max(255, 'Le nom ne doit pas dépasser 255 caractères.'),
        email: z
            .string()
            .min(1, "L'adresse email est requise.")
            .email("L'adresse email doit être valide."),
        password: z
            .string()
            .min(1, 'Le mot de passe est requis.')
            .min(8, 'Le mot de passe doit contenir au moins 8 caractères.'),
        password_confirmation: z.string().min(1, 'Veuillez confirmer le mot de passe.'),
    })
    .refine((data) => data.password === data.password_confirmation, {
        message: 'Les mots de passe ne correspondent pas.',
        path: ['password_confirmation'],
    });
