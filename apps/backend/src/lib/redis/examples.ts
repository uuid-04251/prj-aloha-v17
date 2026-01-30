/**
 * Redis Usage Examples
 *
 * This file demonstrates common Redis patterns used in the application.
 * Import and use redisService in your application code.
 */

import { redisService } from '@/lib/redis';

/**
 * Example 1: Caching Database Queries
 */
export async function getCachedUser(userId: string) {
    const cacheKey = `user:${userId}`;
    const cacheTTL = 300; // 5 minutes

    // Try to get from cache first
    let cachedUser = await redisService.get(cacheKey);

    if (cachedUser) {
        console.log('Cache HIT for user:', userId);
        return cachedUser;
    }

    console.log('Cache MISS for user:', userId);

    // Simulate database fetch
    // const userData = await db.users.findById(userId);
    const userData = {
        id: userId,
        name: 'John Doe',
        email: 'john@example.com'
    };

    // Store in cache
    await redisService.set(cacheKey, userData, cacheTTL);

    return userData;
}

/**
 * Example 2: Session Management
 */
export async function createSession(userId: string, sessionData: any) {
    const sessionId = `session_${Date.now()}_${userId}`;
    const sessionKey = `session:${sessionId}`;
    const sessionTTL = 3600; // 1 hour

    const session = {
        ...sessionData,
        userId,
        createdAt: new Date().toISOString()
    };

    await redisService.set(sessionKey, session, sessionTTL);

    return sessionId;
}

export async function getSession(sessionId: string) {
    const sessionKey = `session:${sessionId}`;
    return await redisService.get(sessionKey);
}

export async function destroySession(sessionId: string) {
    const sessionKey = `session:${sessionId}`;
    await redisService.del(sessionKey);
}

/**
 * Example 3: Rate Limiting
 */
export async function checkRateLimit(
    identifier: string, // IP or user ID
    maxRequests: number = 100,
    windowSeconds: number = 60
): Promise<{ allowed: boolean; remaining: number }> {
    const key = `rate_limit:${identifier}`;

    // Increment counter
    const count = await redisService.incr(key);

    if (count === 1) {
        // First request - set expiry
        await redisService.expire(key, windowSeconds);
    }

    const remaining = Math.max(0, maxRequests - (count || 0));
    const allowed = (count || 0) <= maxRequests;

    return { allowed, remaining };
}

/**
 * Example 4: JWT Token Blacklist
 */
export async function blacklistToken(token: string, expirySeconds: number) {
    const key = `token:blacklist:${token}`;
    await redisService.set(key, '1', expirySeconds);
}

export async function isTokenBlacklisted(token: string): Promise<boolean> {
    const key = `token:blacklist:${token}`;
    return await redisService.exists(key);
}

/**
 * Example 5: Real-time Statistics
 */
export async function trackPageView(pageId: string) {
    // Increment global counter
    await redisService.incr('stats:total_page_views');

    // Increment page-specific counter
    await redisService.incr(`stats:page:${pageId}:views`);

    // Store timestamp
    await redisService.rpush(`stats:page:${pageId}:timestamps`, new Date().toISOString());
}

export async function trackUniqueVisitor(visitorId: string, pageId: string) {
    // Add to global unique visitors set
    await redisService.sadd('stats:unique_visitors', visitorId);

    // Add to page-specific unique visitors set
    await redisService.sadd(`stats:page:${pageId}:unique_visitors`, visitorId);
}

export async function getPageStats(pageId: string) {
    const views = await redisService.get(`stats:page:${pageId}:views`, false);
    const uniqueVisitors = await redisService.smembers(`stats:page:${pageId}:unique_visitors`);

    return {
        views: parseInt(views || '0'),
        uniqueVisitors: uniqueVisitors.length
    };
}

/**
 * Example 6: Leaderboard (Sorted Set alternative using Lists)
 */
export async function addToLeaderboard(userId: string, score: number) {
    const key = 'leaderboard:scores';
    const entry = JSON.stringify({ userId, score, timestamp: Date.now() });

    await redisService.rpush(key, entry);
}

/**
 * Example 7: Feature Flags
 */
export async function setFeatureFlag(flagName: string, enabled: boolean) {
    const key = `feature_flag:${flagName}`;
    await redisService.set(key, enabled ? '1' : '0');
}

export async function isFeatureEnabled(flagName: string): Promise<boolean> {
    const key = `feature_flag:${flagName}`;
    const value = await redisService.get(key, false);
    return value === '1';
}

/**
 * Example 8: Distributed Lock (Simple implementation)
 */
export async function acquireLock(lockName: string, ttlSeconds: number = 30): Promise<boolean> {
    const key = `lock:${lockName}`;
    const exists = await redisService.exists(key);

    if (exists) {
        return false; // Lock already held
    }

    await redisService.set(key, '1', ttlSeconds);
    return true;
}

export async function releaseLock(lockName: string) {
    const key = `lock:${lockName}`;
    await redisService.del(key);
}

/**
 * Example 9: Cache Invalidation Pattern
 */
export async function invalidateUserCache(userId: string) {
    // Invalidate all user-related cache keys
    const keys = await redisService.keys(`user:${userId}:*`);
    if (keys.length > 0) {
        await redisService.del(...keys);
    }

    // Also invalidate main user cache
    await redisService.del(`user:${userId}`);
}

/**
 * Example 10: Queue Management
 */
export async function enqueue(queueName: string, item: any) {
    const key = `queue:${queueName}`;
    await redisService.rpush(key, JSON.stringify(item));
}

export async function getQueueItems(queueName: string, limit: number = 10) {
    const key = `queue:${queueName}`;
    const items = await redisService.lrange(key, 0, limit - 1);
    return items.map((item) => JSON.parse(item));
}

/**
 * Example 11: API Response Caching
 */
export async function cacheAPIResponse(endpoint: string, params: any, response: any, ttl: number = 60) {
    const cacheKey = `api:${endpoint}:${JSON.stringify(params)}`;
    await redisService.set(cacheKey, response, ttl);
}

export async function getCachedAPIResponse(endpoint: string, params: any) {
    const cacheKey = `api:${endpoint}:${JSON.stringify(params)}`;
    return await redisService.get(cacheKey);
}

/**
 * Example 12: Online Users Tracking
 */
export async function markUserOnline(userId: string) {
    const key = 'users:online';
    await redisService.sadd(key, userId);

    // Set expiry on individual user presence
    const userKey = `user:${userId}:presence`;
    await redisService.set(userKey, 'online', 300); // 5 minutes
}

export async function markUserOffline(userId: string) {
    const key = 'users:online';
    await redisService.srem(key, userId);

    const userKey = `user:${userId}:presence`;
    await redisService.del(userKey);
}

export async function getOnlineUsers() {
    const key = 'users:online';
    return await redisService.smembers(key);
}

/**
 * Example 13: OTP/Verification Code Storage
 */
export async function storeOTP(email: string, otp: string) {
    const key = `otp:${email}`;
    const ttl = 300; // 5 minutes

    await redisService.set(key, otp, ttl);
}

export async function verifyOTP(email: string, otp: string): Promise<boolean> {
    const key = `otp:${email}`;
    const storedOTP = await redisService.get(key, false);

    if (storedOTP === otp) {
        // Delete OTP after successful verification
        await redisService.del(key);
        return true;
    }

    return false;
}

/**
 * Example 14: Failed Login Attempts Tracking
 */
export async function recordFailedLogin(email: string) {
    const key = `failed_login:${email}`;
    const ttl = 900; // 15 minutes

    const count = await redisService.incr(key);

    if (count === 1) {
        await redisService.expire(key, ttl);
    }

    return count;
}

export async function getFailedLoginCount(email: string): Promise<number> {
    const key = `failed_login:${email}`;
    const count = await redisService.get(key, false);
    return parseInt(count || '0');
}

export async function resetFailedLogins(email: string) {
    const key = `failed_login:${email}`;
    await redisService.del(key);
}

/**
 * Example 15: Temporary Data Storage
 */
export async function storeTempData(dataId: string, data: any, ttlSeconds: number = 3600) {
    const key = `temp:${dataId}`;
    await redisService.set(key, data, ttlSeconds);
}

export async function getTempData(dataId: string) {
    const key = `temp:${dataId}`;
    return await redisService.get(key);
}

// Export all examples
export const RedisExamples = {
    getCachedUser,
    createSession,
    getSession,
    destroySession,
    checkRateLimit,
    blacklistToken,
    isTokenBlacklisted,
    trackPageView,
    trackUniqueVisitor,
    getPageStats,
    addToLeaderboard,
    setFeatureFlag,
    isFeatureEnabled,
    acquireLock,
    releaseLock,
    invalidateUserCache,
    enqueue,
    getQueueItems,
    cacheAPIResponse,
    getCachedAPIResponse,
    markUserOnline,
    markUserOffline,
    getOnlineUsers,
    storeOTP,
    verifyOTP,
    recordFailedLogin,
    getFailedLoginCount,
    resetFailedLogins,
    storeTempData,
    getTempData
};
