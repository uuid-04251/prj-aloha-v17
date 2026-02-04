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

/**
 * Sanitize and validate user input data
 * @param data - Raw input data
 * @returns Sanitized data
 */
export function sanitizeUserInput(data: any): any {
    const sanitized = { ...data };

    // Trim string fields
    if (sanitized.email) sanitized.email = sanitized.email.trim().toLowerCase();
    if (sanitized.firstName) sanitized.firstName = sanitized.firstName.trim();
    if (sanitized.lastName) sanitized.lastName = sanitized.lastName.trim();

    // Remove any potentially dangerous fields
    delete sanitized._id;
    delete sanitized.createdAt;
    delete sanitized.updatedAt;
    delete sanitized.__v;

    return sanitized;
}

/**
 * Validate email format
 * @param email - Email string to validate
 * @returns True if valid email format
 */
export function isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email) && email.length <= 254; // RFC 5321 limit
}

/**
 * Validate name fields (firstName, lastName)
 * @param name - Name string to validate
 * @returns True if valid name
 */
export function isValidName(name: string): boolean {
    return name.length >= 1 && name.length <= 50 && /^[a-zA-Z\s\-']+$/.test(name);
}
