/**
 * Type definitions for the prompt management system
 */

/**
 * Supported AI model providers
 */
export type ModelProvider = 'anthropic' | 'openai';

/**
 * Prompt categories for organization
 */
export type PromptCategory = 'system' | 'user' | 'assistant' | 'tool' | 'rag' | 'document' | 'chat';

/**
 * Prompt template interface
 */
export interface PromptTemplate {
  /** Unique identifier for the prompt */
  id: string;
  
  /** Human-readable name */
  name: string;
  
  /** Category for organization */
  category: PromptCategory;
  
  /** Main prompt template with variable placeholders */
  template: string;
  
  /** List of variable names used in the template */
  variables: string[];
  
  /** Model-specific prompt variants */
  modelSpecific?: {
    anthropic?: string;
    openai?: string;
  };
  
  /** Version for tracking changes */
  version: string;
  
  /** Metadata about the prompt */
  metadata: PromptMetadata;
  
  /** Optional validation rules for variables */
  validation?: PromptValidation;
  
  /** Optional examples for documentation */
  examples?: PromptExample[];
}

/**
 * Prompt metadata interface
 */
export interface PromptMetadata {
  /** Author of the prompt */
  author: string;
  
  /** Last modification date */
  lastModified: Date;
  
  /** Description of the prompt's purpose */
  description: string;
  
  /** Tags for categorization and search */
  tags: string[];
  
  /** Usage notes or instructions */
  usage?: string;
  
  /** Whether this is a system-critical prompt */
  isCritical?: boolean;
  
  /** Estimated token count (for cost estimation) */
  estimatedTokens?: number;
}

/**
 * Variable validation rules
 */
export interface PromptValidation {
  /** Required variables that must be provided */
  required: string[];
  
  /** Optional variables with default values */
  optional?: Record<string, any>;
  
  /** Variable type definitions */
  types?: Record<string, 'string' | 'number' | 'boolean' | 'array' | 'object'>;
  
  /** Custom validation functions */
  validators?: Record<string, (value: any) => boolean | string>;
}

/**
 * Example usage of a prompt
 */
export interface PromptExample {
  /** Example name/title */
  name: string;
  
  /** Description of the example */
  description: string;
  
  /** Variable values for the example */
  variables: Record<string, any>;
  
  /** Expected output or behavior */
  expectedOutput?: string;
  
  /** Model-specific examples */
  modelSpecific?: {
    anthropic?: string;
    openai?: string;
  };
}

/**
 * Compiled prompt result
 */
export interface CompiledPrompt {
  /** Original template ID */
  templateId: string;
  
  /** Compiled prompt text */
  text: string;
  
  /** Provider it was compiled for */
  provider?: ModelProvider;
  
  /** Variables used in compilation */
  variables: Record<string, any>;
  
  /** Compilation metadata */
  metadata: {
    compiledAt: Date;
    templateVersion: string;
    estimatedTokens?: number;
  };
}

/**
 * Prompt registry configuration
 */
export interface PromptRegistryConfig {
  /** Whether to enable strict validation */
  strictValidation: boolean;
  
  /** Whether to cache compiled prompts */
  enableCaching: boolean;
  
  /** Cache TTL in milliseconds */
  cacheTTL: number;
  
  /** Whether to log prompt usage */
  enableLogging: boolean;
  
  /** Default model provider for compilation */
  defaultProvider?: ModelProvider;
}

/**
 * Prompt search criteria
 */
export interface PromptSearchCriteria {
  /** Search by category */
  category?: PromptCategory;
  
  /** Search by tags */
  tags?: string[];
  
  /** Text search in name/description */
  query?: string;
  
  /** Filter by author */
  author?: string;
  
  /** Filter by criticality */
  isCritical?: boolean;
  
  /** Filter by model provider support */
  supportedProvider?: ModelProvider;
}

/**
 * Prompt usage statistics
 */
export interface PromptUsageStats {
  /** Prompt template ID */
  templateId: string;
  
  /** Total usage count */
  usageCount: number;
  
  /** Last used timestamp */
  lastUsed: Date;
  
  /** Average compilation time */
  avgCompilationTime: number;
  
  /** Error count */
  errorCount: number;
  
  /** Most common variable values */
  commonVariables: Record<string, any[]>;
}

/**
 * Prompt compilation options
 */
export interface CompilationOptions {
  /** Target model provider */
  provider?: ModelProvider;
  
  /** Whether to validate variables */
  validate?: boolean;
  
  /** Whether to use cached result if available */
  useCache?: boolean;
  
  /** Additional context for compilation */
  context?: Record<string, any>;
  
  /** Whether to escape special characters */
  escapeHtml?: boolean;
  
  /** Maximum allowed token count */
  maxTokens?: number;
}

/**
 * Prompt template builder for creating prompts programmatically
 */
export interface PromptTemplateBuilder {
  /** Set the prompt ID */
  id(id: string): PromptTemplateBuilder;
  
  /** Set the prompt name */
  name(name: string): PromptTemplateBuilder;
  
  /** Set the category */
  category(category: PromptCategory): PromptTemplateBuilder;
  
  /** Set the template content */
  template(template: string): PromptTemplateBuilder;
  
  /** Add variables */
  variables(...variables: string[]): PromptTemplateBuilder;
  
  /** Set model-specific variants */
  modelSpecific(variants: { anthropic?: string; openai?: string }): PromptTemplateBuilder;
  
  /** Set version */
  version(version: string): PromptTemplateBuilder;
  
  /** Add metadata */
  metadata(metadata: Partial<PromptMetadata>): PromptTemplateBuilder;
  
  /** Add validation rules */
  validation(validation: PromptValidation): PromptTemplateBuilder;
  
  /** Add examples */
  examples(...examples: PromptExample[]): PromptTemplateBuilder;
  
  /** Build the final prompt template */
  build(): PromptTemplate;
}

/**
 * Error types for prompt operations
 */
export class PromptError extends Error {
  constructor(
    message: string,
    public code: string,
    public templateId?: string,
    public details?: any
  ) {
    super(message);
    this.name = 'PromptError';
  }
}

export class PromptValidationError extends PromptError {
  constructor(message: string, templateId?: string, validationDetails?: any) {
    super(message, 'VALIDATION_ERROR', templateId, validationDetails);
    this.name = 'PromptValidationError';
  }
}

export class PromptCompilationError extends PromptError {
  constructor(message: string, templateId?: string, compilationDetails?: any) {
    super(message, 'COMPILATION_ERROR', templateId, compilationDetails);
    this.name = 'PromptCompilationError';
  }
}

export class PromptNotFoundError extends PromptError {
  constructor(templateId: string) {
    super(`Prompt template not found: ${templateId}`, 'NOT_FOUND', templateId);
    this.name = 'PromptNotFoundError';
  }
}