import User, { IUser } from '../../lib/db/models/user.model';
import { createError, createUserError, createValidationError, ErrorCode } from '../../lib/errors';
import { isValidObjectId } from '../../lib/helpers/validation';
import { isValidEmail, isValidName, sanitizeUserInput } from './users.helpers';
import { ICreateUserData, IUpdateUserData } from './users.types';

export class UserService {
    /**
     * Create a new user
     * @throws {TRPCError} BAD_REQUEST if email already exists or invalid input
     * @throws {TRPCError} INTERNAL_SERVER_ERROR if database operation fails
     */
    static async createUser(data: ICreateUserData): Promise<IUser> {
        // Sanitize input data
        const sanitizedData = sanitizeUserInput(data);

        // Validate input
        if (!isValidEmail(sanitizedData.email)) {
            throw createValidationError('email', ErrorCode.VALIDATION_EMAIL_INVALID);
        }

        // Validate names
        if (!sanitizedData.firstName || sanitizedData.firstName === '' || !isValidName(sanitizedData.firstName)) {
            throw createValidationError('firstName', ErrorCode.VALIDATION_NAME_INVALID, {
                min: 1,
                max: 50
            });
        }

        if (!sanitizedData.lastName || sanitizedData.lastName === '' || !isValidName(sanitizedData.lastName)) {
            throw createValidationError('lastName', ErrorCode.VALIDATION_NAME_INVALID, {
                min: 1,
                max: 50
            });
        }

        try {
            // Use MongoDB's built-in unique constraint instead of manual check
            // This prevents race conditions
            const user = new User(sanitizedData);
            await user.save();
            return user;
        } catch (error: any) {
            // Handle duplicate key error (email already exists)
            if (error.code === 11000 && error.keyPattern?.email) {
                throw createUserError(ErrorCode.USER_ALREADY_EXISTS, undefined, {
                    email: sanitizedData.email,
                    operation: 'create'
                });
            }

            // Handle Mongoose validation errors
            if (error.name === 'ValidationError') {
                const validationErrors = Object.values(error.errors).map((err: any) => err.message);
                throw createError(
                    ErrorCode.VALIDATION_INVALID_FORMAT,
                    {
                        field: 'user',
                        details: validationErrors.join('; '),
                        validationErrors,
                        category: 'validation'
                    },
                    error,
                    `Validation failed: ${validationErrors.join('; ')}`
                );
            }

            // Handle other database errors
            throw createError(
                ErrorCode.SYS_DATABASE_ERROR,
                {
                    operation: 'createUser',
                    email: sanitizedData.email
                },
                error
            );
        }
    }

    /**
     * Get user by ID
     * @throws {TRPCError} BAD_REQUEST if ID is invalid
     * @throws {TRPCError} INTERNAL_SERVER_ERROR if database operation fails
     */
    static async getUserById(id: string): Promise<IUser | null> {
        if (!isValidObjectId(id)) {
            throw createValidationError('id', ErrorCode.VALIDATION_INVALID_FORMAT, {
                expected: 'MongoDB ObjectId'
            });
        }

        try {
            return await User.findById(id);
        } catch (error) {
            throw createError(
                ErrorCode.SYS_DATABASE_ERROR,
                {
                    operation: 'getUserById',
                    userId: id
                },
                error as Error
            );
        }
    }

    /**
     * Get user by email
     * @throws {TRPCError} INTERNAL_SERVER_ERROR if database operation fails
     */
    /**
     * Update user information
     * @throws {TRPCError} BAD_REQUEST if ID is invalid, email already exists, or invalid input
     * @throws {TRPCError} NOT_FOUND if user doesn't exist
     * @throws {TRPCError} INTERNAL_SERVER_ERROR if database operation fails
     */
    static async updateUser(id: string, data: IUpdateUserData): Promise<IUser | null> {
        if (!isValidObjectId(id)) {
            throw createValidationError('id', ErrorCode.VALIDATION_INVALID_FORMAT, {
                expected: 'MongoDB ObjectId'
            });
        }

        // Sanitize input data
        const sanitizedData = sanitizeUserInput(data);

        // Filter out undefined values and remove password field for security
        const updateData = Object.fromEntries(Object.entries(sanitizedData).filter(([key, value]) => value !== undefined && value !== null && value !== '' && key !== 'password'));

        if (Object.keys(updateData).length === 0) {
            // Nothing to update, return current user
            return this.getUserById(id);
        }

        // Validate email if being updated
        if (updateData.email && typeof updateData.email === 'string' && !isValidEmail(updateData.email)) {
            throw createValidationError('email', ErrorCode.VALIDATION_EMAIL_INVALID);
        }

        // Validate names if being updated
        if (updateData.firstName && typeof updateData.firstName === 'string' && !isValidName(updateData.firstName)) {
            throw createValidationError('firstName', ErrorCode.VALIDATION_NAME_INVALID, {
                min: 1,
                max: 50
            });
        }

        if (updateData.lastName && typeof updateData.lastName === 'string' && !isValidName(updateData.lastName)) {
            throw createValidationError('lastName', ErrorCode.VALIDATION_NAME_INVALID, {
                min: 1,
                max: 50
            });
        }

        // Check email uniqueness if email is being updated
        if (updateData.email && typeof updateData.email === 'string') {
            const existingUser = await User.findOne({
                email: updateData.email.toLowerCase(),
                _id: { $ne: id }
            });
            if (existingUser) {
                throw createUserError(ErrorCode.USER_ALREADY_EXISTS, id, {
                    email: updateData.email,
                    operation: 'update',
                    conflictingUserId: existingUser._id.toString()
                });
            }
        }

        // First check if user exists
        const existingUser = await User.findById(id);
        if (!existingUser) {
            throw createUserError(ErrorCode.USER_NOT_FOUND, id, {
                operation: 'update'
            });
        }

        try {
            // Use findOneAndUpdate with upsert: false to prevent race conditions
            const user = await User.findOneAndUpdate({ _id: id }, updateData, {
                new: true,
                runValidators: true
                // Add atomic check for email uniqueness
                // MongoDB will handle the atomicity
            });

            if (!user) {
                throw createUserError(ErrorCode.USER_NOT_FOUND, id, {
                    operation: 'update'
                });
            }

            return user;
        } catch (error: any) {
            // Handle duplicate key error for email updates
            if (error.code === 11000 && error.keyPattern?.email) {
                throw createUserError(ErrorCode.USER_ALREADY_EXISTS, id, {
                    email: updateData.email,
                    operation: 'update'
                });
            }

            throw createError(
                ErrorCode.SYS_DATABASE_ERROR,
                {
                    operation: 'updateUser',
                    userId: id,
                    updateData: Object.keys(updateData)
                },
                error
            );
        }
    }

    /**
     * Delete user by ID
     * @throws {TRPCError} BAD_REQUEST if ID is invalid
     * @throws {TRPCError} NOT_FOUND if user doesn't exist
     * @throws {TRPCError} INTERNAL_SERVER_ERROR if database operation fails
     */
    static async deleteUser(id: string): Promise<boolean> {
        if (!isValidObjectId(id)) {
            throw createValidationError('id', ErrorCode.VALIDATION_INVALID_FORMAT, {
                expected: 'MongoDB ObjectId'
            });
        }

        // First check if user exists
        const existingUser = await User.findById(id);
        if (!existingUser) {
            throw createUserError(ErrorCode.USER_NOT_FOUND, id, {
                operation: 'delete'
            });
        }

        try {
            const result = await User.findByIdAndDelete(id);
            return !!result;
        } catch (error) {
            throw createError(
                ErrorCode.SYS_DATABASE_ERROR,
                {
                    operation: 'deleteUser',
                    userId: id
                },
                error as Error
            );
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
            throw createError(
                ErrorCode.SYS_DATABASE_ERROR,
                {
                    operation: 'getUsers',
                    pagination: { limit, offset }
                },
                error as Error
            );
        }
    }

    /**
     * Get total count of users
     * @throws {TRPCError} INTERNAL_SERVER_ERROR if database operation fails
     */
}
