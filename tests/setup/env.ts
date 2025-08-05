/**
 * Test Environment Variables
 * Set up environment variables for testing
 */

// Set NODE_ENV to test
process.env.NODE_ENV = 'test';

// Mock API URLs
process.env.VITE_API_URL = 'http://localhost:3001';
process.env.VITE_WS_URL = 'ws://localhost:3001';

// Mock API keys (using test values)
process.env.ANTHROPIC_API_KEY = 'test-anthropic-key-123456789';
process.env.OPENAI_API_KEY = 'test-openai-key-123456789';
process.env.ENCRYPTION_KEY = 'test-encryption-key-32-characters';
process.env.JWT_SECRET = 'test-jwt-secret-key';

// Feature flags for testing
process.env.VITE_ENABLE_DEBUG_MODE = 'true';
process.env.VITE_ENABLE_STREAMING = 'true';
process.env.VITE_ENABLE_DOCUMENT_ANALYSIS = 'true';
process.env.VITE_ENABLE_RAG_SEARCH = 'true';
process.env.VITE_ENABLE_CHAT_HISTORY = 'true';

// Test limits
process.env.VITE_MAX_DOCUMENTS_PER_SESSION = '10';
process.env.VITE_MAX_CHAT_HISTORY_ENTRIES = '100';
process.env.VITE_DOCUMENT_RETENTION_HOURS = '24';

// Logging configuration
process.env.LOG_LEVEL = 'silent';
process.env.VITE_LOG_LEVEL = 'silent';

// Disable analytics in tests
process.env.VITE_ANALYTICS_ENABLED = 'false';
process.env.VITE_SENTRY_ENABLED = 'false';

// Rate limiting (relaxed for tests)
process.env.RATE_LIMIT_MAX = '1000';
process.env.RATE_LIMIT_WINDOW_MS = '60000';

// Test database (if needed)
process.env.DATABASE_URL = 'sqlite::memory:';
process.env.REDIS_URL = 'redis://localhost:6379/1';

// Mock external services
process.env.MOCK_EXTERNAL_SERVICES = 'true';