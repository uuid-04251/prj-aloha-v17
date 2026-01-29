import { CreateFastifyContextOptions } from '@trpc/server/adapters/fastify';

export function createContext({ req, res }: CreateFastifyContextOptions) {
    return {
        req,
        res,
        // Add user context if authenticated
        user: null // Will be populated by auth middleware
    };
}

export type Context = ReturnType<typeof createContext>;
