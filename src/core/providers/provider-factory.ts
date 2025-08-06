/**
 * Provider factory for managing AI providers
 * Handles initialization, registration, and selection of AI providers
 */

import {
  BaseAIProvider,
  ProviderRegistry,
  ProviderCapabilities
} from './base-provider';
import { AnthropicProvider } from './anthropic-provider';
import { OpenAIProvider } from './openai-provider';
import { getConfig, ConfigUtils } from '../../config';
import type { AppConfig } from '../../config/schema';
import { logger } from '../logging/logger';
import { env } from '../../config/environment';

/**
 * Provider factory configuration
 */
export interface ProviderFactoryConfig {
  autoInitialize?: boolean;
  defaultProvider?: 'anthropic' | 'openai';
  enableHealthChecks?: boolean;
  healthCheckInterval?: number; // minutes
}

/**
 * Provider initialization result
 */
export interface ProviderInitResult {
  provider: BaseAIProvider;
  isHealthy: boolean;
  error?: string;
}

/**
 * Registry implementation for managing providers
 */
class AIProviderRegistry implements ProviderRegistry {
  private providers: Map<string, BaseAIProvider> = new Map();
  private defaultProvider: string | null = null;

  register(name: string, provider: BaseAIProvider): void {
    this.providers.set(name, provider);

    // Set as default if it's the first provider
    if (!this.defaultProvider) {
      this.defaultProvider = name;
    }
  }

  get(name: string): BaseAIProvider | null {
    return this.providers.get(name) || null;
  }

  getAll(): Record<string, BaseAIProvider> {
    const result: Record<string, BaseAIProvider> = {};
    for (const [name, provider] of this.providers) {
      result[name] = provider;
    }
    return result;
  }

  remove(name: string): boolean {
    const removed = this.providers.delete(name);

    // Update default if we removed it
    if (removed && this.defaultProvider === name) {
      const remaining = Array.from(this.providers.keys());
      this.defaultProvider = remaining.length > 0 ? remaining[0] : null;
    }

    return removed;
  }

  getDefault(): BaseAIProvider | null {
    return this.defaultProvider ? this.get(this.defaultProvider) : null;
  }

  setDefault(name: string): boolean {
    if (this.providers.has(name)) {
      this.defaultProvider = name;
      return true;
    }
    return false;
  }

  getProviderNames(): string[] {
    return Array.from(this.providers.keys());
  }

  getCapabilities(): Record<string, ProviderCapabilities> {
    const result: Record<string, ProviderCapabilities> = {};
    for (const [name, provider] of this.providers) {
      result[name] = provider.getCapabilities();
    }
    return result;
  }
}

/**
 * AI Provider Factory
 * Manages creation, initialization, and lifecycle of AI providers
 */
export class ProviderFactory {
  private static instance: ProviderFactory | null = null;
  private registry: AIProviderRegistry;
  private config: AppConfig;
  private healthCheckTimer: NodeJS.Timeout | null = null;
  private isInitialized = false;

  private constructor(config: AppConfig) {
    this.config = config;
    this.registry = new AIProviderRegistry();
  }

  /**
   * Get singleton instance
   */
  static getInstance(config?: AppConfig): ProviderFactory {
    if (!ProviderFactory.instance) {
      if (!config) {
        throw new Error('Configuration required for first ProviderFactory initialization');
      }
      ProviderFactory.instance = new ProviderFactory(config);
    }
    return ProviderFactory.instance;
  }

  /**
   * Initialize providers based on configuration
   */
  async initialize(options: ProviderFactoryConfig = {}): Promise<Record<string, ProviderInitResult>> {
    const results: Record<string, ProviderInitResult> = {};

    logger.info('🤖 Initializing AI providers...');

    // Initialize Anthropic provider if configured
    if (ConfigUtils.isProviderConfigured('anthropic')) {
      try {
        const provider = await this.createAnthropicProvider();
        const isHealthy = await this.validateProvider(provider);

        this.registry.register('anthropic', provider);
        results.anthropic = { provider, isHealthy };

        logger.info(`✅ Anthropic provider initialized`, { isHealthy });
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        results.anthropic = {
          provider: null as any,
          isHealthy: false,
          error: errorMessage
        };
        logger.error('❌ Failed to initialize Anthropic provider', { error: errorMessage });
      }
    }

    // Initialize OpenAI provider if configured
    if (ConfigUtils.isProviderConfigured('openai')) {
      try {
        const provider = await this.createOpenAIProvider();
        const isHealthy = await this.validateProvider(provider);

        this.registry.register('openai', provider);
        results.openai = { provider, isHealthy };

        logger.info(`✅ OpenAI provider initialized`, { isHealthy });
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        results.openai = {
          provider: null as any,
          isHealthy: false,
          error: errorMessage
        };
        logger.error('❌ Failed to initialize OpenAI provider', { error: errorMessage });
      }
    }

    // Set default provider from environment or options
    const preferredProvider = options.defaultProvider || env.ai.provider() || ConfigUtils.getPreferredProvider();
    if (preferredProvider && this.registry.get(preferredProvider)) {
      this.registry.setDefault(preferredProvider);
      logger.info(`🎯 Default provider set to: ${preferredProvider}`);
    } else {
      logger.warn(`⚠️ Preferred provider '${preferredProvider}' not available, using first available provider`);
    }

    // Start health checks if enabled
    if (options.enableHealthChecks) {
      const healthCheckInterval = options.healthCheckInterval || 30;
      this.startHealthChecks(healthCheckInterval);
      logger.info(`🏥 Health checks enabled with ${healthCheckInterval} minute interval`);
    }

    this.isInitialized = true;
    logger.info(`🚀 Provider factory initialized`, { providerCount: Object.keys(results).length });

    return results;
  }

  /**
   * Get the provider registry
   */
  getRegistry(): ProviderRegistry {
    if (!this.isInitialized) {
      logger.warn('⚠️ Provider factory not initialized. Call initialize() first.');
    }
    return this.registry;
  }

  /**
   * Get a specific provider
   */
  getProvider(name: string): BaseAIProvider | null {
    return this.registry.get(name);
  }

  /**
   * Get the default provider
   */
  getDefaultProvider(): BaseAIProvider | null {
    return this.registry.getDefault();
  }

  /**
   * Get available provider names
   */
  getAvailableProviders(): string[] {
    return this.registry.getProviderNames();
  }

  /**
   * Get provider capabilities
   */
  getProviderCapabilities(): Record<string, ProviderCapabilities> {
    return this.registry.getCapabilities();
  }

  /**
   * Switch default provider
   */
  setDefaultProvider(name: string): boolean {
    const success = this.registry.setDefault(name);
    if (success) {
      logger.info(`🔄 Default provider changed to: ${name}`);
    }
    return success;
  }

  /**
   * Refresh configuration and reinitialize providers
   */
  async refresh(): Promise<Record<string, ProviderInitResult>> {
    logger.info('🔄 Refreshing provider configuration...');

    // Clean up existing providers
    await this.dispose();

    // Reload configuration
    this.config = getConfig();

    // Reinitialize
    return this.initialize();
  }

  /**
   * Clean shutdown
   */
  async dispose(): Promise<void> {
    logger.info('🧹 Disposing AI providers...');

    // Stop health checks
    if (this.healthCheckTimer) {
      clearInterval(this.healthCheckTimer);
      this.healthCheckTimer = null;
    }

    // Dispose all providers
    const providers = this.registry.getAll();
    await Promise.all(
      Object.values(providers).map(provider => provider.dispose())
    );

    // Clear registry
    this.registry = new AIProviderRegistry();
    this.isInitialized = false;
  }

  /**
   * Create Anthropic provider instance
   */
  private async createAnthropicProvider(): Promise<AnthropicProvider> {
    const config = ConfigUtils.getProviderConfig('anthropic');

    return new AnthropicProvider({
      apiKey: config.apiKey,
      baseUrl: config.baseUrl,
      defaultModel: config.defaultModel,
      timeout: config.timeout,
      maxRetries: config.maxRetries
    });
  }

  /**
   * Create OpenAI provider instance
   */
  private async createOpenAIProvider(): Promise<OpenAIProvider> {
    const config = ConfigUtils.getProviderConfig('openai');

    return new OpenAIProvider({
      apiKey: config.apiKey,
      baseUrl: config.baseUrl,
      organization: (config as any).organization, // Type extension for OpenAI
      defaultModel: config.defaultModel,
      timeout: config.timeout,
      maxRetries: config.maxRetries
    });
  }

  /**
   * Validate provider health
   */
  private async validateProvider(provider: BaseAIProvider): Promise<boolean> {
    try {
      return await provider.validateConfig();
    } catch (error) {
      console.warn(`Provider validation failed:`, error);
      return false;
    }
  }

  /**
   * Start periodic health checks
   */
  private startHealthChecks(intervalMinutes: number): void {
    this.healthCheckTimer = setInterval(async () => {
      const providers = this.registry.getAll();

      for (const [name, provider] of Object.entries(providers)) {
        try {
          const health = await provider.checkHealth();
          if (!health.isHealthy) {
            console.warn(`⚠️ Provider ${name} is unhealthy: ${health.message}`);
          }
        } catch (error) {
          console.warn(`⚠️ Health check failed for provider ${name}:`, error);
        }
      }
    }, intervalMinutes * 60 * 1000);
  }
}

/**
 * Convenience functions for common operations
 */
export const ProviderUtils = {
  /**
   * Initialize providers with default configuration
   */
  async initializeProviders(): Promise<ProviderFactory> {
    const config = getConfig();
    const factory = ProviderFactory.getInstance(config);

    await factory.initialize({
      autoInitialize: true,
      enableHealthChecks: env.isDevelopment() || ConfigUtils.isDevelopment(),
      healthCheckInterval: 30
    });

    return factory;
  },

  /**
   * Get the best available provider
   */
  getBestProvider(): BaseAIProvider | null {
    const factory = ProviderFactory.getInstance();
    return factory.getDefaultProvider();
  },

  /**
   * Get provider by name with fallback
   */
  getProviderWithFallback(preferredName?: string): BaseAIProvider | null {
    const factory = ProviderFactory.getInstance();

    if (preferredName) {
      const provider = factory.getProvider(preferredName);
      if (provider) return provider;
    }

    return factory.getDefaultProvider();
  },

  /**
   * Check if any providers are available
   */
  hasAvailableProviders(): boolean {
    const factory = ProviderFactory.getInstance();
    return factory.getAvailableProviders().length > 0;
  }
};