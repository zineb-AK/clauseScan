import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import NewContractPage from '@/pages/NewContractPage';

const mockNavigate = vi.fn();
const mockPost = vi.fn();

vi.mock('@/lib/api', () => ({
    default: {
        post: (...args: unknown[]) => mockPost(...args),
        get: vi.fn(),
    },
    setOnUnauthorized: vi.fn(),
}));

vi.mock('react-router', async () => {
    const actual = await vi.importActual('react-router');
    return {
        ...actual,
        useNavigate: () => mockNavigate,
    };
});

function renderWithProviders(ui: React.ReactElement) {
    const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    return render(
        <QueryClientProvider client={queryClient}>
            <MemoryRouter>{ui}</MemoryRouter>
        </QueryClientProvider>,
    );
}

beforeEach(() => {
    vi.clearAllMocks();
});

describe('NewContractPage', () => {
    it('renders the page title and both tabs', () => {
        renderWithProviders(<NewContractPage />);
        expect(screen.getByText('Nouveau contrat')).toBeInTheDocument();
        expect(screen.getByText('Fichier PDF')).toBeInTheDocument();
        expect(screen.getByText('Texte')).toBeInTheDocument();
    });

    it('shows PDF upload zone by default', () => {
        renderWithProviders(<NewContractPage />);
        expect(screen.getByText((c) => c.includes('glissez-déposez') && c.includes('PDF'))).toBeInTheDocument();
        expect(screen.getByText('Importer')).toBeInTheDocument();
    });

    it('switches to text mode when clicking Texte tab', async () => {
        renderWithProviders(<NewContractPage />);

        await userEvent.click(screen.getByText('Texte'));

        expect(screen.getByPlaceholderText('Copiez le texte de votre contrat ici...')).toBeInTheDocument();
    });

    it('shows field error on API 422 failure', async () => {
        mockPost.mockRejectedValue({
            response: {
                status: 422,
                data: {
                    message: 'Validation failed',
                    errors: { content: ['Le contenu ne doit pas être vide'] },
                },
            },
        });

        renderWithProviders(<NewContractPage />);

        await userEvent.click(screen.getByText('Texte'));
        const textarea = screen.getByPlaceholderText('Copiez le texte de votre contrat ici...');
        await userEvent.type(textarea, 'Mon contrat');

        const submitBtn = screen.getByText('Importer');
        await userEvent.click(submitBtn);

        await waitFor(() => {
            expect(screen.getByText('Le contenu ne doit pas être vide')).toBeInTheDocument();
        });
    });

    it('redirects to /contracts/{id} on successful creation', async () => {
        mockPost.mockResolvedValue({
            data: { data: { id: 42, title: 'Test', source_type: 'text', status: 'pending' } },
        });

        renderWithProviders(<NewContractPage />);

        await userEvent.click(screen.getByText('Texte'));
        const textarea = screen.getByPlaceholderText('Copiez le texte de votre contrat ici...');
        await userEvent.type(textarea, 'Mon contrat');

        const submitBtn = screen.getByText('Importer');
        await userEvent.click(submitBtn);

        await waitFor(() => {
            expect(mockNavigate).toHaveBeenCalledWith('/contracts/42');
        });
    });

    it('shows global error for non-422 failures', async () => {
        mockPost.mockRejectedValue({
            response: {
                status: 500,
                data: { message: 'Erreur serveur' },
            },
        });

        renderWithProviders(<NewContractPage />);

        await userEvent.click(screen.getByText('Texte'));
        const textarea = screen.getByPlaceholderText('Copiez le texte de votre contrat ici...');
        await userEvent.type(textarea, 'Mon contrat');

        const submitBtn = screen.getByText('Importer');
        await userEvent.click(submitBtn);

        await waitFor(() => {
            expect(screen.getByText('Erreur serveur')).toBeInTheDocument();
        });
    });
});
