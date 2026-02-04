import { generateAccessToken, verifyToken } from '@/lib/auth';
import { Token } from '@/lib/db/models/token.model';
import { User } from '@/lib/db/models/user.model';
import { AuthService } from '@/resources/auth/auth.service';

describe('Auth Integration Tests', () => {
    let authService: AuthService;

    beforeAll(async () => {
        authService = new AuthService();
    });

    // Data cleanup is handled by global setup

    describe('register', () => {
        it('should register a new user successfully', async () => {
            const result = await authService.register('test@example.com', 'StrongPassword123!', 'Test', 'User');

            expect(result.user).toMatchObject({
                email: 'test@example.com',
                firstName: 'Test',
                lastName: 'User',
                role: 'user'
            });
            expect(result.accessToken).toBeDefined();
            expect(result.refreshToken).toBeDefined();
        });

        it('should not register duplicate email', async () => {
            await authService.register('duplicate@example.com', 'Password123!', 'User', 'One');

            await expect(authService.register('duplicate@example.com', 'Password123!', 'User', 'Two')).rejects.toThrow('An account with this email already exists');
        });

        it('should hash password on registration', async () => {
            await authService.register('hash@example.com', 'MyPassword123!', 'Hash', 'User');
            const user = await User.findOne({ email: 'hash@example.com' });

            expect(user?.password).toBeDefined();
            expect(user?.password).not.toBe('MyPassword123!');
        });
    });

    describe('login', () => {
        beforeEach(async () => {
            await authService.register('login@example.com', 'LoginPassword123!', 'Login', 'User');
        });

        it('should login with correct credentials', async () => {
            const result = await authService.login('login@example.com', 'LoginPassword123!');

            expect(result.user.email).toBe('login@example.com');
            expect(result.accessToken).toBeDefined();
            expect(result.refreshToken).toBeDefined();
        });

        it('should reject incorrect password', async () => {
            await expect(authService.login('login@example.com', 'WrongPassword!')).rejects.toThrow();
        });

        it('should reject non-existent email', async () => {
            await expect(authService.login('notfound@example.com', 'AnyPassword123!')).rejects.toThrow();
        });
    });

    describe('refreshToken', () => {
        let refreshToken: string;

        beforeEach(async () => {
            const result = await authService.register('refresh@example.com', 'RefreshPassword123!', 'Refresh', 'User');
            refreshToken = result.refreshToken;
        });

        it('should refresh tokens with valid refresh token', async () => {
            const result = await authService.refreshToken(refreshToken);

            expect(result.accessToken).toBeDefined();
            expect(result.refreshToken).toBeDefined();
            // Note: Token rotation blacklists old token
        });

        it('should blacklist old refresh token after refresh', async () => {
            await authService.refreshToken(refreshToken);

            const isBlacklisted = await authService.isTokenBlacklisted(refreshToken);
            expect(isBlacklisted).toBe(true);
        });

        it('should reject blacklisted refresh token', async () => {
            await authService.refreshToken(refreshToken);

            await expect(authService.refreshToken(refreshToken)).rejects.toThrow('Your session has been revoked');
        });

        it('should reject invalid refresh token', async () => {
            await expect(authService.refreshToken('invalid-token')).rejects.toThrow();
        });
    });

    describe('logout', () => {
        let accessToken: string;
        let userId: string;

        beforeEach(async () => {
            const result = await authService.register('logout@example.com', 'LogoutPassword123!', 'Logout', 'User');
            accessToken = result.accessToken;
            userId = result.user.id;
        });

        it('should blacklist access token on logout', async () => {
            await authService.logout(userId, accessToken);

            const isBlacklisted = await authService.isTokenBlacklisted(accessToken);
            expect(isBlacklisted).toBe(true);
        });

        it('should reject blacklisted token', async () => {
            await authService.logout(userId, accessToken);

            const isBlacklisted = await authService.isTokenBlacklisted(accessToken);
            expect(isBlacklisted).toBe(true);
        });
    });

    describe('token blacklist', () => {
        it('should expire blacklisted tokens automatically', async () => {
            const { user, accessToken } = await authService.register('ttl@example.com', 'TtlPassword123!', 'TTL', 'User');

            await authService.logout(user.id, accessToken);

            const blacklistEntry = await Token.findOne({ token: accessToken });
            expect(blacklistEntry).toBeDefined();
            expect(blacklistEntry?.expiresAt).toBeInstanceOf(Date);
        });
    });

    describe('JWT tokens', () => {
        it('should generate valid access token', () => {
            const token = generateAccessToken({ userId: 'user-123', email: 'test@example.com', role: 'user' });
            const payload = verifyToken(token);

            expect(payload.userId).toBe('user-123');
            expect(payload.role).toBe('user');
        });

        it('should reject invalid tokens', () => {
            expect(() => verifyToken('invalid-token')).toThrow();
        });
    });
});
