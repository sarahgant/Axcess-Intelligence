/**
 * Mock Factory Functions
 * Helper functions to create test data objects
 */

import type { ChatMessage, ChatSession, User, Document, ApiResponse } from '@/shared/types';

/**
 * Create a mock chat message
 */
export const createMockMessage = (overrides: Partial<ChatMessage> = {}): ChatMessage => ({
    id: 'msg-test-123',
    content: 'This is a test message',
    type: 'text',
    timestamp: Date.now(),
    sender: 'user',
    ...overrides,
});

/**
 * Create a mock chat session
 */
export const createMockSession = (overrides: Partial<ChatSession> = {}): ChatSession => ({
    id: 'session-test-123',
    title: 'Test Chat Session',
    messages: [
        createMockMessage({ sender: 'user', content: 'Hello' }),
        createMockMessage({ sender: 'assistant', content: 'Hi there!' }),
    ],
    createdAt: Date.now() - 86400000, // 1 day ago
    updatedAt: Date.now(),
    settings: {
        provider: 'anthropic',
        model: 'claude-3-sonnet-20240229',
        temperature: 0.7,
        maxTokens: 1000,
        enableStreaming: true,
    },
    ...overrides,
});

/**
 * Create a mock user
 */
export const createMockUser = (overrides: Partial<User> = {}): User => ({
    id: 'user-test-123',
    email: 'test@example.com',
    name: 'Test User',
    role: 'user',
    createdAt: Date.now() - 86400000,
    updatedAt: Date.now(),
    preferences: {
        theme: 'light',
        language: 'en',
        timezone: 'UTC',
        notifications: {
            email: true,
            push: false,
            inApp: true,
            frequency: 'immediate',
        },
    },
    ...overrides,
});

/**
 * Create a mock document
 */
export const createMockDocument = (overrides: Partial<Document> = {}): Document => ({
    id: 'doc-test-123',
    name: 'test-document.pdf',
    type: 'pdf',
    size: 1048576, // 1MB
    status: 'processed',
    content: 'This is the extracted text content from the document...',
    metadata: {
        originalName: 'test-document.pdf',
        mimeType: 'application/pdf',
        pages: 5,
        language: 'en',
        extractedText: 'This is the extracted text...',
    },
    uploadedAt: Date.now() - 86400000,
    processedAt: Date.now() - 86340000,
    ...overrides,
});

/**
 * Create a mock API response
 */
export const createMockApiResponse = <T>(
    data: T,
    overrides: Partial<ApiResponse<T>> = {}
): ApiResponse<T> => ({
    data,
    success: true,
    meta: {
        timestamp: Date.now(),
        requestId: 'req-test-123',
        version: '1.0.0',
    },
    ...overrides,
});

/**
 * Create a mock API error response
 */
export const createMockApiError = (
    message: string = 'Test error',
    code: string = 'TEST_ERROR'
): ApiResponse<null> => ({
    data: null,
    success: false,
    error: {
        code,
        message,
        details: { test: true },
    },
    meta: {
        timestamp: Date.now(),
        requestId: 'req-test-error-123',
        version: '1.0.0',
    },
});

/**
 * Create mock file for upload testing
 */
export const createMockFile = (
    content: string = 'test file content',
    name: string = 'test.txt',
    type: string = 'text/plain'
): File => {
    const file = new File([content], name, { type });

    // Add additional properties that might be needed
    Object.defineProperty(file, 'size', {
        value: content.length,
        writable: false,
    });

    return file;
};

/**
 * Create mock FormData for form testing
 */
export const createMockFormData = (data: Record<string, any> = {}): FormData => {
    const formData = new FormData();

    Object.entries(data).forEach(([key, value]) => {
        if (value instanceof File) {
            formData.append(key, value);
        } else if (typeof value === 'object') {
            formData.append(key, JSON.stringify(value));
        } else {
            formData.append(key, String(value));
        }
    });

    return formData;
};

/**
 * Create mock event for event testing
 */
export const createMockEvent = (
    type: string = 'click',
    overrides: Partial<Event> = {}
): Event => {
    const event = new Event(type, { bubbles: true, cancelable: true });

    Object.assign(event, overrides);

    return event;
};

/**
 * Create mock keyboard event
 */
export const createMockKeyboardEvent = (
    key: string,
    overrides: Partial<KeyboardEvent> = {}
): KeyboardEvent => {
    const event = new KeyboardEvent('keydown', {
        key,
        bubbles: true,
        cancelable: true,
        ...overrides,
    });

    return event;
};

/**
 * Create mock mouse event
 */
export const createMockMouseEvent = (
    type: string = 'click',
    overrides: Partial<MouseEvent> = {}
): MouseEvent => {
    const event = new MouseEvent(type, {
        bubbles: true,
        cancelable: true,
        ...overrides,
    });

    return event;
};

/**
 * Create mock promise that resolves after delay
 */
export const createMockPromise = <T>(
    value: T,
    delay: number = 0
): Promise<T> => {
    return new Promise(resolve => {
        setTimeout(() => resolve(value), delay);
    });
};

/**
 * Create mock promise that rejects after delay
 */
export const createMockRejection = (
    error: any = new Error('Test error'),
    delay: number = 0
): Promise<never> => {
    return new Promise((_, reject) => {
        setTimeout(() => reject(error), delay);
    });
};