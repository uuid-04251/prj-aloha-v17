'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AuthService } from '../services/AuthService';
import { useAuthTokenRefresh } from '../hooks/useAuthTokenRefresh';

interface AuthGuardProps {
    children: React.ReactNode;
    redirectTo?: string;
}

export function AuthGuard({ children, redirectTo = '/auth/login' }: AuthGuardProps) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // Enable auto token refresh
    useAuthTokenRefresh();

    useEffect(() => {
        // Check authentication status with token validation
        const checkAuth = () => {
            const token = AuthService.getToken();

            if (!token) {
                setIsAuthenticated(false);
                setIsLoading(false);
                router.push(redirectTo);
                return;
            }

            // Validate token expiry
            const isValidToken = !AuthService.isTokenExpired(token);

            if (!isValidToken) {
                // Token expired, clear and redirect
                AuthService.clearTokens();
                setIsAuthenticated(false);
                setIsLoading(false);
                router.push(redirectTo);
                return;
            }

            setIsAuthenticated(true);
            setIsLoading(false);
        };

        checkAuth();
    }, [router, redirectTo]);

    // Show loading or nothing while checking authentication
    if (isLoading) {
        return (
            <div className="flex align-items-center justify-content-center min-h-screen">
                <div className="text-center">
                    <i className="pi pi-spin pi-spinner" style={{ fontSize: '3rem' }}></i>
                    <div className="mt-3 text-xl">Checking authentication...</div>
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
