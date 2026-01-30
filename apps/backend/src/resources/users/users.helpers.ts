import { IUser } from '@/lib/db/models/user.model';
import { IUserResponseData } from './users.types';

/**
 * Sanitize user data for API responses (remove password and internal fields)
 * @param user - Mongoose user document
 * @returns Sanitized user data safe for client consumption
 */
export function sanitizeUserResponse(user: IUser): IUserResponseData {
    const userObj = user.toObject();

    return {
        _id: userObj._id.toString(),
        email: userObj.email,
        firstName: userObj.firstName,
        lastName: userObj.lastName,
        role: userObj.role,
        createdAt: userObj.createdAt.toISOString(),
        updatedAt: userObj.updatedAt.toISOString()
    };
}

/**
 * Sanitize multiple users for API responses
 * @param users - Array of Mongoose user documents
 * @returns Array of sanitized user data
 */
export function sanitizeUsersResponse(users: IUser[]): IUserResponseData[] {
    return users.map((user) => sanitizeUserResponse(user));
}
