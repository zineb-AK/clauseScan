import { useRef, useState } from 'react';

function FileIcon() {
    return (
        <svg className="w-10 h-10 text-blue-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
            />
        </svg>
    );
}

export function FileDropzone({
    file,
    onFileChange,
    error,
    uploading = false,
    progress = 0,
}) {
    const inputRef = useRef(null);
    const [dragOver, setDragOver] = useState(false);

    const handleFiles = (files) => {
        const selected = files?.[0];

        if (selected) {
            onFileChange(selected);
        }
    };

    return (
        <div>
            <div
                role="button"
                tabIndex={0}
                onClick={() => inputRef.current?.click()}
                onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                        inputRef.current?.click();
                    }
                }}
                onDragOver={(event) => {
                    event.preventDefault();
                    setDragOver(true);
                }}
                onDragLeave={() => setDragOver(false)}
                onDrop={(event) => {
                    event.preventDefault();
                    setDragOver(false);
                    handleFiles(event.dataTransfer.files);
                }}
                className={`mt-1.5 w-full px-6 py-10 rounded-xl border-2 border-dashed text-center cursor-pointer transition-colors duration-200 ${
                    dragOver ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-gray-50 hover:bg-gray-100'
                }`}
            >
                <input
                    ref={inputRef}
                    type="file"
                    accept="application/pdf,.pdf"
                    className="hidden"
                    onChange={(event) => handleFiles(event.target.files)}
                />

                {uploading ? (
                    <div>
                        <p className="text-sm font-medium text-gray-700 mb-3">Envoi du PDF en cours…</p>
                        <div className="w-full max-w-xs mx-auto h-2 rounded-full bg-gray-200 overflow-hidden">
                            <div
                                className="h-full bg-blue-500 transition-all duration-200"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                        <p className="mt-2 text-sm text-gray-500">{progress}%</p>
                    </div>
                ) : file ? (
                    <div className="flex items-center justify-center gap-3">
                        <svg className="w-8 h-8 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                        </svg>
                        <div className="text-left">
                            <p className="text-sm font-medium text-gray-900 truncate max-w-xs">{file.name}</p>
                            <p className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} Mo</p>
                        </div>
                    </div>
                ) : (
                    <div>
                        <FileIcon />
                        <p className="text-sm text-gray-600">
                            Glissez-déposez votre contrat PDF ici, ou{' '}
                            <span className="font-medium text-blue-600 underline">parcourez vos fichiers</span>
                        </p>
                        <p className="mt-1 text-xs text-gray-400">Format PDF uniquement, 10 Mo maximum</p>
                    </div>
                )}
            </div>

            {error && (
                <p className="mt-1.5 text-sm text-red-600" role="alert">
                    {error}
                </p>
            )}
        </div>
    );
}