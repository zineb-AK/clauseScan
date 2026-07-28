import type { ReactNode } from 'react';

interface CardProps {
    children: ReactNode;
    className?: string;
    header?: ReactNode;
    footer?: ReactNode;
}

export default function Card({ children, className = '', header, footer }: CardProps) {
    return (
        <div className={`rounded-xl border border-secondary-200 bg-white shadow-sm ${className}`}>
            {header && <div className="border-b border-secondary-200 px-6 py-4 font-medium">{header}</div>}
            <div className="px-6 py-4">{children}</div>
            {footer && <div className="border-t border-secondary-200 px-6 py-4 text-sm text-secondary-500">{footer}</div>}
        </div>
    );
}
