import User, { IUser } from '@/lib/db/models/user.model';
import { isValidObjectId } from '@/lib/helpers/validation';
import { TRPCError } from '@trpc/server';
import { ICreateUserData, IUpdateUserData } from './users.types';

export class UserService {
    /**
     * Create a new user
     * @throws {TRPCError} BAD_REQUEST if email already exists
     * @throws {TRPCError} INTERNAL_SERVER_ERROR if database operation fails
     */
    static async createUser(data: ICreateUserData): Promise<IUser> {
        const existingUser = await User.findOne({ email: data.email.toLowerCase() });
        if (existingUser) {
            throw new TRPCError({
                code: 'BAD_REQUEST',
                message: 'User with this email already exists'
            });
        }

        try {
            const user = new User(data);
            await user.save();
            return user;
        } catch (error) {
            throw new TRPCError({
                code: 'INTERNAL_SERVER_ERROR',
                message: 'Failed to create user',
                cause: error
            });
        }
    }

    /**
     * Get user by ID
     * @throws {TRPCError} BAD_REQUEST if ID is invalid
     * @throws {TRPCError} INTERNAL_SERVER_ERROR if database operation fails
     */
    static async getUserById(id: string): Promise<IUser | null> {
        if (!isValidObjectId(id)) {
            throw new TRPCError({
                code: 'BAD_REQUEST',
                message: 'Invalid user ID format'
            });
        }

        try {
            return await User.findById(id);
        } catch (error) {
            throw new TRPCError({
                code: 'INTERNAL_SERVER_ERROR',
                message: 'Failed to get user',
                cause: error
            });
        }
    }

    /**
     * Get user by email
     * @throws {TRPCError} INTERNAL_SERVER_ERROR if database operation fails
     */
    static async getUserByEmail(email: string): Promise<IUser | null> {
        try {
            return await User.findOne({ email: email.toLowerCase() });
        } catch (error) {
            throw new TRPCError({
                code: 'INTERNAL_SERVER_ERROR',
                message: 'Failed to get user by email',
                cause: error
            });
        }
    }

    /**
     * Update user information
     * @throws {TRPCError} BAD_REQUEST if ID is invalid or email already exists
     * @throws {TRPCError} NOT_FOUND if user doesn't exist
     * @throws {TRPCError} INTERNAL_SERVER_ERROR if database operation fails
     */
    static async updateUser(id: string, data: IUpdateUserData): Promise<IUser | null> {
        if (!isValidObjectId(id)) {
            throw new TRPCError({
                code: 'BAD_REQUEST',
                message: 'Invalid user ID format'
            });
        }

        // Filter out undefined values and remove password field for security
        const updateData = Object.fromEntries(Object.entries(data).filter(([key, value]) => value !== undefined && key !== 'password'));

        if (Object.keys(updateData).length === 0) {
            // Nothing to update, return current user
            return this.getUserById(id);
        }

        // Check email uniqueness if email is being updated
        if (updateData.email) {
            const existingUser = await User.findOne({
                email: updateData.email.toLowerCase(),
                _id: { $ne: id }
            });
            if (existingUser) {
                throw new TRPCError({
                    code: 'BAD_REQUEST',
                    message: 'Email already in use by another user'
                });
            }
        }

        try {
            const user = await User.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });

            if (!user) {
                throw new TRPCError({
                    code: 'NOT_FOUND',
                    message: 'User not found'
                });
            }

            return user;
        } catch (error) {
            if (error instanceof TRPCError) {
                throw error;
            }
            throw new TRPCError({
                code: 'INTERNAL_SERVER_ERROR',
                message: 'Failed to update user',
                cause: error
            });
        }
    }

    /**
     * Delete user by ID
     * @throws {TRPCError} BAD_REQUEST if ID is invalid
     * @throws {TRPCError} INTERNAL_SERVER_ERROR if database operation fails
     */
    static async deleteUser(id: string): Promise<boolean> {
        if (!isValidObjectId(id)) {
            throw new TRPCError({
                code: 'BAD_REQUEST',
                message: 'Invalid user ID format'
            });
        }

        try {
            const result = await User.findByIdAndDelete(id);
            return !!result;
        } catch (error) {
            throw new TRPCError({
                code: 'INTERNAL_SERVER_ERROR',
                message: 'Failed to delete user',
                cause: error
            });
        }
    }

    /**
     * Get paginated list of users
     * @throws {TRPCError} INTERNAL_SERVER_ERROR if database operation fails
     */
    static async getUsers(limit: number = 10, offset: number = 0): Promise<IUser[]> {
        try {
            return await User.find()
                .select('-password -__v') // Exclude password and version key for security
                .sort({ createdAt: -1 })
                .limit(limit)
                .skip(offset)
                .lean(false); // Return Mongoose documents for method access
        } catch (error) {
            throw new TRPCError({
                code: 'INTERNAL_SERVER_ERROR',
                message: 'Failed to get users',
                cause: error
            });
        }
    }

    /**
     * Get total count of users
     * @throws {TRPCError} INTERNAL_SERVER_ERROR if database operation fails
     */
    static async getUserCount(): Promise<number> {
        try {
            return await User.countDocuments();
        } catch (error) {
            throw new TRPCError({
                code: 'INTERNAL_SERVER_ERROR',
                message: 'Failed to get user count',
                cause: error
            });
        }
    }
}
