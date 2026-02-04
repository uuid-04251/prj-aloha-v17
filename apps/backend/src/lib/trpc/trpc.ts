import { initTRPC, TRPCError } from '@trpc/server';
import { logger } from '../../util/logger';
import { extractTokenFromHeader, verifyToken, type JWTPayload } from '../auth';
import type { Context } from './context';
import { authService } from '../../resources/auth/auth.service';

// Initialize tRPC
const t = initTRPC.context<Context>().create({
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

// Auth middleware - requires valid JWT token
export const authMiddleware = middleware(async ({ ctx, next }) => {
    const authHeader = (ctx as any).req.headers.authorization;

    if (!authHeader) {
        throw new TRPCError({
            code: 'UNAUTHORIZED',
            message: 'Authorization header is required'
        });
    }

    const token = extractTokenFromHeader(authHeader);
    if (!token) {
        throw new TRPCError({
            code: 'UNAUTHORIZED',
            message: 'Invalid authorization header format'
        });
    }

    try {
        const payload = verifyToken(token);

        // Check if token is blacklisted
        const isBlacklisted = await authService.isTokenBlacklisted(token);
        if (isBlacklisted) {
            throw new TRPCError({
                code: 'UNAUTHORIZED',
                message: 'Token has been revoked'
            });
        }

        // Add user and token to context
        return next({
            ctx: {
                ...ctx,
                user: payload,
                token: token // Store token for logout
            } as Context & { user: JWTPayload; token: string }
        });
    } catch (error) {
        throw new TRPCError({
            code: 'UNAUTHORIZED',
            message: 'Invalid or expired token'
        });
    }
});

// Protected procedure - requires authentication
export const protectedProcedure = publicProcedure.use(authMiddleware);

// Admin middleware - requires admin role
export const adminMiddleware = middleware(async ({ ctx, next }) => {
    const authCtx = ctx as Context & { user: JWTPayload };
    if (authCtx.user?.role !== 'admin') {
        throw new TRPCError({
            code: 'FORBIDDEN',
            message: 'Admin access required'
        });
    }

    return next();
});

// Admin procedure - requires admin role
export const adminProcedure = protectedProcedure.use(adminMiddleware);

// Type-safe context with user
export type AuthContext = Context & {
    user: JWTPayload;
};
