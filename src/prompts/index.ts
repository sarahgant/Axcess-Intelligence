/**
 * Prompt management system - Main entry point
 * Provides centralized prompt template management and compilation
 */

import { logger } from '../core/logging/logger';

// Core exports
export { PromptRegistry } from './registry';
export { PromptBuilder, PromptUtils, ExamplePrompts } from './builder';

// Type exports
export type {
  PromptTemplate,
  CompiledPrompt,
  PromptRegistryConfig,
  PromptSearchCriteria,
  PromptUsageStats,
  CompilationOptions,
  ModelProvider,
  PromptCategory,
  PromptMetadata,
  PromptValidation,
  PromptExample,
  PromptTemplateBuilder
} from './types';

// Error exports
export {
  PromptError,
  PromptValidationError,
  PromptCompilationError,
  PromptNotFoundError
} from './types';

import { PromptRegistry } from './registry';
import { ExamplePrompts } from './builder';

/**
 * Prompt registry configuration interface
 */
interface PromptRegistryConfig {
  strictValidation?: boolean;
  enableCaching?: boolean;
  cacheTTL?: number;
  enableLogging?: boolean;
  defaultProvider?: ModelProvider;
}

/**
 * Global prompt registry instance
 */
let globalRegistry: PromptRegistry | null = null;

/**
 * Initialize the global prompt registry
 */
export function initializePromptRegistry(config?: PromptRegistryConfig): PromptRegistry {
  if (globalRegistry) {
    return globalRegistry;
  }

  globalRegistry = new PromptRegistry(config);

  // Register built-in prompts
  registerBuiltinPrompts(globalRegistry);

  logger.info('Prompt registry initialized', { component: 'PromptRegistry' });
  return globalRegistry;
}

/**
 * Get the global prompt registry instance
 */
export function getPromptRegistry(): PromptRegistry {
  if (!globalRegistry) {
    throw new Error('Prompt registry not initialized. Call initializePromptRegistry() first.');
  }
  return globalRegistry;
}

/**
 * Check if prompt registry is initialized
 */
export function isPromptRegistryReady(): boolean {
  return globalRegistry !== null;
}

/**
 * Register built-in prompt templates
 */
function registerBuiltinPrompts(registry: PromptRegistry): void {
  try {
    // Register example prompts
    registry.register(ExamplePrompts.cchSystem().build());
    registry.register(ExamplePrompts.ragSearch().build());
    registry.register(ExamplePrompts.documentAnalysis().build());

    logger.info('Built-in prompts registered successfully', { component: 'PromptRegistry' });
  } catch (error) {
    logger.error('Failed to register built-in prompts', { 
      component: 'PromptRegistry',
      error: error instanceof Error ? error.message : String(error)
    });
  }
}

/**
 * Utility functions for working with prompts
 */
export const PromptManager = {
  /**
   * Quick compile - compile a prompt with variables
   */
  compile: (id: string, variables: Record<string, unknown>, provider?: ModelProvider) => {
    const registry = getPromptRegistry();
    return registry.compile(id, variables, { provider });
  },

  /**
   * Quick get - get a prompt template by ID
   */
  get: (id: string, provider?: ModelProvider) => {
    const registry = getPromptRegistry();
    return registry.get(id, provider);
  },

  /**
   * Search prompts by category
   */
  byCategory: (category: PromptCategory) => {
    const registry = getPromptRegistry();
    return registry.search({ category });
  },

  /**
   * Search prompts by tags
   */
  byTags: (...tags: string[]) => {
    const registry = getPromptRegistry();
    return registry.search({ tags });
  },

  /**
   * Search prompts by text query
   */
  search: (query: string) => {
    const registry = getPromptRegistry();
    return registry.search({ query });
  },

  /**
   * Get all available prompt IDs
   */
  listIds: () => {
    const registry = getPromptRegistry();
    return registry.getIds();
  },

  /**
   * Get registry statistics
   */
  getStats: () => {
    const registry = getPromptRegistry();
    return registry.getRegistryStats();
  },

  /**
   * Clear compilation cache
   */
  clearCache: () => {
    const registry = getPromptRegistry();
    registry.clearCache();
  }
};

/**
 * Common prompt IDs for easy reference
 */
export const PROMPT_IDS = {
  // System prompts
  CCH_SYSTEM: 'cch.system.base',

  // RAG prompts
  RAG_SEARCH: 'rag.search.basic',

  // Document analysis prompts
  DOCUMENT_ANALYSIS: 'document.analyze.basic',

  // Chat prompts (to be added)
  CHAT_WELCOME: 'chat.welcome',
  CHAT_FOLLOWUP: 'chat.followup',

  // Tax research prompts (to be added)
  TAX_RESEARCH: 'tax.research.basic',
  TAX_PLANNING: 'tax.planning.advice',

  // Error handling prompts (to be added)
  ERROR_FALLBACK: 'error.fallback',
  CLARIFICATION_REQUEST: 'clarification.request'
} as const;

/**
 * Prompt categories for organization
 */
export const PROMPT_CATEGORIES = {
  SYSTEM: 'system' as const,
  USER: 'user' as const,
  ASSISTANT: 'assistant' as const,
  TOOL: 'tool' as const,
  RAG: 'rag' as const,
  DOCUMENT: 'document' as const,
  CHAT: 'chat' as const
};

/**
 * Model providers
 */
export const MODEL_PROVIDERS = {
  ANTHROPIC: 'anthropic' as const,
  OPENAI: 'openai' as const
};

/**
 * Development helpers for prompt management
 */
export const PromptDevHelpers = {
  /**
   * Register a quick test prompt
   */
  registerTestPrompt: (id: string, template: string, variables: string[] = []) => {
    const registry = getPromptRegistry();
    registry.register({
      id,
      name: `Test: ${id}`,
      category: 'user',
      template,
      variables,
      version: '1.0.0',
      metadata: {
        author: 'developer',
        lastModified: new Date(),
        description: 'Test prompt',
        tags: ['test', 'development']
      }
    });
  },

  /**
   * Test prompt compilation
   */
  testCompilation: (id: string, variables: Record<string, any> = {}) => {
    try {
      const registry = getPromptRegistry();
      const result = registry.compile(id, variables);
      logger.info(`Prompt '${id}' compiled successfully`, { 
        component: 'PromptRegistry',
        promptId: id,
        text: result.text.substring(0, 100) + '...'
      });
      return result;
    } catch (error) {
      logger.error(`Failed to compile prompt '${id}'`, { 
        component: 'PromptRegistry',
        promptId: id,
        error: error instanceof Error ? error.message : String(error)
      });
      throw error;
    }
  },

  /**
   * List all registered prompts
   */
  listAll: () => {
    const registry = getPromptRegistry();
    const ids = registry.getIds();
    logger.info('Registered prompts', { 
      component: 'PromptRegistry',
      totalPrompts: ids.length,
      promptIds: ids
    });
    return ids;
  },

  /**
   * Export prompts for backup/sharing
   */
  exportPrompts: () => {
    const registry = getPromptRegistry();
    const ids = registry.getIds();
    const prompts = ids.map(id => registry.get(id));
    return JSON.stringify(prompts, null, 2);
  },

  /**
   * Import prompts from JSON
   */
  importPrompts: (jsonData: string) => {
    try {
      const prompts = JSON.parse(jsonData);
      const registry = getPromptRegistry();

      if (Array.isArray(prompts)) {
        registry.registerBatch(prompts);
        logger.info(`Imported ${prompts.length} prompts`, { 
          component: 'PromptRegistry',
          importedCount: prompts.length
        });
      } else {
        throw new Error('Invalid format: expected array of prompts');
      }
    } catch (error) {
      logger.error('Failed to import prompts', { 
        component: 'PromptRegistry',
        error: error instanceof Error ? error.message : String(error)
      });
      throw error;
    }
  }
};