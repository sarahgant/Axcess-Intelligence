/**
 * Configuration module - Main entry point
 * Provides centralized configuration management for the application
 */

import { logger } from '../core/logging/logger';

// Core configuration exports
export { ConfigLoader } from './loader';
export { EnvHelper } from './env-helper';

// Import for internal use
import { ConfigLoader } from './loader';

// Schema and type exports
export type {
  AppConfig,
  ProviderConfig,
  FeatureConfig,
  SecurityConfig,
  PerformanceConfig,
  EnvConfig,
  ConfigValidationError,
  ConfigLoadResult
} from './schema';

export {
  AppConfigSchema,
  ProviderConfigSchema,
  FeatureConfigSchema,
  SecurityConfigSchema,
  PerformanceConfigSchema,
  EnvSchema
} from './schema';

// Default configuration exports
export {
  DEFAULT_CONFIG,
  PRODUCTION_CONFIG_OVERRIDES,
  DEVELOPMENT_CONFIG_OVERRIDES,
  REQUIRED_ENV_VARS,
  OPTIONAL_ENV_VARS,
  getEnvironmentOverrides
} from './defaults';

/**
 * Initialize configuration system
 * This should be called early in the application lifecycle
 */
export async function initializeConfig(): Promise<AppConfig> {
  try {
    const config = await ConfigLoader.load();

    // Log configuration summary in development
    if (config.environment === 'development' && config.features.enableDebugMode) {
      logger.info('Configuration loaded', {
        component: 'Config',
        summary: ConfigLoader.getConfigSummary()
      });
    }

    return config;
  } catch (error) {
    logger.error('Failed to initialize configuration', {
      component: 'Config',
      error: error instanceof Error ? error.message : String(error)
    });
    throw error;
  }
}

/**
 * Get current configuration (must be initialized first)
 */
export function getConfig(): AppConfig {
  return ConfigLoader.getInstance();
}

/**
 * Check if configuration is ready
 */
export function isConfigReady(): boolean {
  return ConfigLoader.isLoaded();
}

/**
 * Reload configuration (useful for development or admin interfaces)
 */
export async function reloadConfig(): Promise<AppConfig> {
  logger.info('Reloading configuration', { component: 'Config' });
  return ConfigLoader.reload();
}

/**
 * Configuration utilities for common tasks
 */
export const ConfigUtils = {
  /**
   * Check if a specific AI provider is configured
   */
  isProviderConfigured: (provider: 'anthropic' | 'openai'): boolean => {
    try {
      const config = getConfig();
      return !!config.providers[provider].apiKey;
    } catch {
      return false;
    }
  },

  /**
   * Check if a feature is enabled
   */
  isFeatureEnabled: (feature: keyof FeatureConfig): boolean => {
    try {
      const config = getConfig();
      return !!config.features[feature];
    } catch {
      return false;
    }
  },

  /**
   * Get the preferred AI provider based on configuration
   */
  getPreferredProvider: (): 'anthropic' | 'openai' | null => {
    try {
      const config = getConfig();

      // Prefer Anthropic if both are configured
      if (config.providers.anthropic.apiKey) return 'anthropic';
      if (config.providers.openai.apiKey) return 'openai';

      return null;
    } catch {
      return null;
    }
  },

  /**
   * Get configuration for a specific provider
   */
  getProviderConfig: (provider: 'anthropic' | 'openai') => {
    const config = getConfig();
    return config.providers[provider];
  },

  /**
   * Check if running in development mode
   */
  isDevelopment: (): boolean => {
    try {
      const config = getConfig();
      return config.environment === 'development';
    } catch {
      return false;
    }
  },

  /**
   * Check if running in production mode
   */
  isProduction: (): boolean => {
    try {
      const config = getConfig();
      return config.environment === 'production';
    } catch {
      return false;
    }
  },

  /**
   * Get logging configuration
   */
  getLogLevel: (): string => {
    try {
      const config = getConfig();
      return config.logLevel;
    } catch {
      return 'info';
    }
  },

  /**
   * Check if debug mode is enabled
   */
  isDebugMode: (): boolean => {
    try {
      const config = getConfig();
      return config.features.enableDebugMode;
    } catch {
      return false;
    }
  }
};

/**
 * Development helper functions
 */
export const DevHelpers = {
  /**
   * Generate .env file content for setup
   */
  generateEnvFile: (config?: Partial<AppConfig>) => {
    return EnvHelper.generateEnvFile(config);
  },

  /**
   * Get setup instructions
   */
  getSetupInstructions: () => {
    return EnvHelper.getSetupInstructions();
  },

  /**
   * Validate current environment setup
   */
  validateSetup: () => {
    return EnvHelper.validateEnvironmentSetup();
  },

  /**
   * Get configuration summary for debugging
   */
  getConfigSummary: () => {
    return ConfigLoader.getConfigSummary();
  }
};

// Export commonly used constants
export const CONFIG_CONSTANTS = {
  DEFAULT_ANTHROPIC_MODEL: 'claude-sonnet-4-20250514',
  DEFAULT_OPENAI_MODEL: 'gpt-4.1',
  DEFAULT_DOCUMENT_RETENTION_HOURS: 3, // CCH requirement
  DEFAULT_MAX_DOCUMENTS: 10,
  DEFAULT_RATE_LIMIT: 60, // per minute
  MIN_ENCRYPTION_KEY_LENGTH: 32,
} as const;