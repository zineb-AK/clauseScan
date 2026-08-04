import { useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { z } from 'zod';
import api from '../lib/api';
import PdfUploadZone from '../components/contracts/PdfUploadZone';
import TextInput from '../components/contracts/TextInput';
import Button from '../components/ui/Button';
import type { AxiosError } from 'axios';

const MAX_FILE_SIZE = 10 * 1024 * 1024;
const MAX_CONTENT_LENGTH = 100000;

type ContractForm = {
    contract?: File;
    content?: string;
};

const pdfSchema: z.ZodType<ContractForm> = z.object({
    contract: z
        .any()
        .refine((v) => v instanceof File, 'Veuillez sélectionner un fichier PDF')
        .refine((v) => v instanceof File && v.type === 'application/pdf', 'Le contrat doit être au format PDF')
        .refine((v) => v instanceof File && v.size <= MAX_FILE_SIZE, 'Le contrat ne doit pas dépasser 10 Mo'),
    content: z.undefined().optional(),
});

const textSchema: z.ZodType<ContractForm> = z.object({
    contract: z.undefined().optional(),
    content: z
        .string()
        .min(1, 'Le contenu ne doit pas être vide')
        .max(MAX_CONTENT_LENGTH, 'Le contenu ne doit pas dépasser 100 000 caractères'),
});

export default function NewContractPage() {
    const [mode, setMode] = useState<'pdf' | 'text'>('pdf');
    const [apiError, setApiError] = useState<string | null>(null);
    const navigate = useNavigate();

    const resolver = useMemo(() => zodResolver(mode === 'pdf' ? pdfSchema : textSchema), [mode]);

    const {
        handleSubmit,
        setValue,
        watch,
        reset,
        setError,
        formState: { errors },
    } = useForm<ContractForm>({
        resolver,
        defaultValues: {},
    });

    const contractFile = watch('contract');
    const contentValue = watch('content');

    const mutation = useMutation({
        mutationFn: async (data: ContractForm) => {
            if (data.contract instanceof File) {
                const formData = new FormData();
                formData.append('contract', data.contract);
                return api.post('/contracts', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });
            }
            return api.post('/contracts', { content: data.content });
        },
        onSuccess: (response) => {
            const contractId = response.data.data.id;
            navigate(`/contracts/${contractId}`);
        },
        onError: (err: AxiosError<{ message: string; errors?: Record<string, string[]> }>) => {
            setApiError(null);

            if (err.response?.status === 422 && err.response.data?.errors) {
                for (const [field, messages] of Object.entries(err.response.data.errors)) {
                    if (field === 'contract' || field === 'content') {
                        setError(field as keyof ContractForm, { message: messages[0] });
                    }
                }
            } else {
                setApiError(err.response?.data?.message ?? 'Une erreur est survenue. Veuillez réessayer.');
            }
        },
    });

    const switchMode = useCallback(
        (newMode: 'pdf' | 'text') => {
            setMode(newMode);
            setApiError(null);
            reset({});
        },
        [reset],
    );

    const onSubmit = (data: ContractForm) => {
        setApiError(null);
        mutation.mutate(data);
    };

    return (
        <div className="mx-auto max-w-2xl">
            <h1 className="mb-6 text-2xl font-bold text-secondary-900">Nouveau contrat</h1>

            <div className="mb-6 flex border-b border-secondary-200">
                <button
                    type="button"
                    onClick={() => switchMode('pdf')}
                    className={`px-4 py-2 text-sm font-medium transition-colors ${
                        mode === 'pdf'
                            ? 'border-b-2 border-primary-600 text-primary-600'
                            : 'text-secondary-500 hover:text-secondary-700'
                    }`}
                >
                    Fichier PDF
                </button>
                <button
                    type="button"
                    onClick={() => switchMode('text')}
                    className={`px-4 py-2 text-sm font-medium transition-colors ${
                        mode === 'text'
                            ? 'border-b-2 border-primary-600 text-primary-600'
                            : 'text-secondary-500 hover:text-secondary-700'
                    }`}
                >
                    Texte
                </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {apiError && (
                    <div className="rounded-lg border border-danger-200 bg-danger-50 px-4 py-3 text-sm text-danger-700">
                        {apiError}
                    </div>
                )}

                {mode === 'pdf' && (
                    <PdfUploadZone
                        file={contractFile}
                        error={errors.contract?.message}
                        onFileSelect={(file) => setValue('contract', file, { shouldValidate: true })}
                    />
                )}

                {mode === 'text' && (
                    <TextInput
                        value={contentValue ?? ''}
                        error={errors.content?.message}
                        maxLength={MAX_CONTENT_LENGTH}
                        onChange={(val) => setValue('content', val, { shouldValidate: true })}
                    />
                )}

                <div className="flex items-center gap-3">
                    <Button type="submit" loading={mutation.isPending} disabled={mutation.isPending}>
                        Importer
                    </Button>
                    <button
                        type="button"
                        onClick={() => navigate('/contracts')}
                        className="text-sm text-secondary-500 transition-colors hover:text-secondary-700"
                    >
                        Annuler
                    </button>
                </div>
            </form>
        </div>
    );
}
