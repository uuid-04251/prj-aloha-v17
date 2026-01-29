// Test script for auth endpoints
import { createTRPCProxyClient, httpBatchLink } from '@trpc/client';
import type { AppRouter } from '../src/lib/trpc/router';

const trpc = createTRPCProxyClient<AppRouter>({
    links: [
        httpBatchLink({
            url: 'http://localhost:3001/trpc'
        })
    ]
});

async function testAuth() {
    try {
        console.log('🧪 Testing Auth Endpoints...\n');

        // Test registration
        console.log('1. Testing user registration...');
        const registerResult = await trpc.auth.register.mutate({
            email: 'test@example.com',
            password: 'password123'
        });
        console.log('✅ Registration successful:', {
            userId: registerResult.user.id,
            email: registerResult.user.email,
            hasAccessToken: !!registerResult.accessToken,
            hasRefreshToken: !!registerResult.refreshToken
        });

        // Test login
        console.log('\n2. Testing user login...');
        const loginResult = await trpc.auth.login.mutate({
            email: 'test@example.com',
            password: 'password123'
        });
        console.log('✅ Login successful:', {
            userId: loginResult.user.id,
            email: loginResult.user.email,
            hasAccessToken: !!loginResult.accessToken,
            hasRefreshToken: !!loginResult.refreshToken
        });

        // Test token refresh
        console.log('\n3. Testing token refresh...');
        const refreshResult = await trpc.auth.refreshToken.mutate({
            refreshToken: loginResult.refreshToken
        });
        console.log('✅ Token refresh successful:', {
            hasNewAccessToken: !!refreshResult.accessToken,
            hasNewRefreshToken: !!refreshResult.refreshToken
        });

        console.log('\n🎉 All auth tests passed!');
    } catch (error) {
        console.error('❌ Auth test failed:', error);
    }
}

testAuth();
