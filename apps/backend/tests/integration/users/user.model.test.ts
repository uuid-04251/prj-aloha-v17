import User from '@/lib/db/models/user.model';
import { createTestUser } from '../../utils/testHelpers';

describe('User Model', () => {
    describe('Schema validation', () => {
        it('should create a valid user with all required fields', async () => {
            const userData = {
                email: 'valid@example.com',
                password: 'Password123!7890126456',
                firstName: 'John',
                lastName: 'Doe',
                role: 'user' as const
            };

            const user = new User(userData);
            const savedUser = await user.save();

            expect(savedUser._id).toBeDefined();
            expect(savedUser.email).toBe(userData.email.toLowerCase());
            expect(savedUser.firstName).toBe(userData.firstName);
            expect(savedUser.lastName).toBe(userData.lastName);
            expect(savedUser.role).toBe(userData.role);
            expect(savedUser.createdAt).toBeDefined();
            expect(savedUser.updatedAt).toBeDefined();
        });

        it('should fail validation when email is missing', async () => {
            const user = new User({
                password: 'Password123!7890126',
                firstName: 'John',
                lastName: 'Doe'
            });

            await expect(user.save()).rejects.toThrow();
        });

        it('should fail validation when password is missing', async () => {
            const user = new User({
                email: 'test@example.com',
                firstName: 'John',
                lastName: 'Doe'
            });

            await expect(user.save()).rejects.toThrow();
        });

        it('should fail validation when firstName is missing', async () => {
            const user = new User({
                email: 'test@example.com',
                password: 'Password123!7890126',
                lastName: 'Doe'
            });

            await expect(user.save()).rejects.toThrow();
        });

        it('should fail validation when lastName is missing', async () => {
            const user = new User({
                email: 'test@example.com',
                password: 'Password123!7890126',
                firstName: 'John'
            });

            await expect(user.save()).rejects.toThrow();
        });

        it('should fail validation for invalid email format', async () => {
            const user = new User({
                email: 'invalid-email',
                password: 'Password123!7890126',
                firstName: 'John',
                lastName: 'Doe'
            });

            await expect(user.save()).rejects.toThrow();
        });

        it('should fail validation for password shorter than 6 characters', async () => {
            const user = new User({
                email: 'test@example.com',
                password: 'Short',
                firstName: 'John',
                lastName: 'Doe'
            });

            await expect(user.save()).rejects.toThrow();
        });

        it('should default role to "user" when not specified', async () => {
            const user = new User({
                email: 'default-role@example.com',
                password: 'Password123!7890126',
                firstName: 'Default',
                lastName: 'Role'
            });

            const savedUser = await user.save();

            expect(savedUser.role).toBe('user');
        });

        it('should accept valid role values: user and admin', async () => {
            const userWithUserRole = new User({
                email: 'user-role@example.com',
                password: 'Password123!7890126',
                firstName: 'User',
                lastName: 'Role',
                role: 'user'
            });

            const userWithAdminRole = new User({
                email: 'admin-role@example.com',
                password: 'Password123!7890126',
                firstName: 'Admin',
                lastName: 'Role',
                role: 'admin'
            });

            const savedUser = await userWithUserRole.save();
            const savedAdmin = await userWithAdminRole.save();

            expect(savedUser.role).toBe('user');
            expect(savedAdmin.role).toBe('admin');
        });

        it('should fail validation for invalid role value', async () => {
            const user = new User({
                email: 'invalid-role@example.com',
                password: 'Password123!7890126',
                firstName: 'Invalid',
                lastName: 'Role',
                role: 'superadmin' as any // Invalid role
            });

            await expect(user.save()).rejects.toThrow();
        });
    });

    describe('Email handling', () => {
        it('should convert email to lowercase', async () => {
            const user = new User({
                email: 'UPPERCASE@EXAMPLE.COM',
                password: 'Password123!7890126',
                firstName: 'Upper',
                lastName: 'Case'
            });

            const savedUser = await user.save();

            expect(savedUser.email).toBe('uppercase@example.com');
        });

        it('should trim whitespace from email', async () => {
            const user = new User({
                email: '  spaced@example.com  ',
                password: 'Password123!7890126',
                firstName: 'Spaced',
                lastName: 'Email'
            });

            const savedUser = await user.save();

            expect(savedUser.email).toBe('spaced@example.com');
        });

        it('should enforce unique email constraint', async () => {
            const email = 'duplicate@example.com';

            await createTestUser({ email });

            const duplicateUser = new User({
                email,
                password: 'Password123!7890126',
                firstName: 'Duplicate',
                lastName: 'User'
            });

            await expect(duplicateUser.save()).rejects.toThrow();
        });
    });

    describe('Name field handling', () => {
        it('should trim whitespace from firstName', async () => {
            const user = new User({
                email: 'trim-first@example.com',
                password: 'Password123!7890126',
                firstName: '  John  ',
                lastName: 'Doe'
            });

            const savedUser = await user.save();

            expect(savedUser.firstName).toBe('John');
        });

        it('should trim whitespace from lastName', async () => {
            const user = new User({
                email: 'trim-last@example.com',
                password: 'Password123!7890126',
                firstName: 'John',
                lastName: '  Doe  '
            });

            const savedUser = await user.save();

            expect(savedUser.lastName).toBe('Doe');
        });
    });

    describe('Password hashing', () => {
        it('should hash password before saving', async () => {
            const plainPassword = 'MyPlainPassword123!';
            const user = new User({
                email: 'hash@example.com',
                password: plainPassword,
                firstName: 'Hash',
                lastName: 'Test'
            });

            const savedUser = await user.save();

            expect(savedUser.password).not.toBe(plainPassword);
            expect(savedUser.password.length).toBeGreaterThan(20);
            expect(savedUser.password).toMatch(/^\$2[aby]\$/); // Bcrypt hash pattern
        });

        it('should not rehash password if not modified', async () => {
            const user = await createTestUser({
                email: 'no-rehash@example.com',
                password: 'Password123!7890126'
            });

            const originalHash = user.password;

            // Update non-password field
            user.firstName = 'Updated';
            await user.save();

            expect(user.password).toBe(originalHash);
        });

        it('should rehash password when modified', async () => {
            const user = await createTestUser({
                email: 'rehash@example.com',
                password: 'OldPassword123!'
            });

            const originalHash = user.password;

            // Update password
            user.password = 'NewPassword123!';
            await user.save();

            expect(user.password).not.toBe(originalHash);
            expect(user.password).toMatch(/^\$2[aby]\$/);
        });
    });

    describe('comparePassword method', () => {
        it('should return true for correct password', async () => {
            const password = 'CorrectPassword123!';
            const user = await createTestUser({
                email: 'compare@example.com',
                password
            });

            const isMatch = await user.comparePassword(password);

            expect(isMatch).toBe(true);
        });

        it('should return false for incorrect password', async () => {
            const user = await createTestUser({
                email: 'compare-wrong@example.com',
                password: 'CorrectPassword123!'
            });

            const isMatch = await user.comparePassword('wrongPassword');

            expect(isMatch).toBe(false);
        });

        it('should handle empty password comparison', async () => {
            const user = await createTestUser({
                email: 'empty-pass@example.com',
                password: 'ActualPassword123!'
            });

            const isMatch = await user.comparePassword('');

            expect(isMatch).toBe(false);
        });

        it('should be case sensitive', async () => {
            const password = 'CaseSensitive123!';
            const user = await createTestUser({
                email: 'case-sensitive@example.com',
                password
            });

            const exactMatch = await user.comparePassword(password);
            const wrongCaseMatch = await user.comparePassword('casesensitive123!');

            expect(exactMatch).toBe(true);
            expect(wrongCaseMatch).toBe(false);
        });
    });

    describe('Timestamps', () => {
        it('should automatically create createdAt and updatedAt timestamps', async () => {
            const user = new User({
                email: 'timestamps@example.com',
                password: 'Password123!7890126',
                firstName: 'Time',
                lastName: 'Stamp'
            });

            const savedUser = await user.save();

            expect(savedUser.createdAt).toBeInstanceOf(Date);
            expect(savedUser.updatedAt).toBeInstanceOf(Date);
            expect(savedUser.createdAt.getTime()).toBeLessThanOrEqual(savedUser.updatedAt.getTime());
        });

        it('should update updatedAt on document modification', async () => {
            const user = await createTestUser({
                email: 'update-timestamp@example.com'
            });

            const originalUpdatedAt = user.updatedAt;

            // Wait to ensure timestamp difference
            await new Promise((resolve) => setTimeout(resolve, 10));

            user.firstName = 'Modified';
            await user.save();

            expect(user.updatedAt.getTime()).toBeGreaterThan(originalUpdatedAt.getTime());
        });

        it('should not update createdAt on document modification', async () => {
            const user = await createTestUser({
                email: 'no-update-created@example.com'
            });

            const originalCreatedAt = user.createdAt;

            await new Promise((resolve) => setTimeout(resolve, 10));

            user.firstName = 'Modified';
            await user.save();

            expect(user.createdAt.getTime()).toBe(originalCreatedAt.getTime());
        });
    });

    describe('Database indexes', () => {
        it('should have index on email field for performance', async () => {
            const indexes = User.schema.indexes();
            const emailIndex = indexes.find((index: any) => index[0].email === 1);

            expect(emailIndex).toBeDefined();
        });
    });

    describe('toObject method', () => {
        it('should include all fields when converting to plain object', async () => {
            const user = await createTestUser({
                email: 'toobject@example.com',
                firstName: 'To',
                lastName: 'Object'
            });

            const userObject = user.toObject();

            expect(userObject).toHaveProperty('_id');
            expect(userObject).toHaveProperty('email');
            expect(userObject).toHaveProperty('password');
            expect(userObject).toHaveProperty('firstName');
            expect(userObject).toHaveProperty('lastName');
            expect(userObject).toHaveProperty('role');
            expect(userObject).toHaveProperty('createdAt');
            expect(userObject).toHaveProperty('updatedAt');
        });
    });

    describe('comparePassword method', () => {
        it('should return true for correct password', async () => {
            const user = await createTestUser({
                password: 'CorrectPassword123!'
            });

            const isMatch = await user.comparePassword('CorrectPassword123!');
            expect(isMatch).toBe(true);
        });

        it('should return false for incorrect password', async () => {
            const user = await createTestUser({
                password: 'CorrectPassword123!'
            });

            const isMatch = await user.comparePassword('WrongPassword!');
            expect(isMatch).toBe(false);
        });

        it('should handle bcrypt compare error', async () => {
            const user = await createTestUser();

            // Mock bcrypt.compare to throw error
            const mockCompare = jest.spyOn(require('bcryptjs'), 'compare').mockRejectedValue(new Error('Bcrypt error'));

            await expect(user.comparePassword('anyPassword')).rejects.toThrow('Bcrypt error');

            mockCompare.mockRestore();
        });
    });
});
