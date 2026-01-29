import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { env } from '../util/env';
import { logger } from '../util/logger';

// JWT payload interface
export interface JWTPayload {
    userId: string;
    email: string;
    role: string;
    iat?: number;
    exp?: number;
}

// Password hashing
export async function hashPassword(password: string): Promise<string> {
    const saltRounds = 12;
    return bcrypt.hash(password, saltRounds);
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
}

// JWT token generation
export function generateAccessToken(payload: Omit<JWTPayload, 'iat' | 'exp'>): string {
    return jwt.sign(payload, env.JWT_SECRET, {
        expiresIn: env.JWT_ACCESS_TOKEN_EXPIRY
    } as jwt.SignOptions);
}

export function generateRefreshToken(payload: Omit<JWTPayload, 'iat' | 'exp'>): string {
    return jwt.sign(payload, env.JWT_SECRET, {
        expiresIn: env.JWT_REFRESH_TOKEN_EXPIRY
    } as jwt.SignOptions);
}

// JWT token verification
export function verifyToken(token: string): JWTPayload {
    try {
        const decoded = jwt.verify(token, env.JWT_SECRET) as JWTPayload;
        return decoded;
    } catch (error) {
        logger.error(`JWT verification failed: ${(error as Error).message}`);
        throw new Error('Invalid token');
    }
}

// Extract token from Authorization header
export function extractTokenFromHeader(authHeader: string | undefined): string | null {
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return null;
    }

    return authHeader.substring(7); // Remove 'Bearer ' prefix
}
