import { publicProcedure } from '@/lib/trpc/trpc';
import { TRPCError } from '@trpc/server';
import { sanitizeUserResponse, sanitizeUsersResponse } from './users.helpers';
import { createUserSchema, deleteUserInputSchema, deleteUserOutputSchema, getUserByIdInputSchema, getUsersOutputSchema, getUsersSchema, updateProfileInputSchema, userResponseSchema } from './users.schemas';
import { UserService } from './users.service';

/**
 * Get paginated list of users (without passwords)
 * TODO: Add admin role check when auth middleware is implemented
 * TODO: Add pagination metadata (total count, hasNextPage, etc.)
 */
export const getUsers = publicProcedure
    .input(getUsersSchema)
    .output(getUsersOutputSchema)
    .query(async ({ input }) => {
        const users = await UserService.getUsers(input.limit, input.offset);
        return sanitizeUsersResponse(users);
    });

/**
 * Delete a user by ID
 * TODO: Add admin role check or self-deletion check
 */
export const deleteUser = publicProcedure
    .input(deleteUserInputSchema)
    .output(deleteUserOutputSchema)
    .mutation(async ({ input }) => {
        const deleted = await UserService.deleteUser(input.userId);

        if (!deleted) {
            throw new TRPCError({
                code: 'NOT_FOUND',
                message: 'User not found'
            });
        }

        return { success: true };
    });
/**
 * Get a single user by ID (without password)
 */
export const getUserById = publicProcedure
    .input(getUserByIdInputSchema)
    .output(userResponseSchema)
    .query(async ({ input }) => {
        const user = await UserService.getUserById(input.userId);

        if (!user) {
            throw new TRPCError({
                code: 'NOT_FOUND',
                message: 'User not found'
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
 * TODO: Add user ownership validation (user can only update their own profile)
 */
export const updateProfile = publicProcedure
    .input(updateProfileInputSchema)
    .output(userResponseSchema)
    .mutation(async ({ input }) => {
        const { userId, ...updateData } = input;
        const user = await UserService.updateUser(userId, updateData);

        if (!user) {
            throw new TRPCError({
                code: 'NOT_FOUND',
                message: 'User not found'
            });
        }

        return sanitizeUserResponse(user);
    });
