import fastify from 'fastify';
import cors from '@fastify/cors';
import rateLimit from '@fastify/rate-limit';
import { fastifyTRPCPlugin } from '@trpc/server/adapters/fastify';
import { appRouter } from './lib/trpc/router';
import { createContext } from './lib/trpc/context';
import { logger } from './util/logger';
import { env } from './util/env';
import { connectToDatabase } from './lib/db/connection';
import { getRedisClient, closeRedisConnection, isRedisConnected } from './lib/redis';

// Load environment variables
import dotenv from 'dotenv';
dotenv.config();

// Create Fastify instance with logging
const server = fastify({
    logger: { instance: logger } as any,
    maxParamLength: 5000
});

// Register plugins
async function registerPlugins() {
    // CORS
    await server.register(cors, {
        origin: (origin, callback) => {
            // Allow requests with no origin (like mobile apps or curl requests)
            if (!origin) return callback(null, true);

            const allowedOrigins = env.CORS_ORIGIN.split(',').map((o) => o.trim());
            if (allowedOrigins.includes(origin)) {
                return callback(null, true);
            }

            return callback(new Error('Not allowed by CORS'), false);
        },
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
    return {
        status: 'ok',
        timestamp: new Date().toISOString(),
        redis: isRedisConnected() ? 'connected' : 'disconnected'
    };
});

// Start server
async function start() {
    try {
        // Connect to database first
        await connectToDatabase();

        // Initialize Redis connection
        getRedisClient();

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
    await closeRedisConnection();
    await server.close();
});

process.on('SIGINT', async () => {
    logger.info('SIGINT received, shutting down gracefully');
    await closeRedisConnection();
    await server.close();
});

start();
