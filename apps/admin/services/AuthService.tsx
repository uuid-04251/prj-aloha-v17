// Auth service for managing authentication state and tokens
export class AuthService {
    private static readonly TOKEN_KEY = 'auth_token';
    private static readonly REFRESH_TOKEN_KEY = 'refresh_token';
    private static readonly USER_KEY = 'auth_user';

    // Get stored token
    static getToken(): string | null {
        if (typeof window === 'undefined') return null;
        return localStorage.getItem(this.TOKEN_KEY);
    }

    // Get stored refresh token
    static getRefreshToken(): string | null {
        if (typeof window === 'undefined') return null;
        return localStorage.getItem(this.REFRESH_TOKEN_KEY);
    }

    // Store tokens
    static setTokens(token: string, refreshToken?: string): void {
        if (typeof window === 'undefined') return;
        localStorage.setItem(this.TOKEN_KEY, token);
        if (refreshToken) {
            localStorage.setItem(this.REFRESH_TOKEN_KEY, refreshToken);
        }
    }

    // Store user data
    static setUser(user: any): void {
        if (typeof window === 'undefined') return;
        localStorage.setItem(this.USER_KEY, JSON.stringify(user));
    }

    // Get stored user
    static getUser(): any | null {
        if (typeof window === 'undefined') return null;
        try {
            const user = localStorage.getItem(this.USER_KEY);
            return user ? JSON.parse(user) : null;
        } catch (error) {
            console.error('Failed to parse user data:', error);
            // Clear corrupted data
            localStorage.removeItem(this.USER_KEY);
            return null;
        }
    }

    // Clear all tokens and user data
    static clearTokens(): void {
        if (typeof window === 'undefined') return;
        localStorage.removeItem(this.TOKEN_KEY);
        localStorage.removeItem(this.REFRESH_TOKEN_KEY);
        localStorage.removeItem(this.USER_KEY);
    }

    // Decode JWT token (without verification)
    static decodeToken(token: string): any | null {
        try {
            // Validate token format
            if (!token || typeof token !== 'string') return null;

            const parts = token.split('.');
            if (parts.length !== 3) {
                console.warn('Invalid JWT format');
                return null;
            }

            const payload = parts[1];
            // Validate base64 payload
            if (!payload || payload.length === 0) return null;

            const decoded = JSON.parse(atob(payload));
            return decoded;
        } catch (error) {
            console.error('Failed to decode token:', error);
            return null;
        }
    }

    // Check if token is expired
    static isTokenExpired(token: string): boolean {
        const decoded = this.decodeToken(token);
        if (!decoded || !decoded.exp) return true;
        // Add 5 second buffer
        return Date.now() >= decoded.exp * 1000 - 5000;
    }

    // Check if user is authenticated with valid token
    static isAuthenticated(): boolean {
        const token = this.getToken();
        if (!token) return false;
        return !this.isTokenExpired(token);
    }

    // Get auth headers for API calls
    static getAuthHeaders(): Record<string, string> {
        const token = this.getToken();
        return token ? { Authorization: `Bearer ${token}` } : {};
    }
}
