import { z } from 'zod';
import { publicProcedure } from '@/lib/trpc/trpc';
import { authService } from './auth.service';

// Input validation schemas
const loginSchema = z.object({
    email: z.string().email('Invalid email format'),
    password: z.string().min(6, 'Password must be at least 6 characters')
});

const registerSchema = z.object({
    email: z.string().email('Invalid email format'),
    password: z.string().min(6, 'Password must be at least 6 characters')
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
        const { email, password } = input;
        return authService.register(email, password);
    }),

    // Refresh token procedure
    refreshToken: publicProcedure.input(refreshTokenSchema).mutation(async ({ input }) => {
        const { refreshToken } = input;
        return authService.refreshToken(refreshToken);
    }),

    // Logout procedure (requires authentication)
    logout: publicProcedure.mutation(async () => {
        // TODO: Get userId from authenticated context
        const userId = 'user-123'; // Mock for now
        return authService.logout(userId);
    })
};
