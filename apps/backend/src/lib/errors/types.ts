import { ErrorCode } from './constants';
import { TRPCError } from '@trpc/server';

/**
 * Standardized error structure for consistent error handling
 */
export interface StandardizedError {
    /** Domain-specific error code */
    code: ErrorCode;
    /** User-friendly error message */
    message: string;
    /** Additional error context and details */
    details?: Record<string, any>;
    /** ISO timestamp when error occurred */
    timestamp: string;
    /** Unique request ID for tracking */
    requestId?: string;
    /** Original error that caused this error (if any) */
    originalError?: Error;
}

/**
 * Error context for different error categories
 */
export interface ErrorContext {
    /** Error category (auth, user, validation, system) */
    category?: 'authentication' | 'user_management' | 'validation' | 'system';
    /** Field name for validation errors */
    field?: string;
    /** User ID for user-related errors */
    userId?: string;
    /** Additional metadata */
    metadata?: Record<string, any>;
}

/**
 * Validation error details
 */
export interface ValidationErrorDetails extends ErrorContext {
    field: string;
    value?: any;
    expected?: string;
    received?: string;
    constraints?: {
        min?: number;
        max?: number;
        pattern?: string;
        required?: boolean;
    };
}

/**
 * Auth error details
 */
export interface AuthErrorDetails extends ErrorContext {
    category: 'authentication';
    tokenType?: 'access' | 'refresh';
    tokenExpiry?: Date;
    userId?: string;
    attemptedAction?: string;
}

/**
 * User error details
 */
export interface UserErrorDetails extends ErrorContext {
    category: 'user_management';
    userId: string;
    operation?: 'create' | 'read' | 'update' | 'delete';
    field?: string;
}

/**
 * System error details
 */
export interface SystemErrorDetails extends ErrorContext {
    category: 'system';
    component?: string;
    operation?: string;
    originalMessage?: string;
    stack?: string;
}

/**
 * Error response structure for API responses
 */
export interface ErrorResponse {
    /** HTTP status code */
    status: number;
    /** Error details */
    error: StandardizedError;
    /** Success flag (always false for errors) */
    success: false;
}

/**
 * Success response structure for consistency
 */
export interface SuccessResponse<T = any> {
    /** Response data */
    data: T;
    /** Success flag */
    success: true;
    /** Optional metadata */
    meta?: {
        timestamp: string;
        requestId?: string;
        pagination?: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    };
}

/**
 * Union type for all error detail types
 */
export type ErrorDetails = ValidationErrorDetails | AuthErrorDetails | UserErrorDetails | SystemErrorDetails | ErrorContext;

/**
 * Error handler function type
 */
export type ErrorHandler = (_error: unknown, _context?: ErrorContext) => TRPCError;

/**
 * Error logger function type
 */
export type ErrorLogger = (_error: StandardizedError, _context?: ErrorContext) => void;

/**
 * Error configuration
 */
export interface ErrorConfig {
    /** Whether to include stack traces in development */
    includeStackTrace: boolean;
    /** Whether to log errors */
    enableLogging: boolean;
    /** Custom error logger */
    logger?: ErrorLogger;
    /** Custom error handler */
    handler?: ErrorHandler;
}
