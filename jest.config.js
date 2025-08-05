/**
 * Jest Configuration for CCH Axcess Intelligence Vibed
 * Comprehensive testing setup with TypeScript, React, and coverage reporting
 */

export default {
    // Test environment
    testEnvironment: 'jsdom',

    // Setup files
    setupFilesAfterEnv: ['<rootDir>/tests/setup/jest.setup.ts'],

    // Module paths
    moduleNameMapping: {
        '^@/(.*)$': '<rootDir>/src/$1',
        '^@/tests/(.*)$': '<rootDir>/tests/$1',
    },

    // File extensions to consider
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],

    // Transform configuration
    transform: {
        '^.+\\.(ts|tsx)$': 'ts-jest',
        '^.+\\.(js|jsx)$': 'babel-jest',
    },

    // Ignore transformations for these patterns
    transformIgnorePatterns: [
        'node_modules/(?!(.*\\.mjs$|@testing-library|@radix-ui))',
    ],

    // Test file patterns
    testMatch: [
        '<rootDir>/tests/**/*.test.{ts,tsx}',
        '<rootDir>/src/**/__tests__/**/*.{ts,tsx}',
        '<rootDir>/src/**/*.test.{ts,tsx}',
    ],

    // Files to ignore
    testPathIgnorePatterns: [
        '<rootDir>/node_modules/',
        '<rootDir>/dist/',
        '<rootDir>/tests/e2e/',
    ],

    // Coverage configuration
    collectCoverage: true,
    collectCoverageFrom: [
        'src/**/*.{ts,tsx}',
        '!src/**/*.d.ts',
        '!src/**/*.stories.{ts,tsx}',
        '!src/**/*.test.{ts,tsx}',
        '!src/**/__tests__/**',
        '!src/**/index.ts',
        '!src/main.tsx',
        '!src/vite-env.d.ts',
        '!src/example-usage.ts',
    ],

    // Coverage thresholds
    coverageThreshold: {
        global: {
            branches: 80,
            functions: 80,
            lines: 80,
            statements: 80,
        },
        './src/features/': {
            branches: 85,
            functions: 85,
            lines: 85,
            statements: 85,
        },
        './src/shared/': {
            branches: 90,
            functions: 90,
            lines: 90,
            statements: 90,
        },
    },

    // Coverage reporters
    coverageReporters: [
        'text',
        'text-summary',
        'lcov',
        'html',
        'json',
    ],

    // Coverage directory
    coverageDirectory: '<rootDir>/coverage',

    // Module mocking
    moduleNameMapping: {
        // Handle CSS imports (with CSS modules)
        '\\.module\\.(css|sass|scss|less)$': 'identity-obj-proxy',

        // Handle CSS imports (without CSS modules)
        '\\.(css|sass|scss|less)$': '<rootDir>/tests/mocks/styleMock.js',

        // Handle image imports
        '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
            '<rootDir>/tests/mocks/fileMock.js',

        // Path mapping
        '^@/(.*)$': '<rootDir>/src/$1',
        '^@/tests/(.*)$': '<rootDir>/tests/$1',
    },

    // Global setup and teardown
    globalSetup: '<rootDir>/tests/setup/globalSetup.ts',
    globalTeardown: '<rootDir>/tests/setup/globalTeardown.ts',

    // Test timeout
    testTimeout: 10000,

    // Watch plugins
    watchPlugins: [
        'jest-watch-typeahead/filename',
        'jest-watch-typeahead/testname',
    ],

    // Verbose output
    verbose: process.env.CI === 'true',

    // Fail fast in CI
    bail: process.env.CI === 'true' ? 1 : 0,

    // Clear mocks between tests
    clearMocks: true,

    // Restore mocks after each test
    restoreMocks: true,

    // Error on deprecated features
    errorOnDeprecated: true,

    // Max workers for parallel execution
    maxWorkers: process.env.CI ? 2 : '50%',

    // Cache configuration
    cacheDirectory: '<rootDir>/.jest-cache',

    // Notify of test results
    notify: false,

    // TypeScript configuration
    preset: 'ts-jest',

    // Jest extensions
    snapshotSerializers: ['@emotion/jest/serializer'],

    // Custom environment variables for tests
    setupFiles: ['<rootDir>/tests/setup/env.ts'],
};