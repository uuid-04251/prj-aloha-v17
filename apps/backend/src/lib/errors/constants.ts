/* eslint-disable no-unused-vars */
/**
 * Error codes and messages for standardized error handling
 * Domain-specific error codes for auth, user, validation, and system errors
 */

export enum ErrorCode {
    // Authentication (AUTH_xxx)
    AUTH_INVALID_CREDENTIALS = 'AUTH_INVALID_CREDENTIALS',
    AUTH_TOKEN_EXPIRED = 'AUTH_TOKEN_EXPIRED',
    AUTH_TOKEN_INVALID = 'AUTH_TOKEN_INVALID',
    AUTH_TOKEN_REVOKED = 'AUTH_TOKEN_REVOKED',
    AUTH_TOKEN_MISSING = 'AUTH_TOKEN_MISSING',
    AUTH_INSUFFICIENT_PERMISSIONS = 'AUTH_INSUFFICIENT_PERMISSIONS',
    AUTH_USER_NOT_FOUND = 'AUTH_USER_NOT_FOUND',

    // User Management (USER_xxx)
    USER_NOT_FOUND = 'USER_NOT_FOUND',
    USER_ALREADY_EXISTS = 'USER_ALREADY_EXISTS',
    USER_INVALID_DATA = 'USER_INVALID_DATA',
    USER_UPDATE_FAILED = 'USER_UPDATE_FAILED',
    USER_DELETE_FAILED = 'USER_DELETE_FAILED',
    USER_ACCESS_DENIED = 'USER_ACCESS_DENIED',

    // Product Management (PRODUCT_xxx)
    PRODUCT_NOT_FOUND = 'PRODUCT_NOT_FOUND',
    PRODUCT_SKU_ALREADY_EXISTS = 'PRODUCT_SKU_ALREADY_EXISTS',

    // Validation (VALIDATION_xxx)
    VALIDATION_REQUIRED = 'VALIDATION_REQUIRED',
    VALIDATION_INVALID_FORMAT = 'VALIDATION_INVALID_FORMAT',
    VALIDATION_TOO_LONG = 'VALIDATION_TOO_LONG',
    VALIDATION_TOO_SHORT = 'VALIDATION_TOO_SHORT',
    VALIDATION_INVALID_VALUE = 'VALIDATION_INVALID_VALUE',
    VALIDATION_EMAIL_INVALID = 'VALIDATION_EMAIL_INVALID',
    VALIDATION_PASSWORD_WEAK = 'VALIDATION_PASSWORD_WEAK',
    VALIDATION_NAME_INVALID = 'VALIDATION_NAME_INVALID',

    // System (SYS_xxx)
    SYS_INTERNAL_ERROR = 'SYS_INTERNAL_ERROR',
    SYS_DATABASE_ERROR = 'SYS_DATABASE_ERROR',
    SYS_EXTERNAL_SERVICE_ERROR = 'SYS_EXTERNAL_SERVICE_ERROR',
    SYS_RATE_LIMIT_EXCEEDED = 'SYS_RATE_LIMIT_EXCEEDED',
    SYS_MAINTENANCE_MODE = 'SYS_MAINTENANCE_MODE'
}

export const ErrorMessages = {
    // Auth messages
    [ErrorCode.AUTH_INVALID_CREDENTIALS]: 'Invalid email or password',
    [ErrorCode.AUTH_TOKEN_EXPIRED]: 'Your session has expired. Please log in again',
    [ErrorCode.AUTH_TOKEN_INVALID]: 'Invalid authentication token',
    [ErrorCode.AUTH_TOKEN_REVOKED]: 'Your session has been revoked',
    [ErrorCode.AUTH_TOKEN_MISSING]: 'Authentication token is required',
    [ErrorCode.AUTH_INSUFFICIENT_PERMISSIONS]: 'You do not have permission to perform this action',
    [ErrorCode.AUTH_USER_NOT_FOUND]: 'User account not found',

    // User messages
    [ErrorCode.USER_NOT_FOUND]: 'User not found',
    [ErrorCode.USER_ALREADY_EXISTS]: 'An account with this email already exists',
    [ErrorCode.USER_INVALID_DATA]: 'Invalid user data provided',
    [ErrorCode.USER_UPDATE_FAILED]: 'Failed to update user information',
    [ErrorCode.USER_DELETE_FAILED]: 'Failed to delete user account',
    [ErrorCode.USER_ACCESS_DENIED]: 'You can only access your own account information',

    // Product messages
    [ErrorCode.PRODUCT_NOT_FOUND]: 'Product not found',
    [ErrorCode.PRODUCT_SKU_ALREADY_EXISTS]: 'A product with this SKU already exists',

    // Validation messages (templates with placeholders)
    [ErrorCode.VALIDATION_REQUIRED]: '{field} is required',
    [ErrorCode.VALIDATION_INVALID_FORMAT]: '{field} format is invalid',
    [ErrorCode.VALIDATION_TOO_LONG]: '{field} must be less than {max} characters',
    [ErrorCode.VALIDATION_TOO_SHORT]: '{field} must be at least {min} characters',
    [ErrorCode.VALIDATION_INVALID_VALUE]: '{field} contains invalid characters',
    [ErrorCode.VALIDATION_EMAIL_INVALID]: 'Please enter a valid email address',
    [ErrorCode.VALIDATION_PASSWORD_WEAK]: 'Password must be at least 6 characters with uppercase, lowercase, number, and special character',
    [ErrorCode.VALIDATION_NAME_INVALID]: 'Name must be 1-50 characters and contain only letters, spaces, hyphens, and apostrophes',

    // System messages
    [ErrorCode.SYS_INTERNAL_ERROR]: 'An unexpected error occurred. Please try again later',
    [ErrorCode.SYS_DATABASE_ERROR]: 'Database temporarily unavailable. Please try again later',
    [ErrorCode.SYS_EXTERNAL_SERVICE_ERROR]: 'External service temporarily unavailable. Please try again later',
    [ErrorCode.SYS_RATE_LIMIT_EXCEEDED]: 'Too many requests. Please try again later',
    [ErrorCode.SYS_MAINTENANCE_MODE]: 'System is currently under maintenance. Please try again later'
} as const;

/**
 * Error message templates that support dynamic field replacement
 */
export const ErrorTemplates = {
    REQUIRED: '{field} is required',
    INVALID_FORMAT: '{field} format is invalid',
    TOO_LONG: '{field} must be less than {max} characters',
    TOO_SHORT: '{field} must be at least {min} characters',
    INVALID_VALUE: '{field} contains invalid characters',
    DUPLICATE_VALUE: '{field} already exists'
} as const;
