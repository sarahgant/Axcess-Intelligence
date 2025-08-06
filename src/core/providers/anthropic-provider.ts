/**
 * Anthropic Claude provider implementation
 * Handles communication with Anthropic's Claude API
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
 * Anthropic-specific message format
 */
interface AnthropicMessage {
  role: 'user' | 'assistant';
  content: string;
}

/**
 * Anthropic API response format
 */
interface AnthropicResponse {
  id: string;
  type: string;
  role: string;
  content: Array<{
    type: string;
    text: string;
  }>;
  model: string;
  stop_reason: string;
  stop_sequence: string | null;
  usage: {
    input_tokens: number;
    output_tokens: number;
  };
}

/**
 * Anthropic content block interface
 */
interface AnthropicContentBlock {
  type: string;
  text?: string;
  source?: {
    type: string;
    media_type: string;
    data: string;
  };
}

/**
 * Anthropic streaming response format
 */
interface AnthropicStreamEvent {
  type: 'message_start' | 'content_block_start' | 'content_block_delta' | 'content_block_stop' | 'message_delta' | 'message_stop';
  message?: Partial<AnthropicResponse>;
  content_block?: AnthropicContentBlock;
  delta?: {
    type: string;
    text?: string;
    stop_reason?: string;
  };
  usage?: {
    input_tokens: number;
    output_tokens: number;
  };
}

/**
 * Anthropic request body interface
 */
interface AnthropicRequestBody {
  model: string;
  max_tokens: number;
  messages: AnthropicMessage[];
  system?: string;
  temperature?: number;
  stream?: boolean;
  metadata?: Record<string, unknown>;
}

export class AnthropicProvider extends BaseAIProvider {
  private readonly ANTHROPIC_VERSION = '2023-06-01';

  constructor(config: {
    apiKey: string;
    baseUrl?: string;
    defaultModel?: string;
    timeout?: number;
    maxRetries?: number;
  }) {
    super({
      ...config,
      baseUrl: config.baseUrl || 'https://api.anthropic.com',
      defaultModel: config.defaultModel || 'claude-3-sonnet-20240229'
    });
  }

  /**
   * Send a non-streaming message to Claude
   */
  async sendMessage(
    messages: AIMessage[],
    options: AIRequestOptions = {}
  ): Promise<AIResponse> {
    return this.withRetry(async () => {
      const body = this.buildRequestBody(messages, options, false);

      const response = await fetch(`${this.baseUrl}/v1/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': this.apiKey,
          'anthropic-version': this.ANTHROPIC_VERSION,
        },
        body: JSON.stringify(body),
        signal: AbortSignal.timeout(this.timeout)
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data: AnthropicResponse = await response.json();
      return this.parseResponse(data);
    }, 'sendMessage');
  }

  /**
   * Send a streaming message to Claude
   */
  async sendStreamingMessage(
    messages: AIMessage[],
    handler: StreamingHandler,
    options: AIRequestOptions = {}
  ): Promise<void> {
    return this.withRetry(async () => {
      const body = this.buildRequestBody(messages, options, true);

      handler.onStart?.();

      const response = await fetch(`${this.baseUrl}/v1/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': this.apiKey,
          'anthropic-version': this.ANTHROPIC_VERSION,
        },
        body: JSON.stringify(body),
        signal: AbortSignal.timeout(this.timeout)
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
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
              try {
                const data = JSON.parse(line.slice(6));
                const event = data as AnthropicStreamEvent;

                if (event.type === 'content_block_delta' && event.delta?.text) {
                  const token = event.delta.text;
                  fullResponse += token;
                  handler.onToken(token);
                } else if (event.type === 'message_stop') {
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
      name: 'anthropic',
      displayName: 'Claude (Anthropic)',
      supportsStreaming: true,
      supportsDocuments: true,
      maxTokens: 200000, // Claude 3 context window
      supportedModels: [
        'claude-3-opus-20240229',
        'claude-3-sonnet-20240229',
        'claude-3-haiku-20240307',
        'claude-sonnet-4-20250514'
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
      if (!ProviderUtils.validateApiKey(this.apiKey, 'anthropic')) {
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
    // No specific cleanup needed for Anthropic provider
    return Promise.resolve();
  }

  /**
   * Format messages for Anthropic API
   */
  protected formatMessages(messages: AIMessage[]): AnthropicMessage[] {
    // Filter out system messages and handle them separately
    return messages
      .filter(msg => msg.role !== 'system')
      .map(msg => ({
        role: msg.role === 'user' ? 'user' : 'assistant',
        content: ProviderUtils.sanitizeContent(msg.content)
      }));
  }

  /**
   * Parse Anthropic response
   */
  protected parseResponse(response: AnthropicResponse): AIResponse {
    const content = response.content
      .filter(block => block.type === 'text')
      .map(block => block.text)
      .join('');

    return {
      id: response.id,
      content,
      model: response.model,
      usage: {
        promptTokens: response.usage.input_tokens,
        completionTokens: response.usage.output_tokens,
        totalTokens: response.usage.input_tokens + response.usage.output_tokens
      },
      finishReason: this.mapStopReason(response.stop_reason),
      timestamp: new Date()
    };
  }

  /**
   * Build request body for Anthropic API
   */
  private buildRequestBody(
    messages: AIMessage[],
    options: AIRequestOptions,
    stream: boolean
  ): AnthropicRequestBody {
    const formattedMessages = this.formatMessages(messages);

    const body: AnthropicRequestBody = {
      model: options.model || this.defaultModel,
      max_tokens: options.maxTokens || 4096,
      messages: formattedMessages,
      temperature: options.temperature || 0.7,
      stream
    };

    // Add system prompt if provided
    if (options.systemPrompt) {
      body.system = options.systemPrompt;
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
   * Map Anthropic stop reason to common format
   */
  private mapStopReason(stopReason: string): AIResponse['finishReason'] {
    switch (stopReason) {
      case 'end_turn':
        return 'stop';
      case 'max_tokens':
        return 'length';
      case 'stop_sequence':
        return 'stop';
      default:
        return 'stop';
    }
  }
}