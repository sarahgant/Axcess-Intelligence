import {
  PromptTemplate,
  CompiledPrompt,
  PromptRegistryConfig,
  PromptSearchCriteria,
  PromptUsageStats,
  CompilationOptions,
  ModelProvider,
  PromptError,
  PromptNotFoundError,
  PromptValidationError,
  PromptCompilationError
} from './types';

/**
 * Central registry for managing prompt templates
 * Provides template storage, compilation, caching, and validation
 */
export class PromptRegistry {
  private prompts: Map<string, PromptTemplate> = new Map();
  private compiledCache: Map<string, CompiledPrompt> = new Map();
  private usageStats: Map<string, PromptUsageStats> = new Map();
  private config: PromptRegistryConfig;

  constructor(config?: Partial<PromptRegistryConfig>) {
    this.config = {
      strictValidation: true,
      enableCaching: true,
      cacheTTL: 30 * 60 * 1000, // 30 minutes
      enableLogging: true,
      defaultProvider: 'anthropic',
      ...config
    };
  }

  /**
   * Register a new prompt template
   */
  register(prompt: PromptTemplate): void {
    try {
      // Validate prompt structure
      this.validatePromptTemplate(prompt);
      
      // Check for ID conflicts
      if (this.prompts.has(prompt.id)) {
        throw new PromptError(
          `Prompt with ID '${prompt.id}' already exists`,
          'DUPLICATE_ID',
          prompt.id
        );
      }

      // Register the prompt
      this.prompts.set(prompt.id, { ...prompt });
      
      // Initialize usage stats
      this.usageStats.set(prompt.id, {
        templateId: prompt.id,
        usageCount: 0,
        lastUsed: new Date(),
        avgCompilationTime: 0,
        errorCount: 0,
        commonVariables: {}
      });

      if (this.config.enableLogging) {
        console.debug(`📝 Registered prompt template: ${prompt.id} (${prompt.name})`);
      }
    } catch (error) {
      console.error(`❌ Failed to register prompt '${prompt.id}':`, error);
      throw error;
    }
  }

  /**
   * Register multiple prompts at once
   */
  registerBatch(prompts: PromptTemplate[]): void {
    const errors: Array<{ id: string; error: Error }> = [];
    
    for (const prompt of prompts) {
      try {
        this.register(prompt);
      } catch (error) {
        errors.push({ 
          id: prompt.id, 
          error: error instanceof Error ? error : new Error(String(error))
        });
      }
    }

    if (errors.length > 0) {
      console.warn(`⚠️ Failed to register ${errors.length} prompts:`, errors);
    }

    if (this.config.enableLogging) {
      console.log(`📝 Registered ${prompts.length - errors.length}/${prompts.length} prompt templates`);
    }
  }

  /**
   * Get a prompt template by ID
   */
  get(id: string, provider?: ModelProvider): PromptTemplate {
    const prompt = this.prompts.get(id);
    
    if (!prompt) {
      throw new PromptNotFoundError(id);
    }

    // Return model-specific version if available and requested
    if (provider && prompt.modelSpecific?.[provider]) {
      return {
        ...prompt,
        template: prompt.modelSpecific[provider]
      };
    }

    return { ...prompt };
  }

  /**
   * Check if a prompt exists
   */
  has(id: string): boolean {
    return this.prompts.has(id);
  }

  /**
   * Get all registered prompt IDs
   */
  getIds(): string[] {
    return Array.from(this.prompts.keys());
  }

  /**
   * Get all prompts matching search criteria
   */
  search(criteria: PromptSearchCriteria): PromptTemplate[] {
    const results: PromptTemplate[] = [];
    
    for (const prompt of this.prompts.values()) {
      if (this.matchesCriteria(prompt, criteria)) {
        results.push({ ...prompt });
      }
    }

    return results;
  }

  /**
   * Compile a prompt with variables
   */
  compile(
    id: string, 
    variables: Record<string, any>, 
    options?: CompilationOptions
  ): CompiledPrompt {
    const startTime = Date.now();
    const opts = { 
      validate: this.config.strictValidation, 
      useCache: this.config.enableCaching,
      ...options 
    };

    try {
      // Get the prompt template
      const prompt = this.get(id, opts.provider);
      
      // Check cache if enabled
      if (opts.useCache) {
        const cacheKey = this.getCacheKey(id, variables, opts.provider);
        const cached = this.compiledCache.get(cacheKey);
        
        if (cached && this.isCacheValid(cached)) {
          this.updateUsageStats(id, Date.now() - startTime, false);
          return { ...cached };
        }
      }

      // Validate variables if required
      if (opts.validate) {
        this.validateVariables(prompt, variables);
      }

      // Compile the prompt
      const compiledText = this.interpolateTemplate(prompt.template, variables, opts);
      
      const compiled: CompiledPrompt = {
        templateId: id,
        text: compiledText,
        provider: opts.provider,
        variables: { ...variables },
        metadata: {
          compiledAt: new Date(),
          templateVersion: prompt.version,
          estimatedTokens: this.estimateTokens(compiledText)
        }
      };

      // Cache the result if enabled
      if (opts.useCache) {
        const cacheKey = this.getCacheKey(id, variables, opts.provider);
        this.compiledCache.set(cacheKey, compiled);
      }

      // Update usage statistics
      this.updateUsageStats(id, Date.now() - startTime, false);

      if (this.config.enableLogging) {
        console.debug(`✅ Compiled prompt '${id}' (${Date.now() - startTime}ms)`);
      }

      return compiled;
    } catch (error) {
      this.updateUsageStats(id, Date.now() - startTime, true);
      
      if (error instanceof PromptError) {
        throw error;
      }
      
      throw new PromptCompilationError(
        `Failed to compile prompt '${id}': ${error}`,
        id,
        { variables, options: opts, originalError: error }
      );
    }
  }

  /**
   * Get usage statistics for a prompt
   */
  getUsageStats(id: string): PromptUsageStats | null {
    const stats = this.usageStats.get(id);
    return stats ? { ...stats } : null;
  }

  /**
   * Get all usage statistics
   */
  getAllUsageStats(): Map<string, PromptUsageStats> {
    return new Map(this.usageStats);
  }

  /**
   * Clear compiled cache
   */
  clearCache(): void {
    this.compiledCache.clear();
    if (this.config.enableLogging) {
      console.debug('🧹 Cleared prompt compilation cache');
    }
  }

  /**
   * Remove a prompt from the registry
   */
  unregister(id: string): boolean {
    const removed = this.prompts.delete(id);
    if (removed) {
      this.usageStats.delete(id);
      this.clearCacheForPrompt(id);
      
      if (this.config.enableLogging) {
        console.debug(`🗑️ Unregistered prompt template: ${id}`);
      }
    }
    return removed;
  }

  /**
   * Update registry configuration
   */
  updateConfig(config: Partial<PromptRegistryConfig>): void {
    this.config = { ...this.config, ...config };
    
    if (!config.enableCaching) {
      this.clearCache();
    }
  }

  /**
   * Get registry statistics
   */
  getRegistryStats(): {
    totalPrompts: number;
    totalCompilations: number;
    cacheSize: number;
    categories: Record<string, number>;
    mostUsed: Array<{ id: string; usageCount: number }>;
  } {
    const categories: Record<string, number> = {};
    let totalCompilations = 0;

    for (const prompt of this.prompts.values()) {
      categories[prompt.category] = (categories[prompt.category] || 0) + 1;
    }

    for (const stats of this.usageStats.values()) {
      totalCompilations += stats.usageCount;
    }

    const mostUsed = Array.from(this.usageStats.values())
      .sort((a, b) => b.usageCount - a.usageCount)
      .slice(0, 10)
      .map(stats => ({ id: stats.templateId, usageCount: stats.usageCount }));

    return {
      totalPrompts: this.prompts.size,
      totalCompilations,
      cacheSize: this.compiledCache.size,
      categories,
      mostUsed
    };
  }

  // Private helper methods

  private validatePromptTemplate(prompt: PromptTemplate): void {
    if (!prompt.id || typeof prompt.id !== 'string') {
      throw new PromptValidationError('Prompt ID is required and must be a string');
    }

    if (!prompt.name || typeof prompt.name !== 'string') {
      throw new PromptValidationError('Prompt name is required and must be a string', prompt.id);
    }

    if (!prompt.template || typeof prompt.template !== 'string') {
      throw new PromptValidationError('Prompt template is required and must be a string', prompt.id);
    }

    if (!Array.isArray(prompt.variables)) {
      throw new PromptValidationError('Prompt variables must be an array', prompt.id);
    }

    // Validate that all variables in template are declared
    const templateVars = this.extractVariablesFromTemplate(prompt.template);
    const undeclaredVars = templateVars.filter(v => !prompt.variables.includes(v));
    
    if (undeclaredVars.length > 0) {
      throw new PromptValidationError(
        `Template contains undeclared variables: ${undeclaredVars.join(', ')}`,
        prompt.id,
        { undeclaredVars, templateVars, declaredVars: prompt.variables }
      );
    }
  }

  private validateVariables(prompt: PromptTemplate, variables: Record<string, any>): void {
    // Check required variables
    const requiredVars = prompt.validation?.required || prompt.variables;
    const missingVars = requiredVars.filter(v => !(v in variables));
    
    if (missingVars.length > 0) {
      throw new PromptValidationError(
        `Missing required variables: ${missingVars.join(', ')}`,
        prompt.id,
        { missingVars, providedVars: Object.keys(variables) }
      );
    }

    // Apply custom validators if available
    if (prompt.validation?.validators) {
      for (const [varName, validator] of Object.entries(prompt.validation.validators)) {
        if (varName in variables) {
          const result = validator(variables[varName]);
          if (result !== true) {
            const message = typeof result === 'string' ? result : `Validation failed for variable '${varName}'`;
            throw new PromptValidationError(message, prompt.id, { variable: varName, value: variables[varName] });
          }
        }
      }
    }
  }

  private interpolateTemplate(
    template: string, 
    variables: Record<string, any>, 
    options: CompilationOptions
  ): string {
    let result = template;

    // Replace {{variable}} patterns
    result = result.replace(/\{\{(\w+)\}\}/g, (match, key) => {
      if (key in variables) {
        let value = variables[key];
        
        // Convert to string
        if (typeof value === 'object') {
          value = JSON.stringify(value);
        } else {
          value = String(value);
        }

        // Escape HTML if requested
        if (options.escapeHtml) {
          value = this.escapeHtml(value);
        }

        return value;
      }
      return match; // Keep placeholder if variable not found
    });

    return result;
  }

  private extractVariablesFromTemplate(template: string): string[] {
    const matches = template.match(/\{\{(\w+)\}\}/g);
    if (!matches) return [];
    
    return [...new Set(matches.map(match => match.slice(2, -2)))];
  }

  private matchesCriteria(prompt: PromptTemplate, criteria: PromptSearchCriteria): boolean {
    if (criteria.category && prompt.category !== criteria.category) {
      return false;
    }

    if (criteria.tags && !criteria.tags.some(tag => prompt.metadata.tags.includes(tag))) {
      return false;
    }

    if (criteria.query) {
      const query = criteria.query.toLowerCase();
      const searchText = `${prompt.name} ${prompt.metadata.description}`.toLowerCase();
      if (!searchText.includes(query)) {
        return false;
      }
    }

    if (criteria.author && prompt.metadata.author !== criteria.author) {
      return false;
    }

    if (criteria.isCritical !== undefined && prompt.metadata.isCritical !== criteria.isCritical) {
      return false;
    }

    if (criteria.supportedProvider && !prompt.modelSpecific?.[criteria.supportedProvider]) {
      return false;
    }

    return true;
  }

  private getCacheKey(id: string, variables: Record<string, any>, provider?: ModelProvider): string {
    const varsKey = JSON.stringify(variables, Object.keys(variables).sort());
    return `${id}:${provider || 'default'}:${varsKey}`;
  }

  private isCacheValid(cached: CompiledPrompt): boolean {
    const age = Date.now() - cached.metadata.compiledAt.getTime();
    return age < this.config.cacheTTL;
  }

  private clearCacheForPrompt(id: string): void {
    for (const [key, value] of this.compiledCache.entries()) {
      if (value.templateId === id) {
        this.compiledCache.delete(key);
      }
    }
  }

  private updateUsageStats(id: string, compilationTime: number, isError: boolean): void {
    const stats = this.usageStats.get(id);
    if (!stats) return;

    stats.usageCount++;
    stats.lastUsed = new Date();
    stats.avgCompilationTime = (stats.avgCompilationTime + compilationTime) / 2;
    
    if (isError) {
      stats.errorCount++;
    }

    this.usageStats.set(id, stats);
  }

  private estimateTokens(text: string): number {
    // Rough estimation: ~4 characters per token for English text
    return Math.ceil(text.length / 4);
  }

  private escapeHtml(text: string): string {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
}