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

## 📝 Commit Convention

This project uses [Conventional Commits](https://conventionalcommits.org/) to ensure consistent commit messages and automated changelog generation.

### Commit Message Format:

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

### Types:

- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation only changes
- `style`: Changes that do not affect the meaning of the code (white-space, formatting, etc.)
- `refactor`: A code change that neither fixes a bug nor adds a feature
- `perf`: A code change that improves performance
- `test`: Adding missing tests or correcting existing tests
- `build`: Changes that affect the build system or external dependencies
- `ci`: Changes to our CI configuration files and scripts
- `chore`: Other changes that don't modify src or test files

### Examples:

```bash
feat: add user authentication
fix: resolve memory leak in dashboard
docs: update API documentation
style: format code with prettier
refactor: simplify component logic
perf: optimize database queries
test: add unit tests for user service
build: update dependencies
ci: add github actions workflow
chore: update package.json
```

### Breaking Changes:

For breaking changes, add `!` after the type/scope and explain in the footer:

```bash
feat!: change API response format

BREAKING CHANGE: The response now includes additional metadata
```

### Commit Validation:

Commits are automatically validated using [commitlint](https://commitlint.js.org/) via git hooks. Invalid commit messages will be rejected.

## 🏗️ Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **UI Library:** PrimeReact
- **Styling:** Sass/SCSS
- **Package Manager:** pnpm
- **Linting:** ESLint
- **Formatting:** Prettier
- **Git Hooks:** Husky
- **Commit Convention:** commitlint with conventional commits

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
