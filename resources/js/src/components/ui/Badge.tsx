import type { ReactNode } from 'react';

type RiskVariant = 'low' | 'medium' | 'high';
type StatusVariant = 'info' | 'success' | 'warning' | 'error';
type BadgeVariant = RiskVariant | StatusVariant;

interface BadgeProps {
    children: ReactNode;
    variant?: BadgeVariant;
    className?: string;
}

const styles: Record<BadgeVariant, string> = {
    low: 'bg-success-100 text-success-800',
    medium: 'bg-warning-100 text-warning-800',
    high: 'bg-danger-100 text-danger-800',
    info: 'bg-primary-100 text-primary-800',
    success: 'bg-success-100 text-success-800',
    warning: 'bg-warning-100 text-warning-800',
    error: 'bg-danger-100 text-danger-800',
};

export default function Badge({ children, variant = 'info', className = '' }: BadgeProps) {
    return (
        <span
            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${styles[variant]} ${className}`}
        >
            {children}
        </span>
    );
}
