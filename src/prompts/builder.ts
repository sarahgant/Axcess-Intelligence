import {
  PromptTemplate,
  PromptTemplateBuilder,
  PromptCategory,
  PromptMetadata,
  PromptValidation,
  PromptExample,
  ModelProvider
} from './types';

/**
 * Builder class for creating prompt templates with a fluent API
 */
export class PromptBuilder implements PromptTemplateBuilder {
  private prompt: Partial<PromptTemplate> = {
    variables: [],
    version: '1.0.0',
    metadata: {
      author: 'system',
      lastModified: new Date(),
      description: '',
      tags: []
    }
  };

  /**
   * Set the prompt ID
   */
  id(id: string): PromptTemplateBuilder {
    this.prompt.id = id;
    return this;
  }

  /**
   * Set the prompt name
   */
  name(name: string): PromptTemplateBuilder {
    this.prompt.name = name;
    return this;
  }

  /**
   * Set the category
   */
  category(category: PromptCategory): PromptTemplateBuilder {
    this.prompt.category = category;
    return this;
  }

  /**
   * Set the template content
   */
  template(template: string): PromptTemplateBuilder {
    this.prompt.template = template;
    // Auto-extract variables from template
    const variables = this.extractVariables(template);
    this.prompt.variables = [...new Set([...(this.prompt.variables || []), ...variables])];
    return this;
  }

  /**
   * Add variables
   */
  variables(...variables: string[]): PromptTemplateBuilder {
    this.prompt.variables = [...new Set([...(this.prompt.variables || []), ...variables])];
    return this;
  }

  /**
   * Set model-specific variants
   */
  modelSpecific(variants: { anthropic?: string; openai?: string }): PromptTemplateBuilder {
    this.prompt.modelSpecific = variants;
    
    // Extract variables from model-specific templates too
    if (variants.anthropic) {
      const vars = this.extractVariables(variants.anthropic);
      this.prompt.variables = [...new Set([...(this.prompt.variables || []), ...vars])];
    }
    if (variants.openai) {
      const vars = this.extractVariables(variants.openai);
      this.prompt.variables = [...new Set([...(this.prompt.variables || []), ...vars])];
    }
    
    return this;
  }

  /**
   * Set version
   */
  version(version: string): PromptTemplateBuilder {
    this.prompt.version = version;
    return this;
  }

  /**
   * Add or update metadata
   */
  metadata(metadata: Partial<PromptMetadata>): PromptTemplateBuilder {
    this.prompt.metadata = {
      ...this.prompt.metadata!,
      ...metadata,
      lastModified: new Date()
    };
    return this;
  }

  /**
   * Set description (shorthand for metadata)
   */
  description(description: string): PromptTemplateBuilder {
    this.prompt.metadata!.description = description;
    return this;
  }

  /**
   * Set author (shorthand for metadata)
   */
  author(author: string): PromptTemplateBuilder {
    this.prompt.metadata!.author = author;
    return this;
  }

  /**
   * Add tags (shorthand for metadata)
   */
  tags(...tags: string[]): PromptTemplateBuilder {
    this.prompt.metadata!.tags = [...new Set([...this.prompt.metadata!.tags, ...tags])];
    return this;
  }

  /**
   * Mark as critical (shorthand for metadata)
   */
  critical(isCritical: boolean = true): PromptTemplateBuilder {
    this.prompt.metadata!.isCritical = isCritical;
    return this;
  }

  /**
   * Set usage notes (shorthand for metadata)
   */
  usage(usage: string): PromptTemplateBuilder {
    this.prompt.metadata!.usage = usage;
    return this;
  }

  /**
   * Add validation rules
   */
  validation(validation: PromptValidation): PromptTemplateBuilder {
    this.prompt.validation = validation;
    return this;
  }

  /**
   * Set required variables (shorthand for validation)
   */
  required(...variables: string[]): PromptTemplateBuilder {
    if (!this.prompt.validation) {
      this.prompt.validation = { required: [] };
    }
    this.prompt.validation.required = [...new Set([...(this.prompt.validation.required || []), ...variables])];
    return this;
  }

  /**
   * Add optional variables with defaults (shorthand for validation)
   */
  optional(variables: Record<string, any>): PromptTemplateBuilder {
    if (!this.prompt.validation) {
      this.prompt.validation = { required: [] };
    }
    this.prompt.validation.optional = { ...this.prompt.validation.optional, ...variables };
    return this;
  }

  /**
   * Add variable type definitions (shorthand for validation)
   */
  types(types: Record<string, 'string' | 'number' | 'boolean' | 'array' | 'object'>): PromptTemplateBuilder {
    if (!this.prompt.validation) {
      this.prompt.validation = { required: [] };
    }
    this.prompt.validation.types = { ...this.prompt.validation.types, ...types };
    return this;
  }

  /**
   * Add examples
   */
  examples(...examples: PromptExample[]): PromptTemplateBuilder {
    this.prompt.examples = [...(this.prompt.examples || []), ...examples];
    return this;
  }

  /**
   * Add a single example with fluent API
   */
  example(name: string, description: string, variables: Record<string, any>, expectedOutput?: string): PromptTemplateBuilder {
    const example: PromptExample = {
      name,
      description,
      variables,
      expectedOutput
    };
    return this.examples(example);
  }

  /**
   * Build the final prompt template
   */
  build(): PromptTemplate {
    // Validate required fields
    if (!this.prompt.id) {
      throw new Error('Prompt ID is required');
    }
    if (!this.prompt.name) {
      throw new Error('Prompt name is required');
    }
    if (!this.prompt.category) {
      throw new Error('Prompt category is required');
    }
    if (!this.prompt.template) {
      throw new Error('Prompt template is required');
    }

    // Ensure all required fields are present
    const template: PromptTemplate = {
      id: this.prompt.id,
      name: this.prompt.name,
      category: this.prompt.category,
      template: this.prompt.template,
      variables: this.prompt.variables || [],
      version: this.prompt.version || '1.0.0',
      metadata: {
        author: 'system',
        lastModified: new Date(),
        description: '',
        tags: [],
        ...this.prompt.metadata
      },
      ...(this.prompt.modelSpecific && { modelSpecific: this.prompt.modelSpecific }),
      ...(this.prompt.validation && { validation: this.prompt.validation }),
      ...(this.prompt.examples && { examples: this.prompt.examples })
    };

    return template;
  }

  /**
   * Extract variables from a template string
   */
  private extractVariables(template: string): string[] {
    const matches = template.match(/\{\{(\w+)\}\}/g);
    if (!matches) return [];
    return matches.map(match => match.slice(2, -2));
  }

  /**
   * Create a new builder instance
   */
  static create(): PromptTemplateBuilder {
    return new PromptBuilder();
  }
}

/**
 * Utility functions for creating common prompt patterns
 */
export const PromptUtils = {
  /**
   * Create a system prompt template
   */
  system(id: string, name: string, template: string): PromptTemplateBuilder {
    return PromptBuilder.create()
      .id(id)
      .name(name)
      .category('system')
      .template(template)
      .critical(true)
      .tags('system');
  },

  /**
   * Create a RAG search prompt template
   */
  ragSearch(id: string, name: string, template: string): PromptTemplateBuilder {
    return PromptBuilder.create()
      .id(id)
      .name(name)
      .category('rag')
      .template(template)
      .tags('rag', 'search')
      .required('query', 'context');
  },

  /**
   * Create a document analysis prompt template
   */
  documentAnalysis(id: string, name: string, template: string): PromptTemplateBuilder {
    return PromptBuilder.create()
      .id(id)
      .name(name)
      .category('document')
      .template(template)
      .tags('document', 'analysis')
      .required('document');
  },

  /**
   * Create a chat prompt template
   */
  chat(id: string, name: string, template: string): PromptTemplateBuilder {
    return PromptBuilder.create()
      .id(id)
      .name(name)
      .category('chat')
      .template(template)
      .tags('chat', 'conversation');
  },

  /**
   * Create model-specific variants for common providers
   */
  withModelVariants(
    baseTemplate: string,
    anthropicTemplate?: string,
    openaiTemplate?: string
  ): { anthropic?: string; openai?: string } {
    return {
      ...(anthropicTemplate && { anthropic: anthropicTemplate }),
      ...(openaiTemplate && { openai: openaiTemplate })
    };
  }
};

/**
 * Pre-built example prompts for common use cases
 */
export const ExamplePrompts = {
  /**
   * Basic system prompt for CCH Intelligence
   */
  cchSystem: () => PromptUtils.system(
    'cch.system.base',
    'CCH Intelligence System Prompt',
    `You are CCH Intelligence, an AI assistant specialized in tax research and document analysis.

Your capabilities include:
- Analyzing tax documents and forms
- Providing tax research assistance
- Answering questions about tax law and regulations
- Helping with CCH AnswerConnect integration

Guidelines:
- Be accurate and cite sources when possible
- Acknowledge when you're uncertain
- Provide clear, actionable guidance
- Use professional, helpful tone

Current context: {{context}}
User query: {{query}}`
  )
    .required('context', 'query')
    .description('Base system prompt for CCH Intelligence AI')
    .usage('Use this as the foundation prompt for all CCH Intelligence interactions'),

  /**
   * RAG search prompt for document retrieval
   */
  ragSearch: () => PromptUtils.ragSearch(
    'rag.search.basic',
    'Basic RAG Search',
    `Search for relevant information to answer the user's query.

Query: {{query}}
Context: {{context}}

Instructions:
1. Analyze the provided context for relevant information
2. Extract key points that relate to the query
3. Identify any gaps in information
4. Provide a comprehensive response based on available context

If the context doesn't contain sufficient information, indicate what additional sources might be helpful.`
  )
    .description('Basic template for RAG-based search and retrieval')
    .example(
      'Tax Deduction Search',
      'Search for tax deduction information',
      {
        query: 'business meal deductions for 2024',
        context: 'IRS Publication 463 covers travel, entertainment, gift, and car expenses...'
      },
      'Based on the context, business meal deductions for 2024...'
    ),

  /**
   * Document analysis prompt
   */
  documentAnalysis: () => PromptUtils.documentAnalysis(
    'document.analyze.basic',
    'Basic Document Analysis',
    `Analyze the provided document and extract key information.

Document: {{document}}
Analysis type: {{analysisType}}

Please provide:
1. Document summary
2. Key findings
3. Important dates or deadlines
4. Relevant tax implications
5. Recommended actions

Focus on {{focus}} if specified.`
  )
    .required('document', 'analysisType')
    .optional({ focus: 'general analysis' })
    .description('Basic template for analyzing tax documents')
};