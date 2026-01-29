# Backend API Summary for AI Agents

## Overview

The Backend API is a Node.js application using TRPC for type-safe API endpoints, Drizzle ORM for database operations, and integrates with Keycloak for authentication. It serves as the central business logic hub for the Iruka platform.

## Key Technologies

- **TRPC**: Type-safe RPC framework for API endpoints
- **Drizzle ORM**: Type-safe database queries
- **Zod**: Runtime validation and type inference
- **Keycloak**: Identity provider integration
- **Node.js + TypeScript**: Runtime and type safety
- **PostgreSQL**: Primary database
- **Redis**: Caching and session storage
- **Fastify**: Web framework
- **OpenTelemetry**: Observability and tracing
- **Pino**: Logging
- **Jest**: Testing framework

## Dependencies (Key Ones)

### Production

- `@trpc/server`: TRPC server implementation
- `drizzle-orm`: Database ORM
- `zod`: Schema validation
- `fastify`: Web server
- `@fastify/cors`, `@fastify/formbody`: Fastify plugins
- `@keycloak/keycloak-admin-client`: Keycloak admin API
- `jose`: JWT handling
- `nodemailer`: Email sending
- `expo-server-sdk`: Push notifications
- `axios`: HTTP client
- `node-cron`: Scheduled jobs
- `pino`: Logging
- `@opentelemetry/*`: Observability

### Development

- `tsx`: TypeScript execution
- `jest`: Testing
- `esbuild`: Bundling
- `drizzle-kit`: Migration tools
- `@playwright/test`: E2E testing

## Project Structure

```
apps/backend-api/
├── src/
│   ├── resources/                 # Business logic by domain
│   │   ├── {domain}/
│   │   │   ├── {domain}.service.ts        # Business logic
│   │   │   ├── {domain}.procedures.ts     # TRPC procedures
│   │   │   └── {domain}.router.ts         # TRPC router for domain
│   │   └── ... (domains: auth, users, care-teams, activities, etc.)
│   ├── lib/                       # Infrastructure
│   │   ├── trpc/
│   │   │   ├── router.ts              # Main TRPC router assembly
│   │   │   ├── context.ts             # Request context
│   │   │   ├── middleware.ts          # Auth middleware
│   │   │   └── trpc.ts                # TRPC setup
│   │   ├── db/connection.ts           # Database setup
│   │   ├── auth.ts                    # JWT utilities
│   │   ├── errors/                    # Custom errors
│   │   ├── mail/                      # Email utilities
│   │   ├── redis/                     # Redis utilities
│   │   └── i18n/                      # Internationalization
│   ├── config/                    # Configuration files
│   │   ├── database.ts
│   │   ├── keycloak.ts
│   │   └── email.ts
│   ├── jobs/                      # Background jobs
│   │   └── scheduler.ts            # Job scheduling
│   ├── keycloak/                  # Keycloak integration
│   ├── util/                      # Utilities
│   │   ├── env.ts                  # Environment helpers
│   │   └── logger.ts               # Logging utilities
│   ├── utils/                     # More utilities
│   ├── instrumentation.ts         # OpenTelemetry setup
│   └── server.ts                  # Server setup
├── tests/                         # Test files
│   ├── integration/               # Integration tests by domain
│   │   ├── {domain}/{feature}.test.ts
│   ├── unit/                      # Unit tests
│   └── utils/                     # Test utilities
│       ├── keycloak-auth.ts       # Real Keycloak auth for tests
│       ├── test-helpers.ts        # Test data generators
│       └── trpc-http-client.ts    # TRPC client for E2E
├── migrations/                    # Database migrations (in drizzle/)
├── docs/                         # API documentation
└── package.json
```

## Coding Conventions

### Service Layer Naming

- **Class Names**: `PascalCase` + `Service` suffix, singular (e.g., `UserService`)
- **File Names**: `PascalCase.ts` matching class name (e.g., `UserService.ts`)
- **Location**: `src/resources/{domain}/`
- **Methods**: `camelCase`, verb-first (e.g., `createUser`, `getUserById`, `updateUser`, `deleteUser`)
- **Instance Export**: Singleton instance as `camelCase` (e.g., `export const userService = new UserService();`)

**Example Service (UserService.ts):**

```typescript
export class UserService {
  async createUser(data: CreateUserInput): Promise<User> {
    const [user] = await db.insert(users).values(data).returning();
    return user;
  }

  async getUserById(userId: string): Promise<User | null> {
    const [user] = await db.select().from(users).where(eq(users.id, userId)).limit(1);
    return user || null;
  }

  async getUserByKeycloakId(keycloakUserId: string): Promise<User | null> {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.keycloakUserId, keycloakUserId))
      .limit(1);
    return user || null;
  }
}

export const userService = new UserService();
```

### TRPC Implementation

- **Procedure Files**: `src/resources/{domain}/{domain}.procedures.ts`
- **Router Files**: `src/resources/{domain}/{domain}.router.ts`
- **Router Assembly**: Single main router in `src/lib/trpc/router.ts`
- **Middleware**: `src/lib/trpc/middleware.ts` for auth, validation

**Example Router Setup (router.ts):**

```typescript
import { activityRouter } from '@/resources/activities/activity.router';
import { usersRouter } from '@/resources/users/user.router';
// ... other imports

const baseAppRouter = router({
  health: publicProcedure.query(() => ({ status: 'ok' })),
  activities: activityRouter,
  users: usersRouter,
  // ... other routers
});

export const appRouter = isDev ? devAppRouter : baseAppRouter;
export type AppRouter = typeof baseAppRouter;
```

### Migration Naming

- **Location**: `drizzle/migrations/`
- **Format**: `{number}_{description}.sql`
- **Sequential numbering** with descriptive snake_case names
- **Example**: `0001_fast_vector.sql`

**Example Migration:**

```sql
CREATE TYPE "public"."ops_access_request_status" AS ENUM('pending', 'approved', 'rejected');
ALTER TYPE "public"."user_status" ADD VALUE 'pending_ops_access';
CREATE TABLE "ops_access_requests" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "user_id" uuid NOT NULL,
  "reason" text NOT NULL,
  "status" ops_access_request_status DEFAULT 'pending' NOT NULL,
  "created_at" timestamp DEFAULT now() NOT NULL,
  "updated_at" timestamp DEFAULT now() NOT NULL
);
ALTER TABLE "ops_access_requests" ADD CONSTRAINT "ops_access_requests_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
```

### Test Organization

- **Unit Tests**: `{fileName}.test.ts` next to file or in `__tests__/`
- **Integration Tests**: `tests/integration/{domain}/{feature}.test.ts`
- **E2E Tests**: Use real Keycloak authentication, no mocks
- **Test Utils**: `tests/utils/` with helpers

**Testing Philosophy:**

- E2E tests connect to actual Keycloak instance via password flow
- Integration tests use real services (PostgreSQL, Redis, Mailpit)
- Database transactions for test isolation
- No mocking of external services

### Environment Variables

- **Format**: `SCREAMING_SNAKE_CASE` with `BE_` prefix for backend-specific
- **Examples**:
  ```bash
  BE_PORT=3000
  BE_HOST=0.0.0.0
  BE_NODE_ENV=development
  BE_LOG_LEVEL=debug
  DATABASE_URL=postgresql://...
  KEYCLOAK_BASE_URL=https://keycloak.example.com
  JWT_SECRET=your-secret-key
  JWT_ISSUER=https://api.example.com
  JWT_AUDIENCE=iruka-api
  CORS_ORIGIN=https://app.example.com
  REDIS_URL=redis://localhost:6379
  ```

### Utility Functions

- **Files**: `src/lib/` or `src/util/`, `camelCase.ts`
- **Functions**: `camelCase`, verb-first
- **Examples**: `src/util/env.ts`, `src/util/logger.ts`

### Configuration

- **Files**: `src/config/`, `camelCase.ts`
- **Objects**: `camelCase` + `Config` suffix
- **Example**: `databaseConfig`, `keycloakConfig`

### Error Handling

- **Classes**: `PascalCase` + `Error` suffix (e.g., `UserNotFoundError`)
- **Files**: `src/lib/errors/`
- **Custom TRPC Errors**: In `src/lib/errors/trpc-errors.ts`

## Development Guidelines

### Development Workflow

- **No local npm install**: Everything runs in Docker with hot-reload
- **Setup**: `npm run services:setup` (creates .env, starts all services)
- **Start**: `npm run services:start`
- **Logs**: `npm run services:logs:backend`
- **Restart**: `npm run services:restart`

### Production Deployment

- Uses Kubernetes with optimized bundle via esbuild
- Separate `Dockerfile` for production
- Bundle command: `npm run bundle` (builds + bundles with esbuild)

### Common Commands

```bash
# Development
npm run dev                    # Start with tsx watch
npm run build                  # TypeScript compilation
npm run bundle                 # Production bundle
npm run start                  # Start bundled app

# Testing
npm run test                   # All tests
npm run test:integration       # Integration tests
npm run test:e2e               # E2E tests
npm run test:e2e:browser       # Browser E2E with Playwright

# Quality
npm run lint                   # ESLint
npm run lint:fix               # Auto-fix linting
npm run type-check             # TypeScript check

# Database
npm run db:migrate             # Run migrations (if available)
npm run db:seed                # Seed data (if available)
```

### Server Setup (server.ts)

- **Framework**: Fastify with TRPC plugin
- **Observability**: OpenTelemetry instrumentation
- **Logging**: Pino with custom hooks for request logging
- **CORS**: Configured via environment
- **Scheduled Jobs**: Started on server boot

**Example Server Setup:**

```typescript
import { fastifyTRPCPlugin } from '@trpc/server/adapters/fastify';
import Fastify from 'fastify';
import { appRouter, createContext } from './lib/trpc';

const server = Fastify({
  logger: { level: getRequiredEnv('BE_LOG_LEVEL') },
  disableRequestLogging: true,
});

// Add TRPC
server.register(fastifyTRPCPlugin, {
  prefix: '/trpc',
  trpcOptions: { router: appRouter, createContext },
});

// Custom logging hook
server.addHook('onResponse', (request, reply, done) => {
  request.log.info({
    method: request.method,
    url: request.url,
    statusCode: reply.statusCode,
    durationMs: reply.elapsedTime.toFixed(2),
    userId: request.userId, // Set by TRPC context
  });
  done();
});

server.listen({ port: PORT, host: HOST });
```

### Architecture Patterns

- **Resource-Oriented**: Code organized by business domain
- **Service Layer**: Business logic separate from API
- **Type-Safe**: Full TypeScript with TRPC and Zod validation
- **Dependency Injection**: Services exported as singletons
- **Middleware Pattern**: TRPC middleware for auth/validation

### Key Architectural Decisions

- **Single Router**: All domains in one main router
- **Domain Separation**: Each domain has its own service/router/procedures
- **Real Integration Tests**: No mocks for external services
- **Environment-Based Routing**: Dev router includes test endpoints
- **Instrumentation First**: OpenTelemetry imported early

## Key Files and Locations

- **Main Router**: `src/lib/trpc/router.ts`
- **Server Entry**: `src/server.ts`
- **Database Config**: `src/lib/db/connection.ts`
- **Auth Config**: `src/config/keycloak.ts`
- **Migrations**: `drizzle/migrations/`
- **Tests**: `tests/`
- **Docs**: `docs/api/`
- **Instrumentation**: `src/instrumentation.ts`
- **Jobs**: `src/jobs/scheduler.ts`

## Environment Variables (Complete List)

- `BE_PORT` - Backend port (default: 3000)
- `BE_HOST` - Host to bind to (default: 0.0.0.0)
- `BE_NODE_ENV` - Environment (development/test/production)
- `BE_LOG_LEVEL` - Logging level (debug/info/warn/error)
- `DATABASE_URL` - PostgreSQL connection string
- `KEYCLOAK_BASE_URL` - Keycloak server URL
- `KEYCLOAK_REALM` - Keycloak realm
- `JWT_SECRET`, `JWT_ISSUER`, `JWT_AUDIENCE` - JWT configuration
- `CORS_ORIGIN` - CORS allowed origins
- `REDIS_URL` - Redis connection string
- `MAIL_*` - Email service configuration
- `AWS_*` - AWS services (SES, etc.)
- `OTEL_*` - OpenTelemetry configuration

This summary provides comprehensive details for reusing this backend pattern in other repositories.
