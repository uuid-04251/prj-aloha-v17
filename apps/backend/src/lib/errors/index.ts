/**
 * Error handling utilities for consistent error management
 *
 * This module provides:
 * - Standardized error codes and messages
 * - Helper functions for creating consistent errors
 * - Type definitions for error handling
 * - Integration with TRPC error system
 */

// Export error codes and messages
export { ErrorCode, ErrorMessages, ErrorTemplates } from './constants';

// Export helper functions
export { createError, createValidationError, createAuthError, createUserError, createSystemError, wrapError, mapToTRPCCode, isStandardizedError } from './helpers';

// Export types
export type { StandardizedError, ErrorContext, ValidationErrorDetails, AuthErrorDetails, UserErrorDetails, SystemErrorDetails, ErrorResponse, SuccessResponse, ErrorDetails, ErrorHandler, ErrorLogger, ErrorConfig } from './types';
