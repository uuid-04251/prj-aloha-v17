import pino from 'pino';
import { env } from './env';

// Create logger instance
export const logger = pino({
    level: env.BE_LOG_LEVEL,
    msgPrefix: '',
    formatters: {
        level: (label) => {
            return { level: label };
        }
    },
    timestamp: pino.stdTimeFunctions.isoTime,
    serializers: {
        req: pino.stdSerializers.req,
        res: pino.stdSerializers.res,
        err: pino.stdSerializers.err
    }
});

// Development pretty printing
if (env.BE_NODE_ENV === 'development') {
    logger.info('Logger initialized in development mode');
}
