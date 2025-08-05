/**
 * Shared Types - Common types used across features
 */

// API Types
export interface ApiResponse<T = any> {
    data: T;
    success: boolean;
    message?: string;
    error?: ApiError;
    meta?: ApiMeta;
}

export interface ApiError {
    code: string;
    message: string;
    details?: Record<string, any>;
    stack?: string;
}

export interface ApiMeta {
    timestamp: number;
    requestId: string;
    version: string;
    pagination?: PaginationMeta;
}

export interface PaginationMeta {
    page: number;
    pageSize: number;
    totalPages: number;
    totalItems: number;
    hasNext: boolean;
    hasPrevious: boolean;
}

// Common Entity Types
export interface BaseEntity {
    id: string;
    createdAt: number;
    updatedAt: number;
    version?: number;
}

export interface User extends BaseEntity {
    email: string;
    name: string;
    role: UserRole;
    avatar?: string;
    preferences: UserPreferences;
    lastLoginAt?: number;
}

export type UserRole = 'admin' | 'user' | 'guest';

export interface UserPreferences {
    theme: 'light' | 'dark' | 'auto';
    language: string;
    timezone: string;
    notifications: NotificationPreferences;
}

export interface NotificationPreferences {
    email: boolean;
    push: boolean;
    inApp: boolean;
    frequency: 'immediate' | 'daily' | 'weekly';
}

// Form Types
export interface FormField {
    name: string;
    value: any;
    error?: string;
    touched: boolean;
    required: boolean;
}

export interface FormState {
    fields: Record<string, FormField>;
    isValid: boolean;
    isSubmitting: boolean;
    isDirty: boolean;
    errors: Record<string, string>;
}

// UI Types
export interface ToastMessage {
    id: string;
    type: 'success' | 'error' | 'warning' | 'info';
    title: string;
    message?: string;
    duration?: number;
    actions?: ToastAction[];
}

export interface ToastAction {
    label: string;
    onClick: () => void;
    variant?: 'primary' | 'secondary';
}

export interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    size?: 'sm' | 'md' | 'lg' | 'xl';
    closable?: boolean;
}

// Event Types
export interface CustomEvent<T = any> {
    type: string;
    payload: T;
    timestamp: number;
    source?: string;
}

// Configuration Types
export interface AppConfig {
    apiUrl: string;
    wsUrl?: string;
    version: string;
    environment: 'development' | 'staging' | 'production';
    features: FeatureFlags;
    limits: AppLimits;
}

export interface FeatureFlags {
    enableStreaming: boolean;
    enableDocumentAnalysis: boolean;
    enableRagSearch: boolean;
    enableChatHistory: boolean;
    enableDebugMode: boolean;
}

export interface AppLimits {
    maxDocumentsPerSession: number;
    maxChatHistoryEntries: number;
    maxFileSize: number;
    documentRetentionHours: number;
}

// Utility Types
export type Nullable<T> = T | null;
export type Optional<T> = T | undefined;
export type AsyncResult<T> = Promise<T>;
export type EventHandler<T = void> = (event: T) => void;
export type Callback<T = void> = () => T;
export type AsyncCallback<T = void> = () => Promise<T>;