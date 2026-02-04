import { type CreateFastifyContextOptions } from '@trpc/server/adapters/fastify';
import { JWTPayload } from '../auth';
// Context type for HTTP requests
export function createContext({ req, res }: CreateFastifyContextOptions) {
    return {
        req,
        res,
        user: null as JWTPayload | null // Will be set by auth middleware
    };
}

// Type definitions
export type Context = Awaited<ReturnType<typeof createContext>>;
