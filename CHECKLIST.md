# Repo Optimization Checklist

Dưới đây là checklist tối ưu repo cần thực hiện ngay cho monorepo pnpm. Sắp xếp theo ưu tiên (critical trước), dựa trên trạng thái hiện tại (đã có lint, type-check, husky, .gitignore tối ưu).

## 0. Critical Code Quality Issues (Đã fix - 01/28/2026)

- [x] Fix 59 lint issues (33 errors, 26 warnings) - ESLint config, React hooks, unused vars, types.
- [x] Fix build failures - TypeScript compilation errors.
- [x] Fix Sass deprecation warnings - Migrate @import to @use/@forward.
- [x] Fix Next.js viewport warnings - Separate viewport export from metadata.
- [x] Fix 24 image optimization warnings - Replace <img> with Next.js <Image> components.
- [x] Fix ESLint no-html-link-for-pages error - Disable rule for App Router.
- [x] Lý do: Đảm bảo code quality, build success, performance optimization.

## 0.1. Critical Bug Check (Đã kiểm tra - 01/28/2026)

- [x] Security audit: No known vulnerabilities found.
- [x] Build status: ✓ Compiled successfully, all routes prerendered.
- [x] Lint status: ✓ No errors or warnings.
- [x] TypeScript check: ✓ No type errors.
- [x] Dependencies: ✓ No outdated packages.
- [x] Dev server: ✓ Starts successfully without runtime errors.
- [x] CI/CD: ✓ GitHub Actions workflow configured (lint, type-check, build).
- [x] Lý do: Đảm bảo repo stable và production-ready.

## 0.2. Image Updates (Đã thực hiện - 01/28/2026)

- [x] Update dashboard images: Thay thế ảnh local `/demo/images/product/` bằng URL fake từ ProductService (`mainImage`).
- [x] Fix type consistency: Sử dụng `Product` type thay vì `Demo.Product` trong dashboard.
- [x] Lý do: Đồng bộ dữ liệu ảnh giữa dashboard và trang product, sử dụng fake images từ service.

## 1. Security Audit (Critical - Ngay lập tức)

- [x] Kiểm tra vulnerabilities trong dependencies.
- [x] Chạy `pnpm audit` và fix nếu có high-severity issues.
- [x] Lý do: Bảo mật repo, tránh exploits.

## 2. Update Dependencies (High Priority)

- [x] Cập nhật packages outdated, đặc biệt Next.js (đã update từ 13.4.8 lên 16.1.6).
- [x] Chạy `pnpm update --latest`, test build/lint sau đó.
- [x] Migrate ESLint từ v8 lên v9 flat config.
- [x] Lý do: Fix bugs, security, performance improvements.

## 3. Add Basic CI/CD (High Priority)

- [x] Setup GitHub Actions để auto-run lint, type-check, build trên PR/push.
- [x] Tạo `.github/workflows/ci.yml` với steps: checkout, pnpm install, lint, type-check, build.
- [x] Thêm security audit vào CI workflow.
- [x] Fix CI error: add pnpm setup step trước Node.js setup.
- [x] Fix CI error: pnpm lockfile issue - add fetch-depth: 0 và bỏ --frozen-lockfile.
- [x] Lý do: Catch errors early, ensure quality.

## 4. Add Unit Tests (Medium Priority)

- [x] Setup Jest + React Testing Library.
- [x] Cấu hình Jest cho TypeScript và Next.js.
- [x] Viết unit tests cho ProductService (8 tests).
- [x] Viết component tests cho ProductCard.
- [x] Viết integration tests cho Dashboard với mocked services.
- [x] Thêm Jest globals vào ESLint config.
- [x] Cập nhật CI workflow để chạy tests.
- [x] Fix TypeScript errors trong test files (useState types, mock data).
- [x] Fix CI Jest config: explicitly specify jest.config.js to avoid ts-node dependency.
- [x] Lý do: Đảm bảo code reliability, integrate với CI.

## 5. Bundle Optimization (High Priority - Đã thực hiện 01/29/2026)

- [x] Setup @next/bundle-analyzer để monitor bundle size.
- [x] Implement dynamic imports cho các components lớn (PrimeReact components).
- [x] Giảm bundle size từ 235KB xuống 194KB (17.4% improvement).
- [x] Optimize imports trong dashboard, product, category, user pages.
- [x] Lý do: Improve load time, user experience, SEO scores.

## 6. Add Commitlint (High Priority - Đã thực hiện 01/29/2026)

- [x] Install @commitlint/cli và @commitlint/config-conventional.
- [x] Setup husky commit-msg hook để validate commit messages.
- [x] Tạo .commitlintrc.json với conventional commit rules.
- [x] Test validation với valid/invalid commit messages.
- [x] Lý do: Consistent commit messages, better changelog, team collaboration.

## 7. Security & Privacy Audit (High Priority - Cần bổ sung ngay)

- [x] Kiểm tra hardcoded localhost URLs (ĐÃ FIX: thay http://localhost:3000/api → http://test-api.example.com/api).
- [x] Kiểm tra local paths trong coverage reports (ĐÃ FIX: xóa thư mục coverage chứa /Users/MAC/... paths).
- [x] Kiểm tra environment variables setup (.env files).
- [x] Setup proper environment variable handling cho production.
- [x] Lý do: Prevent sensitive data leaks, ensure production security.

## 8. Performance Optimization (High Priority - Cần bổ sung)

- [ ] Add React.memo cho components không cần re-render thường xuyên.
- [ ] Implement lazy loading cho images với Next.js Image component.
- [ ] Add service worker cho caching (PWA).
- [ ] Optimize fonts loading (preload critical fonts).
- [ ] Lý do: Improve Core Web Vitals, user experience.

## 9. Error Handling & Monitoring (High Priority - Cần bổ sung)

- [ ] Add global error boundary component.
- [ ] Implement proper error pages (404, 500).
- [ ] Add error logging service (Sentry, LogRocket).
- [ ] Add loading states và skeleton components.
- [ ] Lý do: Better user experience, debugging capabilities.

## 10. SEO & Accessibility (High Priority - Cần bổ sung)

- [ ] Add proper meta tags, Open Graph, Twitter cards.
- [ ] Implement structured data (JSON-LD) cho products.
- [ ] Add alt texts cho tất cả images.
- [ ] Test accessibility với axe-core hoặc lighthouse.
- [ ] Lý do: Better search rankings, inclusive design.

## 11. Environment & Deployment Setup (High Priority - Cần bổ sung)

- [ ] Tạo .env.example với tất cả environment variables cần thiết.
- [ ] Setup proper environment variable validation (zod, joi).
- [ ] Configure deployment cho Vercel/Netlify với build settings.
- [ ] Add environment-specific configs (development, staging, production).
- [ ] Lý do: Proper configuration management, secure deployments.

## 12. Code Splitting & Loading Optimization (Medium Priority - Cần bổ sung)

- [ ] Implement route-based code splitting.
- [ ] Add preload/prefetch cho critical resources.
- [ ] Optimize third-party scripts loading.
- [ ] Lý do: Faster initial page loads, better performance scores.

## Lưu ý chung

- Thực hiện theo thứ tự ưu tiên, test sau mỗi bước (build, lint pass).
- **Ưu tiên cao ngay:** 7 (Security), 8 (Performance), 9 (Error Handling), 10 (SEO/Accessibility), 11 (Environment).
- **Đã hoàn thành:** Code quality, CI/CD, tests, bundle optimization, commitlint, documentation.
- Đánh dấu [x] khi hoàn thành, cập nhật ngày tháng.
