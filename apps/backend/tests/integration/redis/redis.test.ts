import { redisService } from '@/lib/redis';

describe('Redis Service', () => {
    beforeAll(() => {
        // Redis connection is initialized in server.ts
    });

    afterAll(async () => {
        // Cleanup test keys
        if (redisService.isAvailable()) {
            await redisService.del('test:*');
        }
    });

    describe('Basic Operations', () => {
        it('should set and get a string value', async () => {
            if (!redisService.isAvailable()) {
                console.log('Redis not available, skipping test');
                return;
            }

            const key = 'test:string';
            const value = 'Hello Redis';

            await redisService.set(key, value);
            const result = await redisService.get(key, false);

            expect(result).toBe(value);
            await redisService.del(key);
        });

        it('should set and get a JSON object', async () => {
            if (!redisService.isAvailable()) {
                console.log('Redis not available, skipping test');
                return;
            }

            const key = 'test:json';
            const value = { name: 'John', age: 30, active: true };

            await redisService.set(key, value);
            const result = await redisService.get(key);

            expect(result).toEqual(value);
            await redisService.del(key);
        });

        it('should set value with TTL', async () => {
            if (!redisService.isAvailable()) {
                console.log('Redis not available, skipping test');
                return;
            }

            const key = 'test:ttl';
            const value = 'expires soon';

            await redisService.set(key, value, 2); // 2 seconds TTL

            const exists1 = await redisService.exists(key);
            expect(exists1).toBe(true);

            const ttl = await redisService.ttl(key);
            expect(ttl).toBeGreaterThan(0);
            expect(ttl).toBeLessThanOrEqual(2);

            // Wait for expiry
            await new Promise((resolve) => setTimeout(resolve, 2100));

            const exists2 = await redisService.exists(key);
            expect(exists2).toBe(false);
        });

        it('should delete keys', async () => {
            if (!redisService.isAvailable()) {
                console.log('Redis not available, skipping test');
                return;
            }

            const key1 = 'test:del1';
            const key2 = 'test:del2';

            await redisService.set(key1, 'value1');
            await redisService.set(key2, 'value2');

            const deleted = await redisService.del(key1, key2);
            expect(deleted).toBe(2);

            const exists1 = await redisService.exists(key1);
            const exists2 = await redisService.exists(key2);

            expect(exists1).toBe(false);
            expect(exists2).toBe(false);
        });
    });

    describe('Counter Operations', () => {
        it('should increment a counter', async () => {
            if (!redisService.isAvailable()) {
                console.log('Redis not available, skipping test');
                return;
            }

            const key = 'test:counter';

            const count1 = await redisService.incr(key);
            expect(count1).toBe(1);

            const count2 = await redisService.incr(key);
            expect(count2).toBe(2);

            const count3 = await redisService.incr(key, 5);
            expect(count3).toBe(7);

            await redisService.del(key);
        });

        it('should decrement a counter', async () => {
            if (!redisService.isAvailable()) {
                console.log('Redis not available, skipping test');
                return;
            }

            const key = 'test:decr';

            await redisService.set(key, '10');

            const count1 = await redisService.decr(key);
            expect(count1).toBe(9);

            const count2 = await redisService.decr(key, 3);
            expect(count2).toBe(6);

            await redisService.del(key);
        });
    });

    describe('Set Operations', () => {
        it('should add and check members in a set', async () => {
            if (!redisService.isAvailable()) {
                console.log('Redis not available, skipping test');
                return;
            }

            const key = 'test:set';

            await redisService.sadd(key, 'member1', 'member2', 'member3');

            const isMember1 = await redisService.sismember(key, 'member1');
            expect(isMember1).toBe(true);

            const isMember4 = await redisService.sismember(key, 'member4');
            expect(isMember4).toBe(false);

            const members = await redisService.smembers(key);
            expect(members.sort()).toEqual(['member1', 'member2', 'member3'].sort());

            await redisService.del(key);
        });

        it('should remove members from a set', async () => {
            if (!redisService.isAvailable()) {
                console.log('Redis not available, skipping test');
                return;
            }

            const key = 'test:set:remove';

            await redisService.sadd(key, 'a', 'b', 'c');
            await redisService.srem(key, 'b');

            const members = await redisService.smembers(key);
            expect(members.sort()).toEqual(['a', 'c'].sort());

            await redisService.del(key);
        });
    });

    describe('List Operations', () => {
        it('should push and get list elements', async () => {
            if (!redisService.isAvailable()) {
                console.log('Redis not available, skipping test');
                return;
            }

            const key = 'test:list';

            await redisService.rpush(key, 'item1', 'item2', 'item3');

            const items = await redisService.lrange(key, 0, -1);
            expect(items).toEqual(['item1', 'item2', 'item3']);

            const firstTwo = await redisService.lrange(key, 0, 1);
            expect(firstTwo).toEqual(['item1', 'item2']);

            await redisService.del(key);
        });
    });

    describe('Multiple Keys Operations', () => {
        it('should get multiple values', async () => {
            if (!redisService.isAvailable()) {
                console.log('Redis not available, skipping test');
                return;
            }

            const key1 = 'test:multi1';
            const key2 = 'test:multi2';
            const key3 = 'test:multi3';
            const keys = [key1, key2, key3];

            await redisService.set(key1, 'value1');
            await redisService.set(key2, 'value2');
            await redisService.set(key3, 'value3');

            const values = await redisService.mget(keys);
            expect(values).toEqual(['value1', 'value2', 'value3']);

            await redisService.del(...keys);
        });

        it('should find keys by pattern', async () => {
            if (!redisService.isAvailable()) {
                console.log('Redis not available, skipping test');
                return;
            }

            await redisService.set('test:pattern:1', 'a');
            await redisService.set('test:pattern:2', 'b');
            await redisService.set('test:pattern:3', 'c');

            const keys = await redisService.keys('test:pattern:*');
            expect(keys.length).toBe(3);
            expect(keys).toContain('test:pattern:1');
            expect(keys).toContain('test:pattern:2');
            expect(keys).toContain('test:pattern:3');

            await redisService.del(...keys);
        });
    });

    describe('Error Handling', () => {
        it('should handle operations gracefully when Redis is not available', async () => {
            // This test checks that operations don't throw when Redis is unavailable
            const result = await redisService.get('non-existent-key');
            expect(result).toBeNull();
        });
    });
});
