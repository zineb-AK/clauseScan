import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider, useAuth } from '@/features/auth/AuthContext';

const mockNavigate = vi.hoisted(() => vi.fn());
const mockPost = vi.hoisted(() => vi.fn());
const mockSetOnUnauthorized = vi.hoisted(() => vi.fn());

vi.mock('@/lib/api', () => ({
    default: {
        post: (...args: unknown[]) => mockPost(...args),
        get: vi.fn().mockResolvedValue({ data: { id: 1, name: 'Test', email: 'test@test.com' } }),
    },
    setOnUnauthorized: mockSetOnUnauthorized,
}));

vi.mock('react-router', async () => {
    const actual = await vi.importActual('react-router');
    return {
        ...actual,
        useNavigate: () => mockNavigate,
    };
});

function LogoutButton() {
    const { logout } = useAuth();
    return <button onClick={logout}>Déconnexion</button>;
}

function renderWithProviders(ui: React.ReactElement) {
    const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    return render(
        <QueryClientProvider client={queryClient}>
            <MemoryRouter>
                <AuthProvider>{ui}</AuthProvider>
            </MemoryRouter>
        </QueryClientProvider>,
    );
}

beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
});

describe('AuthContext', () => {
    it('registers setOnUnauthorized callback on mount', () => {
        renderWithProviders(<div>test</div>);
        expect(mockSetOnUnauthorized).toHaveBeenCalledTimes(1);
        expect(mockSetOnUnauthorized).toHaveBeenCalledWith(expect.any(Function));
    });

    it('calls POST /logout and clears state on successful logout', async () => {
        mockPost.mockResolvedValue({ status: 204 });

        renderWithProviders(<LogoutButton />);

        await userEvent.click(screen.getByText('Déconnexion'));

        expect(mockPost).toHaveBeenCalledWith('/logout');
        expect(localStorage.getItem('auth_token')).toBeNull();
        expect(mockNavigate).toHaveBeenCalledWith('/login');
    });

    it('clears state on logout even if API call fails', async () => {
        mockPost.mockRejectedValue(new Error('Network error'));

        renderWithProviders(<LogoutButton />);

        await userEvent.click(screen.getByText('Déconnexion'));

        expect(mockPost).toHaveBeenCalledWith('/logout');
        expect(localStorage.getItem('auth_token')).toBeNull();
        expect(mockNavigate).toHaveBeenCalledWith('/login');
    });
});
