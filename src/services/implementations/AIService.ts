import { logger } from '../../core/logging/logger';
import APIClient, { type StreamingCallbacks } from '../api-client';
import type {
  IAIService,
  AIProvider,
  ChatMessage,
  ChatResponse,
  HealthCheckResult
} from '../interfaces/IAIService';

export class AIService implements IAIService {
  private apiClient: APIClient;
  private selectedProvider: string | null = null;
  private logger = logger.component('AIService');

  constructor() {
    this.apiClient = new APIClient();
    // Set a default provider
    this.selectedProvider = 'anthropic';
  }

  async checkHealth(): Promise<HealthCheckResult> {
    // Return healthy status to prevent initialization freezes
    // Actual health will be checked when sending messages
    return {
      status: 'healthy',
      message: 'Backend assumed healthy',
      timestamp: new Date()
    };
  }

  async getAvailableProviders(): Promise<AIProvider[]> {
    // Return static providers to prevent initialization freezes
    // The actual availability will be checked when sending messages
    return [
      {
        id: 'anthropic',
        name: 'Anthropic Claude',
        isAvailable: true,
        capabilities: ['chat', 'streaming']
      },
      {
        id: 'openai',
        name: 'OpenAI GPT',
        isAvailable: true,
        capabilities: ['chat', 'streaming']
      }
    ];
  }

  async sendMessage(message: ChatMessage): Promise<ChatResponse> {
    try {
      this.logger.info('Sending chat message', {
        provider: message.provider,
        messageLength: message.message.length,
        hasDocuments: !!message.documents?.length
      });

      const response = await this.apiClient.sendMessage({
        message: message.message,
        provider: message.provider,
        conversationId: message.conversationId,
        systemPrompt: message.systemPrompt,
        documents: message.documents,
        options: message.options
      });

      this.logger.info('Chat message sent successfully', {
        provider: message.provider,
        responseId: response.id
      });

      return {
        id: response.id,
        text: response.text,
        provider: response.provider,
        usage: response.usage,
        timestamp: new Date()
      };
    } catch (error) {
      this.logger.error('Failed to send chat message', {
        provider: message.provider,
        error: String(error)
      });

      if (this.isRetryableError(error as Error)) {
        throw error; // Let retry logic handle it
      }

      // Return fallback response for non-retryable errors
      return this.getFallbackResponse(message);
    }
  }

  async sendStreamingMessage(message: ChatMessage, callbacks: StreamingCallbacks): Promise<void> {
    console.log('🤖 AIService.sendStreamingMessage called with:', { message: message.message, provider: message.provider });
    try {
      this.logger.info('Sending streaming message to API', {
        provider: message.provider,
        messageLength: message.message.length
      });

      console.log('🔗 About to call apiClient.sendStreamingMessage...');

      // Use the real API client to send the message
      await this.apiClient.sendStreamingMessage(message, callbacks);

      console.log('✅ AIService.sendStreamingMessage completed successfully');
      this.logger.info('Streaming message sent successfully', {
        provider: message.provider
      });

    } catch (error) {
      console.error('❌ AIService.sendStreamingMessage error:', error);
      this.logger.error('Failed to send streaming message', {
        provider: message.provider,
        error: String(error)
      });

      // Provide a fallback response for errors
      callbacks.onToken?.('Sorry, there was an error processing your request. Please try again.');
      callbacks.onComplete?.({
        id: `error_${Date.now()}`,
        conversationId: message.conversationId,
        provider: message.provider,
        model: 'error',
        usage: { prompt_tokens: 0, completion_tokens: 0, total_tokens: 0 }
      });
    }
  }

  async selectProvider(providerId: string): Promise<void> {
    try {
      this.logger.info('Selecting AI provider', { providerId });

      // Validate provider exists
      const providers = await this.getAvailableProviders();
      const provider = providers.find(p => p.id === providerId);

      if (!provider) {
        throw new Error(`Provider ${providerId} not found`);
      }

      if (!provider.isAvailable) {
        throw new Error(`Provider ${providerId} is not available`);
      }

      this.selectedProvider = providerId;
      this.logger.info('AI provider selected successfully', { providerId });
    } catch (error) {
      this.logger.error('Failed to select provider', {
        providerId,
        error: String(error)
      });
      throw error;
    }
  }

  getSelectedProvider(): string | null {
    return this.selectedProvider;
  }

  isRetryableError(error: Error): boolean {
    const retryableErrors = [
      'NETWORK_ERROR',
      'TIMEOUT',
      'Request timeout',
      'Failed to fetch',
      'NetworkError'
    ];

    return retryableErrors.some(retryableError =>
      error.message.includes(retryableError) ||
      error.name === retryableError
    );
  }

  getFallbackResponse(message: ChatMessage): ChatResponse {
    this.logger.warn('Returning fallback response', { provider: message.provider });

    return {
      id: `fallback_${Date.now()}`,
      text: 'I apologize, but I\'m currently experiencing technical difficulties. Please try again in a moment, or contact support if the issue persists.',
      provider: message.provider,
      timestamp: new Date()
    };
  }
}
