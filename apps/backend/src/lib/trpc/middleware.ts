import { TRPCError } from '@trpc/server';
import { middleware, publicProcedure } from './trpc';
import { extractTokenFromHeader, verifyToken, type JWTPayload } from '../auth';
import type { Context } from './context';

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

        // Add user to context
        return next({
            ctx: {
                ...ctx,
                user: payload
            } as Context & { user: JWTPayload }
        });
    } catch (error) {
        throw new TRPCError({
            code: 'UNAUTHORIZED',
            message: 'Invalid or expired token'
        });
    }
});

// Protected procedure - requires authentication
export const protectedProcedure = authMiddleware.unstable_pipe;

// Admin middleware - requires admin role
export const adminMiddleware = authMiddleware.unstable_pipe(
    middleware(async ({ ctx, next }) => {
        const authCtx = ctx as Context & { user: JWTPayload };
        if (authCtx.user?.role !== 'admin') {
            throw new TRPCError({
                code: 'FORBIDDEN',
                message: 'Admin access required'
            });
        }

        return next();
    })
);

// Admin procedure - requires admin role
export const adminProcedure = adminMiddleware.unstable_pipe;

// Type-safe context with user
export type AuthContext = Context & {
    user: JWTPayload;
};
