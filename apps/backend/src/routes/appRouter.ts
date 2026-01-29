import { initTRPC } from '@trpc/server';
import { createContext } from './context';

const t = initTRPC.context<typeof createContext>().create();

export const router = t.router;
export const publicProcedure = t.procedure;

// App router - will be extended with route modules
export const appRouter = router({});

// Export type for client
export type AppRouter = typeof appRouter;
