import type { ReactNode } from 'react';
import { Link } from 'react-router';

interface AuthLayoutProps {
    children: ReactNode;
    title: string;
}

export default function AuthLayout({ children, title }: AuthLayoutProps) {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-secondary-50 px-4">
            <div className="w-full max-w-md">
                <div className="mb-8 text-center">
                    <Link to="/" className="text-2xl font-bold text-secondary-900">
                        ClauseScan
                    </Link>
                </div>
                <div className="rounded-xl border border-secondary-200 bg-white px-8 py-8 shadow-sm">
                    <h1 className="mb-6 text-center text-xl font-semibold text-secondary-900">{title}</h1>
                    {children}
                </div>
            </div>
        </div>
    );
}
