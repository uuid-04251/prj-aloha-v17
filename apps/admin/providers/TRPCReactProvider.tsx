'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';
import { trpc, trpcClient } from '../utils/trpc';

export function TRPCReactProvider(props: { children: React.ReactNode }) {
    const [queryClient] = useState(
        () =>
            new QueryClient({
                defaultOptions: {
                    queries: {
                        staleTime: 5 * 1000
                    }
                }
            })
    );

    return (
        // @ts-ignore - Type conflicts due to monorepo setup
        <trpc.Provider client={trpcClient} queryClient={queryClient}>
            <QueryClientProvider client={queryClient}>{props.children}</QueryClientProvider>
            {/* @ts-ignore - Type conflicts due to monorepo setup */}
        </trpc.Provider>
    );
}
