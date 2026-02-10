import { z } from 'zod';

// TODO: Cleanup unused schemas after confirming they are not needed
// TODO: Consider adding more strict validation rules (e.g., password strength, email domain restrictions)
// TODO: Add schema transformations for data sanitization

// Zod schemas for User validation
export const userSchema = z.object({
    _id: z.string(),
    email: z.string().email(),
    firstName: z.string().min(1),
    lastName: z.string().min(1),
    role: z.enum(['user', 'admin']),
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime()
});

export const createUserSchema = z.object({
    email: z.string().email(),
    password: z
        .string()
        .min(6, 'Password must be at least 6 characters long')
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&)'),
    firstName: z.string().min(1),
    lastName: z.string().min(1),
    role: z.enum(['user', 'admin']).optional().default('user')
});

export const userResponseSchema = userSchema;

export const updateProfileSchema = z.object({
    firstName: z.string().min(1).optional(),
    lastName: z.string().min(1).optional(),
    email: z.string().email().optional()
});

export const getUsersSchema = z.object({
    limit: z.number().min(1).max(100).default(10),
    offset: z.number().min(0).default(0)
});

// Input schemas for procedures
export const getProfileInputSchema = z.object({
    userId: z.string()
}); // TODO: Remove if getProfile route is not needed

export const updateProfileInputSchema = z
    .object({
        userId: z.string()
    })
    .merge(updateProfileSchema);

export const deleteUserInputSchema = z.object({
    userId: z.string()
});

// Output schemas for procedures
export const deleteUserOutputSchema = z.object({
    success: z.boolean()
});

export const getUsersOutputSchema = z.array(userResponseSchema);

// Additional input schemas
export const getUserByIdInputSchema = z.object({
    userId: z.string()
});

export const changePasswordInputSchema = z.object({
    currentPassword: z.string().min(1),
    newPassword: z.string().min(6)
}); // TODO: Remove if changePassword route is not implemented

export const updateUserRoleInputSchema = z.object({
    userId: z.string(),
    role: z.enum(['user', 'admin'])
}); // TODO: Remove if updateUserRole route is not needed
