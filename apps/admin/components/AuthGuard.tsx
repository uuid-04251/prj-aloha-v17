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

    // Initialize token refresh hook (it handles its own logic internally)
    useAuthTokenRefresh();

    useEffect(() => {
        // Check authentication status with token validation
        const checkAuth = () => {
            const token = AuthService.getToken();

            if (!token) {
                setIsAuthenticated(false);
                setIsLoading(false);
                // Only redirect if not already on the redirect page to prevent infinite loops
                if (typeof window !== 'undefined' && window.location.pathname !== redirectTo) {
                    router.push(redirectTo);
                }
                return;
            }

            // Validate token expiry
            const isValidToken = !AuthService.isTokenExpired(token);

            if (!isValidToken) {
                // Token expired, clear and redirect
                AuthService.clearTokens();
                setIsAuthenticated(false);
                setIsLoading(false);
                // Only redirect if not already on the redirect page
                if (typeof window !== 'undefined' && window.location.pathname !== redirectTo) {
                    router.push(redirectTo);
                }
                return;
            }

            setIsAuthenticated(true);
            setIsLoading(false);
        };

        checkAuth();
    }, [redirectTo, router]); // Include all dependencies used in effect

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
