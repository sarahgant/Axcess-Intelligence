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
      let envVars: any = {};
      
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
        envVars = process.env;
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
   * Validate configuration against schema
   */
  private static validateConfiguration(config: any): ConfigLoadResult {
    try {
      const validatedConfig = AppConfigSchema.parse(config);
      
      // Check for missing required values
      const errors: ConfigValidationError[] = [];
      const warnings: string[] = [];

      // Validate required API keys
      if (!validatedConfig.providers.anthropic.apiKey) {
        errors.push({
          field: 'providers.anthropic.apiKey',
          message: 'Anthropic API key is required',
          code: 'MISSING_REQUIRED'
        });
      }

      if (!validatedConfig.providers.openai.apiKey) {
        errors.push({
          field: 'providers.openai.apiKey',
          message: 'OpenAI API key is required',
          code: 'MISSING_REQUIRED'
        });
      }

      // Validate encryption key
      if (!validatedConfig.security.encryptionKey || validatedConfig.security.encryptionKey.length < 32) {
        errors.push({
          field: 'security.encryptionKey',
          message: 'Encryption key must be at least 32 characters long',
          code: 'INVALID_VALUE'
        });
      }

      // Add warnings for development environment
      if (validatedConfig.environment === 'development') {
        warnings.push('Running in development mode - some security features are disabled');
      }

      if (errors.length > 0) {
        return {
          success: false,
          errors,
          warnings
        };
      }

      return {
        success: true,
        config: validatedConfig,
        warnings
      };
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors: ConfigValidationError[] = error.issues.map(issue => ({
          field: issue.path.join('.'),
          message: issue.message,
          code: issue.code
        }));

        return {
          success: false,
          errors
        };
      }

      return {
        success: false,
        errors: [{
          field: 'general',
          message: error instanceof Error ? error.message : 'Unknown validation error',
          code: 'VALIDATION_ERROR'
        }]
      };
    }
  }

  /**
   * Deep merge two configuration objects
   */
  private static mergeConfigs(base: any, override: any): any {
    const result = { ...base };
    
    for (const key in override) {
      if (override[key] !== undefined) {
        if (typeof override[key] === 'object' && override[key] !== null && !Array.isArray(override[key])) {
          result[key] = this.mergeConfigs(result[key] || {}, override[key]);
        } else {
          result[key] = override[key];
        }
      }
    }
    
    return result;
  }

  /**
   * Remove undefined values from configuration object
   */
  private static removeUndefinedValues(obj: any): any {
    const result: any = {};
    
    for (const key in obj) {
      if (obj[key] !== undefined) {
        if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
          const nestedResult = this.removeUndefinedValues(obj[key]);
          if (Object.keys(nestedResult).length > 0) {
            result[key] = nestedResult;
          }
        } else {
          result[key] = obj[key];
        }
      }
    }
    
    return result;
  }

  /**
   * Get configuration summary for debugging
   */
  static getConfigSummary(): any {
    if (!this.instance) {
      return { loaded: false };
    }

    // Return config with sensitive values masked
    const summary = { ...this.instance };
    
    // Mask API keys
    if (summary.providers.anthropic.apiKey) {
      summary.providers.anthropic.apiKey = '***' + summary.providers.anthropic.apiKey.slice(-4);
    }
    if (summary.providers.openai.apiKey) {
      summary.providers.openai.apiKey = '***' + summary.providers.openai.apiKey.slice(-4);
    }
    
    // Mask encryption key
    if (summary.security.encryptionKey) {
      summary.security.encryptionKey = '***' + summary.security.encryptionKey.slice(-4);
    }

    return {
      loaded: true,
      config: summary
    };
  }
}