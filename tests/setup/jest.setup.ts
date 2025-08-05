/**
 * Jest Setup Configuration
 * Global test setup and configuration
 */

import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { afterEach, beforeAll, afterAll } from '@jest/globals';
import { server } from '../mocks/server';

// Mock Service Worker setup
beforeAll(() => {
    // Start MSW server
    server.listen({
        onUnhandledRequest: 'warn',
    });
});

afterEach(() => {
    // Clean up DOM after each test
    cleanup();

    // Reset MSW handlers
    server.resetHandlers();

    // Clear all mocks
    jest.clearAllMocks();
});

afterAll(() => {
    // Stop MSW server
    server.close();
});

// Mock IntersectionObserver
global.IntersectionObserver = jest.fn().mockImplementation(() => ({
    observe: jest.fn(),
    unobserve: jest.fn(),
    disconnect: jest.fn(),
}));

// Mock ResizeObserver
global.ResizeObserver = jest.fn().mockImplementation(() => ({
    observe: jest.fn(),
    unobserve: jest.fn(),
    disconnect: jest.fn(),
}));

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(), // Deprecated
        removeListener: jest.fn(), // Deprecated
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
    })),
});

// Mock window.scrollTo
Object.defineProperty(window, 'scrollTo', {
    writable: true,
    value: jest.fn(),
});

// Mock localStorage
const localStorageMock = {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn(),
    length: 0,
    key: jest.fn(),
};

Object.defineProperty(window, 'localStorage', {
    value: localStorageMock,
});

// Mock sessionStorage
Object.defineProperty(window, 'sessionStorage', {
    value: localStorageMock,
});

// Mock crypto.randomUUID
Object.defineProperty(global, 'crypto', {
    value: {
        randomUUID: jest.fn(() => 'mock-uuid'),
        getRandomValues: jest.fn().mockReturnValue(new Uint32Array(1)),
    },
});

// Mock URL.createObjectURL
global.URL.createObjectURL = jest.fn(() => 'mock-url');
global.URL.revokeObjectURL = jest.fn();

// Mock FileReader
const FileReaderMock = jest.fn().mockImplementation(() => ({
    readAsDataURL: jest.fn(),
    readAsText: jest.fn(),
    onload: null,
    onerror: null,
    result: null,
}));

// Add static properties
FileReaderMock.EMPTY = 0;
FileReaderMock.LOADING = 1;
FileReaderMock.DONE = 2;

global.FileReader = FileReaderMock as any;

// Mock Blob
global.Blob = jest.fn().mockImplementation((content, options) => ({
    size: content ? content.length : 0,
    type: options?.type || '',
    slice: jest.fn(),
    stream: jest.fn(),
    text: jest.fn().mockResolvedValue(content?.join('') || ''),
    arrayBuffer: jest.fn(),
}));

// Mock fetch if not available
if (!global.fetch) {
    global.fetch = jest.fn();
}

// Mock console methods in test environment
if (process.env.NODE_ENV === 'test') {
    const originalError = console.error;
    const originalWarn = console.warn;

    console.error = (...args) => {
        // Suppress specific known warnings in tests
        const message = args[0];
        if (
            typeof message === 'string' &&
            (message.includes('Warning: ReactDOM.render is deprecated') ||
                message.includes('Warning: React.createFactory is deprecated'))
        ) {
            return;
        }
        originalError(...args);
    };

    console.warn = (...args) => {
        const message = args[0];
        if (
            typeof message === 'string' &&
            message.includes('deprecated')
        ) {
            return;
        }
        originalWarn(...args);
    };
}

// Enhanced error handling for async tests
process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

// Global test utilities
global.testUtils = {
    // Helper to wait for next tick
    nextTick: () => new Promise(resolve => setTimeout(resolve, 0)),

    // Helper to wait for specific time
    sleep: (ms: number) => new Promise(resolve => setTimeout(resolve, ms)),

    // Helper to create mock functions with return values
    mockReturnValue: (value: any) => jest.fn().mockReturnValue(value),

    // Helper to create mock resolved promises
    mockResolvedValue: (value: any) => jest.fn().mockResolvedValue(value),

    // Helper to create mock rejected promises
    mockRejectedValue: (error: any) => jest.fn().mockRejectedValue(error),
};