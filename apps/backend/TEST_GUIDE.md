# Quick Test Guide

## 🚀 Quick Start

```bash
cd apps/backend
pnpm test
```

## 📋 Available Commands

| Command                   | Description                    |
| ------------------------- | ------------------------------ |
| `pnpm test`               | Run all tests                  |
| `pnpm test:watch`         | Run tests in watch mode        |
| `pnpm test:coverage`      | Run tests with coverage report |
| `pnpm test users.service` | Run specific test file         |

## ✅ Test Results Summary

- **Total Tests**: 62
- **User Model Tests**: 27
- **User Service Tests**: 35
- **Status**: ✅ All Passing
- **Coverage**:
    - user.model.ts: 93.75%
    - users.service.ts: 91.17%

## 📁 Test Files

```
tests/
├── integration/
│   └── users/
│       ├── user.model.test.ts       # Model validation tests
│       └── users.service.test.ts    # CRUD operation tests
└── utils/
    ├── setup.ts                      # MongoDB Memory Server setup
    └── testHelpers.ts                # Test utility functions
```

## 🎯 What's Tested

### User Model (27 tests)

✅ Schema validation (required fields, email format, password length)  
✅ Email handling (lowercase, trimming, uniqueness)  
✅ Password hashing (automatic hashing, no rehash if unchanged)  
✅ Password comparison (bcrypt validation)  
✅ Timestamps (createdAt, updatedAt)  
✅ Database indexes

### User Service (35 tests)

✅ **CREATE** - User creation with validation  
✅ **READ** - Get by ID, email, list with pagination  
✅ **UPDATE** - Partial updates, field preservation  
✅ **DELETE** - User removal  
✅ Edge cases (concurrent creation, duplicate emails)

## 🔧 Configuration

**Test Environment**: Node.js  
**Database**: MongoDB Memory Server (in-memory)  
**Framework**: Jest + ts-jest  
**Timeout**: 30 seconds

## 📊 Coverage Details

```
user.model.ts     ████████████████████░ 93.75%
users.service.ts  ████████████████████░ 91.17%
```

Uncovered lines in users.service.ts:

- Line 52: Error catch block
- Line 84: Error catch block
- Line 93: Error catch block

## 🐛 Running Specific Tests

```bash
# Run only model tests
pnpm test user.model

# Run only service tests
pnpm test users.service

# Run tests matching a pattern
pnpm test createUser

# Run tests in a specific file
pnpm test tests/integration/users/user.model.test.ts
```

## 📝 Adding New Tests

1. Create test file in `tests/integration/`
2. Import utilities from `tests/utils/testHelpers`
3. Use `createTestUser()` for test data
4. Follow AAA pattern (Arrange, Act, Assert)

Example:

```typescript
import { UserService } from '@/resources/users/users.service';
import { createTestUser } from '../../utils/testHelpers';

describe('New Feature', () => {
    it('should do something', async () => {
        const user = await createTestUser();
        const result = await UserService.method(user._id);
        expect(result).toBeDefined();
    });
});
```

## 🎉 Success!

All user CRUD operations are fully tested and working correctly!
