import Redis from 'ioredis';
import { env } from '@/util/env';
import { logger } from '@/util/logger';

/**
 * Redis client instance
 * Singleton pattern to ensure only one connection
 */
let redisClient: Redis | null = null;

/**
 * Get Redis client instance
 * Creates connection if not exists
 */
export const getRedisClient = (): Redis | null => {
    // If Redis is disabled, return null
    if (!env.REDIS_ENABLED) {
        logger.info('Redis is disabled');
        return null;
    }

    // Return existing connection
    if (redisClient) {
        return redisClient;
    }

    try {
        // Create Redis connection
        const options: any = {
            host: env.REDIS_HOST,
            port: env.REDIS_PORT,
            db: env.REDIS_DB,
            retryStrategy: (times: number) => {
                const delay = Math.min(times * 50, 2000);
                return delay;
            },
            maxRetriesPerRequest: 3,
            enableReadyCheck: true,
            lazyConnect: false
        };

        // Only add password if provided
        if (env.REDIS_PASSWORD) {
            options.password = env.REDIS_PASSWORD;
        }

        redisClient = new Redis(options);

        // Connection event handlers
        redisClient.on('connect', () => {
            logger.info('Redis connecting...');
        });

        redisClient.on('ready', () => {
            logger.info(`Redis connected successfully to ${env.REDIS_HOST}:${env.REDIS_PORT}`);
        });

        redisClient.on('error', (error) => {
            logger.error(`Redis connection error: ${error.message}`);
        });

        redisClient.on('close', () => {
            logger.warn('Redis connection closed');
        });

        redisClient.on('reconnecting', () => {
            logger.info('Redis reconnecting...');
        });

        return redisClient;
    } catch (error) {
        logger.error(`Failed to create Redis client: ${(error as Error).message}`);
        return null;
    }
};

/**
 * Close Redis connection
 */
export const closeRedisConnection = async (): Promise<void> => {
    if (redisClient) {
        await redisClient.quit();
        redisClient = null;
        logger.info('Redis connection closed');
    }
};

/**
 * Check Redis connection status
 */
export const isRedisConnected = (): boolean => {
    return redisClient?.status === 'ready';
};

/**
 * Get Redis connection status
 */
export const getRedisStatus = (): string => {
    if (!redisClient) return 'disconnected';
    return redisClient.status;
};
