import { TRPCError } from '@trpc/server';
import { ErrorCode, ErrorMessages } from './constants';
import type { StandardizedError } from './types';

/**
 * Maps domain-specific error codes to TRPC error codes
 */
export function mapToTRPCCode(errorCode: ErrorCode): TRPCError['code'] {
    const codeMappings: Record<string, TRPCError['code']> = {
        // Authentication errors -> UNAUTHORIZED
        [ErrorCode.AUTH_INVALID_CREDENTIALS]: 'UNAUTHORIZED',
        [ErrorCode.AUTH_TOKEN_EXPIRED]: 'UNAUTHORIZED',
        [ErrorCode.AUTH_TOKEN_INVALID]: 'UNAUTHORIZED',
        [ErrorCode.AUTH_TOKEN_REVOKED]: 'UNAUTHORIZED',
        [ErrorCode.AUTH_TOKEN_MISSING]: 'UNAUTHORIZED',
        [ErrorCode.AUTH_INSUFFICIENT_PERMISSIONS]: 'FORBIDDEN',
        [ErrorCode.AUTH_USER_NOT_FOUND]: 'UNAUTHORIZED',

        // User errors -> NOT_FOUND or BAD_REQUEST
        [ErrorCode.USER_NOT_FOUND]: 'NOT_FOUND',
        [ErrorCode.USER_ALREADY_EXISTS]: 'BAD_REQUEST',
        [ErrorCode.USER_INVALID_DATA]: 'BAD_REQUEST',
        [ErrorCode.USER_UPDATE_FAILED]: 'INTERNAL_SERVER_ERROR',
        [ErrorCode.USER_DELETE_FAILED]: 'INTERNAL_SERVER_ERROR',
        [ErrorCode.USER_ACCESS_DENIED]: 'FORBIDDEN',

        // Validation errors -> BAD_REQUEST
        [ErrorCode.VALIDATION_REQUIRED]: 'BAD_REQUEST',
        [ErrorCode.VALIDATION_INVALID_FORMAT]: 'BAD_REQUEST',
        [ErrorCode.VALIDATION_TOO_LONG]: 'BAD_REQUEST',
        [ErrorCode.VALIDATION_TOO_SHORT]: 'BAD_REQUEST',
        [ErrorCode.VALIDATION_INVALID_VALUE]: 'BAD_REQUEST',
        [ErrorCode.VALIDATION_EMAIL_INVALID]: 'BAD_REQUEST',
        [ErrorCode.VALIDATION_PASSWORD_WEAK]: 'BAD_REQUEST',
        [ErrorCode.VALIDATION_NAME_INVALID]: 'BAD_REQUEST',

        // System errors -> INTERNAL_SERVER_ERROR
        [ErrorCode.SYS_INTERNAL_ERROR]: 'INTERNAL_SERVER_ERROR',
        [ErrorCode.SYS_DATABASE_ERROR]: 'INTERNAL_SERVER_ERROR',
        [ErrorCode.SYS_EXTERNAL_SERVICE_ERROR]: 'INTERNAL_SERVER_ERROR',
        [ErrorCode.SYS_RATE_LIMIT_EXCEEDED]: 'TOO_MANY_REQUESTS',
        [ErrorCode.SYS_MAINTENANCE_MODE]: 'INTERNAL_SERVER_ERROR'
    };

    return codeMappings[errorCode] || 'INTERNAL_SERVER_ERROR';
}

/**
 * Creates a standardized TRPC error with consistent format
 */
export function createError(code: ErrorCode, details?: Record<string, any>, cause?: Error, messageOverride?: string): TRPCError {
    let message = messageOverride || ErrorMessages[code];
    if (!message) {
        throw new Error(`Unknown error code: ${code}`);
    }

    const errorDetails = details ? { ...details } : {};
    const timestamp = new Date().toISOString();

    const standardizedError: StandardizedError = {
        code,
        message,
        details: errorDetails,
        timestamp,
        requestId: generateRequestId(),
        ...(cause && { originalError: cause })
    };

    return new TRPCError({
        code: mapToTRPCCode(code),
        message,
        cause: standardizedError
    });
}

/**
 * Creates a validation error with field-specific context
 */
export function createValidationError(field: string, code: ErrorCode, params?: Record<string, any>): TRPCError {
    // For validation errors, we need to interpolate the field name and parameters
    let message: string = ErrorMessages[code];

    if (!message) {
        throw new Error(`Unknown error code: ${code}`);
    }

    // Replace placeholders in message
    message = message.replace(/{(\w+)}/g, (match, key) => {
        if (key === 'field') return field;
        return params?.[key] || match;
    });

    const errorDetails = {
        field,
        ...params
    };

    return createError(
        code,
        {
            ...errorDetails,
            category: 'validation'
        },
        undefined,
        message
    );
}

/**
 * Creates an auth error with security context
 */
export function createAuthError(code: ErrorCode, details?: Record<string, any>): TRPCError {
    return createError(code, {
        ...details,
        category: 'authentication'
    });
}

/**
 * Creates a user error with user context
 */
export function createUserError(code: ErrorCode, userId?: string, details?: Record<string, any>): TRPCError {
    return createError(code, {
        ...details,
        userId,
        category: 'user_management'
    });
}

/**
 * Creates a system error with system context
 */
export function createSystemError(code: ErrorCode, details?: Record<string, any>, originalError?: Error): TRPCError {
    return createError(
        code,
        {
            ...details,
            category: 'system',
            originalMessage: originalError?.message
        },
        originalError
    );
}

/**
 * Wraps any error into a standardized TRPC error
 */
export function wrapError(error: unknown, defaultCode: ErrorCode = ErrorCode.SYS_INTERNAL_ERROR): TRPCError {
    if (error instanceof TRPCError) {
        return error;
    }

    if (error instanceof Error) {
        return createSystemError(defaultCode, {}, error);
    }

    return createError(defaultCode, { originalError: error });
}

/**
 * Generates a unique request ID for error tracking
 */
function generateRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Type guard to check if an error is a standardized error
 */
export function isStandardizedError(error: any): error is StandardizedError {
    return error && typeof error.code === 'string' && typeof error.message === 'string' && typeof error.timestamp === 'string';
}
