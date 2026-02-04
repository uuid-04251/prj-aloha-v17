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
