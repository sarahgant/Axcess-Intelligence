export interface User {
    id: string;
    email: string;
    name: string;
    role: 'user' | 'admin' | 'manager';
    permissions: string[];
    createdAt: Date;
    lastLoginAt?: Date;
}

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface RegisterData {
    email: string;
    password: string;
    name: string;
    role?: 'user' | 'admin' | 'manager';
}

export interface AuthResponse {
    user: User;
    token: string;
    refreshToken: string;
    expiresAt: Date;
}

export interface RefreshTokenRequest {
    refreshToken: string;
}

export interface PasswordResetRequest {
    email: string;
}

export interface PasswordResetConfirm {
    token: string;
    newPassword: string;
}

export interface ChangePasswordRequest {
    currentPassword: string;
    newPassword: string;
}

export interface IAuthService {
    // Authentication
    login(credentials: LoginCredentials): Promise<AuthResponse>;
    register(data: RegisterData): Promise<AuthResponse>;
    logout(): Promise<void>;
    refreshToken(request: RefreshTokenRequest): Promise<AuthResponse>;

    // Password management
    requestPasswordReset(request: PasswordResetRequest): Promise<void>;
    confirmPasswordReset(confirm: PasswordResetConfirm): Promise<void>;
    changePassword(request: ChangePasswordRequest): Promise<void>;

    // User management
    getCurrentUser(): Promise<User | null>;
    updateProfile(updates: Partial<User>): Promise<User>;

    // Session management
    isAuthenticated(): boolean;
    getToken(): string | null;
    setToken(token: string): void;
    clearToken(): void;

    // Authorization
    hasPermission(permission: string): boolean;
    hasRole(role: string): boolean;

    // Error handling
    isAuthError(error: Error): boolean;
    getAuthErrorMessage(error: Error): string;
}
