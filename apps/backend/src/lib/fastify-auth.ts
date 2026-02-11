import { FastifyPluginAsync, FastifyRequest, FastifyReply } from 'fastify';
import fp from 'fastify-plugin';
import { extractTokenFromHeader, verifyToken, type JWTPayload } from './auth';
import { authService } from '../resources/auth/auth.service';
import { logger } from '../util/logger';

// Extend Fastify Request to include user and token
declare module 'fastify' {
    // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
    interface FastifyRequest {
        user?: JWTPayload;
        token?: string;
    }

    // eslint-disable-next-line @typescript-eslint/consistent-type-definitions, no-unused-vars
    interface FastifyInstance {
        authenticate: (_request: FastifyRequest, _reply: FastifyReply) => Promise<void>;
    }
}

/**
 * Fastify Authentication Plugin
 * Decorates Fastify instance with authenticate hook
 */
const authPlugin: FastifyPluginAsync = async (fastify) => {
    // Decorate fastify instance with authenticate function
    fastify.decorate('authenticate', async (request: FastifyRequest, reply: FastifyReply) => {
        try {
            const authHeader = request.headers.authorization;

            if (!authHeader) {
                return reply.status(401).send({
                    success: false,
                    message: 'Authorization header is required'
                });
            }

            const token = extractTokenFromHeader(authHeader);
            if (!token) {
                return reply.status(401).send({
                    success: false,
                    message: 'Invalid authorization header format'
                });
            }

            // Verify token
            const payload = verifyToken(token);

            // Check if token is blacklisted
            const isBlacklisted = await authService.isTokenBlacklisted(token);
            if (isBlacklisted) {
                return reply.status(401).send({
                    success: false,
                    message: 'Token has been revoked'
                });
            }

            // Attach user and token to request
            request.user = payload;
            request.token = token;

            logger.debug(`Authenticated user: ${payload.email} (${payload.role})`);
        } catch (error: any) {
            logger.error(`Authentication failed: ${error.message}`);
            return reply.status(401).send({
                success: false,
                message: 'Invalid or expired token'
            });
        }
    });
};

// Export as fastify plugin
export default fp(authPlugin, {
    name: 'fastify-auth',
    fastify: '4.x'
});
