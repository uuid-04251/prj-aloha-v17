import User, { IUser } from '@/lib/db/models/user.model';
import { UserService } from '@/resources/users/users.service';
import { createTestUser, createTestUsers } from '../../utils/testHelpers';

describe('UserService - CRUD Operations', () => {
    describe('createUser', () => {
        it('should create a new user successfully', async () => {
            const userData = {
                email: 'john.doe@example.com',
                password: 'SecurePassword123!',
                firstName: 'John',
                lastName: 'Doe',
                role: 'user' as const
            };

            const user = await UserService.createUser(userData);

            expect(user).toBeDefined();
            expect(user.email).toBe(userData.email.toLowerCase());
            expect(user.firstName).toBe(userData.firstName);
            expect(user.lastName).toBe(userData.lastName);
            expect(user.role).toBe(userData.role);
            expect(user.password).not.toBe(userData.password); // Password should be hashed
            expect(user.createdAt).toBeDefined();
            expect(user.updatedAt).toBeDefined();
        });

        it('should create user with default role "user" when role is not specified', async () => {
            const userData = {
                email: 'jane.doe@example.com',
                password: 'Password123!',
                firstName: 'Jane',
                lastName: 'Doe'
            };

            const user = await UserService.createUser(userData);

            expect(user.role).toBe('user');
        });

        it('should create an admin user when role is specified', async () => {
            const userData = {
                email: 'admin@example.com',
                password: 'AdminPass123!',
                firstName: 'Admin',
                lastName: 'User',
                role: 'admin' as const
            };

            const user = await UserService.createUser(userData);

            expect(user.role).toBe('admin');
        });

        it('should throw error when creating user with duplicate email', async () => {
            const userData = {
                email: 'duplicate@example.com',
                password: 'Password123!',
                firstName: 'First',
                lastName: 'User'
            };

            await UserService.createUser(userData);

            await expect(UserService.createUser(userData)).rejects.toThrow('An account with this email already exists');
        });

        it('should convert email to lowercase', async () => {
            const userData = {
                email: 'UPPERCASE@EXAMPLE.COM',
                password: 'Password123!',
                firstName: 'Upper',
                lastName: 'Case'
            };

            const user = await UserService.createUser(userData);

            expect(user.email).toBe('uppercase@example.com');
        });

        it('should hash the password before saving', async () => {
            const userData = {
                email: 'hash-test@example.com',
                password: 'PlainPassword123!',
                firstName: 'Hash',
                lastName: 'Test'
            };

            const user = await UserService.createUser(userData);

            expect(user.password).not.toBe(userData.password);
            expect(user.password.length).toBeGreaterThan(20); // Bcrypt hashes are long
        });
    });

    describe('getUserById', () => {
        it('should retrieve user by valid ID', async () => {
            const createdUser = await createTestUser({
                email: 'getbyid@example.com',
                firstName: 'Get',
                lastName: 'ById'
            });

            const user = await UserService.getUserById(createdUser._id.toString());

            expect(user).toBeDefined();
            expect(user?._id.toString()).toBe(createdUser._id.toString());
            expect(user?.email).toBe(createdUser.email);
            expect(user?.firstName).toBe(createdUser.firstName);
            expect(user?.lastName).toBe(createdUser.lastName);
        });

        it('should return null for non-existent user ID', async () => {
            const fakeId = '507f1f77bcf86cd799439011'; // Valid MongoDB ObjectId format

            const user = await UserService.getUserById(fakeId);

            expect(user).toBeNull();
        });

        it('should throw error for invalid ID format', async () => {
            const invalidId = 'invalid-id-format';

            await expect(UserService.getUserById(invalidId)).rejects.toThrow();
        });
    });

    describe('getUserByEmail', () => {
        it('should retrieve user by email', async () => {
            const createdUser = await createTestUser({
                email: 'findbyemail@example.com',
                firstName: 'Find',
                lastName: 'ByEmail'
            });

            const user = await UserService.getUserByEmail('findbyemail@example.com');

            expect(user).toBeDefined();
            expect(user?._id.toString()).toBe(createdUser._id.toString());
            expect(user?.email).toBe(createdUser.email);
        });

        it('should be case insensitive when searching by email', async () => {
            await createTestUser({
                email: 'caseinsensitive@example.com'
            });

            const user = await UserService.getUserByEmail('CASEINSENSITIVE@EXAMPLE.COM');

            expect(user).toBeDefined();
            expect(user?.email).toBe('caseinsensitive@example.com');
        });

        it('should return null for non-existent email', async () => {
            const user = await UserService.getUserByEmail('nonexistent@example.com');

            expect(user).toBeNull();
        });
    });

    describe('updateUser', () => {
        it('should update user firstName and lastName', async () => {
            const user = await createTestUser({
                email: 'update@example.com',
                firstName: 'Original',
                lastName: 'Name'
            });

            const updateData = {
                firstName: 'Updated',
                lastName: 'NewName'
            };

            const updatedUser = await UserService.updateUser(user._id.toString(), updateData);

            expect(updatedUser).toBeDefined();
            expect(updatedUser?.firstName).toBe(updateData.firstName);
            expect(updatedUser?.lastName).toBe(updateData.lastName);
            expect(updatedUser?.email).toBe(user.email); // Email should remain unchanged
        });

        it('should update only firstName when lastName is not provided', async () => {
            const user = await createTestUser({
                firstName: 'Original',
                lastName: 'Name'
            });

            const updatedUser = await UserService.updateUser(user._id.toString(), {
                firstName: 'UpdatedFirst'
            });

            expect(updatedUser?.firstName).toBe('UpdatedFirst');
            expect(updatedUser?.lastName).toBe('Name'); // Should remain unchanged
        });

        it('should update user email', async () => {
            const user = await createTestUser({
                email: 'oldemail@example.com'
            });

            const updatedUser = await UserService.updateUser(user._id.toString(), {
                email: 'newemail@example.com'
            });

            expect(updatedUser?.email).toBe('newemail@example.com');
        });

        it('should update user role', async () => {
            const user = await createTestUser({
                role: 'user'
            });

            const updatedUser = await UserService.updateUser(user._id.toString(), {
                role: 'admin'
            });

            expect(updatedUser?.role).toBe('admin');
        });

        it('should update updatedAt timestamp', async () => {
            const user = await createTestUser();
            const originalUpdatedAt = user.updatedAt;

            // Wait a bit to ensure timestamp difference
            await new Promise((resolve) => setTimeout(resolve, 10));

            const updatedUser = await UserService.updateUser(user._id.toString(), {
                firstName: 'Updated'
            });

            expect(updatedUser?.updatedAt.getTime()).toBeGreaterThan(originalUpdatedAt.getTime());
        });

        it('should throw error when updating non-existent user', async () => {
            const fakeId = '507f1f77bcf86cd799439011';

            await expect(
                UserService.updateUser(fakeId, {
                    firstName: 'Test'
                })
            ).rejects.toThrow('User not found');
        });

        it('should throw error for invalid user ID', async () => {
            await expect(
                UserService.updateUser('invalid-id', {
                    firstName: 'Test'
                })
            ).rejects.toThrow();
        });

        it('should not update when all fields are undefined', async () => {
            const user = await createTestUser({
                firstName: 'Original'
            });

            const updatedUser = await UserService.updateUser(user._id.toString(), {});

            expect(updatedUser?.firstName).toBe('Original');
        });
    });

    describe('deleteUser', () => {
        it('should delete user successfully', async () => {
            const user = await createTestUser({
                email: 'delete@example.com'
            });

            const result = await UserService.deleteUser(user._id.toString());

            expect(result).toBe(true);

            // Verify user is actually deleted
            const deletedUser = await User.findById(user._id);
            expect(deletedUser).toBeNull();
        });

        it('should throw error when deleting non-existent user', async () => {
            const fakeId = '507f1f77bcf86cd799439011';

            await expect(UserService.deleteUser(fakeId)).rejects.toThrow('User not found');
        });

        it('should throw error for invalid user ID', async () => {
            await expect(UserService.deleteUser('invalid-id')).rejects.toThrow();
        });
    });

    describe('getUsers', () => {
        it('should retrieve all users with default pagination', async () => {
            await createTestUsers(5);

            const users = await UserService.getUsers();

            expect(users).toHaveLength(5);
            expect(Array.isArray(users)).toBe(true);
        });

        it('should limit the number of returned users', async () => {
            await createTestUsers(10);

            const users = await UserService.getUsers(5);

            expect(users).toHaveLength(5);
        });

        it('should apply offset for pagination', async () => {
            const createdUsers = await createTestUsers(5);

            const users = await UserService.getUsers(10, 2);

            expect(users).toHaveLength(3);
            // Users are sorted by createdAt descending, so check last 3 users
            expect(users[0]!._id.toString()).toBe(createdUsers[2]!._id.toString());
        });

        it('should return empty array when no users exist', async () => {
            const users = await UserService.getUsers();

            expect(users).toHaveLength(0);
            expect(Array.isArray(users)).toBe(true);
        });

        it('should return users sorted by createdAt in descending order', async () => {
            const user1 = await createTestUser({ email: 'first@example.com' });
            await new Promise((resolve) => setTimeout(resolve, 10));
            const user2 = await createTestUser({ email: 'second@example.com' });
            await new Promise((resolve) => setTimeout(resolve, 10));
            const user3 = await createTestUser({ email: 'third@example.com' });

            const users = await UserService.getUsers();

            expect(users[0]!._id.toString()).toBe(user3._id.toString());
            expect(users[1]!._id.toString()).toBe(user2._id.toString());
            expect(users[2]!._id.toString()).toBe(user1._id.toString());
        });

        it('should handle limit larger than available users', async () => {
            await createTestUsers(3);

            const users = await UserService.getUsers(100);

            expect(users).toHaveLength(3);
        });

        it('should handle offset beyond available users', async () => {
            await createTestUsers(3);

            const users = await UserService.getUsers(10, 10);

            expect(users).toHaveLength(0);
        });
    });

    describe('getUserCount', () => {
        it('should return correct count of users', async () => {
            await createTestUsers(7);

            const count = await UserService.getUserCount();

            expect(count).toBe(7);
        });

        it('should return 0 when no users exist', async () => {
            const count = await UserService.getUserCount();

            expect(count).toBe(0);
        });
    });

    describe('Edge cases and data integrity', () => {
        it('should preserve all user fields during CRUD operations', async () => {
            const userData = {
                email: 'complete@example.com',
                password: 'Password123!',
                firstName: 'Complete',
                lastName: 'User',
                role: 'admin' as const
            };

            const createdUser = await UserService.createUser(userData);
            const retrievedUser = await UserService.getUserById(createdUser._id.toString());

            expect(retrievedUser?.email).toBe(userData.email);
            expect(retrievedUser?.firstName).toBe(userData.firstName);
            expect(retrievedUser?.lastName).toBe(userData.lastName);
            expect(retrievedUser?.role).toBe(userData.role);
        });

        it('should handle concurrent user creation', async () => {
            const promises = Array.from({ length: 5 }, (_, i) =>
                createTestUser({
                    email: `concurrent${i}@example.com`
                })
            );

            const users = await Promise.all(promises);

            expect(users).toHaveLength(5);
            expect(new Set(users.map((u: IUser) => u._id.toString())).size).toBe(5);
        });

        it('should properly validate password comparison after creation', async () => {
            const userData = {
                email: 'password-test@example.com',
                password: 'MySecretPassword123!',
                firstName: 'Password',
                lastName: 'Test'
            };

            const user = await UserService.createUser(userData);

            // Test password comparison method
            const isMatch = await user.comparePassword('MySecretPassword123!');
            const isNotMatch = await user.comparePassword('wrongPassword');

            expect(isMatch).toBe(true);
            expect(isNotMatch).toBe(false);
        });
    });
});
