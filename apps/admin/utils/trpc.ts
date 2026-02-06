import { httpBatchLink, loggerLink } from '@trpc/client';
import { createTRPCReact } from '@trpc/react-query';
import type { AppRouter } from '../types/trpc';

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

export const trpc = createTRPCReact<AppRouter>();

// @ts-ignore - Type conflicts due to monorepo setup
export const trpcClient = trpc.createClient({
    links: [
        loggerLink({
            enabled: (opts) => process.env.NODE_ENV === 'development' || (opts.direction === 'down' && opts.result instanceof Error)
        }),
        httpBatchLink({
            url: `${getBaseUrl()}/trpc`
        })
    ]
});
