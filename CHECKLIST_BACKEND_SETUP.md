# Backend Setup Checklist - FOCUS: Core Auth & User Management

Dưới đây là checklist được ưu tiên cho việc setup authentication và user management trước, dựa trên kiến trúc tham khảo từ backend-summary.md (MongoDB + JWT + Zod + tRPC).

## 0. Setup Coding Conventions (Prerequisite)

- [x] Tạo file `docs/conventions.md` với coding standards cho dự án
- [x] Đảm bảo AI agents và developers tuân thủ conventions

## 1. Chuẩn bị Cấu trúc Dự án (Critical)

- [x] Tạo thư mục `apps/backend/` trong workspace
- [x] Khởi tạo `package.json` cho backend app với dependencies cơ bản:
    - fastify
    - @trpc/server
    - @trpc/client
    - zod
    - mongoose
    - jsonwebtoken
    - bcryptjs
    - dotenv
    - pino (logging)
    - @fastify/cors
    - @fastify/rate-limit
    - @fastify/helmet (security headers)
    - @fastify/swagger (API documentation)
    - @fastify/swagger-ui (API documentation UI)
    - @fastify/compress (response compression)
    - @fastify/multipart (file uploads)
    - mongoose-paginate-v2 (pagination)
    - prom-client (metrics/monitoring)
    - convict (environment validation)
    - ioredis (Redis client for caching)
    - @types/node
    - @types/jsonwebtoken
    - @types/bcryptjs
    - typescript
- [x] Tạo `tsconfig.json` với cấu hình phù hợp cho Node.js
- [x] Cập nhật `pnpm-workspace.yaml` nếu cần (đã có `apps/*`)

## 2. Cài đặt Dependencies (High Priority)

- [x] Chạy `pnpm install` trong `apps/backend/`
- [x] Thêm dev dependencies: nodemon, ts-node, tsx, concurrently
- [x] Thêm testing dependencies: jest, @types/jest, supertest, @types/supertest
- [x] Verify dependencies: Chạy `pnpm list` để kiểm tra

## 3. Thiết lập Cấu trúc Thư mục - FOCUS Auth/User (High Priority)

- [x] Tạo cấu trúc thư mục cơ bản:
    ```
    apps/backend/
    ├── src/
    │   ├── resources/                 # Business logic by domain
    │   │   ├── auth/                  # 🔴 PRIORITY: Authentication
    │   │   │   ├── auth.service.ts        # JWT logic, password hashing
    │   │   │   ├── auth.procedures.ts     # login, register, logout
    │   │   │   └── auth.router.ts         # Auth TRPC router
    │   │   ├── users/                 # 🔴 PRIORITY: User management
    │   │   │   ├── users.service.ts       # User CRUD operations
    │   │   │   ├── users.procedures.ts    # User API procedures
    │   │   │   ├── users.router.ts        # User TRPC router
    │   │   │   └── users.schemas.ts       # Zod validation schemas
    │   ├── lib/                       # Infrastructure
    │   │   ├── trpc/
    │   │   │   ├── router.ts              # Main TRPC router assembly
    │   │   │   ├── context.ts             # Request context
    │   │   │   ├── middleware.ts          # 🔴 PRIORITY: Auth middleware
    │   │   │   └── trpc.ts                # TRPC setup
    │   │   ├── db/
    │   │   │   ├── connection.ts          # 🔴 PRIORITY: MongoDB setup
    │   │   │   └── models/                # Mongoose models
    │   │   │       └── user.model.ts
    │   │   ├── auth.ts                    # 🔴 PRIORITY: JWT utilities
    │   │   └── errors/                    # 🔴 PRIORITY: Custom errors
    │   ├── util/                      # Utilities
    │   │   ├── env.ts                  # 🔴 PRIORITY: Environment helpers
    │   │   └── logger.ts               # 🔴 PRIORITY: Logging utilities
    │   └── server.ts                  # 🔴 PRIORITY: Server setup
    ├── tests/                         # Test files (optional for now)
    └── package.json
    ```
- [x] Tạo file entry point: `src/server.ts`

## 4. Cấu hình Database - MongoDB (Critical)

- [x] Setup MongoDB connection trong `src/lib/db/connection.ts`
- [x] Tạo environment variables: `.env` với MONGODB_URI
- [x] Tạo `.env.example` với template environment variables
- [x] Tạo connection utility và error handling
- [x] Test database connection

## 5. Thiết lập tRPC và Fastify - Core Setup (High Priority)

- [x] Khởi tạo tRPC setup trong `src/lib/trpc/trpc.ts`
- [x] Tạo context trong `src/lib/trpc/context.ts`
- [x] Setup middleware trong `src/lib/trpc/middleware.ts` (JWT auth)
- [x] Tạo main router trong `src/lib/trpc/router.ts`
- [x] Tạo Fastify server trong `src/server.ts` với tRPC adapter
- [x] Setup CORS, logging middleware
- [x] Tạo hello world route để test

## 6. Tạo Auth Resource - CORE FEATURE (High Priority)

- [x] Tạo `src/resources/auth/` structure:
    - `auth.service.ts` - JWT token generation, password hashing/verification
    - `auth.procedures.ts` - login, register, logout, refresh token
    - `auth.router.ts` - Auth TRPC router
- [x] Implement JWT utilities trong `src/lib/auth.ts`
- [x] Setup password hashing với bcryptjs
- [x] Create login/register procedures
- [x] Integrate với User model (database queries)
- [x] Implement token blacklist mechanism
- [x] Add token validation trong middleware

## 7. Tạo Users Resource - CORE FEATURE (High Priority)

- [x] Tạo `src/resources/users/` structure:
    - `users.service.ts` - User CRUD operations (MongoDB)
    - `users.procedures.ts` - getUsers, getUserById, createUser, updateProfile, deleteUser
    - `users.router.ts` - User TRPC router
    - `users.schemas.ts` - Zod validation schemas
- [x] Tạo Mongoose User model
- [x] Implement user business logic
- [x] Create protected user procedures

## 8. Setup Authentication Middleware - CORE FEATURE (High Priority)

- [x] Implement JWT authentication middleware trong `src/lib/trpc/middleware.ts`
- [x] Protect user procedures với auth middleware
- [x] Setup token validation và user context
- [x] Handle token refresh logic
- [x] Implement token blacklist checking
- [x] Store token in context for logout

## 9. Error Handling & Logging - Essential (Medium Priority)

- [ ] Create custom error classes trong `src/lib/errors/`
- [ ] Implement global error handler for Fastify
- [ ] Setup structured logging với Pino trong `src/util/logger.ts`
- [ ] Add error tracking và monitoring

## 10. Testing Auth/User - Minimal (Medium Priority)

- [ ] Viết basic integration tests cho auth: `tests/integration/auth/`
- [ ] Viết basic integration tests cho users: `tests/integration/users/`
- [ ] Setup test database (MongoDB Memory Server)
- [ ] Test login/register flow end-to-end

## 11. Security & Validation - Important (Medium Priority)

- [ ] Implement input validation với Zod schemas
- [ ] Add security headers và CORS configuration
- [ ] Setup basic rate limiting
- [ ] Password strength validation

## 12. API Documentation - Medium Priority

- [ ] Setup Swagger documentation với @fastify/swagger
- [ ] Configure Swagger UI với @fastify/swagger-ui
- [ ] Generate OpenAPI spec từ tRPC routes
- [ ] Add API documentation cho tất cả endpoints

## 13. File Upload Management - Medium Priority

- [ ] Setup file upload với @fastify/multipart
- [ ] Implement file validation (size, type, etc.)
- [ ] Configure file storage (local/cloud)
- [ ] Add file upload endpoints cho user avatars, etc.

## 14. Caching & Performance - Medium Priority

- [ ] Setup Redis connection với ioredis
- [ ] Implement caching cho user queries
- [ ] Add session storage
- [ ] Setup cache invalidation strategies

## 15. Database Enhancements - Medium Priority

- [ ] Add mongoose-paginate-v2 cho pagination
- [ ] Implement database indexes
- [ ] Add database migrations/scripts
- [ ] Setup database seeding cho development

## 16. Advanced Features - FUTURE (Low Priority)

- [ ] Email utilities (`src/lib/mail/`)
- [ ] Background jobs (`src/jobs/`)
- [ ] Internationalization (`src/lib/i18n/`)
- [ ] Caching layer (Redis)
- [ ] Advanced testing suite
- [ ] Docker containerization
- [ ] CI/CD pipeline

## Notes

- 🔴 **PRIORITY FOCUS**: Auth & User management (login, register, JWT tokens)
- ✅ **COMPLETED**: Authentication middleware, Users resource, Auth database integration, Token blacklist
- ⏭️ **NEXT STEPS**: Error handling, testing, security enhancements, API documentation
- Auth system now fully functional with database integration
- Token blacklist prevents token reuse after logout
- Sử dụng TypeScript strictly để type safety
- Đảm bảo compatibility với frontend (tRPC types)
- Tuân thủ Resource-Oriented Architecture pattern
- Implement comprehensive error handling cho auth flows
- Focus on security: password hashing, JWT validation, input sanitization
