# Aloha Admin Authentication Setup

## Overview

The Aloha admin panel now has a complete authentication system with login/logout functionality, route protection, and admin account seeding.

## Admin Account

A default admin account has been created with the following credentials:

- **Email**: admin@aloha.com
- **Password**: Admin123456!
- **Role**: admin

## Getting Started

### 1. Start MongoDB

Make sure MongoDB is running on your system:

```bash
brew services start mongodb/brew/mongodb-community
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Start Backend

```bash
cd apps/backend
npm run dev
```

### 4. Start Frontend

```bash
cd apps/admin
npm run dev
```

### 5. Access Admin Panel

Open [http://localhost:3000](http://localhost:3000) and login with the admin credentials above.

## Features Implemented

### Authentication

- ✅ JWT-based authentication
- ✅ Password hashing with bcrypt
- ✅ Login/logout functionality
- ✅ Route protection middleware
- ✅ Admin role validation

### User Management

- ✅ Admin account seeding from environment variables
- ✅ User model with validation (strong passwords required)
- ✅ Role-based access control

### API

- ✅ tRPC integration for type-safe API calls
- ✅ Zod validation schemas
- ✅ Error handling and response formatting

### Frontend

- ✅ Next.js 16 with TypeScript
- ✅ Clean login form (removed test user creation)
- ✅ Protected routes
- ✅ Authentication state management

## Environment Variables

The following environment variables are configured in `apps/backend/.env`:

```env
# Database
MONGODB_URI=mongodb://localhost:27017/aloha

# JWT
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRES_IN=7d

# CORS
CORS_ORIGIN=http://localhost:3000

# Admin Account (for seeding)
ADMIN_EMAIL=admin@aloha.com
ADMIN_PASSWORD=Admin123456!
ADMIN_FIRST_NAME=Admin
ADMIN_LAST_NAME=User
```

## Scripts

### Backend Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run seed-admin` - Seed admin account from environment variables
- `npm run test` - Run tests
- `npm run lint` - Run ESLint

### Frontend Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run test` - Run tests

## Security Notes

- Passwords must be at least 12 characters long
- Passwords must contain uppercase, lowercase, numbers, and special characters
- JWT tokens expire after 7 days
- Admin routes are protected by authentication middleware
- CORS is configured for localhost:3000 only

## Next Steps

1. Update admin credentials in production environment
2. Configure proper MongoDB connection string for production
3. Set up proper JWT secrets for production
4. Implement user registration functionality if needed
5. Add password reset functionality
6. Implement user profile management</content>
   <parameter name="filePath">/Users/MAC/Desktop/lamdd/aloha/prj-aloha-v17/AUTHENTICATION_README.md
