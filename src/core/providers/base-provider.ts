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
 * Error context interface for better error handling
 */
interface ErrorContext {
  provider: string;
  operation: string;
  timestamp: Date;
  requestId?: string;
  userAgent?: string;
  additionalInfo?: Record<string, unknown>;
}

/**
 * Provider response interface for type safety
 */
interface ProviderResponse {
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
  metadata?: Record<string, unknown>;
}

/**
 * Provider request interface for type safety
 */
interface ProviderRequest {
  messages: Array<{
    role: 'user' | 'assistant' | 'system';
    content: string;
    id?: string;
    timestamp?: Date;
  }>;
  model: string;
  temperature?: number;
  maxTokens?: number;
  stream?: boolean;
  systemPrompt?: string;
  contextDocuments?: Array<{
    name: string;
    content: string;
    type: string;
  }>;
  metadata?: Record<string, unknown>;
}

import { RetryWithBackoff, CircuitBreaker } from '../utils';
import { logger } from '../logging/logger';
import { env } from '../../config/environment';

/**
 * Base abstract class that all AI providers must implement
 */
export abstract class BaseAIProvider {
  protected apiKey: string;
  protected baseUrl?: string;
  protected defaultModel: string;
  protected timeout: number;
  protected maxRetries: number;
  protected retry: RetryWithBackoff;
  protected circuitBreaker: CircuitBreaker;

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
        this.timeout = config.timeout || env.api.timeout();
    this.maxRetries = config.maxRetries || env.retry.maxAttempts();
 
    // Initialize retry and circuit breaker with environment configuration
    this.retry = new RetryWithBackoff({
      maxAttempts: this.maxRetries,
      initialDelay: env.retry.initialDelay(),
      maxDelay: env.retry.maxDelay(),
      retryableErrors: ['NETWORK_ERROR', 'TIMEOUT', '503', '429', '502', '504', 'ECONNABORTED']
    });
    
    this.circuitBreaker = new CircuitBreaker({
      failureThreshold: env.circuitBreaker.failureThreshold(),
      resetTimeout: env.circuitBreaker.resetTimeout(),
      successThreshold: env.circuitBreaker.successThreshold()
    });
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
   * Retry logic for failed requests with circuit breaker
   */
  protected async withRetry<T>(
    operation: () => Promise<T>,
    context: string
  ): Promise<T> {
    return this.circuitBreaker.execute(
      () => this.retry.execute(
        operation,
        `${this.getCapabilities().name}: ${context}`
      ),
      () => this.getFallbackResponse<T>(context) // Fallback response
    );
  }

  /**
   * Get fallback response when circuit breaker is open
   */
  protected getFallbackResponse<T>(context: string): T {
    logger.warn('Using fallback response due to circuit breaker', {
      provider: this.getCapabilities().name,
      context
    });

    // Return a default response or throw an error
    throw new Error(`${this.getCapabilities().displayName} is temporarily unavailable. Please try again later.`);
  }

  /**
   * Common error handling utility
   */
  protected handleError(error: Error | unknown, context: string): Error {
    const errorContext: ErrorContext = {
      provider: this.getCapabilities().name,
      operation: context,
      timestamp: new Date(),
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : undefined
    };

    logger.error(`[${this.getCapabilities().name}] Error in ${context}`, {
      error: error instanceof Error ? error.message : String(error),
      errorContext
    });

    // Handle different error types
    if (error && typeof error === 'object' && 'response' in error) {
      const responseError = error as { response?: { status?: number } };

      if (responseError.response?.status === 401) {
        return new Error(`Authentication failed for ${this.getCapabilities().displayName}. Please check your API key.`);
      }

      if (responseError.response?.status === 429) {
        return new Error(`Rate limit exceeded for ${this.getCapabilities().displayName}. Please try again later.`);
      }

      if (responseError.response?.status && responseError.response.status >= 500) {
        return new Error(`Server error from ${this.getCapabilities().displayName}. Please try again later.`);
      }
    }

    if (error && typeof error === 'object' && 'code' in error) {
      const codeError = error as { code?: string; message?: string };

      if (codeError.code === 'ECONNABORTED' || codeError.message?.includes('timeout')) {
        return new Error(`Request timeout for ${this.getCapabilities().displayName}. Please try again.`);
      }
    }

    // Handle generic errors
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Error(`${this.getCapabilities().displayName} error: ${errorMessage}`);
  }

  /**
   * Format messages for the specific provider
   */
  protected abstract formatMessages(messages: AIMessage[]): ProviderRequest['messages'];

  /**
   * Parse response from the specific provider
   */
  protected abstract parseResponse(response: ProviderResponse | unknown): AIResponse;

  /**
   * Get circuit breaker metrics
   */
  getCircuitBreakerMetrics() {
    return this.circuitBreaker.getMetrics();
  }

  /**
   * Get retry configuration
   */
  getRetryConfig() {
    return this.retry.getConfig();
  }

  /**
   * Reset circuit breaker
   */
  resetCircuitBreaker() {
    this.circuitBreaker.reset();
  }

  /**
   * Check if provider is healthy
   */
  isHealthy(): boolean {
    return this.circuitBreaker.isHealthy();
  }
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