import { AppConfig } from './schema';

/**
 * Default configuration values for the application
 * These values are used as fallbacks when environment variables are not set
 */
export const DEFAULT_CONFIG: AppConfig = {
  providers: {
    anthropic: {
      apiKey: '',
      defaultModel: 'claude-sonnet-4-20250514',
      maxRetries: 3,
      timeout: 30000,
    },
    openai: {
      apiKey: '',
      defaultModel: 'gpt-4.1',
      maxRetries: 3,
      timeout: 30000,
    },
  },
  features: {
    enableStreaming: true,
    enableDocumentAnalysis: true,
    enableRAGSearch: true,
    enableChatHistory: true,
    maxDocumentsPerSession: 10,
    maxChatHistoryEntries: 100,
    documentRetentionHours: 3,
    enableDebugMode: false,
  },
  security: {
    encryptionKey: '',
    allowedOrigins: ['http://localhost:3000', 'http://localhost:5173'],
    enableCORS: true,
    rateLimitPerMinute: 60,
    enableCSP: true,
  },
  performance: {
    cacheEnabled: true,
    cacheTTLMinutes: 30,
    enableServiceWorker: false,
    enableLazyLoading: true,
    maxConcurrentRequests: 5,
  },
  environment: 'development',
  logLevel: 'info',
  version: '1.0.0',
};

/**
 * Production-specific configuration overrides
 */
export const PRODUCTION_CONFIG_OVERRIDES: Partial<AppConfig> = {
  environment: 'production',
  logLevel: 'warn',
  features: {
    enableDebugMode: false,
    enableServiceWorker: true,
  },
  security: {
    enableCSP: true,
    rateLimitPerMinute: 30,
  },
  performance: {
    enableLazyLoading: true,
    maxConcurrentRequests: 3,
  },
};

/**
 * Development-specific configuration overrides
 */
export const DEVELOPMENT_CONFIG_OVERRIDES: Partial<AppConfig> = {
  environment: 'development',
  logLevel: 'debug',
  features: {
    enableDebugMode: true,
  },
  security: {
    enableCSP: false,
    rateLimitPerMinute: 120,
  },
};

/**
 * Required environment variables that must be provided
 */
export const REQUIRED_ENV_VARS = [
  'ANTHROPIC_API_KEY',
  'OPENAI_API_KEY',
  'ENCRYPTION_KEY',
] as const;

/**
 * Optional environment variables with their default descriptions
 */
export const OPTIONAL_ENV_VARS = {
  ANTHROPIC_DEFAULT_MODEL: 'Default Anthropic model to use',
  ANTHROPIC_BASE_URL: 'Custom Anthropic API base URL',
  OPENAI_ORGANIZATION: 'OpenAI organization ID',
  OPENAI_DEFAULT_MODEL: 'Default OpenAI model to use',
  OPENAI_BASE_URL: 'Custom OpenAI API base URL',
  ENABLE_STREAMING: 'Enable streaming responses',
  ENABLE_DOCUMENT_ANALYSIS: 'Enable document analysis features',
  ENABLE_RAG_SEARCH: 'Enable RAG search capabilities',
  ENABLE_CHAT_HISTORY: 'Enable chat history persistence',
  MAX_DOCUMENTS_PER_SESSION: 'Maximum documents per session',
  MAX_CHAT_HISTORY_ENTRIES: 'Maximum chat history entries',
  DOCUMENT_RETENTION_HOURS: 'Document retention time in hours (CCH requirement)',
  ALLOWED_ORIGINS: 'Comma-separated list of allowed origins for CORS',
  ENABLE_CORS: 'Enable CORS support',
  RATE_LIMIT_PER_MINUTE: 'Rate limit per minute per user',
  CACHE_ENABLED: 'Enable caching',
  CACHE_TTL_MINUTES: 'Cache time-to-live in minutes',
  ENABLE_SERVICE_WORKER: 'Enable service worker for PWA features',
  MAX_CONCURRENT_REQUESTS: 'Maximum concurrent API requests',
  NODE_ENV: 'Node environment (development/staging/production)',
  LOG_LEVEL: 'Logging level (debug/info/warn/error)',
} as const;

/**
 * Get environment-specific configuration overrides
 */
export function getEnvironmentOverrides(environment: string): Partial<AppConfig> {
  switch (environment) {
    case 'production':
      return PRODUCTION_CONFIG_OVERRIDES;
    case 'development':
      return DEVELOPMENT_CONFIG_OVERRIDES;
    default:
      return {};
  }
}