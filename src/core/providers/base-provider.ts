/**
 * Base provider interface and common types for AI providers
 * Provides a unified interface for different AI services (Anthropic, OpenAI)
 */

/**
 * Common message types for all AI providers
 */
export interface AIMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  id?: string;
  timestamp?: Date;
}

/**
 * Streaming response handler for real-time message updates
 */
export interface StreamingHandler {
  onToken: (token: string) => void;
  onComplete: (fullResponse: string) => void;
  onError: (error: Error) => void;
  onStart?: () => void;
}

/**
 * Configuration options for AI requests
 */
export interface AIRequestOptions {
  model?: string;
  temperature?: number;
  maxTokens?: number;
  stream?: boolean;
  timeout?: number;
  systemPrompt?: string;
  contextDocuments?: Array<{
    name: string;
    content: string;
    type: string;
  }>;
}

/**
 * Provider response structure
 */
export interface AIResponse {
  id: string;
  content: string;
  model: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
  finishReason?: 'stop' | 'length' | 'content_filter' | 'tool_calls';
  timestamp: Date;
}

/**
 * Provider capabilities and metadata
 */
export interface ProviderCapabilities {
  name: string;
  displayName: string;
  supportsStreaming: boolean;
  supportsDocuments: boolean;
  maxTokens: number;
  supportedModels: string[];
  defaultModel: string;
}

/**
 * Provider health status
 */
export interface ProviderHealth {
  isHealthy: boolean;
  lastChecked: Date;
  averageResponseTime?: number;
  errorRate?: number;
  message?: string;
}

/**
 * Base abstract class that all AI providers must implement
 */
export abstract class BaseAIProvider {
  protected apiKey: string;
  protected baseUrl?: string;
  protected defaultModel: string;
  protected timeout: number;
  protected maxRetries: number;

  constructor(config: {
    apiKey: string;
    baseUrl?: string;
    defaultModel: string;
    timeout?: number;
    maxRetries?: number;
  }) {
    this.apiKey = config.apiKey;
    this.baseUrl = config.baseUrl;
    this.defaultModel = config.defaultModel;
    this.timeout = config.timeout || 30000;
    this.maxRetries = config.maxRetries || 3;
  }

  /**
   * Send a chat completion request
   */
  abstract sendMessage(
    messages: AIMessage[],
    options?: AIRequestOptions
  ): Promise<AIResponse>;

  /**
   * Send a streaming chat completion request
   */
  abstract sendStreamingMessage(
    messages: AIMessage[],
    handler: StreamingHandler,
    options?: AIRequestOptions
  ): Promise<void>;

  /**
   * Get provider capabilities
   */
  abstract getCapabilities(): ProviderCapabilities;

  /**
   * Check provider health
   */
  abstract checkHealth(): Promise<ProviderHealth>;

  /**
   * Validate configuration
   */
  abstract validateConfig(): Promise<boolean>;

  /**
   * Clean shutdown for any cleanup needed
   */
  abstract dispose(): Promise<void>;

  /**
   * Common error handling utility
   */
  protected handleError(error: any, context: string): Error {
    console.error(`[${this.getCapabilities().name}] Error in ${context}:`, error);
    
    if (error.response?.status === 401) {
      return new Error(`Authentication failed for ${this.getCapabilities().displayName}. Please check your API key.`);
    }
    
    if (error.response?.status === 429) {
      return new Error(`Rate limit exceeded for ${this.getCapabilities().displayName}. Please try again later.`);
    }
    
    if (error.response?.status >= 500) {
      return new Error(`Server error from ${this.getCapabilities().displayName}. Please try again later.`);
    }
    
    if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
      return new Error(`Request timeout for ${this.getCapabilities().displayName}. Please try again.`);
    }
    
    return new Error(`${this.getCapabilities().displayName} error: ${error.message || 'Unknown error'}`);
  }

  /**
   * Retry logic for failed requests
   */
  protected async withRetry<T>(
    operation: () => Promise<T>,
    context: string
  ): Promise<T> {
    let lastError: Error;
    
    for (let attempt = 1; attempt <= this.maxRetries; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = this.handleError(error, context);
        
        if (attempt === this.maxRetries) {
          throw lastError;
        }
        
        // Exponential backoff: 1s, 2s, 4s
        const delay = Math.pow(2, attempt - 1) * 1000;
        console.warn(`[${this.getCapabilities().name}] Attempt ${attempt} failed, retrying in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
    
    throw lastError!;
  }

  /**
   * Format messages for the specific provider
   */
  protected abstract formatMessages(messages: AIMessage[]): any[];

  /**
   * Parse response from the specific provider
   */
  protected abstract parseResponse(response: any): AIResponse;
}

/**
 * Provider registry interface for managing multiple providers
 */
export interface ProviderRegistry {
  register(name: string, provider: BaseAIProvider): void;
  get(name: string): BaseAIProvider | null;
  getAll(): Record<string, BaseAIProvider>;
  remove(name: string): boolean;
  getDefault(): BaseAIProvider | null;
  setDefault(name: string): boolean;
}

/**
 * Common utility functions for all providers
 */
export const ProviderUtils = {
  /**
   * Create a unique message ID
   */
  generateMessageId: (): string => {
    return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  },

  /**
   * Validate API key format (basic validation)
   */
  validateApiKey: (key: string, provider: string): boolean => {
    if (!key || key.length < 10) {
      return false;
    }
    
    // Provider-specific basic validation
    if (provider === 'anthropic' && !key.startsWith('sk-ant-')) {
      return false;
    }
    
    if (provider === 'openai' && !key.startsWith('sk-')) {
      return false;
    }
    
    return true;
  },

  /**
   * Sanitize content for safety
   */
  sanitizeContent: (content: string): string => {
    // Basic content sanitization
    return content.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  },

  /**
   * Calculate token count estimate (rough approximation)
   */
  estimateTokens: (text: string): number => {
    // Rough estimation: ~4 characters per token
    return Math.ceil(text.length / 4);
  },

  /**
   * Format documents for context
   */
  formatDocumentContext: (documents: Array<{ name: string; content: string; type: string }>): string => {
    if (!documents || documents.length === 0) {
      return '';
    }

    let context = '\n\n--- DOCUMENT CONTEXT ---\n';
    documents.forEach((doc, index) => {
      context += `\nDocument ${index + 1}: ${doc.name} (${doc.type})\n`;
      context += `Content: ${doc.content}\n`;
    });
    context += '--- END DOCUMENT CONTEXT ---\n\n';
    
    return context;
  }
};