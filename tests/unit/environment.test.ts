import { loadEnvironment, env, getEnvironmentSummary, validateProductionEnvironment } from '../../src/config/environment';

// Mock import.meta.env
const mockImportMetaEnv = {
  VITE_API_BASE_URL: 'http://localhost:3001',
  VITE_API_TIMEOUT: '5000',
  VITE_ANTHROPIC_API_KEY: 'sk-ant-test-key',
  VITE_OPENAI_API_KEY: 'sk-test-key',
  VITE_AI_PROVIDER: 'anthropic',
  VITE_CORS_ORIGIN: 'http://localhost:5173',
  VITE_RATE_LIMIT_REQUESTS: '100',
  VITE_RATE_LIMIT_WINDOW: '60000',
  VITE_ENABLE_LOGGING: 'true',
  VITE_ENABLE_MONITORING: 'false',
  VITE_ENABLE_CACHE: 'true',
  VITE_MAX_FILE_SIZE: '20971520',
  VITE_MAX_CONCURRENT_REQUESTS: '5',
  VITE_CACHE_TTL: '3600',
  VITE_DEBUG: 'false',
  VITE_RETRY_MAX_ATTEMPTS: '3',
  VITE_RETRY_INITIAL_DELAY: '1000',
  VITE_RETRY_MAX_DELAY: '10000',
  VITE_CIRCUIT_BREAKER_FAILURE_THRESHOLD: '5',
  VITE_CIRCUIT_BREAKER_RESET_TIMEOUT: '60000',
  VITE_CIRCUIT_BREAKER_SUCCESS_THRESHOLD: '2',
  MODE: 'development'
};

// Mock the logger to avoid console output during tests
jest.mock('../../src/core/logging/logger', () => ({
  logger: {
    debug: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
    fatal: jest.fn()
  }
}));

describe('Environment Configuration', () => {
  beforeEach(() => {
    // Reset import.meta.env mock
    Object.defineProperty(global, 'import', {
      value: {
        meta: {
          env: { ...mockImportMetaEnv }
        }
      },
      writable: true
    });
  });

  describe('loadEnvironment', () => {
    it('should load environment with default values', () => {
      const config = loadEnvironment();
      
      expect(config.API_BASE_URL).toBe('http://localhost:3001');
      expect(config.API_TIMEOUT).toBe(5000);
      expect(config.AI_PROVIDER).toBe('anthropic');
      expect(config.ENABLE_LOGGING).toBe(true);
      expect(config.ENABLE_CACHE).toBe(true);
      expect(config.NODE_ENV).toBe('development');
    });

    it('should validate URL format for API_BASE_URL', () => {
      Object.defineProperty(global, 'import', {
        value: {
          meta: {
            env: { ...mockImportMetaEnv, VITE_API_BASE_URL: 'invalid-url' }
          }
        },
        writable: true
      });

      expect(() => loadEnvironment()).toThrow('Invalid environment configuration');
    });

    it('should validate numeric values', () => {
      Object.defineProperty(global, 'import', {
        value: {
          meta: {
            env: { ...mockImportMetaEnv, VITE_API_TIMEOUT: 'invalid-number' }
          }
        },
        writable: true
      });

      expect(() => loadEnvironment()).toThrow('Invalid environment configuration');
    });

    it('should validate enum values', () => {
      Object.defineProperty(global, 'import', {
        value: {
          meta: {
            env: { ...mockImportMetaEnv, VITE_AI_PROVIDER: 'invalid-provider' }
          }
        },
        writable: true
      });

      expect(() => loadEnvironment()).toThrow('Invalid environment configuration');
    });

    it('should handle missing optional values', () => {
      const envWithoutOptional = { ...mockImportMetaEnv };
      delete envWithoutOptional.VITE_ANTHROPIC_API_KEY;
      delete envWithoutOptional.VITE_OPENAI_API_KEY;

      Object.defineProperty(global, 'import', {
        value: {
          meta: {
            env: envWithoutOptional
          }
        },
        writable: true
      });

      const config = loadEnvironment();
      expect(config.ANTHROPIC_API_KEY).toBeUndefined();
      expect(config.OPENAI_API_KEY).toBeUndefined();
    });
  });

  describe('Environment Helpers', () => {
    let config: any;

    beforeEach(() => {
      config = loadEnvironment();
    });

    describe('env.isDevelopment', () => {
      it('should return true for development mode', () => {
        expect(env.isDevelopment()).toBe(true);
      });

      it('should return false for production mode', () => {
        Object.defineProperty(global, 'import', {
          value: {
            meta: {
              env: { ...mockImportMetaEnv, MODE: 'production' }
            }
          },
          writable: true
        });
        
        const prodConfig = loadEnvironment();
        expect(prodConfig.NODE_ENV).toBe('production');
      });
    });

    describe('env.api', () => {
      it('should return API configuration', () => {
        expect(env.api.baseUrl()).toBe('http://localhost:3001');
        expect(env.api.timeout()).toBe(5000);
      });
    });

    describe('env.ai', () => {
      it('should return AI provider configuration', () => {
        expect(env.ai.provider()).toBe('anthropic');
        expect(env.ai.anthropicKey()).toBe('sk-ant-test-key');
        expect(env.ai.openaiKey()).toBe('sk-test-key');
      });
    });

    describe('env.security', () => {
      it('should return security configuration', () => {
        expect(env.security.corsOrigin()).toBe('http://localhost:5173');
        expect(env.security.rateLimitRequests()).toBe(100);
        expect(env.security.rateLimitWindow()).toBe(60000);
      });
    });

    describe('env.features', () => {
      it('should return feature flags', () => {
        expect(env.features.logging()).toBe(true);
        expect(env.features.monitoring()).toBe(false);
        expect(env.features.cache()).toBe(true);
      });
    });

    describe('env.performance', () => {
      it('should return performance configuration', () => {
        expect(env.performance.maxFileSize()).toBe(20971520);
        expect(env.performance.maxConcurrentRequests()).toBe(5);
        expect(env.performance.cacheTTL()).toBe(3600);
      });
    });

    describe('env.retry', () => {
      it('should return retry configuration', () => {
        expect(env.retry.maxAttempts()).toBe(3);
        expect(env.retry.initialDelay()).toBe(1000);
        expect(env.retry.maxDelay()).toBe(10000);
      });
    });

    describe('env.circuitBreaker', () => {
      it('should return circuit breaker configuration', () => {
        expect(env.circuitBreaker.failureThreshold()).toBe(5);
        expect(env.circuitBreaker.resetTimeout()).toBe(60000);
        expect(env.circuitBreaker.successThreshold()).toBe(2);
      });
    });
  });

  describe('validateProductionEnvironment', () => {
    it('should not throw error in development mode', () => {
      expect(() => validateProductionEnvironment()).not.toThrow();
    });

    it('should throw error for missing required variables in production', () => {
      Object.defineProperty(global, 'import', {
        value: {
          meta: {
            env: { 
              ...mockImportMetaEnv, 
              MODE: 'production',
              VITE_API_BASE_URL: '',
              VITE_ANTHROPIC_API_KEY: '',
              VITE_OPENAI_API_KEY: '',
              VITE_CORS_ORIGIN: ''
            }
          }
        },
        writable: true
      });

      const prodConfig = loadEnvironment();
      expect(() => validateProductionEnvironment()).toThrow('Missing required environment variables for production');
    });

    it('should pass validation with all required variables in production', () => {
      Object.defineProperty(global, 'import', {
        value: {
          meta: {
            env: { 
              ...mockImportMetaEnv, 
              MODE: 'production',
              VITE_API_BASE_URL: 'https://api.production.com',
              VITE_CORS_ORIGIN: 'https://app.production.com'
            }
          }
        },
        writable: true
      });

      const prodConfig = loadEnvironment();
      expect(() => validateProductionEnvironment()).not.toThrow();
    });
  });

  describe('getEnvironmentSummary', () => {
    it('should return environment summary', () => {
      const summary = getEnvironmentSummary();
      
      expect(summary.nodeEnv).toBe('development');
      expect(summary.debug).toBe(false);
      expect(summary.apiBaseUrl).toBe('http://localhost:3001');
      expect(summary.aiProvider).toBe('anthropic');
      expect(summary.features).toEqual({
        logging: true,
        monitoring: false,
        cache: true,
      });
      expect(summary.performance).toEqual({
        maxFileSize: '20MB',
        maxConcurrentRequests: 5,
        cacheTTL: '3600s',
      });
      expect(summary.retry).toEqual({
        maxAttempts: 3,
        initialDelay: '1000ms',
        maxDelay: '10000ms',
      });
      expect(summary.circuitBreaker).toEqual({
        failureThreshold: 5,
        resetTimeout: '60000ms',
        successThreshold: 2,
      });
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty string values', () => {
      Object.defineProperty(global, 'import', {
        value: {
          meta: {
            env: { 
              ...mockImportMetaEnv,
              VITE_API_TIMEOUT: '',
              VITE_RATE_LIMIT_REQUESTS: ''
            }
          }
        },
        writable: true
      });

      const config = loadEnvironment();
      expect(config.API_TIMEOUT).toBe(5000); // Default value
      expect(config.RATE_LIMIT_REQUESTS).toBe(100); // Default value
    });

    it('should handle undefined values', () => {
      const envWithUndefined = { ...mockImportMetaEnv };
      delete envWithUndefined.VITE_API_TIMEOUT;
      delete envWithUndefined.VITE_RATE_LIMIT_REQUESTS;

      Object.defineProperty(global, 'import', {
        value: {
          meta: {
            env: envWithUndefined
          }
        },
        writable: true
      });

      const config = loadEnvironment();
      expect(config.API_TIMEOUT).toBe(5000); // Default value
      expect(config.RATE_LIMIT_REQUESTS).toBe(100); // Default value
    });

    it('should validate numeric ranges', () => {
      Object.defineProperty(global, 'import', {
        value: {
          meta: {
            env: { 
              ...mockImportMetaEnv,
              VITE_API_TIMEOUT: '0', // Below minimum
              VITE_MAX_FILE_SIZE: '999999999999' // Above maximum
            }
          }
        },
        writable: true
      });

      expect(() => loadEnvironment()).toThrow('Invalid environment configuration');
    });
  });
});
