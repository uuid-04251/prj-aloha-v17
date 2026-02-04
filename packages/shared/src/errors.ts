/**
 * Error constants for frontend use
 * This file provides type-safe error codes and messages for frontend applications
 */

// Error codes enum
export enum ErrorCode {
    // Authentication
    AUTH_INVALID_CREDENTIALS = 'AUTH_INVALID_CREDENTIALS',
    AUTH_TOKEN_EXPIRED = 'AUTH_TOKEN_EXPIRED',
    AUTH_TOKEN_INVALID = 'AUTH_TOKEN_INVALID',
    AUTH_TOKEN_REVOKED = 'AUTH_TOKEN_REVOKED',
    AUTH_TOKEN_MISSING = 'AUTH_TOKEN_MISSING',
    AUTH_INSUFFICIENT_PERMISSIONS = 'AUTH_INSUFFICIENT_PERMISSIONS',
    AUTH_USER_NOT_FOUND = 'AUTH_USER_NOT_FOUND',

    // User Management
    USER_NOT_FOUND = 'USER_NOT_FOUND',
    USER_ALREADY_EXISTS = 'USER_ALREADY_EXISTS',
    USER_INVALID_DATA = 'USER_INVALID_DATA',
    USER_UPDATE_FAILED = 'USER_UPDATE_FAILED',
    USER_DELETE_FAILED = 'USER_DELETE_FAILED',
    USER_ACCESS_DENIED = 'USER_ACCESS_DENIED',

    // Validation
    VALIDATION_REQUIRED = 'VALIDATION_REQUIRED',
    VALIDATION_INVALID_FORMAT = 'VALIDATION_INVALID_FORMAT',
    VALIDATION_TOO_LONG = 'VALIDATION_TOO_LONG',
    VALIDATION_TOO_SHORT = 'VALIDATION_TOO_SHORT',
    VALIDATION_INVALID_VALUE = 'VALIDATION_INVALID_VALUE',
    VALIDATION_EMAIL_INVALID = 'VALIDATION_EMAIL_INVALID',
    VALIDATION_PASSWORD_WEAK = 'VALIDATION_PASSWORD_WEAK',
    VALIDATION_NAME_INVALID = 'VALIDATION_NAME_INVALID',

    // System
    SYS_INTERNAL_ERROR = 'SYS_INTERNAL_ERROR',
    SYS_DATABASE_ERROR = 'SYS_DATABASE_ERROR',
    SYS_EXTERNAL_SERVICE_ERROR = 'SYS_EXTERNAL_SERVICE_ERROR',
    SYS_RATE_LIMIT_EXCEEDED = 'SYS_RATE_LIMIT_EXCEEDED',
    SYS_MAINTENANCE_MODE = 'SYS_MAINTENANCE_MODE'
}

// Error severity levels
export enum ErrorSeverity {
    LOW = 'low', // User can fix (validation errors)
    MEDIUM = 'medium', // User needs action (auth errors)
    HIGH = 'high', // System issues, show retry
    CRITICAL = 'critical' // Contact support
}

// Get error severity
export function getErrorSeverity(code: ErrorCode): ErrorSeverity {
    const codeStr = code.toString();
    if (codeStr.startsWith('VALIDATION_')) return ErrorSeverity.LOW;
    if (codeStr.startsWith('AUTH_')) return ErrorSeverity.MEDIUM;
    if (codeStr.startsWith('SYS_')) return ErrorSeverity.HIGH;
    return ErrorSeverity.CRITICAL;
}

// User-friendly error messages (Vietnamese)
export const ERROR_MESSAGES = {
    // Auth errors
    [ErrorCode.AUTH_INVALID_CREDENTIALS]: 'Email hoặc mật khẩu không đúng',
    [ErrorCode.AUTH_TOKEN_EXPIRED]: 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại',
    [ErrorCode.AUTH_TOKEN_INVALID]: 'Phiên đăng nhập không hợp lệ',
    [ErrorCode.AUTH_TOKEN_REVOKED]: 'Phiên đăng nhập đã bị thu hồi',
    [ErrorCode.AUTH_TOKEN_MISSING]: 'Yêu cầu đăng nhập',
    [ErrorCode.AUTH_INSUFFICIENT_PERMISSIONS]: 'Bạn không có quyền thực hiện hành động này',
    [ErrorCode.AUTH_USER_NOT_FOUND]: 'Tài khoản không tồn tại',

    // User errors
    [ErrorCode.USER_NOT_FOUND]: 'Người dùng không tồn tại',
    [ErrorCode.USER_ALREADY_EXISTS]: 'Email này đã được đăng ký',
    [ErrorCode.USER_INVALID_DATA]: 'Dữ liệu người dùng không hợp lệ',
    [ErrorCode.USER_UPDATE_FAILED]: 'Cập nhật thông tin thất bại',
    [ErrorCode.USER_DELETE_FAILED]: 'Xóa tài khoản thất bại',
    [ErrorCode.USER_ACCESS_DENIED]: 'Bạn chỉ có thể truy cập thông tin của chính mình',

    // Validation errors
    [ErrorCode.VALIDATION_REQUIRED]: 'Trường này là bắt buộc',
    [ErrorCode.VALIDATION_INVALID_FORMAT]: 'Định dạng không hợp lệ',
    [ErrorCode.VALIDATION_TOO_LONG]: 'Quá nhiều ký tự',
    [ErrorCode.VALIDATION_TOO_SHORT]: 'Quá ít ký tự',
    [ErrorCode.VALIDATION_INVALID_VALUE]: 'Giá trị không hợp lệ',
    [ErrorCode.VALIDATION_EMAIL_INVALID]: 'Vui lòng nhập email hợp lệ',
    [ErrorCode.VALIDATION_PASSWORD_WEAK]: 'Mật khẩu phải có ít nhất 12 ký tự với chữ hoa, chữ thường, số và ký tự đặc biệt',
    [ErrorCode.VALIDATION_NAME_INVALID]: 'Tên phải có 1-50 ký tự và chỉ chứa chữ cái, khoảng trắng, dấu gạch ngang và dấu phẩy',

    // System errors
    [ErrorCode.SYS_INTERNAL_ERROR]: 'Có lỗi xảy ra. Vui lòng thử lại sau',
    [ErrorCode.SYS_DATABASE_ERROR]: 'Hệ thống tạm thời không khả dụng. Vui lòng thử lại sau',
    [ErrorCode.SYS_EXTERNAL_SERVICE_ERROR]: 'Dịch vụ bên ngoài tạm thời không khả dụng',
    [ErrorCode.SYS_RATE_LIMIT_EXCEEDED]: 'Quá nhiều yêu cầu. Vui lòng thử lại sau',
    [ErrorCode.SYS_MAINTENANCE_MODE]: 'Hệ thống đang bảo trì. Vui lòng thử lại sau'
} as const;

// Type for error messages
export type ErrorMessageKey = keyof typeof ERROR_MESSAGES;

// HTTP status code mapping
export const ERROR_HTTP_STATUS = {
    [ErrorCode.AUTH_INVALID_CREDENTIALS]: 401,
    [ErrorCode.AUTH_TOKEN_EXPIRED]: 401,
    [ErrorCode.AUTH_TOKEN_INVALID]: 401,
    [ErrorCode.AUTH_TOKEN_REVOKED]: 401,
    [ErrorCode.AUTH_TOKEN_MISSING]: 401,
    [ErrorCode.AUTH_INSUFFICIENT_PERMISSIONS]: 403,
    [ErrorCode.AUTH_USER_NOT_FOUND]: 401,

    [ErrorCode.USER_NOT_FOUND]: 404,
    [ErrorCode.USER_ALREADY_EXISTS]: 400,
    [ErrorCode.USER_INVALID_DATA]: 400,
    [ErrorCode.USER_UPDATE_FAILED]: 500,
    [ErrorCode.USER_DELETE_FAILED]: 500,
    [ErrorCode.USER_ACCESS_DENIED]: 403,

    [ErrorCode.VALIDATION_REQUIRED]: 400,
    [ErrorCode.VALIDATION_INVALID_FORMAT]: 400,
    [ErrorCode.VALIDATION_TOO_LONG]: 400,
    [ErrorCode.VALIDATION_TOO_SHORT]: 400,
    [ErrorCode.VALIDATION_INVALID_VALUE]: 400,
    [ErrorCode.VALIDATION_EMAIL_INVALID]: 400,
    [ErrorCode.VALIDATION_PASSWORD_WEAK]: 400,
    [ErrorCode.VALIDATION_NAME_INVALID]: 400,

    [ErrorCode.SYS_INTERNAL_ERROR]: 500,
    [ErrorCode.SYS_DATABASE_ERROR]: 500,
    [ErrorCode.SYS_EXTERNAL_SERVICE_ERROR]: 500,
    [ErrorCode.SYS_RATE_LIMIT_EXCEEDED]: 429,
    [ErrorCode.SYS_MAINTENANCE_MODE]: 503
} as const;
