import { z } from 'zod';
import { logger } from '../core/logging/logger';

/**
 * 🚨 CRITICAL ARCHITECTURE REMINDER 🚨
 * 
 * ENVIRONMENT FILES ALREADY EXIST - DO NOT CREATE OR MODIFY THEM!
 * 
 * - Frontend (/.env): Configuration only, NO API keys
 * - Backend (/server/.env): All API keys and secrets
 * - Frontend uses: import.meta.env.VITE_*
 * - Backend uses: process.env.*
 * - All AI calls go through backend proxy
 * 
 * See: docs/ARCHITECTURE_CONSTRAINTS.md for complete details
 */

/**
 * Environment schema with validation and defaults
 */
const envSchema = z.object({
  // API Configuration
  API_BASE_URL: z.string().url().default('http://localhost:3001/api'),
  API_TIMEOUT: z.number().min(1000).max(30000).default(5000),

  // AI Provider Selection (frontend only knows about provider choice, not keys)
  AI_PROVIDER: z.enum(['anthropic', 'openai', 'azure']).default('anthropic'),

  // Security
  CORS_ORIGIN: z.string().default('http://localhost:5173'),
  RATE_LIMIT_REQUESTS: z.number().min(1).max(1000).default(100),
  RATE_LIMIT_WINDOW: z.number().min(1000).max(3600000).default(60000), // 1 minute

  // Features
  ENABLE_LOGGING: z.boolean().default(true),
  ENABLE_MONITORING: z.boolean().default(false),
  ENABLE_CACHE: z.boolean().default(true),

  // Performance
  MAX_FILE_SIZE: z.number().min(1024 * 1024).max(100 * 1024 * 1024).default(20 * 1024 * 1024), // 20MB
  MAX_CONCURRENT_REQUESTS: z.number().min(1).max(50).default(5),
  CACHE_TTL: z.number().min(60).max(86400).default(3600), // 1 hour

  // Development
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  DEBUG: z.boolean().default(false),

  // Retry Configuration
  RETRY_MAX_ATTEMPTS: z.number().min(1).max(10).default(3),
  RETRY_INITIAL_DELAY: z.number().min(100).max(10000).default(1000),
  RETRY_MAX_DELAY: z.number().min(1000).max(60000).default(10000),

  // Circuit Breaker Configuration
  CIRCUIT_BREAKER_FAILURE_THRESHOLD: z.number().min(1).max(20).default(5),
  CIRCUIT_BREAKER_RESET_TIMEOUT: z.number().min(1000).max(300000).default(60000), // 1 minute
  CIRCUIT_BREAKER_SUCCESS_THRESHOLD: z.number().min(1).max(10).default(2),
});

export type Environment = z.infer<typeof envSchema>;

/**
 * Safely parse numeric environment variables with fallbacks
 */
function parseNumber(value: string | undefined, defaultValue: number): number {
  if (!value || value.trim() === '') {
    return defaultValue;
  }

  const parsed = Number(value);
  if (isNaN(parsed)) {
    logger.warn(`Invalid numeric value for environment variable: ${value}, using default: ${defaultValue}`);
    return defaultValue;
  }

  return parsed;
}

/**
 * Safely parse boolean environment variables
 */
function parseBoolean(value: string | undefined, defaultValue: boolean): boolean {
  if (!value || value.trim() === '') {
    return defaultValue;
  }

  return value.toLowerCase() === 'true';
}

/**
 * Load and validate environment configuration
 */
export function loadEnvironment(): Environment {
  // Get environment variables with fallback for testing
  const getEnvVar = (key: string): string | undefined => {
    if (typeof import.meta !== 'undefined' && (import.meta as any).env) {
      return (import.meta as any).env[key];
    }
    // Fallback for testing environment
    return (process as any).env?.[key];
  };

  const env = {
    API_BASE_URL: (getEnvVar('VITE_API_BASE_URL') || 'http://localhost:3001') + (getEnvVar('VITE_API_BASE_URL')?.includes('/api') ? '' : '/api'),
    FRONTEND_PORT: 5173, // Vite default port, NOT 3000
    API_TIMEOUT: parseNumber(getEnvVar('VITE_API_TIMEOUT'), 5000),
    AI_PROVIDER: getEnvVar('VITE_AI_PROVIDER') || 'anthropic',
    CORS_ORIGIN: getEnvVar('VITE_CORS_ORIGIN') || 'http://localhost:5173',
    RATE_LIMIT_REQUESTS: parseNumber(getEnvVar('VITE_RATE_LIMIT_REQUESTS'), 100),
    RATE_LIMIT_WINDOW: parseNumber(getEnvVar('VITE_RATE_LIMIT_WINDOW'), 60000),
    ENABLE_LOGGING: parseBoolean(getEnvVar('VITE_ENABLE_LOGGING'), true),
    ENABLE_MONITORING: parseBoolean(getEnvVar('VITE_ENABLE_MONITORING'), false),
    ENABLE_CACHE: parseBoolean(getEnvVar('VITE_ENABLE_CACHE'), true),
    MAX_FILE_SIZE: parseNumber(getEnvVar('VITE_MAX_FILE_SIZE'), 20 * 1024 * 1024),
    MAX_CONCURRENT_REQUESTS: parseNumber(getEnvVar('VITE_MAX_CONCURRENT_REQUESTS'), 5),
    CACHE_TTL: parseNumber(getEnvVar('VITE_CACHE_TTL'), 3600),
    NODE_ENV: getEnvVar('MODE') || 'development',
    DEBUG: parseBoolean(getEnvVar('VITE_DEBUG'), false),
    RETRY_MAX_ATTEMPTS: parseNumber(getEnvVar('VITE_RETRY_MAX_ATTEMPTS'), 3),
    RETRY_INITIAL_DELAY: parseNumber(getEnvVar('VITE_RETRY_INITIAL_DELAY'), 1000),
    RETRY_MAX_DELAY: parseNumber(getEnvVar('VITE_RETRY_MAX_DELAY'), 10000),
    CIRCUIT_BREAKER_FAILURE_THRESHOLD: parseNumber(getEnvVar('VITE_CIRCUIT_BREAKER_FAILURE_THRESHOLD'), 5),
    CIRCUIT_BREAKER_RESET_TIMEOUT: parseNumber(getEnvVar('VITE_CIRCUIT_BREAKER_RESET_TIMEOUT'), 60000),
    CIRCUIT_BREAKER_SUCCESS_THRESHOLD: parseNumber(getEnvVar('VITE_CIRCUIT_BREAKER_SUCCESS_THRESHOLD'), 2)
  };

  try {
    const validatedEnv = envSchema.parse(env);

    logger.info('Environment configuration loaded successfully', {
      nodeEnv: validatedEnv.NODE_ENV,
      apiBaseUrl: validatedEnv.API_BASE_URL,
      aiProvider: validatedEnv.AI_PROVIDER,
      enableLogging: validatedEnv.ENABLE_LOGGING,
      enableCache: validatedEnv.ENABLE_CACHE,
      debug: validatedEnv.DEBUG
    });

    return validatedEnv;
  } catch (error) {
    logger.error('Environment validation failed', {
      error: error instanceof Error ? error.message : String(error),
      env: Object.keys(env).filter(key => env[key as keyof typeof env] !== undefined)
    });
    throw new Error(`Invalid environment configuration: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * Get environment configuration with validation
 */
export const config = loadEnvironment();

/**
 * Environment configuration helpers
 */
export const env = {
  /**
   * Check if running in development mode
   */
  isDevelopment: () => config.NODE_ENV === 'development',

  /**
   * Check if running in production mode
   */
  isProduction: () => config.NODE_ENV === 'production',

  /**
   * Check if running in test mode
   */
  isTest: () => config.NODE_ENV === 'test',

  /**
   * Check if debug mode is enabled
   */
  isDebug: () => config.DEBUG,

  /**
   * Get API configuration
   */
  api: {
    baseUrl: () => config.API_BASE_URL,
    timeout: () => config.API_TIMEOUT,
  },

  /**
   * Get AI provider configuration
   */
  ai: {
    provider: () => config.AI_PROVIDER,
  },

  /**
   * Get security configuration
   */
  security: {
    corsOrigin: () => config.CORS_ORIGIN,
    rateLimitRequests: () => config.RATE_LIMIT_REQUESTS,
    rateLimitWindow: () => config.RATE_LIMIT_WINDOW,
  },

  /**
   * Get feature flags
   */
  features: {
    logging: () => config.ENABLE_LOGGING,
    monitoring: () => config.ENABLE_MONITORING,
    cache: () => config.ENABLE_CACHE,
  },

  /**
   * Get performance configuration
   */
  performance: {
    maxFileSize: () => config.MAX_FILE_SIZE,
    maxConcurrentRequests: () => config.MAX_CONCURRENT_REQUESTS,
    cacheTTL: () => config.CACHE_TTL,
  },

  /**
   * Get retry configuration
   */
  retry: {
    maxAttempts: () => config.RETRY_MAX_ATTEMPTS,
    initialDelay: () => config.RETRY_INITIAL_DELAY,
    maxDelay: () => config.RETRY_MAX_DELAY,
  },

  /**
   * Get circuit breaker configuration
   */
  circuitBreaker: {
    failureThreshold: () => config.CIRCUIT_BREAKER_FAILURE_THRESHOLD,
    resetTimeout: () => config.CIRCUIT_BREAKER_RESET_TIMEOUT,
    successThreshold: () => config.CIRCUIT_BREAKER_SUCCESS_THRESHOLD,
  },
};

/**
 * Validate required environment variables for production
 */
export function validateProductionEnvironment(): void {
  if (env.isProduction()) {
    const requiredVars = [
      'API_BASE_URL',
      'CORS_ORIGIN'
    ];

    const missingVars = requiredVars.filter(varName => {
      const value = config[varName as keyof Environment];
      return value === undefined || value === '';
    });

    if (missingVars.length > 0) {
      throw new Error(`Missing required environment variables for production: ${missingVars.join(', ')}`);
    }

    logger.info('Production environment validation passed');
  }
}

/**
 * Get environment summary for debugging
 */
export function getEnvironmentSummary(): Record<string, unknown> {
  return {
    nodeEnv: config.NODE_ENV,
    debug: config.DEBUG,
    apiBaseUrl: config.API_BASE_URL,
    aiProvider: config.AI_PROVIDER,
    features: {
      logging: config.ENABLE_LOGGING,
      monitoring: config.ENABLE_MONITORING,
      cache: config.ENABLE_CACHE,
    },
    performance: {
      maxFileSize: `${config.MAX_FILE_SIZE / (1024 * 1024)}MB`,
      maxConcurrentRequests: config.MAX_CONCURRENT_REQUESTS,
      cacheTTL: `${config.CACHE_TTL}s`,
    },
    retry: {
      maxAttempts: config.RETRY_MAX_ATTEMPTS,
      initialDelay: `${config.RETRY_INITIAL_DELAY}ms`,
      maxDelay: `${config.RETRY_MAX_DELAY}ms`,
    },
    circuitBreaker: {
      failureThreshold: config.CIRCUIT_BREAKER_FAILURE_THRESHOLD,
      resetTimeout: `${config.CIRCUIT_BREAKER_RESET_TIMEOUT}ms`,
      successThreshold: config.CIRCUIT_BREAKER_SUCCESS_THRESHOLD,
    },
  };
}
