import { describe, expect, it } from 'vitest';
import { importSchema, MAX_CONTENT_CHARS, MAX_FILE_BYTES } from './importSchema';

function createPdfFile({ type = 'application/pdf', size = 1024, name = 'bail.pdf' } = {}) {
    const file = new File(['%PDF-1.4 test'], name, { type });
    Object.defineProperty(file, 'size', { value: size });
    return file;
}

describe('importSchema', () => {
    describe('mode PDF', () => {
        it('accepts a valid PDF file', () => {
            const result = importSchema.safeParse({ mode: 'pdf', contract: createPdfFile() });
            expect(result.success).toBe(true);
        });

        it('rejects a missing file', () => {
            const result = importSchema.safeParse({ mode: 'pdf', contract: undefined });
            expect(result.success).toBe(false);
            expect(result.error.issues[0].message).toBe('Le fichier du contrat est requis.');
        });

        it('rejects a non-PDF file', () => {
            const result = importSchema.safeParse({
                mode: 'pdf',
                contract: createPdfFile({ type: 'image/png' }),
            });
            expect(result.success).toBe(false);
            expect(result.error.issues[0].message).toBe('Le contrat doit être au format PDF.');
        });

        it('rejects a PDF larger than 10 MB', () => {
            const result = importSchema.safeParse({
                mode: 'pdf',
                contract: createPdfFile({ size: MAX_FILE_BYTES + 1 }),
            });
            expect(result.success).toBe(false);
            expect(result.error.issues[0].message).toBe('Le contrat ne doit pas dépasser 10 Mo.');
        });
    });

    describe('mode texte', () => {
        it('accepts non-empty text', () => {
            const result = importSchema.safeParse({ mode: 'text', content: 'Bail de location...' });
            expect(result.success).toBe(true);
        });

        it('rejects empty content', () => {
            const result = importSchema.safeParse({ mode: 'text', content: '' });
            expect(result.success).toBe(false);
            expect(result.error.issues[0].message).toBe('Le contenu ne doit pas être vide.');
        });

        it('rejects whitespace-only content', () => {
            const result = importSchema.safeParse({ mode: 'text', content: '   ' });
            expect(result.success).toBe(false);
            expect(result.error.issues[0].message).toBe('Le contenu ne doit pas être vide.');
        });

        it('rejects content exceeding 100 000 characters', () => {
            const result = importSchema.safeParse({
                mode: 'text',
                content: 'a'.repeat(MAX_CONTENT_CHARS + 1),
            });
            expect(result.success).toBe(false);
            expect(result.error.issues[0].message).toBe(
                'Le contenu ne doit pas dépasser 100 000 caractères.',
            );
        });
    });
});
