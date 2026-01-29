import Fastify from 'fastify';
import { fastifyTRPCPlugin } from '@trpc/server/adapters/fastify';
import { appRouter } from './routes/appRouter';
import { createContext } from './routes/context';
import connectToDatabase from './config/database';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env' });
console.log('CWD:', process.cwd());
console.log('MONGODB_URI:', process.env.MONGODB_URI ? 'defined' : 'undefined');

const server = Fastify({
    logger: true
});

// Register tRPC plugin
server.register(fastifyTRPCPlugin, {
    prefix: '/trpc',
    trpcOptions: { router: appRouter, createContext }
});

// Health check route
server.get('/health', async () => {
    return { status: 'ok', timestamp: new Date().toISOString() };
});

const start = async () => {
    try {
        // Connect to database
        await connectToDatabase();

        const port = process.env.PORT ? parseInt(process.env.PORT) : 3001;
        await server.listen({ port, host: '0.0.0.0' });
        console.log(`Server listening on http://localhost:${port}`);
    } catch (err) {
        server.log.error(err);
        process.exit(1);
    }
};

start();
