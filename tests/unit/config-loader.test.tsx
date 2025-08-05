/**
 * Unit tests for ConfigLoader
 * Tests configuration loading, validation, and error handling
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { ConfigLoader } from '../../src/config/loader';
import { DEFAULT_CONFIG } from '../../src/config/defaults';

// Mock environment variables
const mockEnv = {
  ANTHROPIC_API_KEY: 'test-anthropic-key-1234567890',
  OPENAI_API_KEY: 'test-openai-key-1234567890',
  ENCRYPTION_KEY: 'test-encryption-key-32-characters',
  NODE_ENV: 'test',
  ENABLE_STREAMING: 'true',
  MAX_DOCUMENTS_PER_SESSION: '5'
};

describe('ConfigLoader', () => {
  let originalEnv: NodeJS.ProcessEnv;

  beforeEach(() => {
    // Save original environment
    originalEnv = { ...process.env };
    
    // Reset ConfigLoader instance
    (ConfigLoader as any).instance = null;
    (ConfigLoader as any).loadPromise = null;
    
    // Clear environment
    Object.keys(process.env).forEach(key => {
      if (key.startsWith('ANTHROPIC_') || key.startsWith('OPENAI_') || key.startsWith('ENABLE_')) {
        delete process.env[key];
      }
    });
  });

  afterEach(() => {
    // Restore original environment
    process.env = originalEnv;
  });

  describe('load()', () => {
    it('should load configuration with valid environment variables', async () => {
      // Set up test environment
      Object.assign(process.env, mockEnv);

      const config = await ConfigLoader.load();

      expect(config).toBeDefined();
      expect(config.providers.anthropic.apiKey).toBe('test-anthropic-key-1234567890');
      expect(config.providers.openai.apiKey).toBe('test-openai-key-1234567890');
      expect(config.security.encryptionKey).toBe('test-encryption-key-32-characters');
      expect(config.environment).toBe('test');
    });

    it('should return cached instance on subsequent calls', async () => {
      Object.assign(process.env, mockEnv);

      const config1 = await ConfigLoader.load();
      const config2 = await ConfigLoader.load();

      expect(config1).toBe(config2); // Same instance
    });

    it('should throw error for missing required API keys', async () => {
      // Set up environment without API keys
      process.env.ENCRYPTION_KEY = 'test-encryption-key-32-characters';
      process.env.NODE_ENV = 'test';

      await expect(ConfigLoader.load()).rejects.toThrow(/API key is required/);
    });

    it('should throw error for invalid encryption key', async () => {
      Object.assign(process.env, {
        ...mockEnv,
        ENCRYPTION_KEY: 'short' // Too short
      });

      await expect(ConfigLoader.load()).rejects.toThrow(/at least 32 characters/);
    });

    it('should merge environment variables with defaults', async () => {
      Object.assign(process.env, {
        ...mockEnv,
        ENABLE_STREAMING: 'false',
        MAX_DOCUMENTS_PER_SESSION: '15'
      });

      const config = await ConfigLoader.load();

      expect(config.features.enableStreaming).toBe(false);
      expect(config.features.maxDocumentsPerSession).toBe(15);
      expect(config.features.enableDocumentAnalysis).toBe(DEFAULT_CONFIG.features.enableDocumentAnalysis);
    });
  });

  describe('reload()', () => {
    it('should reload configuration with new environment variables', async () => {
      // Initial load
      Object.assign(process.env, mockEnv);
      const config1 = await ConfigLoader.load();
      
      // Change environment
      process.env.ANTHROPIC_DEFAULT_MODEL = 'claude-sonnet-4-20250514';
      
      // Reload
      const config2 = await ConfigLoader.reload();
      
      expect(config2.providers.anthropic.defaultModel).toBe('claude-sonnet-4-20250514');
    });
  });

  describe('getInstance()', () => {
    it('should return loaded configuration', async () => {
      Object.assign(process.env, mockEnv);
      await ConfigLoader.load();

      const config = ConfigLoader.getInstance();
      expect(config).toBeDefined();
      expect(config.providers.anthropic.apiKey).toBe('test-anthropic-key-1234567890');
    });

    it('should throw error if not loaded', () => {
      expect(() => ConfigLoader.getInstance()).toThrow(/Configuration not loaded/);
    });
  });

  describe('isLoaded()', () => {
    it('should return false initially', () => {
      expect(ConfigLoader.isLoaded()).toBe(false);
    });

    it('should return true after loading', async () => {
      Object.assign(process.env, mockEnv);
      await ConfigLoader.load();

      expect(ConfigLoader.isLoaded()).toBe(true);
    });
  });

  describe('getConfigSummary()', () => {
    it('should return not loaded status initially', () => {
      const summary = ConfigLoader.getConfigSummary();
      expect(summary.loaded).toBe(false);
    });

    it('should return masked configuration after loading', async () => {
      Object.assign(process.env, mockEnv);
      await ConfigLoader.load();

      const summary = ConfigLoader.getConfigSummary();
      expect(summary.loaded).toBe(true);
      expect(summary.config.providers.anthropic.apiKey).toMatch(/^\*\*\*\d{4}$/);
      expect(summary.config.providers.openai.apiKey).toMatch(/^\*\*\*\d{4}$/);
    });
  });

  describe('Environment-specific overrides', () => {
    it('should apply development overrides', async () => {
      Object.assign(process.env, {
        ...mockEnv,
        NODE_ENV: 'development'
      });

      const config = await ConfigLoader.load();
      expect(config.environment).toBe('development');
      expect(config.logLevel).toBe('debug');
    });

    it('should apply production overrides', async () => {
      Object.assign(process.env, {
        ...mockEnv,
        NODE_ENV: 'production'
      });

      const config = await ConfigLoader.load();
      expect(config.environment).toBe('production');
      expect(config.logLevel).toBe('warn');
    });
  });

  describe('Error handling', () => {
    it('should provide detailed validation errors', async () => {
      process.env.ANTHROPIC_API_KEY = 'test-key';
      // Missing OPENAI_API_KEY and ENCRYPTION_KEY

      try {
        await ConfigLoader.load();
        expect.fail('Should have thrown validation error');
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect(error.message).toContain('Configuration validation failed');
      }
    });

    it('should handle malformed environment variables gracefully', async () => {
      Object.assign(process.env, {
        ...mockEnv,
        MAX_DOCUMENTS_PER_SESSION: 'not-a-number'
      });

      // Should still load with default value
      const config = await ConfigLoader.load();
      expect(config.features.maxDocumentsPerSession).toBe(DEFAULT_CONFIG.features.maxDocumentsPerSession);
    });
  });
});