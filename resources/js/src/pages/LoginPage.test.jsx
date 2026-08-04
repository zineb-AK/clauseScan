import { describe, expect, it, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { AuthProvider } from '../features/auth/AuthContext';
import { LoginPage } from './LoginPage';

vi.mock('../lib/api', () => ({
    default: { post: vi.fn() },
}));

import api from '../lib/api';

function renderLoginPage() {
    return render(
        <MemoryRouter initialEntries={['/login']}>
            <AuthProvider>
                <Routes>
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/contracts" element={<div>Contrats OK</div>} />
                </Routes>
            </AuthProvider>
        </MemoryRouter>,
    );
}

describe('LoginPage', () => {
    beforeEach(() => {
        api.post.mockReset();
    });

    it('renders the login form', () => {
        renderLoginPage();

        expect(screen.getByLabelText('Adresse email')).toBeInTheDocument();
        expect(screen.getByLabelText('Mot de passe')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Se connecter' })).toBeInTheDocument();
        expect(screen.getByText("Pas encore de compte ?")).toBeInTheDocument();
        expect(screen.getByRole('link', { name: "S'inscrire" })).toHaveAttribute('href', '/register');
    });

    it('shows client-side errors under the fields without calling the API', async () => {
        const user = userEvent.setup();
        renderLoginPage();

        await user.click(screen.getByRole('button', { name: 'Se connecter' }));

        expect(await screen.findByText("L'adresse email est requise.")).toBeInTheDocument();
        expect(screen.getByText('Le mot de passe est requis.')).toBeInTheDocument();
        expect(api.post).not.toHaveBeenCalled();
    });

    it('displays 422 API errors under the corresponding fields', async () => {
        const user = userEvent.setup();
        api.post.mockRejectedValue({
            response: {
                status: 422,
                data: { errors: { email: ['Cette adresse email est déjà utilisée.'] } },
            },
        });
        renderLoginPage();

        await user.type(screen.getByLabelText('Adresse email'), 'marie@exemple.fr');
        await user.type(screen.getByLabelText('Mot de passe'), 'motdepasse123');
        await user.click(screen.getByRole('button', { name: 'Se connecter' }));

        expect(await screen.findByText('Cette adresse email est déjà utilisée.')).toBeInTheDocument();
        expect(api.post).toHaveBeenCalledWith('/login', {
            email: 'marie@exemple.fr',
            password: 'motdepasse123',
        });
    });

    it('displays a generic message on 401 invalid credentials', async () => {
        const user = userEvent.setup();
        api.post.mockRejectedValue({
            response: { status: 401, data: { message: 'Identifiants invalides.' } },
        });
        renderLoginPage();

        await user.type(screen.getByLabelText('Adresse email'), 'marie@exemple.fr');
        await user.type(screen.getByLabelText('Mot de passe'), 'mauvais-mdp');
        await user.click(screen.getByRole('button', { name: 'Se connecter' }));

        expect(await screen.findByText('Identifiants invalides.')).toBeInTheDocument();
        expect(screen.getByLabelText('Mot de passe')).toBeInTheDocument();
    });

    it('stores the token and redirects to /contracts on success', async () => {
        const user = userEvent.setup();
        api.post.mockResolvedValue({
            data: { token: 'token-123', data: { id: 1, name: 'Marie', email: 'marie@exemple.fr' } },
        });
        renderLoginPage();

        await user.type(screen.getByLabelText('Adresse email'), 'marie@exemple.fr');
        await user.type(screen.getByLabelText('Mot de passe'), 'motdepasse123');
        await user.click(screen.getByRole('button', { name: 'Se connecter' }));

        expect(await screen.findByText('Contrats OK')).toBeInTheDocument();
        expect(localStorage.getItem('clausescan_token')).toBe('token-123');
    });
});
