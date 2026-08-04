import { useRef, useState, type DragEvent, type ChangeEvent } from 'react';

interface PdfUploadZoneProps {
    file: File | undefined;
    error?: string;
    onFileSelect: (file: File) => void;
}

export default function PdfUploadZone({ file, error, onFileSelect }: PdfUploadZoneProps) {
    const inputRef = useRef<HTMLInputElement>(null);
    const [isDragOver, setIsDragOver] = useState(false);
    const [localError, setLocalError] = useState<string | null>(null);

    const validateFile = (f: File): boolean => {
        if (f.type !== 'application/pdf') {
            setLocalError('Le contrat doit être au format PDF');
            return false;
        }
        if (f.size > 10 * 1024 * 1024) {
            setLocalError('Le contrat ne doit pas dépasser 10 Mo');
            return false;
        }
        setLocalError(null);
        return true;
    };

    const handleDrop = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragOver(false);
        const f = e.dataTransfer.files[0];
        if (f && validateFile(f)) {
            onFileSelect(f);
        }
    };

    const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragOver(true);
    };

    const handleDragLeave = () => {
        setIsDragOver(false);
    };

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const f = e.target.files?.[0];
        if (f && validateFile(f)) {
            onFileSelect(f);
        }
        e.target.value = '';
    };

    const handleClick = () => {
        inputRef.current?.click();
    };

    const displayError = error ?? localError;

    return (
        <div>
            <div
                onClick={handleClick}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                className={`flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 text-center transition-colors ${
                    isDragOver
                        ? 'border-primary-500 bg-primary-50'
                        : displayError
                          ? 'border-danger-500 bg-danger-50'
                          : 'border-secondary-300 bg-white hover:border-primary-400 hover:bg-primary-50/50'
                }`}
            >
                <input
                    ref={inputRef}
                    type="file"
                    accept=".pdf,application/pdf"
                    className="hidden"
                    onChange={handleInputChange}
                />

                {file ? (
                    <div className="flex flex-col items-center gap-2">
                        <svg className="size-8 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p className="text-sm font-medium text-secondary-900">{file.name}</p>
                        <p className="text-xs text-secondary-500">{(file.size / 1024 / 1024).toFixed(1)} Mo</p>
                    </div>
                ) : (
                    <div className="flex flex-col items-center gap-2">
                        <svg className="size-8 text-secondary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                        <p className="text-sm text-secondary-600">
                            <span className="font-medium text-primary-600">Cliquez</span> ou glissez-déposez un fichier PDF
                        </p>
                        <p className="text-xs text-secondary-400">Taille maximale : 10 Mo</p>
                    </div>
                )}
            </div>

            {displayError && <p className="mt-1 text-sm text-danger-600">{displayError}</p>}
        </div>
    );
}
