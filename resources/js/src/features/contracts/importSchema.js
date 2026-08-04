import { z } from 'zod';

export const MAX_FILE_BYTES = 10 * 1024 * 1024; // 10 Mo
export const MAX_CONTENT_CHARS = 100000;

const pdfSchema = z.object({
    mode: z.literal('pdf'),
    contract: z
        .custom((value) => value instanceof File, 'Le fichier du contrat est requis.')
        .refine((file) => file.type === 'application/pdf', 'Le contrat doit être au format PDF.')
        .refine((file) => file.size <= MAX_FILE_BYTES, 'Le contrat ne doit pas dépasser 10 Mo.'),
});

const textSchema = z.object({
    mode: z.literal('text'),
    content: z
        .string()
        .max(MAX_CONTENT_CHARS, 'Le contenu ne doit pas dépasser 100 000 caractères.')
        .refine((text) => text.trim().length > 0, 'Le contenu ne doit pas être vide.'),
});

export const importSchema = z.discriminatedUnion('mode', [pdfSchema, textSchema]);
