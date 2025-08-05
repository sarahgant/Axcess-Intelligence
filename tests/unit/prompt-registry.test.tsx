/**
 * Unit tests for PromptRegistry
 * Tests prompt template registration, compilation, and management
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { PromptRegistry } from '../../src/prompts/registry';
import { PromptBuilder } from '../../src/prompts/builder';
import { 
  PromptTemplate, 
  PromptNotFoundError, 
  PromptValidationError,
  PromptCompilationError 
} from '../../src/prompts/types';

describe('PromptRegistry', () => {
  let registry: PromptRegistry;

  const samplePrompt: PromptTemplate = {
    id: 'test.basic',
    name: 'Basic Test Prompt',
    category: 'user',
    template: 'Hello {{name}}, welcome to {{service}}!',
    variables: ['name', 'service'],
    version: '1.0.0',
    metadata: {
      author: 'test',
      lastModified: new Date(),
      description: 'Basic test prompt',
      tags: ['test']
    }
  };

  beforeEach(() => {
    registry = new PromptRegistry({
      enableLogging: false // Disable logging for tests
    });
  });

  describe('register()', () => {
    it('should register a valid prompt template', () => {
      expect(() => registry.register(samplePrompt)).not.toThrow();
      expect(registry.has('test.basic')).toBe(true);
    });

    it('should throw error for duplicate prompt IDs', () => {
      registry.register(samplePrompt);
      
      expect(() => registry.register(samplePrompt)).toThrow(/already exists/);
    });

    it('should validate prompt structure', () => {
      const invalidPrompt = {
        ...samplePrompt,
        id: '', // Invalid empty ID
      };

      expect(() => registry.register(invalidPrompt as PromptTemplate)).toThrow(PromptValidationError);
    });

    it('should validate that template variables are declared', () => {
      const invalidPrompt = {
        ...samplePrompt,
        template: 'Hello {{name}}, welcome to {{undeclaredVar}}!',
        variables: ['name'] // Missing 'undeclaredVar'
      };

      expect(() => registry.register(invalidPrompt)).toThrow(PromptValidationError);
    });
  });

  describe('get()', () => {
    beforeEach(() => {
      registry.register(samplePrompt);
    });

    it('should retrieve registered prompt', () => {
      const prompt = registry.get('test.basic');
      expect(prompt.id).toBe('test.basic');
      expect(prompt.name).toBe('Basic Test Prompt');
    });

    it('should throw error for non-existent prompt', () => {
      expect(() => registry.get('non.existent')).toThrow(PromptNotFoundError);
    });

    it('should return model-specific version when available', () => {
      const promptWithVariants = {
        ...samplePrompt,
        id: 'test.variants',
        modelSpecific: {
          anthropic: 'Human: {{message}}\nAssistant:',
          openai: 'System: {{message}}'
        }
      };

      registry.register(promptWithVariants);

      const anthropicVersion = registry.get('test.variants', 'anthropic');
      const openaiVersion = registry.get('test.variants', 'openai');

      expect(anthropicVersion.template).toBe('Human: {{message}}\nAssistant:');
      expect(openaiVersion.template).toBe('System: {{message}}');
    });
  });

  describe('compile()', () => {
    beforeEach(() => {
      registry.register(samplePrompt);
    });

    it('should compile prompt with variables', () => {
      const compiled = registry.compile('test.basic', {
        name: 'John',
        service: 'CCH Intelligence'
      });

      expect(compiled.text).toBe('Hello John, welcome to CCH Intelligence!');
      expect(compiled.templateId).toBe('test.basic');
      expect(compiled.variables).toEqual({
        name: 'John',
        service: 'CCH Intelligence'
      });
    });

    it('should validate required variables', () => {
      expect(() => {
        registry.compile('test.basic', {
          name: 'John'
          // Missing 'service' variable
        });
      }).toThrow(PromptValidationError);
    });

    it('should handle missing variables gracefully when validation disabled', () => {
      const compiled = registry.compile('test.basic', {
        name: 'John'
        // Missing 'service' variable
      }, { validate: false });

      expect(compiled.text).toBe('Hello John, welcome to {{service}}!');
    });

    it('should use cache when enabled', () => {
      const variables = { name: 'John', service: 'CCH Intelligence' };
      
      const compiled1 = registry.compile('test.basic', variables, { useCache: true });
      const compiled2 = registry.compile('test.basic', variables, { useCache: true });

      // Should return same result (cached)
      expect(compiled1.text).toBe(compiled2.text);
      expect(compiled1.metadata.compiledAt).toEqual(compiled2.metadata.compiledAt);
    });

    it('should handle different providers', () => {
      const promptWithVariants = {
        ...samplePrompt,
        id: 'test.provider',
        modelSpecific: {
          anthropic: 'Human: Hello {{name}}\nAssistant:',
          openai: 'Hello {{name}}'
        }
      };

      registry.register(promptWithVariants);

      const anthropicCompiled = registry.compile('test.provider', 
        { name: 'John' }, 
        { provider: 'anthropic' }
      );
      
      const openaiCompiled = registry.compile('test.provider', 
        { name: 'John' }, 
        { provider: 'openai' }
      );

      expect(anthropicCompiled.text).toBe('Human: Hello John\nAssistant:');
      expect(openaiCompiled.text).toBe('Hello John');
    });
  });

  describe('search()', () => {
    beforeEach(() => {
      registry.register(samplePrompt);
      registry.register({
        ...samplePrompt,
        id: 'test.system',
        category: 'system',
        metadata: {
          ...samplePrompt.metadata,
          tags: ['system', 'core']
        }
      });
    });

    it('should search by category', () => {
      const systemPrompts = registry.search({ category: 'system' });
      expect(systemPrompts).toHaveLength(1);
      expect(systemPrompts[0].id).toBe('test.system');
    });

    it('should search by tags', () => {
      const corePrompts = registry.search({ tags: ['core'] });
      expect(corePrompts).toHaveLength(1);
      expect(corePrompts[0].id).toBe('test.system');
    });

    it('should search by text query', () => {
      const results = registry.search({ query: 'Basic' });
      expect(results).toHaveLength(1);
      expect(results[0].id).toBe('test.basic');
    });
  });

  describe('registerBatch()', () => {
    it('should register multiple prompts', () => {
      const prompts = [
        { ...samplePrompt, id: 'batch.1' },
        { ...samplePrompt, id: 'batch.2' },
        { ...samplePrompt, id: 'batch.3' }
      ];

      registry.registerBatch(prompts);

      expect(registry.has('batch.1')).toBe(true);
      expect(registry.has('batch.2')).toBe(true);
      expect(registry.has('batch.3')).toBe(true);
    });

    it('should handle partial failures gracefully', () => {
      const prompts = [
        { ...samplePrompt, id: 'batch.valid' },
        { ...samplePrompt, id: '' }, // Invalid
        { ...samplePrompt, id: 'batch.valid2' }
      ];

      // Should not throw but log warnings
      expect(() => registry.registerBatch(prompts)).not.toThrow();
      
      expect(registry.has('batch.valid')).toBe(true);
      expect(registry.has('batch.valid2')).toBe(true);
    });
  });

  describe('usage statistics', () => {
    beforeEach(() => {
      registry.register(samplePrompt);
    });

    it('should track usage statistics', () => {
      registry.compile('test.basic', { name: 'John', service: 'Test' });
      registry.compile('test.basic', { name: 'Jane', service: 'Test' });

      const stats = registry.getUsageStats('test.basic');
      expect(stats?.usageCount).toBe(2);
      expect(stats?.templateId).toBe('test.basic');
    });

    it('should track error statistics', () => {
      try {
        registry.compile('test.basic', {}); // Missing variables
      } catch (error) {
        // Expected error
      }

      const stats = registry.getUsageStats('test.basic');
      expect(stats?.errorCount).toBe(1);
    });
  });

  describe('cache management', () => {
    beforeEach(() => {
      registry.register(samplePrompt);
    });

    it('should clear cache', () => {
      registry.compile('test.basic', { name: 'John', service: 'Test' });
      
      expect(() => registry.clearCache()).not.toThrow();
    });

    it('should clear cache for specific prompt when unregistered', () => {
      registry.compile('test.basic', { name: 'John', service: 'Test' });
      
      const removed = registry.unregister('test.basic');
      expect(removed).toBe(true);
      expect(registry.has('test.basic')).toBe(false);
    });
  });

  describe('registry statistics', () => {
    beforeEach(() => {
      registry.register(samplePrompt);
      registry.register({
        ...samplePrompt,
        id: 'test.system',
        category: 'system'
      });
    });

    it('should provide registry statistics', () => {
      const stats = registry.getRegistryStats();
      
      expect(stats.totalPrompts).toBe(2);
      expect(stats.categories.user).toBe(1);
      expect(stats.categories.system).toBe(1);
    });
  });

  describe('PromptBuilder integration', () => {
    it('should work with PromptBuilder', () => {
      const prompt = PromptBuilder.create()
        .id('builder.test')
        .name('Builder Test')
        .category('user')
        .template('Hello {{name}}!')
        .author('test-author')
        .tags('test', 'builder')
        .build();

      registry.register(prompt);

      const compiled = registry.compile('builder.test', { name: 'Builder' });
      expect(compiled.text).toBe('Hello Builder!');
    });
  });
});