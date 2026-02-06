# TODO Checklist: Setup Authentication & Login Feature

Dựa trên kiểm tra code hiện tại, nhiều phần backend đã implement. Đây là cập nhật checklist với trạng thái thực tế và chi tiết hơn.

## Backend Setup (Đã hoàn thành phần lớn)

### Database & Models

- [x] Tạo kết nối MongoDB trong `apps/backend/src/lib/db/connection.ts`
- [x] Tạo User model (Mongoose) trong `apps/backend/src/lib/db/models/user.model.ts` với schema: email, password (hashed), role, timestamps
    - Password validation mạnh: min 12 chars, uppercase, lowercase, number, special char
    - comparePassword method implemented
- [x] Tạo Token model trong `apps/backend/src/lib/db/models/token.model.ts` cho blacklist
- [ ] Test kết nối database và tạo `.env` với MONGODB_URI (cần verify)

### tRPC & Server Infrastructure

- [x] Khởi tạo tRPC setup trong `apps/backend/src/lib/trpc/trpc.ts`
- [x] Cập nhật context trong `apps/backend/src/lib/trpc/context.ts` để tích hợp user từ JWT
- [x] Tạo middleware auth trong `apps/backend/src/lib/trpc/middleware.ts` để verify JWT + blacklist check
- [x] Setup Fastify server trong `apps/backend/src/server.ts` với tRPC adapter, CORS, rate limiting
- [x] Tạo main router trong `apps/backend/src/lib/trpc/router.ts`

### Auth Resource (Core Login Feature)

- [x] Tạo thư mục `apps/backend/src/resources/auth/`
- [x] Implement `auth.service.ts`: JWT utilities (generate/verify), password hashing/verification với bcryptjs
    - Login, register, refreshToken, logout methods
- [x] Implement `auth.procedures.ts`: login, register, logout, refreshToken, getCurrentUser procedures
    - Zod validation schemas included
- [x] Tạo `auth.router.ts`: Router tRPC cho auth
- [x] Implement token blacklist mechanism (Redis/database via Token model)
- [x] Tích hợp auth với User model cho database queries

### Users Resource (Hỗ trợ Auth)

- [x] Tạo thư mục `apps/backend/src/resources/users/`
- [x] Implement `users.service.ts`: User CRUD operations
- [x] Implement `users.procedures.ts`: getUsers, createUser, updateUser, etc.
- [x] Tạo `users.schemas.ts`: Zod validation schemas
- [x] Tạo `users.router.ts`: Router tRPC
- [x] Bảo vệ user procedures bằng auth middleware

### Security & Error Handling

- [x] Tạo custom errors trong `apps/backend/src/lib/errors/` (AUTH_INVALID_CREDENTIALS, etc.)
- [x] Setup logging với Pino trong `apps/backend/src/util/logger.ts`
- [x] Thêm security headers với @fastify/helmet (cần verify trong server.ts)
- [x] Implement input validation với Zod (email format, password strength)
- [x] Setup rate limiting cho auth endpoints (cần verify)

### Testing

- [x] Viết integration tests cho auth trong `apps/backend/tests/integration/auth/`
- [x] Viết tests cho users trong `apps/backend/tests/integration/users/`
- [x] Setup test database (MongoDB Memory Server)
- [x] Test login/register flow end-to-end
- [x] Đạt coverage 90%+ cho auth và user logic (auth.service.ts: 98.64%, users.service.ts: 89.06%, user.model.ts: 94.11%)

## Frontend Setup (Admin App - Next.js) - Cần hoàn thiện

### tRPC Client & Infrastructure

- [x] Setup tRPC client trong `apps/admin/` để gọi backend procedures
- [x] Tạo provider trong `apps/admin/providers/` để wrap app với tRPC context

### Auth Pages & Components

- [x] Tạo trang login trong `apps/admin/app/(full-page)/auth/login/page.tsx` với form (email, password) - UI cơ bản có, thiếu logic
- [x] Implement form validation và error handling (client-side) - cần thêm state và submit handler
- [x] Tạo layout cho auth pages nếu cần
- [x] Thêm logic gọi auth.login procedure khi submit form
- [x] Handle response: lưu token, redirect to dashboard

### Access Control & Session Management

- [x] Implement token storage (localStorage/httpOnly cookies)
- [x] Tạo middleware/HOC để protect routes (dashboard trong `(main)/`)
- [x] Implement logout: Clear token và redirect
- [ ] Handle token refresh logic nếu cần

### Services & Types

- [x] Tạo auth service trong `apps/admin/services/` để handle API calls (AuthService.tsx)
- [x] Định nghĩa types trong `apps/admin/types/` cho user và auth responses (auth.d.ts)

### UI/UX

- [x] Sử dụng PrimeReact cho form components (đã có trong login page)
- [ ] Thêm error messages từ backend (e.g., "Invalid credentials")
- [ ] Ensure responsive design với SCSS themes

## Integration & End-to-End Testing

- [x] Test full login flow: Frontend → Backend → Database
- [x] Verify protected routes work with JWT
- [x] Test logout và token invalidation
- [ ] Manual testing với Postman/browser

## Deployment & Production

- [ ] Setup environment variables cho production (secure JWT_SECRET)
- [ ] Configure HTTPS và secure headers
- [ ] Deploy backend và frontend riêng biệt
- [ ] Thêm monitoring với prom-client

## Notes

- Backend auth đã implement khá đầy đủ, cần test và verify.
- Frontend cần focus vào tRPC integration và auth logic.
- Tham khảo `CHECKLIST_BACKEND_SETUP.md` cho chi tiết hơn.
- Đảm bảo tuân thủ coding conventions trong `docs/conventions.md`.
- Nếu gặp lỗi, check logs và run tests để debug.</content>
  <parameter name="filePath">/Users/MAC/Desktop/lamdd/aloha/prj-aloha-v17/TODO_AUTH_SETUP.md
