import { IUser } from '@/lib/db/models/user.model';
import { UserService } from '@/resources/users/users.service';

/**
 * Create a test user with default or custom data
 */
export async function createTestUser(
    overrides: Partial<{
        email: string;
        password: string;
        firstName: string;
        lastName: string;
        role: 'user' | 'admin';
    }> = {}
): Promise<IUser> {
    const defaultUser = {
        email: `test-${Date.now()}@example.com`,
        password: 'Password123!',
        firstName: 'Test',
        lastName: 'User',
        role: 'user' as const,
        ...overrides
    };

    return await UserService.createUser(defaultUser);
}

/**
 * Create multiple test users
 */
export async function createTestUsers(count: number): Promise<IUser[]> {
    const users: IUser[] = [];
    const names = ['John', 'Jane', 'Bob', 'Alice', 'Charlie', 'Diana', 'Eve', 'Frank', 'Grace', 'Henry'];

    for (let i = 0; i < count; i++) {
        const user = await createTestUser({
            email: `test-user-${i}-${Date.now()}@example.com`,
            firstName: names[i % names.length] || 'John',
            lastName: `User`,
            password: 'Password123!'
        });
        users.push(user);
    }

    return users;
}

/**
 * Strip password and internal fields from user object for comparison
 */
export function sanitizeUser(user: IUser | null): Record<string, unknown> | null {
    if (!user) return null;

    const { password: _password, __v, ...sanitized } = user.toObject();
    return {
        ...sanitized,
        _id: sanitized._id.toString(),
        createdAt: sanitized.createdAt.toISOString(),
        updatedAt: sanitized.updatedAt.toISOString()
    };
}

/**
 * Wait for a specified time (useful for testing time-based features)
 */
export function wait(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
