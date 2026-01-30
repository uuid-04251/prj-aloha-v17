# Backend Testing Documentation

## Overview

This testing suite provides comprehensive test coverage for the backend API, focusing on user CRUD operations using Jest and MongoDB Memory Server.

## Test Structure

```
apps/backend/
├── tests/
│   ├── integration/
│   │   └── users/
│   │       ├── users.service.test.ts   # UserService CRUD tests
│   │       └── user.model.test.ts      # User model validation tests
│   └── utils/
│       ├── setup.ts                     # Test environment setup
│       └── testHelpers.ts               # Test utility functions
└── jest.config.js                       # Jest configuration
```

## Running Tests

### Run all tests

```bash
cd apps/backend
pnpm test
```

### Run tests in watch mode

```bash
pnpm test:watch
```

### Run tests with coverage

```bash
pnpm test:coverage
```

### Run specific test file

```bash
pnpm test users.service.test
```

## Test Coverage

### User Model Tests (27 tests)

- Schema validation (11 tests)
    - Required fields validation
    - Email format validation
    - Password length validation
    - Role enum validation
- Email handling (3 tests)
    - Lowercase conversion
    - Trimming whitespace
    - Unique constraint
- Name field handling (2 tests)
    - First name trimming
    - Last name trimming
- Password hashing (3 tests)
    - Hash on save
    - No rehash if unchanged
    - Rehash when modified
- Password comparison (4 tests)
    - Correct password
    - Incorrect password
    - Empty password
    - Case sensitivity
- Timestamps (3 tests)
    - Auto-creation
    - Update on modification
    - CreatedAt immutability
- Database indexes (1 test)

### User Service Tests (35 tests)

- **createUser** (6 tests)
    - Successful creation
    - Default role assignment
    - Admin role creation
    - Duplicate email prevention
    - Email lowercase conversion
    - Password hashing verification
- **getUserById** (3 tests)
    - Valid ID retrieval
    - Non-existent ID handling
    - Invalid ID format handling
- **getUserByEmail** (3 tests)
    - Email retrieval
    - Case-insensitive search
    - Non-existent email handling
- **updateUser** (8 tests)
    - Name updates
    - Partial updates
    - Email updates
    - Role updates
    - Timestamp updates
    - Non-existent user handling
    - Invalid ID handling
    - Empty update handling
- **deleteUser** (3 tests)
    - Successful deletion
    - Non-existent user handling
    - Invalid ID handling
- **getUsers** (7 tests)
    - Default pagination
    - Limit application
    - Offset application
    - Empty result handling
    - Sort order verification
    - Large limit handling
    - Large offset handling
- **getUserCount** (2 tests)
    - Correct count
    - Zero count
- **Edge cases** (3 tests)
    - Field preservation
    - Concurrent creation
    - Password comparison

## Test Utilities

### setup.ts

Configures MongoDB Memory Server for isolated test database:

- Creates in-memory MongoDB before tests
- Clears collections after each test
- Tears down database after all tests

### testHelpers.ts

Provides utility functions:

- `createTestUser()` - Create test user with default/custom data
- `createTestUsers(count)` - Create multiple test users
- `sanitizeUser()` - Strip sensitive fields for comparison
- `wait(ms)` - Async delay utility

## Best Practices

### Test Isolation

- Each test runs in a clean database state
- Collections are cleared after every test
- No test dependencies on execution order

### Test Data

- Unique emails using timestamps
- Predictable test data structure
- Proper cleanup after tests

### Assertions

- Clear, descriptive test names
- Comprehensive edge case coverage
- Positive and negative test cases

### Performance

- MongoDB Memory Server for fast tests
- Parallel test execution
- 30-second timeout for slow operations

## Configuration

### jest.config.js

```javascript
{
  preset: 'ts-jest',
  testEnvironment: 'node',
  testTimeout: 30000,
  setupFilesAfterEnv: ['<rootDir>/tests/utils/setup.ts'],
  moduleNameMapper: { '^@/(.*)$': '<rootDir>/src/$1' }
}
```

### Coverage Configuration

- Collects coverage from `src/**/*.ts`
- Excludes type definitions and schemas
- Excludes server entry point

## Writing New Tests

### Example Test Structure

```typescript
import { UserService } from '@/resources/users/users.service';
import { createTestUser } from '../../utils/testHelpers';

describe('Feature Name', () => {
    describe('method name', () => {
        it('should do something specific', async () => {
            // Arrange
            const testData = {
                /* ... */
            };

            // Act
            const result = await UserService.method(testData);

            // Assert
            expect(result).toBeDefined();
            expect(result.field).toBe(expected);
        });
    });
});
```

## Troubleshooting

### Common Issues

**MongoDB Memory Server connection timeout**

- Increase `testTimeout` in jest.config.js
- Check system resources

**Duplicate key errors**

- Ensure unique emails in test data
- Verify afterEach cleanup is working

**Module resolution errors**

- Check `moduleNameMapper` in jest.config.js
- Verify tsconfig.json paths configuration

## CI/CD Integration

Tests are designed to run in CI/CD pipelines:

```yaml
- name: Run tests
  run: |
      cd apps/backend
      pnpm install
      pnpm test:coverage
```

## Future Enhancements

- [ ] Add authentication/authorization tests
- [ ] Add API endpoint integration tests
- [ ] Add performance/load tests
- [ ] Add E2E tests with real HTTP requests
- [ ] Implement snapshot testing
- [ ] Add mutation testing

## Test Results

Current status: ✅ **62 tests passing**

- User Model: 27 tests
- User Service: 35 tests
- Coverage: High (all CRUD operations covered)
