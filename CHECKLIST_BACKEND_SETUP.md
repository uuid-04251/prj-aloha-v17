# Backend Setup Checklist

Dưới đây là checklist chuẩn quy trình để setup backend cho dự án Aloha, dựa trên kiến trúc đã định nghĩa (Fastify + tRPC + Zod + MongoDB).

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

## 3. Thiết lập Cấu trúc Thư mục (High Priority)

- [x] Tạo thư mục `src/` với subfolders:
    - `src/routes/` - tRPC routes
    - `src/schemas/` - Zod validation schemas
    - `src/models/` - MongoDB Mongoose models
    - `src/services/` - Business logic services
    - `src/utils/` - Utility functions
    - `src/config/` - Configuration files
- [x] Tạo file entry point: `src/index.ts` hoặc `src/server.ts`

## 4. Cấu hình Database (Critical)

- [x] Setup MongoDB connection trong `src/config/database.ts`
- [x] Tạo environment variables: `.env` với MONGODB_URI
- [x] Tạo `.env.example` với template environment variables
- [x] Tạo connection utility và error handling
- [x] Test database connection

## 5. Thiết lập tRPC và Fastify (High Priority)

- [ ] Khởi tạo tRPC app router trong `src/routes/appRouter.ts`
- [ ] Tạo Fastify server với tRPC adapter
- [ ] Setup CORS, logging middleware
- [ ] Tạo hello world route để test

## 6. Tạo Zod Schemas và Models (High Priority)

- [ ] Định nghĩa Zod schemas cho User, Product, Category trong `src/schemas/`
- [ ] Tạo Mongoose models tương ứng trong `src/models/`
- [ ] Implement validation middleware

## 7. Implement Business Logic (Medium Priority)

- [ ] Tạo services trong `src/services/` cho CRUD operations
- [ ] Implement authentication logic (JWT)
- [ ] Tạo utility functions cho password hashing, etc.

## 8. Setup Authentication (Medium Priority)

- [ ] Implement JWT authentication middleware
- [ ] Tạo login/register routes
- [ ] Setup session management

## 9. Testing và Validation (Medium Priority)

- [ ] Viết unit tests cho models và services
- [ ] Viết integration tests cho API routes
- [ ] Setup test database (MongoDB Memory Server)

## 10. Scripts và Deployment (Low Priority)

- [ ] Thêm scripts trong `package.json`: dev, build, start, test
- [ ] Setup production build với TypeScript compilation
- [ ] Tạo Dockerfile nếu cần
- [ ] Cấu hình environment cho production

## 11. Documentation và Final Checks (Low Priority)

- [ ] Cập nhật docs trong `docs/architecture/backend.md` với implementation details
- [ ] Tạo API documentation với Swagger/OpenAPI
- [ ] Final security audit: `pnpm audit`
- [ ] Performance testing cơ bản

## Notes

- Thực hiện theo thứ tự ưu tiên: Critical > High > Medium > Low
- Test từng bước để đảm bảo stability
- Sử dụng TypeScript strictly để type safety
- Đảm bảo compatibility với frontend (tRPC types)
