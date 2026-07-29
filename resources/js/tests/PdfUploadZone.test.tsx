import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import PdfUploadZone from '@/components/contracts/PdfUploadZone';

function createFile(name: string, type: string, size: number): File {
    const blob = new Blob(['x'.repeat(size)], { type });
    return new File([blob], name, { type });
}

describe('PdfUploadZone', () => {
    it('renders the drop zone with instructions', () => {
        render(<PdfUploadZone file={undefined} error={undefined} onFileSelect={vi.fn()} />);
        expect(screen.getByText((c) => c.includes('glissez-déposez') && c.includes('PDF'))).toBeInTheDocument();
        expect(screen.getByText('Taille maximale : 10 Mo')).toBeInTheDocument();
    });

    it('displays file name when a file is selected', () => {
        const file = createFile('test.pdf', 'application/pdf', 1024);
        render(<PdfUploadZone file={file} error={undefined} onFileSelect={vi.fn()} />);
        expect(screen.getByText('test.pdf')).toBeInTheDocument();
    });

    it('shows error message when error prop is set', () => {
        render(<PdfUploadZone file={undefined} error="Le PDF semble être scanné" onFileSelect={vi.fn()} />);
        expect(screen.getByText('Le PDF semble être scanné')).toBeInTheDocument();
    });

    it('calls onFileSelect with a valid PDF file', async () => {
        const onFileSelect = vi.fn();
        const file = createFile('doc.pdf', 'application/pdf', 5000);

        const { container } = render(<PdfUploadZone file={undefined} error={undefined} onFileSelect={onFileSelect} />);

        const input = container.querySelector('input[type="file"]')!;
        fireEvent.change(input, { target: { files: [file] } });

        expect(onFileSelect).toHaveBeenCalledWith(file);
    });

    it('does not call onFileSelect for non-PDF file', async () => {
        const onFileSelect = vi.fn();
        const file = createFile('doc.png', 'image/png', 5000);

        const { container } = render(<PdfUploadZone file={undefined} error={undefined} onFileSelect={onFileSelect} />);

        const input = container.querySelector('input[type="file"]')!;
        fireEvent.change(input, { target: { files: [file] } });

        await waitFor(() => {
            expect(screen.getByText('Le contrat doit être au format PDF')).toBeInTheDocument();
        });

        expect(onFileSelect).not.toHaveBeenCalled();
    });
});
