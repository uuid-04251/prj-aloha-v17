import { z } from 'zod';

// Load environment variables
import dotenv from 'dotenv';
dotenv.config();

// Environment variables schema
const envSchema = z.object({
    // Backend specific
    BE_PORT: z.coerce.number().default(3000),
    BE_HOST: z.string().default('0.0.0.0'),
    BE_NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
    BE_LOG_LEVEL: z.enum(['debug', 'info', 'warn', 'error']).default('info'),

    // Database - REQUIRED
    MONGODB_URI: z.string().min(1, 'MONGODB_URI is required'),

    // Redis
    REDIS_HOST: z.string().default('localhost'),
    REDIS_PORT: z.coerce.number().default(6379),
    REDIS_PASSWORD: z.string().optional(),
    REDIS_DB: z.coerce.number().default(0),
    REDIS_ENABLED: z.coerce.boolean().default(true),

    // JWT - REQUIRED
    JWT_SECRET: z.string().min(32, 'JWT_SECRET must be at least 32 characters'),
    JWT_ISSUER: z.string().default('https://api.aloha.com'),
    JWT_AUDIENCE: z.string().default('aloha-api'),
    JWT_ACCESS_TOKEN_EXPIRY: z.string().default('15m'),
    JWT_REFRESH_TOKEN_EXPIRY: z.string().default('7d'),

    // CORS
    CORS_ORIGIN: z.string().default('http://localhost:3000')
});

// Parse and validate environment variables
const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
    console.error('❌ Environment variable validation failed:');
    console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    const errors = parsedEnv.error.format();

    // Log each error with clear formatting
    Object.entries(errors).forEach(([key, error]) => {
        if (key !== '_errors' && error) {
            const errorMessages = (error as any)._errors || [];
            if (errorMessages.length > 0) {
                console.error(`\n❌ ${key}:`);
                errorMessages.forEach((msg: string) => {
                    console.error(`   → ${msg}`);
                });
            }
        }
    });

    console.error('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.error('\n📝 Required environment variables:');
    console.error('   • MONGODB_URI - Database connection string');
    console.error('   • JWT_SECRET - Secret key for JWT (minimum 32 characters)');
    console.error('\n💡 Check .env.example for reference');
    console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    process.exit(1);
}

export const env = parsedEnv.data;

// Type for environment variables
export type Env = typeof env;
