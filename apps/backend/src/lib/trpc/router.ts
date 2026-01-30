import { router, publicProcedure } from './trpc';

// Import domain routers
import { authRouter } from '../../resources/auth/auth.router';
import { usersRouter } from '../../resources/users/users.router';

// Create main app router
export const appRouter = router({
    // Health check
    health: router({
        ping: publicProcedure.query(() => 'pong')
    }),

    // Domain routers
    auth: authRouter,
    users: usersRouter
});

// Export type definition of API
export type AppRouter = typeof appRouter;
