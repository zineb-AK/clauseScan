import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { AuthProvider } from '../features/auth/AuthContext';
import { RegisterPage } from './RegisterPage';

vi.mock('../lib/api', () => ({
    default: { post: vi.fn() },
}));

import api from '../lib/api';

const validPayload = {
    name: 'Marie Dupont',
    email: 'marie@exemple.fr',
    password: 'motdepasse123',
    password_confirmation: 'motdepasse123',
};

async function fillRegisterForm(user) {
    await user.type(screen.getByLabelText('Nom'), validPayload.name);
    await user.type(screen.getByLabelText('Adresse email'), validPayload.email);
    await user.type(screen.getByLabelText('Mot de passe'), validPayload.password);
    await user.type(
        screen.getByLabelText('Confirmer le mot de passe'),
        validPayload.password_confirmation,
    );
}

function renderRegisterPage() {
    return render(
        <MemoryRouter initialEntries={['/register']}>
            <AuthProvider>
                <Routes>
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/contracts" element={<div>Contrats OK</div>} />
                </Routes>
            </AuthProvider>
        </MemoryRouter>,
    );
}

describe('RegisterPage', () => {
    beforeEach(() => {
        api.post.mockReset();
    });

    it('renders the registration form', () => {
        renderRegisterPage();

        expect(screen.getByLabelText('Nom')).toBeInTheDocument();
        expect(screen.getByLabelText('Adresse email')).toBeInTheDocument();
        expect(screen.getByLabelText('Mot de passe')).toBeInTheDocument();
        expect(screen.getByLabelText('Confirmer le mot de passe')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: "S'inscrire" })).toBeInTheDocument();
        expect(screen.getByText('Déjà un compte ?')).toBeInTheDocument();
        expect(screen.getByRole('link', { name: 'Se connecter' })).toHaveAttribute(
            'href',
            '/login',
        );
    });

    it('shows client-side errors under the fields without calling the API', async () => {
        const user = userEvent.setup();
        renderRegisterPage();

        await user.click(screen.getByRole('button', { name: "S'inscrire" }));

        expect(await screen.findByText('Le nom est requis.')).toBeInTheDocument();
        expect(screen.getByText("L'adresse email est requise.")).toBeInTheDocument();
        expect(screen.getByText('Le mot de passe est requis.')).toBeInTheDocument();
        expect(api.post).not.toHaveBeenCalled();
    });

    it('shows a client-side error when the password confirmation does not match', async () => {
        const user = userEvent.setup();
        renderRegisterPage();

        await fillRegisterForm(user);
        await user.clear(screen.getByLabelText('Confirmer le mot de passe'));
        await user.type(screen.getByLabelText('Confirmer le mot de passe'), 'autre-mdp');
        await user.click(screen.getByRole('button', { name: "S'inscrire" }));

        expect(await screen.findByText('Les mots de passe ne correspondent pas.')).toBeInTheDocument();
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
        renderRegisterPage();

        await fillRegisterForm(user);
        await user.click(screen.getByRole('button', { name: "S'inscrire" }));

        expect(await screen.findByText('Cette adresse email est déjà utilisée.')).toBeInTheDocument();
        expect(api.post).toHaveBeenCalledWith('/register', validPayload);
    });

    it('stores the token and redirects to /contracts on success', async () => {
        const user = userEvent.setup();
        api.post.mockResolvedValue({
            data: { token: 'token-456', data: { id: 2, name: 'Marie', email: 'marie@exemple.fr' } },
        });
        renderRegisterPage();

        await fillRegisterForm(user);
        await user.click(screen.getByRole('button', { name: "S'inscrire" }));

        expect(await screen.findByText('Contrats OK')).toBeInTheDocument();
        expect(localStorage.getItem('clausescan_token')).toBe('token-456');
    });
});
