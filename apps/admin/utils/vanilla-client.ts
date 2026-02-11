import { createTRPCProxyClient, httpBatchLink } from '@trpc/client';
import type { AppRouter } from '../types/trpc';
import { AuthService } from '../services/AuthService';

function getBaseUrl() {
    if (typeof window !== 'undefined') {
        // Browser should use backend URL
        return 'http://localhost:4000';
    }
    if (process.env.VERCEL_URL) {
        // SSR should use vercel url
        return `https://${process.env.VERCEL_URL}`;
    }
    // dev SSR should use localhost backend port
    return `http://localhost:4000`;
}

/**
 * Vanilla tRPC client for use in service layers
 * This client can be used outside of React components
 */
export const vanillaClient = createTRPCProxyClient<AppRouter>({
    links: [
        httpBatchLink({
            url: `${getBaseUrl()}/trpc`,
            headers() {
                // Only add Authorization header on client side
                if (typeof window === 'undefined') return {};

                const token = AuthService.getToken();
                if (!token) return {};

                // Validate token before sending
                if (AuthService.isTokenExpired(token)) {
                    console.warn('Token expired, refresh needed');
                    return {};
                }

                return {
                    Authorization: `Bearer ${token}`
                };
            }
        })
    ]
});
