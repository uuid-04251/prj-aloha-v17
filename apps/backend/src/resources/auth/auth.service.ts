import { hashPassword, verifyPassword, generateAccessToken, generateRefreshToken, type JWTPayload } from '../../lib/auth';
import { logger } from '../../util/logger';
import User, { IUser } from '../../lib/db/models/user.model';
import { Token } from '../../lib/db/models/token.model';

// User interface for auth operations - aligned with database model
export interface AuthUser {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: 'user' | 'admin';
    createdAt: Date;
    updatedAt: Date;
}

// Auth service class
export class AuthService {
    // Login user
    async login(
        email: string,
        password: string
    ): Promise<{
        user: Omit<AuthUser, 'password'>;
        accessToken: string;
        refreshToken: string;
    }> {
        try {
            // Find user by email
            const user = await User.findOne({ email: email.toLowerCase() });
            if (!user) {
                throw new Error('Invalid credentials');
            }

            // Verify password using model's comparePassword method
            const isValidPassword = await user.comparePassword(password);
            if (!isValidPassword) {
                throw new Error('Invalid credentials');
            }

            // Generate tokens
            const tokenPayload: Omit<JWTPayload, 'iat' | 'exp'> = {
                userId: user._id.toString(),
                email: user.email,
                role: user.role
            };

            const accessToken = generateAccessToken(tokenPayload);
            const refreshToken = generateRefreshToken(tokenPayload);

            // Return user without password
            const userResponse: Omit<AuthUser, 'password'> = {
                id: user._id.toString(),
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.role,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt
            };

            logger.info(`User logged in successfully: ${user._id} - ${user.email}`);

            return {
                user: userResponse,
                accessToken,
                refreshToken
            };
        } catch (error) {
            logger.error(`Login failed for ${email}: ${(error as Error).message}`);
            throw error;
        }
    }

    // Register new user
    async register(
        email: string,
        password: string,
        firstName: string,
        lastName: string
    ): Promise<{
        user: Omit<AuthUser, 'password'>;
        accessToken: string;
        refreshToken: string;
    }> {
        try {
            // Check if user already exists
            const existingUser = await User.findOne({ email: email.toLowerCase() });
            if (existingUser) {
                throw new Error('User with this email already exists');
            }

            // Create new user
            const newUser = new User({
                email: email.toLowerCase(),
                password, // Will be hashed by pre-save middleware
                firstName,
                lastName,
                role: 'user'
            });

            // Save user to database
            await newUser.save();

            // Generate tokens
            const tokenPayload: Omit<JWTPayload, 'iat' | 'exp'> = {
                userId: newUser._id.toString(),
                email: newUser.email,
                role: newUser.role
            };

            const accessToken = generateAccessToken(tokenPayload);
            const refreshToken = generateRefreshToken(tokenPayload);

            // Return user without password
            const userResponse: Omit<AuthUser, 'password'> = {
                id: newUser._id.toString(),
                email: newUser.email,
                firstName: newUser.firstName,
                lastName: newUser.lastName,
                role: newUser.role,
                createdAt: newUser.createdAt,
                updatedAt: newUser.updatedAt
            };

            logger.info(`User registered successfully: ${newUser._id} - ${newUser.email}`);

            return {
                user: userResponse,
                accessToken,
                refreshToken
            };
        } catch (error) {
            logger.error(`Registration failed for ${email}: ${(error as Error).message}`);
            throw error;
        }
    }

    // Refresh access token
    async refreshToken(refreshToken: string): Promise<{
        accessToken: string;
        refreshToken: string;
    }> {
        try {
            // Verify refresh token
            const { verifyToken } = await import('../../lib/auth');
            const payload = verifyToken(refreshToken);

            // Check if token is blacklisted
            const blacklistedToken = await Token.findOne({
                token: refreshToken,
                type: 'refresh'
            });

            if (blacklistedToken) {
                throw new Error('Token has been revoked');
            }

            // Verify user still exists
            const user = await User.findById(payload.userId);
            if (!user) {
                throw new Error('User not found');
            }

            // Generate new tokens
            const tokenPayload: Omit<JWTPayload, 'iat' | 'exp'> = {
                userId: user._id.toString(),
                email: user.email,
                role: user.role
            };

            const newAccessToken = generateAccessToken(tokenPayload);
            const newRefreshToken = generateRefreshToken(tokenPayload);

            // Blacklist old refresh token
            await this.blacklistToken(refreshToken, payload.userId, 'refresh');

            logger.info(`Token refreshed successfully for user: ${user._id}`);

            return {
                accessToken: newAccessToken,
                refreshToken: newRefreshToken
            };
        } catch (error) {
            logger.error(`Token refresh failed: ${(error as Error).message}`);
            throw error;
        }
    }

    // Logout user (invalidate tokens)
    async logout(userId: string, accessToken?: string, refreshToken?: string): Promise<void> {
        try {
            // Blacklist tokens if provided
            if (accessToken) {
                await this.blacklistToken(accessToken, userId, 'access');
            }
            if (refreshToken) {
                await this.blacklistToken(refreshToken, userId, 'refresh');
            }

            // TODO: Clear any user sessions if implemented

            logger.info(`User logged out successfully: ${userId}`);
        } catch (error) {
            logger.error(`Logout failed for ${userId}: ${(error as Error).message}`);
            throw error;
        }
    }

    // Blacklist a token
    private async blacklistToken(token: string, userId: string, type: 'access' | 'refresh'): Promise<void> {
        try {
            // Decode token to get expiry
            const { verifyToken } = await import('../../lib/auth');
            const payload = verifyToken(token);

            // Calculate expiry date
            const expiresAt = new Date(payload.exp! * 1000);

            // Save to blacklist
            await Token.create({
                token,
                userId,
                type,
                expiresAt
            });

            logger.debug(`Token blacklisted: ${type} token for user ${userId}`);
        } catch (error) {
            // If token verification fails, still try to blacklist it
            logger.warn(`Failed to verify token for blacklisting: ${(error as Error).message}`);
            // Still create blacklist entry with a default expiry
            await Token.create({
                token,
                userId,
                type,
                expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours from now
            });
        }
    }

    // Check if token is blacklisted
    async isTokenBlacklisted(token: string): Promise<boolean> {
        try {
            const blacklistedToken = await Token.findOne({ token });
            return !!blacklistedToken;
        } catch (error) {
            logger.error(`Error checking token blacklist: ${(error as Error).message}`);
            return false; // Default to not blacklisted on error
        }
    }
}

// Export singleton instance
export const authService = new AuthService();
