import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FileDropzone } from '../components/FileDropzone';
import { importSchema, MAX_CONTENT_CHARS } from '../features/contracts/importSchema';
import { useImportContract } from '../features/contracts/useImportContract';

export function ContractNewPage() {
    const navigate = useNavigate();
    const {
        register,
        handleSubmit,
        setValue,
        setError,
        watch,
        clearErrors,
        resetField,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(importSchema),
        defaultValues: { mode: 'pdf', contract: undefined, content: '' },
    });
    const { importContract, isSubmitting, progress, apiError, setApiError } = useImportContract();

    const mode = watch('mode');
    const content = watch('content') ?? '';

    const switchMode = (next) => {
        setValue('mode', next);

        if (next === 'pdf') {
            setValue('content', '');
        } else {
            resetField('contract');
        }

        clearErrors('contract', 'content');
        setApiError(null);
    };

    const handleFileChange = (file) => {
        setValue('contract', file, { shouldValidate: true });
    };

    const onSubmit = async (values) => {
        setApiError(null);

        try {
            const contract = await importContract(values);
            navigate(`/contracts/${contract.id}`, { state: { contract } });
        } catch (error) {
            if (error.response?.status === 422 && error.response.data?.errors) {
                Object.entries(error.response.data.errors).forEach(([field, messages]) => {
                    setError(field, { type: 'server', message: messages[0] });
                });
            } else if (error.response?.data?.message) {
                setApiError(error.response.data.message);
            } else {
                setApiError('Service indisponible, réessayez.');
            }
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 py-10">
            <div className="w-full max-w-2xl">
                <Link to="/contracts" className="text-sm font-medium text-primary hover:underline mb-6 inline-block">
                    ← Retour à mes contrats
                </Link>

                <div className="bg-white rounded-2xl shadow-2xl p-8">
                    <h1 className="text-2xl font-bold text-primary">Nouveau contrat</h1>
                    <p className="mt-1 text-sm text-gray-500">
                        Importez un contrat PDF ou collez son contenu pour lancer une analyse.
                    </p>

                    {apiError && (
                        <div className="mt-4 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-sm text-red-700">
                            {apiError}
                        </div>
                    )}

                    <div className="mt-6 grid grid-cols-2 gap-2 p-1 rounded-xl bg-gray-100">
                        <button
                            type="button"
                            onClick={() => switchMode('pdf')}
                            className={`py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
                                mode === 'pdf'
                                    ? 'bg-white text-primary shadow'
                                    : 'text-gray-500 hover:text-gray-700'
                            }`}
                        >
                            Fichier PDF
                        </button>
                        <button
                            type="button"
                            onClick={() => switchMode('text')}
                            className={`py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
                                mode === 'text'
                                    ? 'bg-white text-primary shadow'
                                    : 'text-gray-500 hover:text-gray-700'
                            }`}
                        >
                            Texte brut
                        </button>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-5" noValidate>
                        {mode === 'pdf' ? (
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Fichier du contrat</label>
                                <FileDropzone
                                    file={watch('contract')}
                                    onFileChange={handleFileChange}
                                    error={errors.contract?.message}
                                    uploading={isSubmitting}
                                    progress={progress}
                                />
                            </div>
                        ) : (
                            <div>
                                <label htmlFor="content" className="block text-sm font-medium text-gray-700">
                                    Contenu du contrat
                                </label>
                                <textarea
                                    id="content"
                                    rows={12}
                                    {...register('content')}
                                    className={`mt-1.5 w-full px-4 py-3 rounded-xl border bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:bg-white resize-y ${
                                        errors.content ? 'border-red-400' : 'border-gray-200'
                                    }`}
                                    placeholder="Collez ici le texte de votre contrat…"
                                />
                                {errors.content ? (
                                    <p className="mt-1.5 text-sm text-red-600" role="alert">
                                        {errors.content.message}
                                    </p>
                                ) : (
                                    <p className="mt-1.5 text-right text-xs text-gray-400">
                                        {content.length.toLocaleString('fr-FR')} /{' '}
                                        {MAX_CONTENT_CHARS.toLocaleString('fr-FR')} caractères
                                    </p>
                                )}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full py-3 rounded-xl text-sm font-semibold text-white bg-primary hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200 shadow-lg shadow-blue-500/20"
                        >
                            {isSubmitting ? 'Import en cours…' : 'Importer le contrat'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}