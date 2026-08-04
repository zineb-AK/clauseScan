import { describe, expect, it, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { ContractNewPage } from './ContractNewPage';
import { ContractDetailPage } from './ContractDetailPage';

vi.mock('../lib/api', () => ({
    default: { post: vi.fn() },
}));

import api from '../lib/api';

function createPdfFile(name = 'bail.pdf') {
    return new File(['%PDF-1.4 contenu du bail'], name, { type: 'application/pdf' });
}

function renderImportPage() {
    return render(
        <MemoryRouter initialEntries={['/contracts/new']}>
            <Routes>
                <Route path="/contracts/new" element={<ContractNewPage />} />
                <Route path="/contracts/:id" element={<ContractDetailPage />} />
                <Route path="/contracts" element={<div>Contrats OK</div>} />
            </Routes>
        </MemoryRouter>,
    );
}

describe('ContractNewPage', () => {
    beforeEach(() => {
        api.post.mockReset();
    });

    it('renders the import form with both modes', () => {
        renderImportPage();

        expect(screen.getByRole('heading', { name: 'Nouveau contrat' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Fichier PDF' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Texte brut' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Importer le contrat' })).toBeInTheDocument();
        expect(screen.getByText(/Glissez-déposez votre contrat PDF/)).toBeInTheDocument();
    });

    it('blocks submission without a file and does not call the API', async () => {
        const user = userEvent.setup();
        renderImportPage();

        await user.click(screen.getByRole('button', { name: 'Importer le contrat' }));

        expect(await screen.findByText('Le fichier du contrat est requis.')).toBeInTheDocument();
        expect(api.post).not.toHaveBeenCalled();
    });

    it('shows a client-side error for a non-PDF file', async () => {
        const { container } = renderImportPage();
        const dropzone = container.querySelector('[role="button"]');
        const docxFile = new File(['x'], 'contrat.docx', {
            type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        });

        fireEvent.drop(dropzone, { dataTransfer: { files: [docxFile] } });

        expect(await screen.findByText('Le contrat doit être au format PDF.')).toBeInTheDocument();
    });

    it('validates text mode content before submitting', async () => {
        const user = userEvent.setup();
        renderImportPage();

        await user.click(screen.getByRole('button', { name: 'Texte brut' }));
        await user.click(screen.getByRole('button', { name: 'Importer le contrat' }));

        expect(await screen.findByText('Le contenu ne doit pas être vide.')).toBeInTheDocument();
        expect(api.post).not.toHaveBeenCalled();
    });

    it('displays the character counter in text mode', async () => {
        const user = userEvent.setup();
        renderImportPage();

        await user.click(screen.getByRole('button', { name: 'Texte brut' }));
        await user.type(screen.getByLabelText('Contenu du contrat'), 'Bail de location');

        expect(screen.getByText(/16 \/ 100 000 caractères/)).toBeInTheDocument();
    });

    it('displays server 422 field errors under the dropzone', async () => {
        const user = userEvent.setup();
        api.post.mockRejectedValue({
            response: { status: 422, data: { errors: { contract: ['Le contrat doit être au format PDF.'] } } },
        });
        const { container } = renderImportPage();
        const fileInput = container.querySelector('input[type="file"]');

        await user.upload(fileInput, createPdfFile());
        await user.click(screen.getByRole('button', { name: 'Importer le contrat' }));

        expect(await screen.findByText('Le contrat doit être au format PDF.')).toBeInTheDocument();
        expect(api.post).toHaveBeenCalledTimes(1);
    });

    it('displays a global server message (scanned PDF) in a banner', async () => {
        const user = userEvent.setup();
        api.post.mockRejectedValue({
            response: {
                status: 422,
                data: { message: 'Le PDF semble être scanné (aucun texte exploitable).' },
            },
        });
        const { container } = renderImportPage();
        const fileInput = container.querySelector('input[type="file"]');

        await user.upload(fileInput, createPdfFile());
        await user.click(screen.getByRole('button', { name: 'Importer le contrat' }));

        expect(await screen.findByText('Le PDF semble être scanné (aucun texte exploitable).')).toBeInTheDocument();
    });

    it('redirects to the contract detail page on success', async () => {
        const user = userEvent.setup();
        api.post.mockResolvedValue({
            data: {
                id: 7,
                title: 'bail.pdf',
                source_type: 'pdf',
                status: 'pending',
                created_at: '2026-08-04T00:00:00.000000Z',
            },
        });
        const { container } = renderImportPage();
        const fileInput = container.querySelector('input[type="file"]');

        await user.upload(fileInput, createPdfFile());
        await user.click(screen.getByRole('button', { name: 'Importer le contrat' }));

        expect(await screen.findByRole('heading', { name: 'bail.pdf' })).toBeInTheDocument();
        expect(api.post).toHaveBeenCalledTimes(1);
    });
});
