/**
 * OpenAI GPT provider implementation
 * Handles communication with OpenAI's GPT API
 */

import {
  BaseAIProvider,
  AIMessage,
  AIResponse,
  StreamingHandler,
  AIRequestOptions,
  ProviderCapabilities,
  ProviderHealth,
  ProviderUtils
} from './base-provider';

/**
 * OpenAI-specific message format
 */
interface OpenAIMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

/**
 * OpenAI API response format
 */
interface OpenAIResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: Array<{
    index: number;
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }>;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

/**
 * OpenAI streaming response format
 */
interface OpenAIStreamChunk {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: Array<{
    index: number;
    delta: {
      role?: string;
      content?: string;
    };
    finish_reason: string | null;
  }>;
}

/**
 * OpenAI request body interface
 */
interface OpenAIRequestBody {
  model: string;
  messages: OpenAIMessage[];
  max_tokens: number;
  stream: boolean;
  temperature?: number;
  metadata?: Record<string, unknown>;
}

export class OpenAIProvider extends BaseAIProvider {
  private readonly organization?: string;

  constructor(config: {
    apiKey: string;
    baseUrl?: string;
    organization?: string;
    defaultModel?: string;
    timeout?: number;
    maxRetries?: number;
  }) {
    super({
      ...config,
      baseUrl: config.baseUrl || 'https://api.openai.com',
      defaultModel: config.defaultModel || 'gpt-4-turbo-preview'
    });
    this.organization = config.organization;
  }

  /**
   * Send a non-streaming message to GPT
   */
  async sendMessage(
    messages: AIMessage[],
    options: AIRequestOptions = {}
  ): Promise<AIResponse> {
    return this.withRetry(async () => {
      const body = this.buildRequestBody(messages, options, false);

      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`,
      };

      if (this.organization) {
        headers['OpenAI-Organization'] = this.organization;
      }

      const response = await fetch(`${this.baseUrl}/v1/chat/completions`, {
        method: 'POST',
        headers,
        body: JSON.stringify(body),
        signal: AbortSignal.timeout(this.timeout)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        const errorMessage = errorData?.error?.message || `HTTP ${response.status}: ${response.statusText}`;
        throw new Error(errorMessage);
      }

      const data: OpenAIResponse = await response.json();
      return this.parseResponse(data);
    }, 'sendMessage');
  }

  /**
   * Send a streaming message to GPT
   */
  async sendStreamingMessage(
    messages: AIMessage[],
    handler: StreamingHandler,
    options: AIRequestOptions = {}
  ): Promise<void> {
    return this.withRetry(async () => {
      const body = this.buildRequestBody(messages, options, true);

      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`,
      };

      if (this.organization) {
        headers['OpenAI-Organization'] = this.organization;
      }

      handler.onStart?.();

      const response = await fetch(`${this.baseUrl}/v1/chat/completions`, {
        method: 'POST',
        headers,
        body: JSON.stringify(body),
        signal: AbortSignal.timeout(this.timeout)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        const errorMessage = errorData?.error?.message || `HTTP ${response.status}: ${response.statusText}`;
        throw new Error(errorMessage);
      }

      if (!response.body) {
        throw new Error('No response body received');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let fullResponse = '';

      try {
        while (true) {
          const { done, value } = await reader.read();

          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split('\n');

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6).trim();

              if (data === '[DONE]') {
                handler.onComplete(fullResponse);
                return;
              }

              try {
                const parsed = JSON.parse(data) as OpenAIStreamChunk;
                const choice = parsed.choices[0];

                if (choice?.delta?.content) {
                  const token = choice.delta.content;
                  fullResponse += token;
                  handler.onToken(token);
                } else if (choice?.finish_reason) {
                  handler.onComplete(fullResponse);
                  return;
                }
              } catch (parseError) {
                // Skip malformed JSON lines
                console.warn('Failed to parse streaming data:', parseError);
              }
            }
          }
        }

        handler.onComplete(fullResponse);
      } catch (error) {
        handler.onError(this.handleError(error, 'streaming'));
        throw error;
      } finally {
        reader.releaseLock();
      }
    }, 'sendStreamingMessage');
  }

  /**
   * Get provider capabilities
   */
  getCapabilities(): ProviderCapabilities {
    return {
      name: 'openai',
      displayName: 'GPT (OpenAI)',
      supportsStreaming: true,
      supportsDocuments: true,
      maxTokens: 128000, // GPT-4 Turbo context window
      supportedModels: [
        'gpt-4-turbo-preview',
        'gpt-4-1106-preview',
        'gpt-4-0125-preview',
        'gpt-3.5-turbo',
        'gpt-4.1'
      ],
      defaultModel: this.defaultModel
    };
  }

  /**
   * Check provider health
   */
  async checkHealth(): Promise<ProviderHealth> {
    const startTime = Date.now();

    try {
      // Send a minimal test message
      const testMessages: AIMessage[] = [
        { role: 'user', content: 'Hello' }
      ];

      await this.sendMessage(testMessages, { maxTokens: 10 });

      const responseTime = Date.now() - startTime;

      return {
        isHealthy: true,
        lastChecked: new Date(),
        averageResponseTime: responseTime,
        message: 'Provider is healthy'
      };
    } catch (error) {
      return {
        isHealthy: false,
        lastChecked: new Date(),
        message: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Validate configuration
   */
  async validateConfig(): Promise<boolean> {
    try {
      if (!ProviderUtils.validateApiKey(this.apiKey, 'openai')) {
        return false;
      }

      const health = await this.checkHealth();
      return health.isHealthy;
    } catch {
      return false;
    }
  }

  /**
   * Clean shutdown
   */
  async dispose(): Promise<void> {
    // No specific cleanup needed for OpenAI provider
    return Promise.resolve();
  }

  /**
   * Format messages for OpenAI API
   */
  protected formatMessages(messages: AIMessage[]): OpenAIMessage[] {
    return messages.map(msg => ({
      role: msg.role,
      content: ProviderUtils.sanitizeContent(msg.content)
    }));
  }

  /**
   * Parse OpenAI response
   */
  protected parseResponse(response: OpenAIResponse): AIResponse {
    const choice = response.choices[0];
    if (!choice) {
      throw new Error('No choices in OpenAI response');
    }

    return {
      id: response.id,
      content: choice.message.content,
      model: response.model,
      usage: {
        promptTokens: response.usage.prompt_tokens,
        completionTokens: response.usage.completion_tokens,
        totalTokens: response.usage.total_tokens
      },
      finishReason: this.mapFinishReason(choice.finish_reason),
      timestamp: new Date()
    };
  }

  /**
   * Build request body for OpenAI API
   */
  private buildRequestBody(
    messages: AIMessage[],
    options: AIRequestOptions,
    stream: boolean
  ): OpenAIRequestBody {
    let formattedMessages = this.formatMessages(messages);

    // Add document context if provided
    if (options.contextDocuments && options.contextDocuments.length > 0) {
      const documentContext = ProviderUtils.formatDocumentContext(options.contextDocuments);

      // Add as system message or append to existing system message
      const systemMessageIndex = formattedMessages.findIndex(msg => msg.role === 'system');
      if (systemMessageIndex >= 0) {
        formattedMessages[systemMessageIndex].content += documentContext;
      } else {
        formattedMessages.unshift({
          role: 'system',
          content: documentContext
        });
      }
    }

    // Add system prompt if provided and no system message exists
    if (options.systemPrompt) {
      const systemMessageIndex = formattedMessages.findIndex(msg => msg.role === 'system');
      if (systemMessageIndex >= 0) {
        formattedMessages[systemMessageIndex].content =
          `${options.systemPrompt}\n${formattedMessages[systemMessageIndex].content}`;
      } else {
        formattedMessages.unshift({
          role: 'system',
          content: options.systemPrompt
        });
      }
    }

    const body: OpenAIRequestBody = {
      model: options.model || this.defaultModel,
      messages: formattedMessages,
      max_tokens: options.maxTokens || 4000,
      stream
    };

    if (options.temperature !== undefined) {
      body.temperature = Math.max(0, Math.min(2, options.temperature));
    }

    // Add metadata if available
    if (options.contextDocuments && options.contextDocuments.length > 0) {
      body.metadata = {
        contextDocuments: options.contextDocuments.length,
        hasSystemPrompt: !!options.systemPrompt
      };
    }

    return body;
  }

  /**
   * Map OpenAI finish reason to common format
   */
  private mapFinishReason(finishReason: string): AIResponse['finishReason'] {
    switch (finishReason) {
      case 'stop':
        return 'stop';
      case 'length':
        return 'length';
      case 'content_filter':
        return 'content_filter';
      case 'tool_calls':
        return 'tool_calls';
      default:
        return 'stop';
    }
  }
}