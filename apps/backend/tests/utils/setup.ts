import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { closeRedisConnection } from '@/lib/redis/connection';

let mongoServer: MongoMemoryServer;

/**
 * Connect to the in-memory database before all tests
 */
beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();

    await mongoose.connect(mongoUri);
});

/**
 * Clear all test data after each test
 */
afterEach(async () => {
    const collections = mongoose.connection.collections;

    for (const key in collections) {
        const collection = collections[key];
        if (collection) {
            await collection.deleteMany({});
        }
    }
});

/**
 * Close database connection and stop MongoDB server after all tests
 */
afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    await mongoServer.stop();

    // Close Redis connection to prevent handle leaks
    await closeRedisConnection();
});
