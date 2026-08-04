import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TextInput from '@/components/contracts/TextInput';

const MAX = 100000;

function getCharCountEl(value: string): HTMLElement | null {
    const el = screen.queryByText((c) => c.includes(value) && c.includes(String(MAX)));
    return el;
}

describe('TextInput', () => {
    it('renders textarea and character count', () => {
        render(<TextInput value="" error={undefined} maxLength={MAX} onChange={vi.fn()} />);
        expect(screen.getByPlaceholderText('Copiez le texte de votre contrat ici...')).toBeInTheDocument();
    });

    it('displays character count as user types', async () => {
        const onChange = vi.fn();

        const { rerender } = render(<TextInput value="" error={undefined} maxLength={MAX} onChange={onChange} />);

        const textarea = screen.getByPlaceholderText('Copiez le texte de votre contrat ici...');
        await userEvent.type(textarea, 'Bonjour');

        expect(onChange).toHaveBeenCalled();
    });

    it('shows character count with value prop', () => {
        render(<TextInput value="Test" error={undefined} maxLength={MAX} onChange={vi.fn()} />);
        expect(screen.getByText((c) => c.includes('4 /'))).toBeInTheDocument();
    });

    it('displays error message when error prop is set', () => {
        render(<TextInput value="test" error="Le contenu ne doit pas être vide" maxLength={MAX} onChange={vi.fn()} />);
        expect(screen.getByText('Le contenu ne doit pas être vide')).toBeInTheDocument();
    });

    it('applies warning color when nearing limit', () => {
        const nearLimit = 'x'.repeat(Math.floor(MAX * 0.95));
        const { container } = render(<TextInput value={nearLimit} error={undefined} maxLength={MAX} onChange={vi.fn()} />);

        const spans = container.querySelectorAll('span');
        const countSpan = Array.from(spans).find(
            (s) => s.className.includes('warning') || s.className.includes('tabular-nums'),
        );
        expect(countSpan?.className).toContain('warning');
    });

    it('applies danger color when exceeding limit', () => {
        const overLimit = 'x'.repeat(MAX + 1);
        const { container } = render(<TextInput value={overLimit} error={undefined} maxLength={MAX} onChange={vi.fn()} />);

        const spans = container.querySelectorAll('span');
        const countSpan = Array.from(spans).find(
            (s) => s.className.includes('danger') || s.className.includes('tabular-nums'),
        );
        expect(countSpan?.className).toContain('danger');
    });
});
