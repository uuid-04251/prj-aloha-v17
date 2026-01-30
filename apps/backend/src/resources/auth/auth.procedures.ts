import { z } from 'zod';
import { publicProcedure } from '../../lib/trpc/trpc';
import { authService } from './auth.service';

// Input validation schemas
const loginSchema = z.object({
    email: z.string().email('Invalid email format'),
    password: z.string().min(6, 'Password must be at least 6 characters')
});

const registerSchema = z.object({
    email: z.string().email('Invalid email format'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    firstName: z.string().min(1, 'First name is required').max(50, 'First name too long'),
    lastName: z.string().min(1, 'Last name is required').max(50, 'Last name too long')
});

const refreshTokenSchema = z.object({
    refreshToken: z.string().min(1, 'Refresh token is required')
});

// Auth procedures
export const authProcedures = {
    // Login procedure
    login: publicProcedure.input(loginSchema).mutation(async ({ input }) => {
        const { email, password } = input;
        return authService.login(email, password);
    }),

    // Register procedure
    register: publicProcedure.input(registerSchema).mutation(async ({ input }) => {
        const { email, password, firstName, lastName } = input;
        return authService.register(email, password, firstName, lastName);
    }),

    // Refresh token procedure
    refreshToken: publicProcedure.input(refreshTokenSchema).mutation(async ({ input }) => {
        const { refreshToken } = input;
        return authService.refreshToken(refreshToken);
    }),

    // Logout procedure (requires authentication)
    // TODO: Replace with protectedProcedure once auth middleware is fully implemented
    logout: publicProcedure.mutation(async ({ ctx }: { ctx: any }) => {
        // TODO: Get userId from authenticated context
        const userId = ctx.user?.userId || 'user-123'; // Mock for now
        const accessToken = ctx.token;

        return authService.logout(userId, accessToken);
    })
};
