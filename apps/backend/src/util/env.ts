import { z } from 'zod';

// Load environment variables
import dotenv from 'dotenv';
dotenv.config();

// Debug: print JWT_SECRET
console.log('JWT_SECRET from process.env:', process.env.JWT_SECRET);

// Environment variables schema
const envSchema = z.object({
    // Backend specific
    BE_PORT: z.coerce.number().default(3000),
    BE_HOST: z.string().default('0.0.0.0'),
    BE_NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
    BE_LOG_LEVEL: z.enum(['debug', 'info', 'warn', 'error']).default('info'),

    // Database
    MONGODB_URI: z.string().default('mongodb://localhost:27017/aloha'),

    // Redis
    REDIS_HOST: z.string().default('localhost'),
    REDIS_PORT: z.coerce.number().default(6379),
    REDIS_PASSWORD: z.string().optional(),
    REDIS_DB: z.coerce.number().default(0),
    REDIS_ENABLED: z.coerce.boolean().default(true),

    // JWT
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
    console.error('❌ Invalid environment variables:');
    console.error(parsedEnv.error.format());
    process.exit(1);
}

export const env = parsedEnv.data;

// Type for environment variables
export type Env = typeof env;
