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
    const refreshTokenMutation = trpc.auth.refreshToken.useMutation();

    const scheduleTokenRefresh = (token: string) => {
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
        }
    };

    const handleLogout = () => {
        AuthService.clearTokens();
        router.push('/auth/login');
    };

    useEffect(() => {
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
    }, []);

    return { refreshToken };
}
