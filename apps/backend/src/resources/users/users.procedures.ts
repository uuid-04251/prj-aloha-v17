import { createUserError, ErrorCode } from '@/lib/errors';
import { adminProcedure, protectedProcedure, publicProcedure } from '@/lib/trpc/trpc';
import { sanitizeUserResponse, sanitizeUsersResponse } from './users.helpers';
import { createUserSchema, deleteUserInputSchema, deleteUserOutputSchema, getUserByIdInputSchema, getUsersOutputSchema, getUsersSchema, updateProfileInputSchema, userResponseSchema } from './users.schemas';
import { UserService } from './users.service';

/**
 * Get paginated list of users (without passwords)
 * Requires authentication
 */
export const getUsers = protectedProcedure
    .input(getUsersSchema)
    .output(getUsersOutputSchema)
    .query(async ({ input }) => {
        const users = await UserService.getUsers(input.limit, input.offset);
        return sanitizeUsersResponse(users);
    });

/**
 * Delete a user by ID
 * Requires admin role
 */
export const deleteUser = adminProcedure
    .input(deleteUserInputSchema)
    .output(deleteUserOutputSchema)
    .mutation(async ({ input }) => {
        const deleted = await UserService.deleteUser(input.userId);

        if (!deleted) {
            throw createUserError(ErrorCode.USER_NOT_FOUND, input.userId, {
                operation: 'delete'
            });
        }

        return { success: true };
    });
/**
 * Get a single user by ID (without password)
 * Requires authentication - users can only view their own profile or admins can view any
 */
export const getUserById = protectedProcedure
    .input(getUserByIdInputSchema)
    .output(userResponseSchema)
    .query(async ({ input, ctx }) => {
        const authUser = (ctx as any).user;

        // Users can only view their own profile unless they are admin
        if (authUser.userId !== input.userId && authUser.role !== 'admin') {
            throw createUserError(ErrorCode.USER_ACCESS_DENIED, input.userId, {
                requestedBy: authUser.userId,
                operation: 'read'
            });
        }

        const user = await UserService.getUserById(input.userId);

        if (!user) {
            throw createUserError(ErrorCode.USER_NOT_FOUND, input.userId, {
                operation: 'read'
            });
        }

        return sanitizeUserResponse(user);
    });

/**
 * Create a new user
 */
export const createUser = publicProcedure
    .input(createUserSchema)
    .output(userResponseSchema)
    .mutation(async ({ input }) => {
        const user = await UserService.createUser(input);
        return sanitizeUserResponse(user);
    });

/**
 * Update user profile
 * Users can only update their own profile unless they are admin
 */
export const updateProfile = protectedProcedure
    .input(updateProfileInputSchema)
    .output(userResponseSchema)
    .mutation(async ({ input, ctx }) => {
        const { userId, ...updateData } = input;
        const authUser = (ctx as any).user;

        // Check ownership: user can only update their own profile unless admin
        if (authUser.userId !== userId && authUser.role !== 'admin') {
            throw createUserError(ErrorCode.USER_ACCESS_DENIED, userId, {
                requestedBy: authUser.userId,
                operation: 'update'
            });
        }

        const user = await UserService.updateUser(userId, updateData);

        if (!user) {
            throw createUserError(ErrorCode.USER_NOT_FOUND, userId, {
                operation: 'update'
            });
        }

        return sanitizeUserResponse(user);
    });
