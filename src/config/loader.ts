import { z } from 'zod';
import { 
  AppConfig, 
  AppConfigSchema, 
  EnvSchema, 
  ConfigValidationError, 
  ConfigLoadResult 
} from './schema';
import { DEFAULT_CONFIG, getEnvironmentOverrides, REQUIRED_ENV_VARS } from './defaults';

/**
 * Environment variables interface for type safety
 */
interface EnvironmentVariables {
  ANTHROPIC_API_KEY?: string;
  OPENAI_API_KEY?: string;
  ANTHROPIC_BASE_URL?: string;
  OPENAI_BASE_URL?: string;
  OPENAI_ORGANIZATION?: string;
  ANTHROPIC_DEFAULT_MODEL?: string;
  OPENAI_DEFAULT_MODEL?: string;
  ENCRYPTION_KEY?: string;
  ENABLE_STREAMING?: boolean;
  ENABLE_DOCUMENT_ANALYSIS?: boolean;
  ENABLE_RAG_SEARCH?: boolean;
  ENABLE_CHAT_HISTORY?: boolean;
  MAX_DOCUMENTS_PER_SESSION?: number;
  MAX_CHAT_HISTORY_ENTRIES?: number;
  DOCUMENT_RETENTION_HOURS?: number;
  ENABLE_DEBUG_MODE?: boolean;
  ALLOWED_ORIGINS?: string;
  ENABLE_CORS?: boolean;
  RATE_LIMIT_PER_MINUTE?: number;
  CACHE_ENABLED?: boolean;
  CACHE_TTL_MINUTES?: number;
  ENABLE_SERVICE_WORKER?: boolean;
  MAX_CONCURRENT_REQUESTS?: number;
  NODE_ENV?: string;
  LOG_LEVEL?: string;
  [key: string]: string | number | boolean | undefined; // For other environment variables
}

/**
 * Configuration validation result interface
 */
interface ConfigValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

/**
 * Configuration merge result interface
 */
interface ConfigMergeResult {
  merged: Partial<AppConfig>;
  conflicts: string[];
}

/**
 * Configuration loader class for managing application configuration
 * Supports loading from environment variables, local config files, and defaults
 */
export class ConfigLoader {
  private static instance: AppConfig | null = null;
  private static loadPromise: Promise<AppConfig> | null = null;

  /**
   * Load and validate application configuration
   * Implements singleton pattern for consistent configuration across the app
   */
  static async load(): Promise<AppConfig> {
    // Return cached instance if available
    if (this.instance) {
      return this.instance;
    }

    // Return existing load promise if already loading
    if (this.loadPromise) {
      return this.loadPromise;
    }

    // Start loading configuration
    this.loadPromise = this.loadConfiguration();
    
    try {
      this.instance = await this.loadPromise;
      return this.instance;
    } catch (error) {
      this.loadPromise = null; // Reset promise to allow retry
      throw error;
    }
  }

  /**
   * Force reload of configuration (useful for testing or config updates)
   */
  static async reload(): Promise<AppConfig> {
    this.instance = null;
    this.loadPromise = null;
    return this.load();
  }

  /**
   * Get current configuration instance (throws if not loaded)
   */
  static getInstance(): AppConfig {
    if (!this.instance) {
      throw new Error('Configuration not loaded. Call ConfigLoader.load() first.');
    }
    return this.instance;
  }

  /**
   * Check if configuration is loaded
   */
  static isLoaded(): boolean {
    return this.instance !== null;
  }

  /**
   * Private method to load configuration from various sources
   */
  private static async loadConfiguration(): Promise<AppConfig> {
    const loadResult = await this.loadFromSources();
    
    if (!loadResult.success || !loadResult.config) {
      const errorMessage = loadResult.errors
        ?.map(err => `${err.field}: ${err.message}`)
        .join(', ') || 'Unknown configuration error';
      
      throw new Error(`Configuration validation failed: ${errorMessage}`);
    }

    // Log warnings if any
    if (loadResult.warnings?.length) {
      console.warn('Configuration warnings:', loadResult.warnings);
    }

    return loadResult.config;
  }

  /**
   * Load configuration from multiple sources with precedence
   * Priority: Environment Variables > Local Config File > Defaults
   */
  private static async loadFromSources(): Promise<ConfigLoadResult> {
    try {
      // Start with default configuration
      let config = { ...DEFAULT_CONFIG };

      // Load from local config file if available
      const localConfig = await this.loadFromLocalConfig();
      if (localConfig) {
        config = this.mergeConfigs(config, localConfig);
      }

      // Load from environment variables (highest priority)
      const envConfig = this.loadFromEnvironment();
      if (envConfig) {
        config = this.mergeConfigs(config, envConfig);
      }

      // Apply environment-specific overrides
      const envOverrides = getEnvironmentOverrides(config.environment);
      if (envOverrides) {
        config = this.mergeConfigs(config, envOverrides);
      }

      // Validate the final configuration
      const validationResult = this.validateConfiguration(config);
      
      return validationResult;
    } catch (error) {
      return {
        success: false,
        errors: [{
          field: 'general',
          message: error instanceof Error ? error.message : 'Unknown error during configuration loading',
          code: 'LOAD_ERROR'
        }]
      };
    }
  }

  /**
   * Load configuration from environment variables
   */
  private static loadFromEnvironment(): Partial<AppConfig> | null {
    try {
      // Parse environment variables 
      // In browser: use import.meta.env for VITE_ prefixed vars
      // For API keys: they should be handled by the server/build process
      let envVars: EnvironmentVariables = {};
      
      if (typeof window !== 'undefined') {
        // Browser environment - use Vite env vars
        envVars = {
          ...import.meta.env,
          // For demo purposes, try to get API keys from import.meta.env too
          ANTHROPIC_API_KEY: import.meta.env.ANTHROPIC_API_KEY || import.meta.env.VITE_ANTHROPIC_API_KEY,
          OPENAI_API_KEY: import.meta.env.OPENAI_API_KEY || import.meta.env.VITE_OPENAI_API_KEY,
          // Convert VITE_ prefixed vars to expected names
          ENCRYPTION_KEY: import.meta.env.VITE_ENCRYPTION_KEY,
          ENABLE_STREAMING: import.meta.env.VITE_ENABLE_STREAMING,
          ENABLE_DOCUMENT_ANALYSIS: import.meta.env.VITE_ENABLE_DOCUMENT_ANALYSIS,
          ENABLE_RAG_SEARCH: import.meta.env.VITE_ENABLE_RAG_SEARCH,
          ENABLE_CHAT_HISTORY: import.meta.env.VITE_ENABLE_CHAT_HISTORY,
          ENABLE_DEBUG_MODE: import.meta.env.VITE_ENABLE_DEBUG_MODE,
          MAX_DOCUMENTS_PER_SESSION: import.meta.env.VITE_MAX_DOCUMENTS_PER_SESSION,
          MAX_CHAT_HISTORY_ENTRIES: import.meta.env.VITE_MAX_CHAT_HISTORY_ENTRIES,
          DOCUMENT_RETENTION_HOURS: import.meta.env.VITE_DOCUMENT_RETENTION_HOURS,
          NODE_ENV: import.meta.env.VITE_APP_ENVIRONMENT || import.meta.env.NODE_ENV,
          LOG_LEVEL: import.meta.env.VITE_LOG_LEVEL
        };
      } else {
        // Node.js environment
        envVars = process.env as EnvironmentVariables;
      }
      
      const envResult = EnvSchema.safeParse(envVars);
      
      if (!envResult.success) {
        console.warn('Environment variable parsing warnings:', envResult.error.issues);
        return null;
      }

      const env = envResult.data;
      
      // Convert environment variables to config structure
      const envConfig: Partial<AppConfig> = {
        providers: {
                  anthropic: {
          apiKey: env.ANTHROPIC_API_KEY || '',
          baseUrl: env.ANTHROPIC_BASE_URL,
          defaultModel: env.ANTHROPIC_DEFAULT_MODEL as any || 'claude-sonnet-4-20250514',
          maxRetries: 3,
          timeout: 30000,
        },
        openai: {
          apiKey: env.OPENAI_API_KEY || '',
          baseUrl: env.OPENAI_BASE_URL,
          organization: env.OPENAI_ORGANIZATION,
          defaultModel: env.OPENAI_DEFAULT_MODEL as any || 'gpt-4.1',
          maxRetries: 3,
          timeout: 30000,
        },
        },
        features: {
          enableStreaming: env.ENABLE_STREAMING,
          enableDocumentAnalysis: env.ENABLE_DOCUMENT_ANALYSIS,
          enableRAGSearch: env.ENABLE_RAG_SEARCH,
          enableChatHistory: env.ENABLE_CHAT_HISTORY,
          maxDocumentsPerSession: env.MAX_DOCUMENTS_PER_SESSION,
          maxChatHistoryEntries: env.MAX_CHAT_HISTORY_ENTRIES,
          documentRetentionHours: env.DOCUMENT_RETENTION_HOURS,
          enableDebugMode: env.ENABLE_DEBUG_MODE,
        },
        security: {
          encryptionKey: env.ENCRYPTION_KEY || '',
          allowedOrigins: env.ALLOWED_ORIGINS ? env.ALLOWED_ORIGINS.split(',') : undefined,
          enableCORS: env.ENABLE_CORS,
          rateLimitPerMinute: env.RATE_LIMIT_PER_MINUTE,
        },
        performance: {
          cacheEnabled: env.CACHE_ENABLED,
          cacheTTLMinutes: env.CACHE_TTL_MINUTES,
          enableServiceWorker: env.ENABLE_SERVICE_WORKER,
          maxConcurrentRequests: env.MAX_CONCURRENT_REQUESTS,
        },
        environment: env.NODE_ENV || 'development',
        logLevel: env.LOG_LEVEL || 'info',
      };

      // Remove undefined values to avoid overriding defaults
      return this.removeUndefinedValues(envConfig);
    } catch (error) {
      console.warn('Failed to load environment configuration:', error);
      return null;
    }
  }

  /**
   * Load configuration from local config.json file
   */
  private static async loadFromLocalConfig(): Promise<Partial<AppConfig> | null> {
    try {
      // Try to load config.json from the project root
      const configPath = './config.json';
      
      // In a browser environment, we can't load files directly
      // This would be implemented differently in a Node.js backend
      if (typeof window !== 'undefined') {
        return null; // Skip file loading in browser
      }

      // Node.js environment (for testing or SSR)
      const fs = await import('fs');
      const path = await import('path');
      
      const fullPath = path.resolve(configPath);
      
      if (!fs.existsSync(fullPath)) {
        return null;
      }

      const configContent = fs.readFileSync(fullPath, 'utf-8');
      const localConfig = JSON.parse(configContent);
      
      return localConfig;
    } catch (error) {
      console.warn('Failed to load local configuration file:', error);
      return null;
    }
  }

  /**
   * Validate configuration structure and values
   */
  private static validateConfiguration(config: Partial<AppConfig>): ConfigValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Validate providers configuration
    if (config.providers) {
      if (config.providers.anthropic) {
        if (!config.providers.anthropic.apiKey) {
          errors.push('Anthropic API key is required');
        }
        if (config.providers.anthropic.apiKey && config.providers.anthropic.apiKey.length < 10) {
          warnings.push('Anthropic API key appears to be invalid (too short)');
        }
      }

      if (config.providers.openai) {
        if (!config.providers.openai.apiKey) {
          errors.push('OpenAI API key is required');
        }
        if (config.providers.openai.apiKey && config.providers.openai.apiKey.length < 10) {
          warnings.push('OpenAI API key appears to be invalid (too short)');
        }
      }
    }

    // Validate features configuration
    if (config.features) {
      if (config.features.maxDocumentsPerSession && config.features.maxDocumentsPerSession <= 0) {
        errors.push('maxDocumentsPerSession must be greater than 0');
      }
      if (config.features.maxChatHistoryEntries && config.features.maxChatHistoryEntries <= 0) {
        errors.push('maxChatHistoryEntries must be greater than 0');
      }
      if (config.features.documentRetentionHours && config.features.documentRetentionHours <= 0) {
        errors.push('documentRetentionHours must be greater than 0');
      }
    }

    // Validate security configuration
    if (config.security) {
      if (config.security.encryptionKey && config.security.encryptionKey.length < 16) {
        warnings.push('Encryption key should be at least 16 characters long');
      }
      if (config.security.rateLimitPerMinute && config.security.rateLimitPerMinute <= 0) {
        errors.push('rateLimitPerMinute must be greater than 0');
      }
    }

    // Validate performance configuration
    if (config.performance) {
      if (config.performance.cacheTTLMinutes && config.performance.cacheTTLMinutes <= 0) {
        errors.push('cacheTTLMinutes must be greater than 0');
      }
      if (config.performance.maxConcurrentRequests && config.performance.maxConcurrentRequests <= 0) {
        errors.push('maxConcurrentRequests must be greater than 0');
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }

  /**
   * Merge configuration objects with conflict detection
   */
  private static mergeConfigs(base: Partial<AppConfig>, override: Partial<AppConfig>): ConfigMergeResult {
    const merged = { ...base };
    const conflicts: string[] = [];

    // Helper function to merge nested objects
    const mergeNested = (baseObj: Record<string, unknown>, overrideObj: Record<string, unknown>, path: string): void => {
      for (const [key, value] of Object.entries(overrideObj)) {
        const fullPath = `${path}.${key}`;
        
        if (key in baseObj) {
          if (typeof value === 'object' && value !== null && typeof baseObj[key] === 'object' && baseObj[key] !== null) {
            // Recursively merge nested objects
            mergeNested(baseObj[key] as Record<string, unknown>, value as Record<string, unknown>, fullPath);
          } else if (baseObj[key] !== value) {
            // Conflict detected
            conflicts.push(`${fullPath}: base="${baseObj[key]}" vs override="${value}"`);
            merged[key] = value;
          }
        } else {
          // New property
          merged[key] = value;
        }
      }
    };

    // Merge top-level properties
    for (const [key, value] of Object.entries(override)) {
      if (key in merged) {
        if (typeof value === 'object' && value !== null && typeof merged[key] === 'object' && merged[key] !== null) {
          // Recursively merge nested objects
          mergeNested(merged[key] as Record<string, unknown>, value as Record<string, unknown>, key);
        } else if (merged[key] !== value) {
          // Conflict detected
          conflicts.push(`${key}: base="${merged[key]}" vs override="${value}"`);
          merged[key] = value;
        }
      } else {
        // New property
        merged[key] = value;
      }
    }

    return {
      merged,
      conflicts
    };
  }

  /**
   * Remove undefined values from configuration object
   */
  private static removeUndefinedValues(obj: Record<string, unknown>): Record<string, unknown> {
    const result: Record<string, unknown> = {};
    
    for (const [key, value] of Object.entries(obj)) {
      if (value !== undefined) {
        if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
          // Recursively clean nested objects
          const cleaned = this.removeUndefinedValues(value as Record<string, unknown>);
          if (Object.keys(cleaned).length > 0) {
            result[key] = cleaned;
          }
        } else {
          result[key] = value;
        }
      }
    }
    
    return result;
  }

  /**
   * Get a summary of the current configuration for debugging
   */
  static getConfigSummary(): Record<string, unknown> {
    const config = this.getInstance();
    
    return {
      environment: config.environment,
      logLevel: config.logLevel,
      providers: {
        anthropic: {
          configured: !!config.providers.anthropic.apiKey,
          hasBaseUrl: !!config.providers.anthropic.baseUrl,
          model: config.providers.anthropic.defaultModel
        },
        openai: {
          configured: !!config.providers.openai.apiKey,
          hasBaseUrl: !!config.providers.openai.baseUrl,
          model: config.providers.openai.defaultModel
        }
      },
      features: {
        streaming: config.features.enableStreaming,
        documentAnalysis: config.features.enableDocumentAnalysis,
        ragSearch: config.features.enableRAGSearch,
        chatHistory: config.features.enableChatHistory,
        debugMode: config.features.enableDebugMode
      },
      security: {
        hasEncryptionKey: !!config.security.encryptionKey,
        corsEnabled: config.security.enableCORS,
        rateLimit: config.security.rateLimitPerMinute
      },
      performance: {
        cacheEnabled: config.performance.cacheEnabled,
        serviceWorker: config.performance.enableServiceWorker,
        maxConcurrent: config.performance.maxConcurrentRequests
      }
    };
  }
}