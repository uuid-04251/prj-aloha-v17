'use client';

import { useEffect, useRef } from 'react';
import { AuthService } from '../services/AuthService';
import { trpc } from '../utils/trpc';
import { useRouter } from 'next/navigation';

/**
 * Hook to automatically refresh auth token before expiration
 * Should be used in root layout or auth provider
 */
export function useAuthTokenRefresh() {
    const router = useRouter();
    const refreshTimeoutRef = useRef<ReturnType<typeof setTimeout>>();
    const isRefreshingRef = useRef(false);
    const isInitializedRef = useRef(false);
    const refreshTokenMutation = trpc.auth.refreshToken.useMutation();

    const scheduleTokenRefresh = (token: string) => {
        // Only run on client side
        if (typeof window === 'undefined') return;

        // Clear any existing timeout
        if (refreshTimeoutRef.current) {
            clearTimeout(refreshTimeoutRef.current);
        }

        const decoded = AuthService.decodeToken(token);
        if (!decoded || !decoded.exp) return;

        // Calculate when to refresh (5 minutes before expiry)
        const expiresAt = decoded.exp * 1000;
        const now = Date.now();
        const refreshIn = expiresAt - now - 5 * 60 * 1000; // 5 minutes before expiry

        // If token expires in less than 5 minutes, refresh immediately
        if (refreshIn <= 0) {
            refreshToken();
            return;
        }

        // Schedule refresh
        refreshTimeoutRef.current = setTimeout(() => {
            refreshToken();
        }, refreshIn);
    };

    const refreshToken = async () => {
        // Only run on client side
        if (typeof window === 'undefined') return;

        // Prevent multiple concurrent refresh attempts
        if (isRefreshingRef.current) return;
        isRefreshingRef.current = true;

        const currentRefreshToken = AuthService.getRefreshToken();
        if (!currentRefreshToken) {
            // No refresh token, logout
            handleLogout();
            return;
        }

        try {
            const result = await refreshTokenMutation.mutateAsync({
                refreshToken: currentRefreshToken
            });

            // Store new tokens
            AuthService.setTokens(result.accessToken, result.refreshToken);

            // Schedule next refresh
            scheduleTokenRefresh(result.accessToken);
        } catch (error) {
            console.error('Token refresh failed:', error);
            // Refresh failed, logout user
            handleLogout();
        } finally {
            isRefreshingRef.current = false;
        }
    };

    const handleLogout = () => {
        AuthService.clearTokens();
        // Only redirect if not already on login page to prevent infinite loops
        if (typeof window !== 'undefined' && !window.location.pathname.includes('/auth/login')) {
            router.push('/auth/login');
        }
    };

    useEffect(() => {
        // Only run on client side to prevent SSR issues
        if (typeof window === 'undefined') return;

        // Prevent multiple initializations
        if (isInitializedRef.current) return;
        isInitializedRef.current = true;

        const token = AuthService.getToken();
        if (!token) return;

        // Check if token is already expired
        if (AuthService.isTokenExpired(token)) {
            // Try to refresh immediately
            refreshToken();
        } else {
            // Schedule refresh
            scheduleTokenRefresh(token);
        }

        // Cleanup on unmount
        return () => {
            if (refreshTimeoutRef.current) {
                clearTimeout(refreshTimeoutRef.current);
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // Empty dependency array to prevent re-runs

    return { refreshToken };
}
