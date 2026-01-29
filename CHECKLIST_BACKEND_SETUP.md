# Backend Setup Checklist

Dưới đây là checklist chuẩn quy trình để setup backend cho dự án Aloha, dựa trên kiến trúc đã định nghĩa (Fastify + tRPC + Zod + MongoDB).

## 0. Setup Coding Conventions (Prerequisite)

- [ ] Tạo file `docs/conventions.md` với coding standards cho dự án
- [ ] Đảm bảo AI agents và developers tuân thủ conventions

## 1. Chuẩn bị Cấu trúc Dự án (Critical)

- [ ] Tạo thư mục `apps/backend/` trong workspace
- [ ] Khởi tạo `package.json` cho backend app với dependencies cơ bản:
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
    - @types/node
    - @types/jsonwebtoken
    - @types/bcryptjs
    - typescript
- [ ] Tạo `tsconfig.json` với cấu hình phù hợp cho Node.js
- [ ] Cập nhật `pnpm-workspace.yaml` nếu cần (đã có `apps/*`)

## 2. Cài đặt Dependencies (High Priority)

- [ ] Chạy `pnpm install` trong `apps/backend/`
- [ ] Thêm dev dependencies: nodemon, ts-node, tsx, concurrently
- [ ] Thêm testing dependencies: jest, @types/jest, supertest, @types/supertest
- [ ] Verify dependencies: Chạy `pnpm list` để kiểm tra

## 3. Thiết lập Cấu trúc Thư mục (High Priority)

- [ ] Tạo thư mục `src/` với subfolders:
    - `src/routes/` - tRPC routes
    - `src/schemas/` - Zod validation schemas
    - `src/models/` - MongoDB Mongoose models
    - `src/services/` - Business logic services
    - `src/utils/` - Utility functions
    - `src/config/` - Configuration files
- [ ] Tạo file entry point: `src/index.ts` hoặc `src/server.ts`

## 4. Cấu hình Database (Critical)

- [ ] Setup MongoDB connection trong `src/config/database.ts`
- [ ] Tạo environment variables: `.env` với MONGODB_URI
- [ ] Tạo `.env.example` với template environment variables
- [ ] Tạo connection utility và error handling
- [ ] Test database connection

## 5. Thiết lập tRPC và Fastify (High Priority)

- [ ] Khởi tạo tRPC app router trong `src/routes/appRouter.ts`
- [ ] Tạo Fastify server với tRPC adapter
- [ ] Setup CORS, logging middleware
- [ ] Tạo hello world route để test

## 6. Tạo Zod Schemas và Models (High Priority)

- [ ] Định nghĩa Zod schemas cho User, Product, Category
- [ ] Tạo Mongoose models tương ứng
- [ ] Implement validation middleware

## 7. Implement Business Logic (Medium Priority)

- [ ] Tạo domain entities (User, Product, Category)
- [ ] Implement business services
- [ ] Implement authentication logic (JWT)
- [ ] Tạo utility functions cho password hashing, etc.

## 8. Setup Authentication (Medium Priority)

- [ ] Implement JWT authentication middleware
- [ ] Tạo login/register use cases
- [ ] Setup session management
- [ ] Create protected tRPC procedures

## 9. Error Handling & Logging (Medium Priority)

- [ ] Create custom error classes
- [ ] Implement global error handler for Fastify
- [ ] Setup structured logging với Pino
- [ ] Add error tracking và monitoring

## 10. Testing và Validation (Medium Priority)

- [ ] Viết unit tests cho entities và services
- [ ] Viết integration tests cho repositories
- [ ] Viết API tests cho tRPC routes
- [ ] Setup test database (MongoDB Memory Server)
- [ ] Implement test utilities và factories

## 11. Security & Performance (Medium Priority)

- [ ] Implement input sanitization and validation
- [ ] Add security headers and CORS configuration
- [ ] Setup rate limiting per user/route
- [ ] Implement caching layer (Redis)
- [ ] Add database indexes and query optimization

## 12. Scripts và Deployment (Low Priority)

- [ ] Thêm scripts trong `package.json`: dev, build, start, test
- [ ] Setup production build với TypeScript compilation
- [ ] Tạo Dockerfile cho containerization
- [ ] Cấu hình environment cho production (staging, prod)
- [ ] Setup health checks và monitoring
- [ ] Implement graceful shutdown

## 13. Documentation và Final Checks (Low Priority)

- [ ] Cập nhật docs trong `docs/architecture/backend.md`
- [ ] Tạo API documentation với Swagger/OpenAPI từ tRPC
- [ ] Document domain entities và business rules
- [ ] Final security audit: `pnpm audit`
- [ ] Performance testing và optimization
- [ ] Setup CI/CD pipeline với automated testing

## Notes

- Thực hiện theo thứ tự ưu tiên: Critical > High > Medium > Low
- Test từng bước để đảm bảo stability
- Sử dụng TypeScript strictly để type safety
- Đảm bảo compatibility với frontend (tRPC types)
- Tuân thủ Modular Clean Architecture principles
- Implement comprehensive error handling
- Focus on testability và maintainability