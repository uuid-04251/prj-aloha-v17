import { createNextApiHandler } from '@trpc/server/adapters/next';
import { appRouter } from '../../../../backend/src/lib/trpc/router';

// Create context for Next.js API routes
function createContext(): any {
    return {};
}

// export API handler
export default createNextApiHandler({
    router: appRouter,
    createContext: createContext,
    onError:
        process.env.NODE_ENV === 'development'
            ? ({ path, error }) => {
                  console.error(`❌ tRPC failed on ${path ?? '<no-path>'}: ${error.message}`);
              }
            : undefined
});
