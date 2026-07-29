interface TextInputProps {
    value: string;
    error?: string;
    maxLength: number;
    onChange: (value: string) => void;
}

export default function TextInput({ value, error, maxLength, onChange }: TextInputProps) {
    const charCount = value.length;
    const isOverLimit = charCount > maxLength;
    const isNearLimit = charCount > maxLength * 0.9 && !isOverLimit;

    return (
        <div className="space-y-1">
            <label className="block text-sm font-medium text-secondary-700">Contenu du contrat</label>
            <textarea
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder="Copiez le texte de votre contrat ici..."
                rows={12}
                className={`block w-full rounded-lg border px-3 py-2 text-sm shadow-sm transition-colors placeholder:text-secondary-400 focus:outline-none focus:ring-2 focus:ring-offset-1 ${
                    error
                        ? 'border-danger-500 focus:border-danger-500 focus:ring-danger-500'
                        : 'border-secondary-300 focus:border-primary-500 focus:ring-primary-500'
                }`}
            />
            <div className="flex items-center justify-between">
                {error ? (
                    <p className="text-sm text-danger-600">{error}</p>
                ) : (
                    <span />
                )}
                <span
                    className={`text-xs tabular-nums ${
                        isOverLimit
                            ? 'text-danger-600 font-medium'
                            : isNearLimit
                              ? 'text-warning-600'
                              : 'text-secondary-400'
                    }`}
                >
                    {charCount.toLocaleString('fr-FR')} / {maxLength.toLocaleString('fr-FR')}
                </span>
            </div>
        </div>
    );
}
