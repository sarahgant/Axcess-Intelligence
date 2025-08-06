import { z } from 'zod';
import { logger } from '../core/logging/logger';

/**
 * Environment schema with validation and defaults
 */
const envSchema = z.object({
  // API Configuration
  API_BASE_URL: z.string().url().default('http://localhost:3001'),
  API_TIMEOUT: z.number().min(1000).max(30000).default(5000),
  
  // AI Providers
  ANTHROPIC_API_KEY: z.string().optional(),
  OPENAI_API_KEY: z.string().optional(),
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
 * Load and validate environment configuration
 */
export function loadEnvironment(): Environment {
  // Get environment variables with fallback for testing
  const getEnvVar = (key: string): string | undefined => {
    if (typeof import.meta !== 'undefined' && import.meta.env) {
      return import.meta.env[key];
    }
    // Fallback for testing environment
    return process.env[key];
  };

  const env = {
    API_BASE_URL: getEnvVar('VITE_API_BASE_URL'),
    API_TIMEOUT: Number(getEnvVar('VITE_API_TIMEOUT')),
    ANTHROPIC_API_KEY: getEnvVar('VITE_ANTHROPIC_API_KEY'),
    OPENAI_API_KEY: getEnvVar('VITE_OPENAI_API_KEY'),
    AI_PROVIDER: getEnvVar('VITE_AI_PROVIDER'),
    CORS_ORIGIN: getEnvVar('VITE_CORS_ORIGIN'),
    RATE_LIMIT_REQUESTS: Number(getEnvVar('VITE_RATE_LIMIT_REQUESTS')),
    RATE_LIMIT_WINDOW: Number(getEnvVar('VITE_RATE_LIMIT_WINDOW')),
    ENABLE_LOGGING: getEnvVar('VITE_ENABLE_LOGGING') === 'true',
    ENABLE_MONITORING: getEnvVar('VITE_ENABLE_MONITORING') === 'true',
    ENABLE_CACHE: getEnvVar('VITE_ENABLE_CACHE') === 'true',
    MAX_FILE_SIZE: Number(getEnvVar('VITE_MAX_FILE_SIZE')),
    MAX_CONCURRENT_REQUESTS: Number(getEnvVar('VITE_MAX_CONCURRENT_REQUESTS')),
    CACHE_TTL: Number(getEnvVar('VITE_CACHE_TTL')),
    NODE_ENV: getEnvVar('MODE') || 'development',
    DEBUG: getEnvVar('VITE_DEBUG') === 'true',
    RETRY_MAX_ATTEMPTS: Number(getEnvVar('VITE_RETRY_MAX_ATTEMPTS')),
    RETRY_INITIAL_DELAY: Number(getEnvVar('VITE_RETRY_INITIAL_DELAY')),
    RETRY_MAX_DELAY: Number(getEnvVar('VITE_RETRY_MAX_DELAY')),
    CIRCUIT_BREAKER_FAILURE_THRESHOLD: Number(getEnvVar('VITE_CIRCUIT_BREAKER_FAILURE_THRESHOLD')),
    CIRCUIT_BREAKER_RESET_TIMEOUT: Number(getEnvVar('VITE_CIRCUIT_BREAKER_RESET_TIMEOUT')),
    CIRCUIT_BREAKER_SUCCESS_THRESHOLD: Number(getEnvVar('VITE_CIRCUIT_BREAKER_SUCCESS_THRESHOLD')),
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
    anthropicKey: () => config.ANTHROPIC_API_KEY,
    openaiKey: () => config.OPENAI_API_KEY,
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
      'ANTHROPIC_API_KEY',
      'OPENAI_API_KEY',
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
