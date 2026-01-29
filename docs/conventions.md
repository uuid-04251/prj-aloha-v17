# Coding Conventions for Aloha Project

## Overview

This document outlines the coding conventions and standards for the Aloha project. These conventions ensure consistency, maintainability, and efficiency across the codebase, especially for AI agents working on the project.

## 1. General Principles

- **Consistency**: Follow the established patterns in the codebase
- **Readability**: Code should be self-documenting
- **Maintainability**: Easy to modify and extend
- **Performance**: Optimize where necessary
- **Security**: Follow security best practices

## 2. Project Structure

```
apps/
├── admin/          # Next.js admin app
├── backend/        # Fastify + tRPC backend
docs/
├── architecture/
├── business-logic/
├── database/
├── deployment/
├── conventions.md  # This file
```

## 3. Backend Modular Clean Architecture Structure

```
apps/backend/src/
├── modules/        # Business modules (modular approach)
│   ├── user/       # User management module
│   │   ├── entities/    # User entity
│   │   ├── services/    # User business logic
│   │   ├── routes/      # User tRPC routes
│   │   ├── schemas/     # User Zod schemas
│   │   └── repositories/# User repository
│   ├── product/    # Product management module
│   │   ├── entities/    # Product entity
│   │   ├── services/    # Product business logic
│   │   ├── routes/      # Product tRPC routes
│   │   ├── schemas/     # Product Zod schemas
│   │   └── repositories/# Product repository
│   └── category/   # Category management module
│       ├── entities/    # Category entity
│       ├── services/    # Category business logic
│       ├── routes/      # Category tRPC routes
│       ├── schemas/     # Category Zod schemas
│       └── repositories/# Category repository
├── infrastructure/ # External concerns
│   ├── database/   # MongoDB models & shared repositories
│   ├── external/   # External APIs, services
│   └── config/     # Configuration
├── presentation/   # Interface adapters
│   ├── server/     # Fastify server setup
│   ├── routes/     # Main tRPC router composition
│   ├── middlewares/# Fastify middlewares
│   └── schemas/    # Shared Zod schemas
├── shared/         # Shared utilities
│   ├── utils/      # Pure utility functions
│   ├── types/      # Shared types
│   └── constants/  # Application constants
└── index.ts        # Application entry point
```

## 4. Clean Architecture Guidelines

- **Dependency Rule**: Inner layers cannot depend on outer layers
- **Domain Layer**: Pure business logic, no external dependencies
- **Application Layer**: Orchestrates domain objects, use cases
- **Infrastructure Layer**: Implements interfaces defined in inner layers
- **Presentation Layer**: Translates between external world and application
- **Dependency Injection**: Use constructor injection for testability
- **Error Handling**: Domain errors vs infrastructure errors
- **Validation**: Input validation at boundaries (Zod schemas)

## 5. Fastify Best Practices

- **Plugins**: Use plugins for reusable functionality
- **Hooks**: Prefer `onRequest` for auth, `preHandler` for validation
- **Decorators**: Use for request/response augmentation
- **Error Handling**: Use `setErrorHandler` for global error handling
- **Logging**: Structured logging with Pino
- **CORS**: Configure based on environment
- **Rate Limiting**: Implement per route or global
- **Validation**: Use Fastify's built-in validation with schemas

## 6. tRPC Guidelines

- **Procedures**: Use `publicProcedure` for public, `protectedProcedure` for auth
- **Input/Output**: Always validate with Zod schemas
- **Error Handling**: Use tRPC's error formatting
- **Middleware**: Create reusable middleware for auth, logging
- **Type Safety**: Leverage tRPC's end-to-end type safety
- **Router Composition**: Compose routers for better organization

## 7. Database & Models

- **Mongoose**: Use schemas with validation
- **Repositories**: Implement repository pattern for data access
- **Transactions**: Use for multi-document operations
- **Indexing**: Add indexes for query performance
- **Migration**: Version control schema changes
- **Connection**: Use connection pooling and error handling

## 8. Error Handling Patterns

- **Domain Errors**: Business logic errors (e.g., UserNotFoundError)
- **Application Errors**: Use case errors
- **Infrastructure Errors**: External service errors
- **HTTP Errors**: Map to appropriate HTTP status codes
- **Logging**: Log errors with context, not sensitive data
- **Recovery**: Implement retry logic where appropriate

## 9. File Naming Conventions

- **Files**: kebab-case (e.g., `user-service.ts`, `product-schema.ts`)
- **Directories**: kebab-case (e.g., `user-management/`)
- **Components**: PascalCase (e.g., `UserCard.tsx`)
- **Hooks**: camelCase with `use` prefix (e.g., `useUserData.ts`)
- **Types/Interfaces**: PascalCase (e.g., `User.ts`, `ProductInterface.ts`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `MAX_RETRY_COUNT`)

## 4. TypeScript Conventions

- **Strict Mode**: Always enabled
- **Types vs Interfaces**:
    - Use `interface` for object shapes that may be extended
    - Use `type` for unions, primitives, and complex types
- **Naming**:
    - Interfaces: PascalCase with `I` prefix optional (prefer no prefix)
    - Types: PascalCase
    - Generics: Single letter (T, U, V) or descriptive (TData, TError)
- **Imports**: Group by external libraries, then internal modules
- **Exports**: Prefer named exports over default exports

## 5. Code Style

- **Indentation**: 2 spaces
- **Line Length**: Max 100 characters
- **Semicolons**: Required
- **Quotes**: Single quotes for strings, double for JSX attributes
- **Trailing Commas**: Required in multiline objects/arrays

## 6. Backend Specific Conventions (Fastify + tRPC + Zod + MongoDB)

- **Routes**: Define in `src/routes/` with descriptive names
- **Schemas**: Zod schemas in `src/schemas/` matching model names
- **Models**: Mongoose models in `src/models/` with PascalCase
- **Services**: Business logic in `src/services/` with Service suffix
- **Utils**: Pure functions in `src/utils/`
- **Config**: Environment-based config in `src/config/`
- **Error Handling**: Use custom error classes, consistent error responses
- **Validation**: All inputs validated with Zod schemas
- **Authentication**: JWT-based, middleware for protected routes

## 7. Frontend Specific Conventions (Next.js)

- **Components**: Functional components with hooks
- **Pages**: App Router structure in `app/`
- **API Routes**: RESTful endpoints in `app/api/`
- **Services**: Data fetching services in `services/`
- **Styling**: SCSS modules or Tailwind CSS
- **State Management**: React Context for global state
- **Images**: Next.js Image component, lazy loading

## 8. Testing Conventions

- **Unit Tests**: For services, utils, and pure functions
- **Integration Tests**: For API routes and database operations
- **E2E Tests**: For critical user flows
- **Test Files**: `.test.ts` or `.spec.ts` suffix
- **Mocking**: Use appropriate mocks for external dependencies
- **Coverage**: Aim for 80%+ coverage

## 9. Commit Message Conventions

Follow Conventional Commits:

```
type(scope): description

Types: feat, fix, docs, style, refactor, test, chore
Examples:
- feat(auth): add JWT authentication
- fix(user): resolve password reset bug
- docs(readme): update installation guide
```

## 10. Documentation

- **Code Comments**: For complex logic, not obvious code
- **README**: Project setup and usage
- **API Docs**: Auto-generated from tRPC routes
- **Architecture Docs**: High-level design decisions

## 11. Security Practices

- **Input Validation**: Always validate and sanitize inputs
- **Authentication**: Secure JWT handling
- **Authorization**: Role-based access control
- **Data Protection**: Encrypt sensitive data
- **Dependencies**: Regular security audits

## 12. Performance Guidelines

- **Database**: Use indexes, avoid N+1 queries
- **API**: Implement caching, rate limiting
- **Frontend**: Code splitting, lazy loading
- **Images**: Optimize and compress

## 13. AI Agent Guidelines

- **Context Awareness**: Always check existing code patterns before implementing
- **Incremental Changes**: Make small, testable changes
- **Validation**: Run tests and linting after changes
- **Documentation**: Update docs when changing architecture
- **Communication**: Explain changes clearly in commit messages

## 14. Tooling

- **Package Manager**: pnpm for workspace management
- **Linting**: ESLint with project config
- **Formatting**: Prettier
- **Type Checking**: TypeScript strict mode
- **Testing**: Jest for unit/integration tests
- **Git Hooks**: Husky for pre-commit checks

## 15. Deployment

- **Environment**: Separate configs for dev/staging/prod
- **CI/CD**: Automated testing and deployment
- **Monitoring**: Error tracking and performance monitoring
- **Backup**: Regular database backups

---

_This document should be updated as the project evolves. All team members and AI agents must adhere to these conventions._
