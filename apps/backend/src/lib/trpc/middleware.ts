import { TRPCError } from '@trpc/server';
import { middleware, publicProcedure } from './trpc';
import { extractTokenFromHeader, verifyToken, type JWTPayload } from '../auth';
import type { Context } from './context';
import { authService } from '../../resources/auth/auth.service';

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
