// Auth service for managing authentication state and tokens
export class AuthService {
    private static readonly TOKEN_KEY = 'auth_token';
    private static readonly REFRESH_TOKEN_KEY = 'refresh_token';

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

    // Clear all tokens
    static clearTokens(): void {
        if (typeof window === 'undefined') return;
        localStorage.removeItem(this.TOKEN_KEY);
        localStorage.removeItem(this.REFRESH_TOKEN_KEY);
    }

    // Check if user is authenticated
    static isAuthenticated(): boolean {
        return !!this.getToken();
    }

    // Get auth headers for API calls
    static getAuthHeaders(): Record<string, string> {
        const token = this.getToken();
        return token ? { Authorization: `Bearer ${token}` } : {};
    }
}
