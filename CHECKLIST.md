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

## 5. Bundle Optimization (Medium Priority)

- [ ] Kiểm tra và tối ưu bundle size (dùng @next/bundle-analyzer).
- [ ] Add analyzer, run `ANALYZE=true pnpm build`, optimize imports.
- [ ] Lý do: Improve load time, SEO.

## 6. Add Commitlint (Low-Medium Priority)

- [ ] Enforce conventional commits (feat, fix, etc.).
- [ ] Add @commitlint/cli, husky commit-msg hook.
- [ ] Lý do: Consistent commit messages, better changelog.

## 7. Update Documentation (Low Priority)

- [x] Cập nhật README với setup, scripts, contribution guide.
- [x] Thêm sections: Installation, Scripts, Development, Deployment.
- [x] Lý do: Dễ onboard contributors.

## 8. Branch Protection & Releases (Low Priority)

- [ ] Protect main branch, add release workflow.
- [ ] GitHub settings: require PR reviews, add semantic-release.
- [ ] Lý do: Prevent bad merges, automate versioning.

## Lưu ý chung

- Thực hiện theo thứ tự ưu tiên, test sau mỗi bước (build, lint pass).
- Ưu tiên 1-3 trước, vì liên quan security/quality.
- Đánh dấu [x] khi hoàn thành.
