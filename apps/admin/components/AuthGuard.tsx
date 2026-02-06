'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AuthService } from '../services/AuthService';

interface AuthGuardProps {
    children: React.ReactNode;
    redirectTo?: string;
}

export function AuthGuard({ children, redirectTo = '/auth/login' }: AuthGuardProps) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        // Check authentication status
        const checkAuth = () => {
            const authStatus = AuthService.isAuthenticated();
            setIsAuthenticated(authStatus);
            setIsLoading(false);

            if (!authStatus) {
                router.push(redirectTo);
            }
        };

        // Small delay to allow token storage after login redirect
        const timer = setTimeout(checkAuth, 100);

        return () => clearTimeout(timer);
    }, [router, redirectTo]);

    // Show loading or nothing while checking authentication
    if (isLoading) {
        return (
            <div className="flex align-items-center justify-content-center min-h-screen">
                <div className="text-center">
                    <div className="spinner-border" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                    <div className="mt-2">Checking authentication...</div>
                </div>
            </div>
        );
    }

    // If not authenticated, don't render children (redirect is handled in useEffect)
    if (!isAuthenticated) {
        return null;
    }

    return <>{children}</>;
}
