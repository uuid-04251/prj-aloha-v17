import mongoose from 'mongoose';
import { env } from '../../util/env';
import { logger } from '../../util/logger';

let isConnected = false;

export async function connectToDatabase(): Promise<void> {
    if (isConnected) {
        logger.debug('MongoDB already connected');
        return;
    }

    try {
        await mongoose.connect(env.MONGODB_URI, {
            maxPoolSize: 10,
            serverSelectionTimeoutMS: 30000, // Increased from 5000 to 30000ms
            socketTimeoutMS: 45000,
            connectTimeoutMS: 30000
        });

        isConnected = true;
        logger.info('✅ Connected to MongoDB successfully');
    } catch (error) {
        logger.error(`❌ Failed to connect to MongoDB: ${(error as Error).message}`);
        throw error;
    }
}

export async function disconnectFromDatabase(): Promise<void> {
    if (!isConnected) {
        return;
    }

    try {
        await mongoose.disconnect();
        isConnected = false;
        logger.info('✅ Disconnected from MongoDB');
    } catch (error) {
        logger.error(`❌ Failed to disconnect from MongoDB: ${(error as Error).message}`);
        throw error;
    }
}

export function getConnectionStatus(): boolean {
    return isConnected;
}

// Handle connection events
mongoose.connection.on('connected', () => {
    logger.info('Mongoose connected to MongoDB');
    isConnected = true;
});

mongoose.connection.on('error', (err) => {
    logger.error('Mongoose connection error:', err);
    isConnected = false;
});

mongoose.connection.on('disconnected', () => {
    logger.warn('Mongoose disconnected from MongoDB');
    isConnected = false;
});

// Auto-reconnect on disconnection
mongoose.connection.on('disconnected', async () => {
    logger.warn('Attempting to reconnect to MongoDB...');
    try {
        await connectToDatabase();
    } catch (error) {
        logger.error(`Auto-reconnect failed: ${(error as Error).message}`);
    }
});

// Graceful shutdown
process.on('SIGINT', async () => {
    await disconnectFromDatabase();
});
