import { describe, expect, it } from 'vitest';
import { loginSchema, registerSchema } from './schemas';

const validRegister = {
    name: 'Marie Dupont',
    email: 'marie@exemple.fr',
    password: 'motdepasse123',
    password_confirmation: 'motdepasse123',
};

describe('loginSchema', () => {
    it('accepts a valid email and password', () => {
        const result = loginSchema.safeParse({ email: 'marie@exemple.fr', password: 'secret' });

        expect(result.success).toBe(true);
    });

    it('rejects a missing email', () => {
        const result = loginSchema.safeParse({ password: 'secret' });

        expect(result.success).toBe(false);
        expect(result.error.issues[0].path).toEqual(['email']);
    });

    it('rejects an invalid email format', () => {
        const result = loginSchema.safeParse({ email: 'pas-un-email', password: 'secret' });

        expect(result.success).toBe(false);
        expect(result.error.issues[0].path).toEqual(['email']);
    });

    it('rejects a missing password', () => {
        const result = loginSchema.safeParse({ email: 'marie@exemple.fr' });

        expect(result.success).toBe(false);
        expect(result.error.issues[0].path).toEqual(['password']);
    });
});

describe('registerSchema', () => {
    it('accepts a valid registration payload', () => {
        const result = registerSchema.safeParse(validRegister);

        expect(result.success).toBe(true);
    });

    it('rejects a missing name', () => {
        const result = registerSchema.safeParse({ ...validRegister, name: '' });

        expect(result.success).toBe(false);
        expect(result.error.issues[0].path).toEqual(['name']);
    });

    it('rejects an invalid email format', () => {
        const result = registerSchema.safeParse({ ...validRegister, email: 'nope' });

        expect(result.success).toBe(false);
        expect(result.error.issues[0].path).toEqual(['email']);
    });

    it('rejects a password shorter than 8 characters', () => {
        const result = registerSchema.safeParse({
            ...validRegister,
            password: 'court',
            password_confirmation: 'court',
        });

        expect(result.success).toBe(false);
        expect(result.error.issues[0].path).toEqual(['password']);
    });

    it('rejects a mismatched password confirmation', () => {
        const result = registerSchema.safeParse({
            ...validRegister,
            password_confirmation: 'autre-mdp',
        });

        expect(result.success).toBe(false);
        expect(result.error.issues[0].path).toEqual(['password_confirmation']);
    });
});
