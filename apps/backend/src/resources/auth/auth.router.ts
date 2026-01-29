import { router } from '@/lib/trpc/trpc';
import { authProcedures } from './auth.procedures';

// Auth router combining all auth procedures
export const authRouter = router({
    login: authProcedures.login,
    register: authProcedures.register,
    refreshToken: authProcedures.refreshToken,
    logout: authProcedures.logout
});

// Export type for client usage
export type AuthRouter = typeof authRouter;
