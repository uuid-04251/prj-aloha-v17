import fastify from 'fastify';
import cors from '@fastify/cors';
import rateLimit from '@fastify/rate-limit';
import { fastifyTRPCPlugin } from '@trpc/server/adapters/fastify';
import { appRouter } from '@/lib/trpc/router';
import { createContext } from '@/lib/trpc/context';
import { logger } from '@/util/logger';
import { env } from '@/util/env';
import { connectToDatabase } from '@/lib/db/connection';

// Load environment variables
import dotenv from 'dotenv';
dotenv.config();

// Create Fastify instance with logging
const server = fastify({
    logger: logger,
    maxParamLength: 5000
});

// Register plugins
async function registerPlugins() {
    // CORS
    await server.register(cors, {
        origin: env.CORS_ORIGIN,
        credentials: true
    });

    // Rate limiting
    await server.register(rateLimit, {
        max: 100,
        timeWindow: '1 minute'
    });

    // tRPC
    await server.register(fastifyTRPCPlugin, {
        prefix: '/trpc',
        trpcOptions: { router: appRouter, createContext }
    });
}

// Health check endpoint
server.get('/health', async () => {
    return { status: 'ok', timestamp: new Date().toISOString() };
});

// Start server
async function start() {
    try {
        // Connect to database first
        await connectToDatabase();

        await registerPlugins();

        const address = await server.listen({
            host: env.BE_HOST,
            port: env.BE_PORT
        });

        logger.info(`Server listening on ${address}`);
    } catch (err) {
        logger.error(`Failed to start server: ${(err as Error).message}`);
        process.exit(1);
    }
}

// Graceful shutdown
process.on('SIGTERM', async () => {
    logger.info('SIGTERM received, shutting down gracefully');
    await server.close();
});

process.on('SIGINT', async () => {
    logger.info('SIGINT received, shutting down gracefully');
    await server.close();
});

start();
