import { TRPCError } from '@trpc/server';
import {
    createError,
    createValidationError,
    createAuthError,
    createUserError,
    mapToTRPCCode,
    ErrorCode
} from '@/lib/errors';
import type { StandardizedError } from '@/lib/errors/types';

describe('Error Helper Functions', () => {
    describe('mapToTRPCCode', () => {
        it('should map AUTH_INVALID_CREDENTIALS to UNAUTHORIZED', () => {
            expect(mapToTRPCCode(ErrorCode.AUTH_INVALID_CREDENTIALS)).toBe('UNAUTHORIZED');
        });

        it('should map AUTH_INSUFFICIENT_PERMISSIONS to FORBIDDEN', () => {
            expect(mapToTRPCCode(ErrorCode.AUTH_INSUFFICIENT_PERMISSIONS)).toBe('FORBIDDEN');
        });

        it('should map USER_NOT_FOUND to NOT_FOUND', () => {
            expect(mapToTRPCCode(ErrorCode.USER_NOT_FOUND)).toBe('NOT_FOUND');
        });

        it('should map USER_ALREADY_EXISTS to BAD_REQUEST', () => {
            expect(mapToTRPCCode(ErrorCode.USER_ALREADY_EXISTS)).toBe('BAD_REQUEST');
        });

        it('should map VALIDATION_REQUIRED to BAD_REQUEST', () => {
            expect(mapToTRPCCode(ErrorCode.VALIDATION_REQUIRED)).toBe('BAD_REQUEST');
        });

        it('should map SYS_DATABASE_ERROR to INTERNAL_SERVER_ERROR', () => {
            expect(mapToTRPCCode(ErrorCode.SYS_DATABASE_ERROR)).toBe('INTERNAL_SERVER_ERROR');
        });

        it('should map SYS_RATE_LIMIT_EXCEEDED to TOO_MANY_REQUESTS', () => {
            expect(mapToTRPCCode(ErrorCode.SYS_RATE_LIMIT_EXCEEDED)).toBe('TOO_MANY_REQUESTS');
        });

        it('should default to INTERNAL_SERVER_ERROR for unknown codes', () => {
            expect(mapToTRPCCode('UNKNOWN_CODE' as ErrorCode)).toBe('INTERNAL_SERVER_ERROR');
        });
    });

    describe('createError', () => {
        it('should create a TRPCError with correct code and message', () => {
            const error = createError(ErrorCode.USER_NOT_FOUND, {
                userId: '123',
                operation: 'find'
            });

            expect(error.cause).toBeDefined();

            const cause = error.cause as unknown as StandardizedError;
            expect(cause.code).toBe('USER_NOT_FOUND');
            expect(cause.message).toBe('User not found');
            expect(cause.details).toEqual({
                userId: '123',
                operation: 'find'
            });
            expect(cause.timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/);
            expect(cause.requestId).toBeDefined();
        });

        it('should create error with original error as cause', () => {
            const originalError = new Error('Database connection failed');
            const error = createError(ErrorCode.SYS_DATABASE_ERROR, {
                operation: 'connect'
            }, originalError);

            const cause = error.cause as unknown as StandardizedError;
            expect(cause.details).toEqual({
                operation: 'connect'
            });
            expect(cause).toHaveProperty('originalError', originalError);
        });
    });

    describe('createValidationError', () => {
        it('should create validation error with field and code', () => {
            const error = createValidationError('email', ErrorCode.VALIDATION_EMAIL_INVALID);

            expect(error).toBeInstanceOf(TRPCError);
            expect(error.code).toBe('BAD_REQUEST');
            expect(error.message).toBe('Please enter a valid email address');

            const cause = error.cause as unknown as StandardizedError;
            expect(cause.code).toBe('VALIDATION_EMAIL_INVALID');
            expect(cause.message).toBe('Please enter a valid email address');
            expect(cause.details).toEqual({
                field: 'email',
                category: 'validation'
            });
        });

        it('should create validation error with template and params', () => {
            const error = createValidationError('firstName', ErrorCode.VALIDATION_TOO_SHORT, {
                min: 2
            });

            expect(error.message).toBe('firstName must be at least 2 characters');
        });
    });

    describe('createAuthError', () => {
        it('should create auth error with security context', () => {
            const error = createAuthError(ErrorCode.AUTH_INVALID_CREDENTIALS, {
                email: 'test@example.com',
                attemptCount: 3
            });

            expect(error).toBeInstanceOf(TRPCError);
            expect(error.code).toBe('UNAUTHORIZED');
            expect(error.message).toBe('Invalid email or password');

            const cause = error.cause as unknown as StandardizedError;
            expect(cause.details).toEqual({
                email: 'test@example.com',
                attemptCount: 3,
                category: 'authentication'
            });
        });
    });

    describe('createUserError', () => {
        it('should create user error with user context', () => {
            const error = createUserError(ErrorCode.USER_NOT_FOUND, 'user123', {
                operation: 'update'
            });

            expect(error).toBeInstanceOf(TRPCError);
            expect(error.code).toBe('NOT_FOUND');
            expect(error.message).toBe('User not found');

            const cause = error.cause as unknown as StandardizedError;
            expect(cause.details).toEqual({
                userId: 'user123',
                operation: 'update',
                category: 'user_management'
            });
        });
    });

    describe('Error Context and Metadata', () => {
        it('should include timestamp in ISO format', () => {
            const error = createError(ErrorCode.SYS_INTERNAL_ERROR);

            const cause = error.cause as unknown as StandardizedError;
            expect(cause.timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/);
        });

        it('should include unique request ID', () => {
            const error1 = createError(ErrorCode.SYS_INTERNAL_ERROR);
            const error2 = createError(ErrorCode.SYS_INTERNAL_ERROR);

            const cause1 = error1.cause as unknown as StandardizedError;
            const cause2 = error2.cause as unknown as StandardizedError;

            expect(cause1.requestId).toBeDefined();
            expect(cause2.requestId).toBeDefined();
            expect(cause1.requestId).not.toBe(cause2.requestId);
        });

        it('should merge context with category', () => {
            const error = createError(ErrorCode.USER_NOT_FOUND, {
                userId: '123',
                operation: 'delete'
            });

            const cause = error.cause as unknown as StandardizedError;
            expect(cause.details).toEqual({
                userId: '123',
                operation: 'delete'
            });
        });
    });
});