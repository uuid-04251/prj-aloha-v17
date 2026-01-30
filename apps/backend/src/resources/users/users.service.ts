import { z } from 'zod';
import User, { IUser } from '@/lib/db/models/user.model';

export interface CreateUserData {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    role?: 'user' | 'admin';
}

/** @typedef {UpdateUserData} - Interface for updating user data */
export interface UpdateUserData {
    firstName?: string | undefined;
    lastName?: string | undefined;
    email?: string | undefined;
    role?: 'user' | 'admin' | undefined;
}

export class UserService {
    // TODO: Add input validation using Zod schemas for better type safety
    // TODO: Implement proper error handling with custom error classes
    // TODO: Add caching layer for frequently accessed users
    // TODO: Consider adding soft delete functionality instead of hard delete
    static async createUser(data: CreateUserData): Promise<IUser> {
        try {
            const existingUser = await User.findOne({ email: data.email });
            if (existingUser) {
                throw new Error('User with this email already exists');
            }

            const user = new User(data);
            await user.save();
            return user;
        } catch (error) {
            throw new Error(`Failed to create user: ${(error as Error).message}`);
        }
    }

    static async getUserById(id: string): Promise<IUser | null> {
        try {
            return await User.findById(id);
        } catch (error) {
            throw new Error(`Failed to get user: ${(error as Error).message}`);
        }
    }

    static async getUserByEmail(email: string): Promise<IUser | null> {
        try {
            return await User.findOne({ email: email.toLowerCase() });
        } catch (error) {
            throw new Error(`Failed to get user by email: ${(error as Error).message}`);
        }
    }

    static async updateUser(id: string, data: UpdateUserData): Promise<IUser | null> {
        try {
            // Filter out undefined values
            const updateData = Object.fromEntries(Object.entries(data).filter(([_, value]) => value !== undefined));

            const user = await User.findByIdAndUpdate(id, { ...updateData, updatedAt: new Date() }, { new: true, runValidators: true });
            if (!user) {
                throw new Error('User not found');
            }
            return user;
        } catch (error) {
            throw new Error(`Failed to update user: ${(error as Error).message}`);
        }
    }

    static async deleteUser(id: string): Promise<boolean> {
        try {
            const result = await User.findByIdAndDelete(id);
            return !!result;
        } catch (error) {
            throw new Error(`Failed to delete user: ${(error as Error).message}`);
        }
    }

    static async getUsers(limit: number = 10, offset: number = 0): Promise<IUser[]> {
        try {
            return await User.find().sort({ createdAt: -1 }).limit(limit).skip(offset);
        } catch (error) {
            throw new Error(`Failed to get users: ${(error as Error).message}`);
        }
    }

    static async getUserCount(): Promise<number> {
        // TODO: Remove this method if not needed, or implement in router if pagination requires total count
        try {
            return await User.countDocuments();
        } catch (error) {
            throw new Error(`Failed to get user count: ${(error as Error).message}`);
        }
    }
}
