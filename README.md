# Aloha Admin - Next.js Monorepo

A modern admin dashboard built with Next.js 16, TypeScript, and PrimeReact.

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- pnpm

### Installation

```bash
pnpm install
```

### Development

```bash
pnpm dev
```

### Build

```bash
pnpm build
```

## 🧪 Testing

This project includes comprehensive testing setup:

### Unit Tests

```bash
pnpm test          # Run all tests
pnpm test:watch    # Run tests in watch mode
pnpm test:coverage # Run tests with coverage report
```

### Test Types Included:

- **Service Tests**: ProductService với dump data validation
- **Component Tests**: ProductCard với props và rendering
- **Integration Tests**: Dashboard với mocked services

### Test Coverage:

- ✅ Service layer (ProductService)
- ✅ Component rendering (ProductCard)
- ✅ Async operations (API calls)
- ✅ Mocking external dependencies
- ✅ TypeScript integration

### CI Integration:

Tests run automatically on every PR/push via GitHub Actions.

## 🔄 CI/CD

This project uses GitHub Actions for continuous integration:

### What CI does:

- ✅ **Linting** - Code quality checks with ESLint
- ✅ **Type Checking** - TypeScript compilation checks
- ✅ **Build** - Production build verification
- ✅ **Security Audit** - Dependency vulnerability scanning

### Triggers:

- On every push to `main` or `develop` branches
- On every pull request to `main` or `develop` branches

### Local CI Testing:

```bash
pnpm test:ci
```

## 🏗️ Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **UI Library:** PrimeReact
- **Styling:** Sass/SCSS
- **Package Manager:** pnpm
- **Linting:** ESLint
- **Formatting:** Prettier
- **Git Hooks:** Husky

## 📁 Project Structure

```
├── apps/admin/          # Main Next.js application
├── .github/workflows/   # CI/CD workflows
├── eslint.config.js     # ESLint configuration
├── tsconfig.json        # TypeScript configuration
└── package.json         # Root package configuration
```

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.
