import { z } from 'zod';

/**
 * Configuration schema for AI provider settings
 */
export const ProviderConfigSchema = z.object({
  anthropic: z.object({
    apiKey: z.string().min(1, 'Anthropic API key is required'),
    baseUrl: z.string().url().optional(),
    defaultModel: z.enum([
      // CCH Axcess Intelligence specific models
      'claude-sonnet-4-20250514',
      // Standard Claude models (for compatibility)
      'claude-3-opus-20240229', 
      'claude-3-sonnet-20240229', 
      'claude-3-haiku-20240307'
    ]).default('claude-sonnet-4-20250514'),
    maxRetries: z.number().int().positive().default(3),
    timeout: z.number().positive().default(30000), // 30 seconds
  }),
  openai: z.object({
    apiKey: z.string().min(1, 'OpenAI API key is required'),
    baseUrl: z.string().url().optional(),
    organization: z.string().optional(),
    defaultModel: z.enum([
      // CCH Axcess Intelligence specific models
      'gpt-4.1',
      // Standard OpenAI models (for compatibility)
      'gpt-4-turbo-preview', 
      'gpt-4-1106-preview', 
      'gpt-4-0125-preview', 
      'gpt-3.5-turbo'
    ]).default('gpt-4.1'),
    maxRetries: z.number().int().positive().default(3),
    timeout: z.number().positive().default(30000), // 30 seconds
  }),
});

/**
 * Feature flags configuration schema
 */
export const FeatureConfigSchema = z.object({
  enableStreaming: z.boolean().default(true),
  enableDocumentAnalysis: z.boolean().default(true),
  enableRAGSearch: z.boolean().default(true),
  enableChatHistory: z.boolean().default(true),
  maxDocumentsPerSession: z.number().int().positive().default(10),
  maxChatHistoryEntries: z.number().int().positive().default(100),
  documentRetentionHours: z.number().positive().default(3),
  enableDebugMode: z.boolean().default(false),
});

/**
 * Security configuration schema
 */
export const SecurityConfigSchema = z.object({
  encryptionKey: z.string().min(32, 'Encryption key must be at least 32 characters'),
  allowedOrigins: z.array(z.string()).default(['http://localhost:3000', 'http://localhost:5173']),
  enableCORS: z.boolean().default(true),
  rateLimitPerMinute: z.number().int().positive().default(60),
  enableCSP: z.boolean().default(true),
});

/**
 * Application performance configuration schema
 */
export const PerformanceConfigSchema = z.object({
  cacheEnabled: z.boolean().default(true),
  cacheTTLMinutes: z.number().positive().default(30),
  enableServiceWorker: z.boolean().default(false),
  enableLazyLoading: z.boolean().default(true),
  maxConcurrentRequests: z.number().int().positive().default(5),
});

/**
 * Complete application configuration schema
 */
export const AppConfigSchema = z.object({
  providers: ProviderConfigSchema,
  features: FeatureConfigSchema,
  security: SecurityConfigSchema,
  performance: PerformanceConfigSchema,
  environment: z.enum(['development', 'staging', 'production']).default('development'),
  logLevel: z.enum(['debug', 'info', 'warn', 'error']).default('info'),
  version: z.string().default('1.0.0'),
});

/**
 * Environment variable schema for validation
 */
export const EnvSchema = z.object({
  // AI Provider Keys
  ANTHROPIC_API_KEY: z.string().optional(),
  ANTHROPIC_DEFAULT_MODEL: z.string().optional(),
  ANTHROPIC_BASE_URL: z.string().optional(),
  
  OPENAI_API_KEY: z.string().optional(),
  OPENAI_ORGANIZATION: z.string().optional(),
  OPENAI_DEFAULT_MODEL: z.string().optional(),
  OPENAI_BASE_URL: z.string().optional(),
  
  // Feature Flags
  ENABLE_STREAMING: z.string().transform(val => val === 'true').optional(),
  ENABLE_DOCUMENT_ANALYSIS: z.string().transform(val => val === 'true').optional(),
  ENABLE_RAG_SEARCH: z.string().transform(val => val === 'true').optional(),
  ENABLE_CHAT_HISTORY: z.string().transform(val => val === 'true').optional(),
  ENABLE_DEBUG_MODE: z.string().transform(val => val === 'true').optional(),
  
  MAX_DOCUMENTS_PER_SESSION: z.string().transform(val => parseInt(val, 10)).optional(),
  MAX_CHAT_HISTORY_ENTRIES: z.string().transform(val => parseInt(val, 10)).optional(),
  DOCUMENT_RETENTION_HOURS: z.string().transform(val => parseFloat(val)).optional(),
  
  // Security
  ENCRYPTION_KEY: z.string().optional(),
  ALLOWED_ORIGINS: z.string().optional(),
  ENABLE_CORS: z.string().transform(val => val === 'true').optional(),
  RATE_LIMIT_PER_MINUTE: z.string().transform(val => parseInt(val, 10)).optional(),
  
  // Performance
  CACHE_ENABLED: z.string().transform(val => val === 'true').optional(),
  CACHE_TTL_MINUTES: z.string().transform(val => parseInt(val, 10)).optional(),
  ENABLE_SERVICE_WORKER: z.string().transform(val => val === 'true').optional(),
  MAX_CONCURRENT_REQUESTS: z.string().transform(val => parseInt(val, 10)).optional(),
  
  // Environment
  NODE_ENV: z.enum(['development', 'staging', 'production']).optional(),
  LOG_LEVEL: z.enum(['debug', 'info', 'warn', 'error']).optional(),
});

// Type exports for TypeScript usage
export type AppConfig = z.infer<typeof AppConfigSchema>;
export type ProviderConfig = z.infer<typeof ProviderConfigSchema>;
export type FeatureConfig = z.infer<typeof FeatureConfigSchema>;
export type SecurityConfig = z.infer<typeof SecurityConfigSchema>;
export type PerformanceConfig = z.infer<typeof PerformanceConfigSchema>;
export type EnvConfig = z.infer<typeof EnvSchema>;

/**
 * Configuration validation error type
 */
export interface ConfigValidationError {
  field: string;
  message: string;
  code: string;
}

/**
 * Configuration loading result type
 */
export interface ConfigLoadResult {
  success: boolean;
  config?: AppConfig;
  errors?: ConfigValidationError[];
  warnings?: string[];
}