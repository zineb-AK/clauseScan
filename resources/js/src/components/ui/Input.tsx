import { type InputHTMLAttributes, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ label, error, className = '', id, ...props }, ref) => {
        const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-');

        return (
            <div className="space-y-1">
                {label && (
                    <label htmlFor={inputId} className="block text-sm font-medium text-secondary-700">
                        {label}
                    </label>
                )}
                <input
                    ref={ref}
                    id={inputId}
                    className={`block w-full rounded-lg border px-3 py-2 text-sm shadow-sm transition-colors placeholder:text-secondary-400 focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:cursor-not-allowed disabled:bg-secondary-50 disabled:text-secondary-500 ${
                        error
                            ? 'border-danger-500 focus:border-danger-500 focus:ring-danger-500'
                            : 'border-secondary-300 focus:border-primary-500 focus:ring-primary-500'
                    } ${className}`}
                    {...props}
                />
                {error && <p className="text-sm text-danger-600">{error}</p>}
            </div>
        );
    },
);

Input.displayName = 'Input';

export default Input;
