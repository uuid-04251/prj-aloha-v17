import { initTRPC } from '@trpc/server';
import { logger } from '@/util/logger';

// Initialize tRPC
const t = initTRPC.create({
    // Add error formatter for better error messages
    errorFormatter({ shape, error }) {
        logger.error(`tRPC Error: ${error.message} (code: ${error.code})`);

        return {
            ...shape,
            data: {
                ...shape.data,
                zodError: error.cause instanceof Error ? error.cause.message : null
            }
        };
    }
});

// Export tRPC functions
export const router = t.router;
export const publicProcedure = t.procedure;
export const middleware = t.middleware;
export const createCallerFactory = t.createCallerFactory;
