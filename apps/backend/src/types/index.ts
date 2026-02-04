/**
 * Shared type definitions for the application
 *
 * This file contains common types used across the application,
 * including error handling types and API response structures.
 */

// Re-export error handling types and utilities
export {
    // Error codes and messages
    ErrorCode,
    ErrorMessages,

    // Error creation helpers
    createError,
    createValidationError,
    createAuthError,
    createUserError,
    createSystemError,

    // Error types
    type StandardizedError,
    type ErrorContext,
    type ValidationErrorDetails,
    type AuthErrorDetails,
    type UserErrorDetails,
    type SystemErrorDetails,
    type ErrorResponse,
    type SuccessResponse
} from '../lib/errors';

// API Response types
export interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    error?: import('../lib/errors/types').StandardizedError;
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

// Common utility types
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;

// Pagination types
export interface PaginationParams {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
    meta: {
        timestamp: string;
        requestId?: string;
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    };
}

// Filter and search types
export interface FilterParams {
    search?: string;
    filters?: Record<string, any>;
    dateRange?: {
        start: Date;
        end: Date;
    };
}

// Common entity types
export interface BaseEntity {
    id: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface SoftDeleteEntity extends BaseEntity {
    deletedAt?: Date;
    isDeleted?: boolean;
}
