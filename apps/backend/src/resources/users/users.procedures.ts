import { z } from 'zod';
import { publicProcedure } from '@/lib/trpc/trpc';
import { deleteUserInputSchema, deleteUserOutputSchema, getUsersOutputSchema, getUsersSchema, updateProfileInputSchema, userResponseSchema, getUserByIdInputSchema } from './users.schemas';
import { UserService } from './users.service';

// TODO: Implement custom error handling with TRPC error formatter
// TODO: Add rate limiting for user operations
// TODO: Consider adding input sanitization middleware
// TODO: Add logging for user operations (create, update, delete)

// TODO: Replace with protectedProcedure once auth middleware is implemented
export const getUsers = publicProcedure
    .input(getUsersSchema)
    .output(getUsersOutputSchema)
    .query(async ({ input }) => {
        // TODO: Add admin role check when middleware is implemented
        // TODO: Add pagination metadata (total count, hasNextPage, etc.)
        const users = await UserService.getUsers(input.limit, input.offset);
        // Return users without passwords
        return users.map((user) => {
            const { password: _, ...userData } = user.toObject();
            return userData;
        });
    });

// TODO: Replace with protectedProcedure once auth middleware is implemented
export const deleteUser = publicProcedure
    .input(deleteUserInputSchema)
    .output(deleteUserOutputSchema)
    .mutation(async ({ input }) => {
        // TODO: Add admin role check or self-deletion check
        const deleted = await UserService.deleteUser(input.userId);
        if (!deleted) {
            throw new Error('User not found');
        }
        return { success: true };
    });
// TODO: Replace with protectedProcedure once auth middleware is implemented
export const getUserById = publicProcedure
    .input(getUserByIdInputSchema)
    .output(userResponseSchema)
    .query(async ({ input }) => {
        const user = await UserService.getUserById(input.userId);
        if (!user) {
            throw new Error('User not found');
        }
        // Return user data without password
        const { password: _, ...userData } = user.toObject();
        return userData;
    });

// TODO: Replace with protectedProcedure once auth middleware is implemented
export const createUser = publicProcedure
    .input(
        z.object({
            email: z.string().email(),
            password: z.string().min(6),
            firstName: z.string().min(1),
            lastName: z.string().min(1),
            role: z.enum(['user', 'admin']).optional().default('user')
        })
    )
    .output(userResponseSchema)
    .mutation(async ({ input }) => {
        // TODO: Add admin role check when middleware is implemented
        // TODO: Improve duplicate email error handling with specific error codes
        // TODO: Add email verification workflow
        const user = await UserService.createUser(input);
        // Return user data without password
        const { password: _, ...userData } = user.toObject();
        return userData;
    });

// TODO: Replace with protectedProcedure once auth middleware is implemented
export const updateProfile = publicProcedure
    .input(updateProfileInputSchema)
    .output(userResponseSchema)
    .mutation(async ({ input }) => {
        // TODO: Add user ownership validation (user can only update their own profile)
        // TODO: Add email uniqueness validation when updating email
        // TODO: Consider adding update history/audit trail
        const { userId, ...updateData } = input;
        const user = await UserService.updateUser(userId, updateData);
        if (!user) {
            throw new Error('User not found');
        }
        // Return updated user data without password
        const { password: _, ...userData } = user.toObject();
        return userData;
    });
