import { getRedisClient } from './connection';
import { logger } from '@/util/logger';

/**
 * Redis Service - Wrapper for common Redis operations
 */
export class RedisService {
    private client;

    constructor() {
        this.client = getRedisClient();
    }

    /**
     * Check if Redis is available
     */
    isAvailable(): boolean {
        return this.client !== null && this.client.status === 'ready';
    }

    /**
     * Set a key-value pair with optional TTL (Time To Live)
     * @param key - Redis key
     * @param value - Value to store (will be JSON stringified)
     * @param ttlSeconds - Time to live in seconds (optional)
     */
    async set(key: string, value: any, ttlSeconds?: number): Promise<boolean> {
        if (!this.isAvailable()) {
            logger.warn('Redis not available, skipping set operation');
            return false;
        }

        try {
            const stringValue = typeof value === 'string' ? value : JSON.stringify(value);

            if (ttlSeconds) {
                await this.client!.setex(key, ttlSeconds, stringValue);
            } else {
                await this.client!.set(key, stringValue);
            }

            return true;
        } catch (error) {
            logger.error(`Redis SET error: ${(error as Error).message}`);
            return false;
        }
    }

    /**
     * Get value by key
     * @param key - Redis key
     * @param parseJson - Whether to parse value as JSON (default: true)
     */
    async get<T = any>(key: string, parseJson: boolean = true): Promise<T | null> {
        if (!this.isAvailable()) {
            logger.warn('Redis not available, skipping get operation');
            return null;
        }

        try {
            const value = await this.client!.get(key);

            if (value === null) {
                return null;
            }

            if (parseJson) {
                try {
                    return JSON.parse(value) as T;
                } catch {
                    return value as T;
                }
            }

            return value as T;
        } catch (error) {
            logger.error(`Redis GET error: ${(error as Error).message}`);
            return null;
        }
    }

    /**
     * Delete key(s)
     * @param keys - Single key or array of keys
     */
    async del(...keys: string[]): Promise<number> {
        if (!this.isAvailable()) {
            logger.warn('Redis not available, skipping del operation');
            return 0;
        }

        try {
            return await this.client!.del(...keys);
        } catch (error) {
            logger.error(`Redis DEL error: ${(error as Error).message}`);
            return 0;
        }
    }

    /**
     * Check if key exists
     * @param key - Redis key
     */
    async exists(key: string): Promise<boolean> {
        if (!this.isAvailable()) {
            return false;
        }

        try {
            const result = await this.client!.exists(key);
            return result === 1;
        } catch (error) {
            logger.error(`Redis EXISTS error: ${(error as Error).message}`);
            return false;
        }
    }

    /**
     * Set expiration time for a key
     * @param key - Redis key
     * @param seconds - Time to live in seconds
     */
    async expire(key: string, seconds: number): Promise<boolean> {
        if (!this.isAvailable()) {
            return false;
        }

        try {
            const result = await this.client!.expire(key, seconds);
            return result === 1;
        } catch (error) {
            logger.error(`Redis EXPIRE error: ${(error as Error).message}`);
            return false;
        }
    }

    /**
     * Get remaining TTL for a key
     * @param key - Redis key
     * @returns TTL in seconds, -1 if no expiry, -2 if key doesn't exist
     */
    async ttl(key: string): Promise<number> {
        if (!this.isAvailable()) {
            return -2;
        }

        try {
            return await this.client!.ttl(key);
        } catch (error) {
            logger.error(`Redis TTL error: ${(error as Error).message}`);
            return -2;
        }
    }

    /**
     * Increment a value
     * @param key - Redis key
     * @param increment - Amount to increment by (default: 1)
     */
    async incr(key: string, increment: number = 1): Promise<number | null> {
        if (!this.isAvailable()) {
            return null;
        }

        try {
            if (increment === 1) {
                return await this.client!.incr(key);
            } else {
                return await this.client!.incrby(key, increment);
            }
        } catch (error) {
            logger.error(`Redis INCR error: ${(error as Error).message}`);
            return null;
        }
    }

    /**
     * Decrement a value
     * @param key - Redis key
     * @param decrement - Amount to decrement by (default: 1)
     */
    async decr(key: string, decrement: number = 1): Promise<number | null> {
        if (!this.isAvailable()) {
            return null;
        }

        try {
            if (decrement === 1) {
                return await this.client!.decr(key);
            } else {
                return await this.client!.decrby(key, decrement);
            }
        } catch (error) {
            logger.error(`Redis DECR error: ${(error as Error).message}`);
            return null;
        }
    }

    /**
     * Get multiple values by keys
     * @param keys - Array of Redis keys
     */
    async mget(keys: string[]): Promise<(string | null)[]> {
        if (!this.isAvailable()) {
            return keys.map(() => null);
        }

        try {
            return await this.client!.mget(...keys);
        } catch (error) {
            logger.error(`Redis MGET error: ${(error as Error).message}`);
            return keys.map(() => null);
        }
    }

    /**
     * Find keys matching a pattern
     * @param pattern - Pattern to match (e.g., 'user:*')
     */
    async keys(pattern: string): Promise<string[]> {
        if (!this.isAvailable()) {
            return [];
        }

        try {
            return await this.client!.keys(pattern);
        } catch (error) {
            logger.error(`Redis KEYS error: ${(error as Error).message}`);
            return [];
        }
    }

    /**
     * Clear all keys in current database (USE WITH CAUTION!)
     */
    async flushdb(): Promise<boolean> {
        if (!this.isAvailable()) {
            return false;
        }

        try {
            await this.client!.flushdb();
            logger.warn('Redis database flushed');
            return true;
        } catch (error) {
            logger.error(`Redis FLUSHDB error: ${(error as Error).message}`);
            return false;
        }
    }

    /**
     * Add member to a set
     * @param key - Set key
     * @param members - Member(s) to add
     */
    async sadd(key: string, ...members: string[]): Promise<number> {
        if (!this.isAvailable()) {
            return 0;
        }

        try {
            return await this.client!.sadd(key, ...members);
        } catch (error) {
            logger.error(`Redis SADD error: ${(error as Error).message}`);
            return 0;
        }
    }

    /**
     * Check if member exists in set
     * @param key - Set key
     * @param member - Member to check
     */
    async sismember(key: string, member: string): Promise<boolean> {
        if (!this.isAvailable()) {
            return false;
        }

        try {
            const result = await this.client!.sismember(key, member);
            return result === 1;
        } catch (error) {
            logger.error(`Redis SISMEMBER error: ${(error as Error).message}`);
            return false;
        }
    }

    /**
     * Remove member from set
     * @param key - Set key
     * @param members - Member(s) to remove
     */
    async srem(key: string, ...members: string[]): Promise<number> {
        if (!this.isAvailable()) {
            return 0;
        }

        try {
            return await this.client!.srem(key, ...members);
        } catch (error) {
            logger.error(`Redis SREM error: ${(error as Error).message}`);
            return 0;
        }
    }

    /**
     * Get all members of a set
     * @param key - Set key
     */
    async smembers(key: string): Promise<string[]> {
        if (!this.isAvailable()) {
            return [];
        }

        try {
            return await this.client!.smembers(key);
        } catch (error) {
            logger.error(`Redis SMEMBERS error: ${(error as Error).message}`);
            return [];
        }
    }

    /**
     * Push value to list (right side)
     * @param key - List key
     * @param values - Value(s) to push
     */
    async rpush(key: string, ...values: string[]): Promise<number> {
        if (!this.isAvailable()) {
            return 0;
        }

        try {
            return await this.client!.rpush(key, ...values);
        } catch (error) {
            logger.error(`Redis RPUSH error: ${(error as Error).message}`);
            return 0;
        }
    }

    /**
     * Get range of list elements
     * @param key - List key
     * @param start - Start index
     * @param stop - Stop index
     */
    async lrange(key: string, start: number, stop: number): Promise<string[]> {
        if (!this.isAvailable()) {
            return [];
        }

        try {
            return await this.client!.lrange(key, start, stop);
        } catch (error) {
            logger.error(`Redis LRANGE error: ${(error as Error).message}`);
            return [];
        }
    }
}

// Export singleton instance
export const redisService = new RedisService();
