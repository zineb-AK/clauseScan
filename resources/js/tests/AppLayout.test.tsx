import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import AppLayout from '@/components/layout/AppLayout';

const mockLogout = vi.fn();

vi.mock('@/features/auth/AuthContext', () => ({
    useAuth: () => ({
        user: { id: 1, name: 'Jean Dupont', email: 'jean@test.com' },
        token: 'fake-token',
        isAuthenticated: true,
        login: vi.fn(),
        logout: mockLogout,
    }),
    AuthProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

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

describe('AppLayout logout button', () => {
    it('renders the Déconnexion button for authenticated users', () => {
        renderWithProviders(<AppLayout />);
        expect(screen.getByText('Déconnexion')).toBeInTheDocument();
    });

    it('displays the user name', () => {
        renderWithProviders(<AppLayout />);
        expect(screen.getByText('Jean Dupont')).toBeInTheDocument();
    });

    it('calls logout when Déconnexion is clicked', async () => {
        renderWithProviders(<AppLayout />);
        await userEvent.click(screen.getByText('Déconnexion'));
        expect(mockLogout).toHaveBeenCalledOnce();
    });

    it('renders navigation links', () => {
        renderWithProviders(<AppLayout />);
        expect(screen.getByText('ClauseScan')).toBeInTheDocument();
        expect(screen.getByText('Contrats')).toBeInTheDocument();
        expect(screen.getByText('Historique')).toBeInTheDocument();
    });
});
