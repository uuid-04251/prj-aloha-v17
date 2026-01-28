# Repo Optimization Checklist

Dưới đây là checklist tối ưu repo cần thực hiện ngay cho monorepo pnpm. Sắp xếp theo ưu tiên (critical trước), dựa trên trạng thái hiện tại (đã có lint, type-check, husky, .gitignore tối ưu).

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
- [ ] Lý do: Catch errors early, ensure quality.

## 4. Add Unit Tests (Medium Priority)

- [ ] Thêm tests cơ bản cho components/services (dùng Jest/RTL).
- [ ] Add `jest`, `testing-library` vào devDeps, tạo tests cho 1-2 components, add script "test".
- [ ] Lý do: Đảm bảo code reliability, integrate với CI.

## 5. Bundle Optimization (Medium Priority)

- [ ] Kiểm tra và tối ưu bundle size (dùng @next/bundle-analyzer).
- [ ] Add analyzer, run `ANALYZE=true pnpm build`, optimize imports.
- [ ] Lý do: Improve load time, SEO.

## 6. Add Commitlint (Low-Medium Priority)

- [ ] Enforce conventional commits (feat, fix, etc.).
- [ ] Add @commitlint/cli, husky commit-msg hook.
- [ ] Lý do: Consistent commit messages, better changelog.

## 7. Update Documentation (Low Priority)

- [ ] Cập nhật README với setup, scripts, contribution guide.
- [ ] Thêm sections: Installation, Scripts, Development, Deployment.
- [ ] Lý do: Dễ onboard contributors.

## 8. Branch Protection & Releases (Low Priority)

- [ ] Protect main branch, add release workflow.
- [ ] GitHub settings: require PR reviews, add semantic-release.
- [ ] Lý do: Prevent bad merges, automate versioning.

## Lưu ý chung

- Thực hiện theo thứ tự ưu tiên, test sau mỗi bước (build, lint pass).
- Ưu tiên 1-3 trước, vì liên quan security/quality.
- Đánh dấu [x] khi hoàn thành.
