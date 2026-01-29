# Coding Conventions - Aloha Backend

Dưới đây là coding standards và conventions cho dự án Aloha Backend (Fastify + tRPC + Zod + MongoDB + JWT).

## 1. Project Structure

```
apps/backend/
├── src/
│   ├── resources/                 # Business logic by domain
│   │   ├── {domain}/
│   │   │   ├── {domain}.service.ts        # Business logic
│   │   │   ├── {domain}.procedures.ts     # TRPC procedures
│   │   │   └── {domain}.router.ts         # TRPC router for domain
│   ├── lib/                       # Infrastructure
│   │   ├── trpc/
│   │   │   ├── router.ts              # Main TRPC router assembly
│   │   │   ├── context.ts             # Request context
│   │   │   ├── middleware.ts          # Auth middleware
│   │   │   └── trpc.ts                # TRPC setup
│   │   ├── db/connection.ts           # MongoDB setup
│   │   ├── auth.ts                    # JWT utilities
│   │   ├── errors/                    # Custom errors
│   │   └── ...                       # Other infrastructure
│   ├── util/                      # Utilities
│   │   ├── env.ts                  # Environment helpers
│   │   └── logger.ts               # Logging utilities
│   └── server.ts                  # Server setup
├── tests/                         # Test files
│   ├── integration/               # Integration tests by domain
│   │   ├── {domain}/{feature}.test.ts
│   └── utils/                     # Test utilities
└── package.json
```

## 2. Naming Conventions

### 2.1 Files and Directories

- **Directories**: `camelCase` or `kebab-case` (e.g., `user-service`, `auth-utils`)
- **Files**: `camelCase.ts` matching class/function name (e.g., `userService.ts`)
- **Test Files**: `{fileName}.test.ts` or `{fileName}.spec.ts`

### 2.2 Classes and Types

- **Classes**: `PascalCase` (e.g., `UserService`, `AuthMiddleware`)
- **Interfaces**: `PascalCase` with `I` prefix (e.g., `IUser`, `IAuthService`)
- **Types**: `PascalCase` (e.g., `User`, `CreateUserInput`)
- **Enums**: `PascalCase` (e.g., `UserRole`, `AuthStatus`)

### 2.3 Functions and Variables

- **Functions**: `camelCase`, verb-first (e.g., `createUser`, `getUserById`, `validatePassword`)
- **Variables**: `camelCase` (e.g., `userData`, `authToken`)
- **Constants**: `SCREAMING_SNAKE_CASE` (e.g., `JWT_SECRET`, `DEFAULT_PORT`)

### 2.4 Database

- **Collections**: `camelCase` plural (e.g., `users`, `userSessions`)
- **Fields**: `camelCase` (e.g., `firstName`, `lastName`, `createdAt`)

## 3. Service Layer Pattern

### 3.1 Service Classes

```typescript
export class UserService {
    // Methods: verb-first, camelCase
    async createUser(data: CreateUserInput): Promise<User> {
        // Implementation
    }

    async getUserById(userId: string): Promise<User | null> {
        // Implementation
    }

    async updateUser(userId: string, data: UpdateUserInput): Promise<User> {
        // Implementation
    }
}

// Export singleton instance
export const userService = new UserService();
```

### 3.2 Service Naming Rules

- **Class Name**: `PascalCase` + `Service` suffix, singular (e.g., `UserService`)
- **File Name**: Match class name (e.g., `userService.ts`)
- **Location**: `src/resources/{domain}/`
- **Methods**: `camelCase`, verb-first
- **Export**: Singleton instance as `camelCase`

## 4. TRPC Implementation

### 4.1 File Structure per Domain

```
src/resources/{domain}/
├── {domain}.service.ts      # Business logic
├── {domain}.procedures.ts   # TRPC procedures
└── {domain}.router.ts       # TRPC router
```

### 4.2 Router Assembly

- **Main Router**: `src/lib/trpc/router.ts`
- **Domain Routers**: Import and combine all domain routers
- **Middleware**: `src/lib/trpc/middleware.ts`

### 4.3 Procedure Naming

- **Public**: `camelCase` (e.g., `login`, `register`)
- **Protected**: `camelCase` (e.g., `getProfile`, `updateUser`)
- **Admin**: `adminCamelCase` (e.g., `adminGetUsers`)

## 5. Error Handling

### 5.1 Custom Error Classes

```typescript
export class UserNotFoundError extends Error {
    constructor(userId: string) {
        super(`User with ID ${userId} not found`);
        this.name = 'UserNotFoundError';
    }
}

export class AuthenticationError extends Error {
    constructor(message: string = 'Authentication failed') {
        super(message);
        this.name = 'AuthenticationError';
    }
}
```

### 5.2 Error Naming

- **Class Name**: `PascalCase` + `Error` suffix
- **File Location**: `src/lib/errors/`
- **TRPC Errors**: Use `TRPCError` from `@trpc/server`

## 6. Environment Variables

### 6.1 Naming Format

- **Backend-specific**: `BE_` prefix + `SCREAMING_SNAKE_CASE`
- **General**: `SCREAMING_SNAKE_CASE`

### 6.2 Examples

```bash
# Backend specific
BE_PORT=3000
BE_HOST=0.0.0.0
BE_NODE_ENV=development
BE_LOG_LEVEL=debug

# General
MONGODB_URI=mongodb://localhost:27017/aloha
JWT_SECRET=your-secret-key
JWT_ISSUER=https://api.aloha.com
JWT_AUDIENCE=aloha-api
CORS_ORIGIN=https://app.aloha.com
```

## 7. Testing Conventions

### 7.1 Test File Organization

```
tests/
├── integration/
│   ├── auth/
│   │   └── login.test.ts
│   └── users/
│       └── profile.test.ts
└── utils/
    └── test-helpers.ts
```

### 7.2 Test Naming

- **Files**: `{feature}.test.ts` or `{feature}.spec.ts`
- **Test Cases**: `describe('Feature', () => { it('should do something', () => { ... }) })`
- **Mock Data**: Use factories in `tests/utils/`

## 8. Zod Validation Schemas

### 8.1 Schema Naming

- **Input Schemas**: `{Action}{Entity}Input` (e.g., `CreateUserInput`, `LoginInput`)
- **Response Schemas**: `{Entity}Response` (e.g., `UserResponse`, `AuthResponse`)

### 8.2 Schema Location

- **Domain Schemas**: `src/resources/{domain}/{domain}.schemas.ts`
- **Shared Schemas**: `src/lib/schemas/`

## 9. Logging

### 9.1 Logger Usage

```typescript
import { logger } from '../util/logger';

// Info level
logger.info('User logged in', { userId, email });

// Error level
logger.error('Login failed', { error: err.message, email });

// Debug level
logger.debug('JWT token generated', { userId, tokenExpiry });
```

### 9.2 Log Levels

- **error**: Errors and exceptions
- **warn**: Warnings
- **info**: General information
- **debug**: Debug information

## 10. Import/Export Rules

### 10.1 Import Order

1. Node.js built-ins
2. External packages
3. Internal modules (lib, util)
4. Relative imports

### 10.2 Export Patterns

```typescript
// Named exports for utilities
export { hashPassword, verifyPassword } from './auth';

// Default export for main classes
export default class UserService { ... }

// Re-export for convenience
export * from './types';
```

## 11. TypeScript Rules

### 11.1 Strict Mode

- Always use strict TypeScript settings
- No `any` types (use `unknown` if necessary)
- Explicit return types for functions
- Use interfaces over types for object shapes

### 11.2 Type Definitions

```typescript
// Good: Explicit interface
interface User {
    id: string;
    email: string;
    name: string;
    role: UserRole;
    createdAt: Date;
}

// Good: Union types for enums
type UserRole = 'admin' | 'user' | 'moderator';

// Good: Generic types
type ApiResponse<T> = {
    success: boolean;
    data: T;
    error?: string;
};
```

## 12. Security Best Practices

### 12.1 Password Handling

- Use bcryptjs for hashing (minimum 12 rounds)
- Never log passwords
- Implement password strength validation

### 12.2 JWT Tokens

- Use secure secrets (minimum 256 bits)
- Set appropriate expiration times
- Implement token refresh mechanism
- Validate tokens on each request

### 12.3 Input Validation

- Always validate input with Zod schemas
- Sanitize user inputs
- Use parameterized queries (Mongoose handles this)

## 13. Performance Guidelines

### 13.1 Database Queries

- Use indexes for frequently queried fields
- Implement pagination for list endpoints
- Use lean() queries when possible in Mongoose
- Avoid N+1 query problems

### 13.2 Caching Strategy

- Cache frequently accessed data
- Use appropriate cache expiration
- Invalidate cache on data changes

## 14. Code Quality

### 14.1 Linting and Formatting

- Use ESLint with TypeScript rules
- Use Prettier for code formatting
- Run linters in CI/CD pipeline

### 14.2 Documentation

- JSDoc comments for public APIs
- README files for complex modules
- API documentation with examples

### 14.3 Commit Messages

- Use conventional commits format
- English language
- Descriptive but concise

## 15. Development Workflow

### 15.1 Branch Naming

- `feature/{feature-name}` for new features
- `fix/{issue-description}` for bug fixes
- `refactor/{description}` for refactoring

### 15.2 Pull Request Guidelines

- Descriptive title and description
- Reference related issues
- Include tests for new features
- Code review required before merge

---

_These conventions ensure consistency, maintainability, and scalability across the Aloha Backend codebase. All team members should follow these guidelines._
