# @aloha/shared

Shared types and constants for the Aloha monorepo, providing consistent error handling across backend and frontend applications.

## Installation

```bash
pnpm add @aloha/shared
```

## Usage

### Error Handling

Import error constants and utilities:

```typescript
import { ErrorCode, ErrorSeverity, ERROR_MESSAGES, ERROR_STATUS_CODES, getErrorSeverity } from '@aloha/shared';

// Use error codes
const errorCode = ErrorCode.AUTH_INVALID_CREDENTIALS;

// Get user-friendly message (Vietnamese)
const message = ERROR_MESSAGES[errorCode];

// Get HTTP status code
const statusCode = ERROR_STATUS_CODES[errorCode];

// Get error severity
const severity = getErrorSeverity(errorCode);
```

### Error Response Structure

Standard API error response format:

```typescript
{
  success: false,
  error: {
    code: "AUTH_INVALID_CREDENTIALS",
    message: "Email hoặc mật khẩu không đúng",
    statusCode: 401,
    severity: "medium",
    timestamp: "2024-01-01T00:00:00.000Z",
    requestId: "req-123"
  }
}
```

## Error Codes

### Authentication Errors

- `AUTH_INVALID_CREDENTIALS` - Invalid email/password
- `AUTH_TOKEN_EXPIRED` - Session expired
- `AUTH_TOKEN_INVALID` - Invalid session token
- `AUTH_TOKEN_REVOKED` - Session revoked
- `AUTH_TOKEN_MISSING` - Authentication required
- `AUTH_INSUFFICIENT_PERMISSIONS` - Insufficient permissions
- `AUTH_USER_NOT_FOUND` - User account not found

### User Management Errors

- `USER_NOT_FOUND` - User does not exist
- `USER_ALREADY_EXISTS` - Email already registered
- `USER_INVALID_DATA` - Invalid user data
- `USER_UPDATE_FAILED` - Update operation failed
- `USER_DELETE_FAILED` - Delete operation failed
- `USER_ACCESS_DENIED` - Access denied to user data

### Validation Errors

- `VALIDATION_REQUIRED` - Required field missing
- `VALIDATION_INVALID_FORMAT` - Invalid format
- `VALIDATION_TOO_LONG` - Value too long
- `VALIDATION_TOO_SHORT` - Value too short
- `VALIDATION_INVALID_VALUE` - Invalid value
- `VALIDATION_EMAIL_INVALID` - Invalid email format
- `VALIDATION_PASSWORD_WEAK` - Password doesn't meet requirements
- `VALIDATION_NAME_INVALID` - Invalid name format

### System Errors

- `SYS_INTERNAL_ERROR` - Internal server error
- `SYS_DATABASE_ERROR` - Database connection issue
- `SYS_EXTERNAL_SERVICE_ERROR` - External service unavailable
- `SYS_RATE_LIMIT_EXCEEDED` - Too many requests
- `SYS_MAINTENANCE_MODE` - System under maintenance

## Error Severity Levels

- `LOW` - User-fixable errors (validation issues)
- `MEDIUM` - Authentication/authorization issues
- `HIGH` - System-level errors
- `CRITICAL` - Severe system failures

## Development

```bash
# Build the package
npm run build

# Type checking
npm run type-check

# Watch mode
npm run dev
```

## License

MIT
