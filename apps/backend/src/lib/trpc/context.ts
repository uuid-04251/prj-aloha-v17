import { type CreateFastifyContextOptions } from '@trpc/server/adapters/fastify';
import { type CreateWSSContextFnOptions } from '@trpc/server/adapters/ws';
import { env } from '../../util/env';
import { JWTPayload } from '../auth';
// Context type for HTTP requests
export function createContext({ req, res }: CreateFastifyContextOptions) {
    return {
        req,
        res,
        user: null as JWTPayload | null // Will be set by auth middleware
    };
}

// Context type for WebSocket connections (if needed later)
export function createWSContext({ req }: CreateWSSContextFnOptions) {
    return {
        req,
        user: null
    };
}

// Type definitions
export type Context = Awaited<ReturnType<typeof createContext>>;
export type WSContext = Awaited<ReturnType<typeof createWSContext>>;
