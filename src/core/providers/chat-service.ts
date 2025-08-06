/**
 * Chat service that orchestrates AI providers for conversations
 * Handles message routing, streaming, history, and error recovery
 */

import {
  BaseAIProvider,
  AIMessage,
  AIResponse,
  StreamingHandler,
  AIRequestOptions
} from './base-provider';
import { ProviderFactory, ProviderUtils } from './provider-factory';
import { logger } from '../logging/logger';
import { getConfig } from '../../config';

/**
 * Chat message with metadata
 */
export interface ChatMessage extends AIMessage {
  id: string;
  timestamp: Date;
  provider?: string;
  model?: string;
  attachedDocuments?: Array<{
    id: string;
    name: string;
    type: string;
    content?: string;
  }>;
  isStreaming?: boolean;
  versions?: string[]; // For regenerated responses
  currentVersion?: number;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

/**
 * Chat conversation
 */
export interface ChatConversation {
  id: string;
  title: string;
  messages: ChatMessage[];
  createdAt: Date;
  updatedAt: Date;
  provider?: string;
  metadata?: Record<string, any>;
}

/**
 * Streaming response callbacks
 */
export interface ChatStreamingCallbacks {
  onStart?: () => void;
  onToken: (token: string, messageId: string) => void;
  onComplete: (fullResponse: string, messageId: string) => void;
  onError: (error: Error, messageId: string) => void;
}

/**
 * Chat service configuration
 */
export interface ChatServiceConfig {
  defaultProvider?: string;
  enableRetries?: boolean;
  maxRetries?: number;
  enableFallback?: boolean;
  fallbackProvider?: string;
  enableHistory?: boolean;
  maxHistoryLength?: number;
  enableDocumentContext?: boolean;
}

/**
 * Service for managing AI-powered chat conversations
 */
export class ChatService {
  private static instance: ChatService | null = null;
  private providerFactory: ProviderFactory;
  private config: ChatServiceConfig;
  private conversations: Map<string, ChatConversation> = new Map();
  private activeStreams: Map<string, AbortController> = new Map();

  private constructor(config: ChatServiceConfig = {}) {
    this.config = {
      enableRetries: true,
      maxRetries: 3,
      enableFallback: true,
      enableHistory: true,
      maxHistoryLength: 100,
      enableDocumentContext: true,
      ...config
    };
    
    // Get provider factory instance
    this.providerFactory = ProviderFactory.getInstance(getConfig());
  }

  /**
   * Get singleton instance
   */
  static getInstance(config?: ChatServiceConfig): ChatService {
    if (!ChatService.instance) {
      ChatService.instance = new ChatService(config);
    }
    return ChatService.instance;
  }

  /**
   * Initialize the chat service
   */
  async initialize(): Promise<void> {
    try {
      logger.info('Initializing chat service', { component: 'ChatService' });
      
      // Initialize providers if not already done
      if (!ProviderUtils.hasAvailableProviders()) {
        await ProviderUtils.initializeProviders();
      }
      
      logger.info('Chat service initialized', { component: 'ChatService' });
    } catch (error) {
      logger.error('Failed to initialize chat service', { 
        component: 'ChatService',
        error: error instanceof Error ? error.message : String(error)
      });
      throw error;
    }
  }

  /**
   * Send a message and get response
   */
  async sendMessage(
    conversationId: string,
    message: string,
    options: {
      provider?: string;
      systemPrompt?: string;
      documents?: Array<{ id: string; name: string; type: string; content?: string }>;
      temperature?: number;
      maxTokens?: number;
    } = {}
  ): Promise<{ userMessage: ChatMessage; aiMessage: ChatMessage }> {
    
    const provider = this.getProvider(options.provider);
    if (!provider) {
      throw new Error('No AI provider available');
    }

    // Create user message
    const userMessage: ChatMessage = {
      id: this.generateMessageId(),
      role: 'user',
      content: message,
      timestamp: new Date(),
      provider: provider.getCapabilities().name,
      attachedDocuments: options.documents?.map(doc => ({
        id: doc.id,
        name: doc.name,
        type: doc.type,
        content: doc.content
      }))
    };

    // Get conversation history
    const conversation = this.getOrCreateConversation(conversationId);
    conversation.messages.push(userMessage);
    conversation.updatedAt = new Date();

    // Prepare messages for AI
    const aiMessages = this.prepareMessagesForAI(conversation, options.systemPrompt);
    
    // Prepare request options
    const requestOptions: AIRequestOptions = {
      model: provider.getCapabilities().defaultModel,
      temperature: options.temperature,
      maxTokens: options.maxTokens,
      systemPrompt: options.systemPrompt,
      contextDocuments: options.documents?.map(doc => ({
        name: doc.name,
        content: doc.content || '',
        type: doc.type
      }))
    };

    try {
      // Send to AI provider
      const response = await this.sendWithRetry(provider, aiMessages, requestOptions);
      
      // Create AI response message
      const aiMessage: ChatMessage = {
        id: this.generateMessageId(),
        role: 'assistant',
        content: response.content,
        timestamp: new Date(),
        provider: provider.getCapabilities().name,
        model: response.model,
        usage: response.usage
      };

      // Add to conversation
      conversation.messages.push(aiMessage);
      conversation.updatedAt = new Date();
      conversation.provider = provider.getCapabilities().name;

      return { userMessage, aiMessage };
      
    } catch (error) {
      // Try fallback provider if enabled
      if (this.config.enableFallback && this.config.fallbackProvider) {
        const fallbackProvider = this.getProvider(this.config.fallbackProvider);
        if (fallbackProvider && fallbackProvider !== provider) {
          console.warn(`Retrying with fallback provider: ${this.config.fallbackProvider}`);
          return this.sendMessage(conversationId, message, {
            ...options,
            provider: this.config.fallbackProvider
          });
        }
      }
      
      // Create error message
      const errorMessage: ChatMessage = {
        id: this.generateMessageId(),
        role: 'assistant',
        content: `I'm sorry, I encountered an error: ${error instanceof Error ? error.message : 'Unknown error'}. Please try again.`,
        timestamp: new Date(),
        provider: 'error'
      };
      
      conversation.messages.push(errorMessage);
      throw error;
    }
  }

  /**
   * Send a streaming message
   */
  async sendStreamingMessage(
    conversationId: string,
    message: string,
    callbacks: ChatStreamingCallbacks,
    options: {
      provider?: string;
      systemPrompt?: string;
      documents?: Array<{ id: string; name: string; type: string; content?: string }>;
      temperature?: number;
      maxTokens?: number;
    } = {}
  ): Promise<ChatMessage> {
    
    const provider = this.getProvider(options.provider);
    if (!provider) {
      throw new Error('No AI provider available');
    }

    // Create user message
    const userMessage: ChatMessage = {
      id: this.generateMessageId(),
      role: 'user',
      content: message,
      timestamp: new Date(),
      provider: provider.getCapabilities().name,
      attachedDocuments: options.documents?.map(doc => ({
        id: doc.id,
        name: doc.name,
        type: doc.type,
        content: doc.content
      }))
    };

    // Create AI message placeholder
    const aiMessageId = this.generateMessageId();
    const aiMessage: ChatMessage = {
      id: aiMessageId,
      role: 'assistant',
      content: '',
      timestamp: new Date(),
      provider: provider.getCapabilities().name,
      isStreaming: true
    };

    // Get conversation history
    const conversation = this.getOrCreateConversation(conversationId);
    conversation.messages.push(userMessage, aiMessage);
    conversation.updatedAt = new Date();

    // Prepare messages for AI
    const aiMessages = this.prepareMessagesForAI(conversation, options.systemPrompt, -1); // Exclude the AI placeholder

    // Prepare request options
    const requestOptions: AIRequestOptions = {
      model: provider.getCapabilities().defaultModel,
      temperature: options.temperature,
      maxTokens: options.maxTokens,
      systemPrompt: options.systemPrompt,
      contextDocuments: options.documents?.map(doc => ({
        name: doc.name,
        content: doc.content || '',
        type: doc.type
      }))
    };

    // Create abort controller for this stream
    const abortController = new AbortController();
    this.activeStreams.set(aiMessageId, abortController);

    try {
      // Set up streaming handler
      const streamingHandler: StreamingHandler = {
        onStart: () => {
          callbacks.onStart?.();
        },
        onToken: (token: string) => {
          if (abortController.signal.aborted) return;
          
          aiMessage.content += token;
          callbacks.onToken(token, aiMessageId);
        },
        onComplete: (fullResponse: string) => {
          if (abortController.signal.aborted) return;
          
          aiMessage.content = fullResponse;
          aiMessage.isStreaming = false;
          conversation.updatedAt = new Date();
          
          this.activeStreams.delete(aiMessageId);
          callbacks.onComplete(fullResponse, aiMessageId);
        },
        onError: (error: Error) => {
          aiMessage.isStreaming = false;
          aiMessage.content = 'Sorry, I encountered an error while generating the response.';
          
          this.activeStreams.delete(aiMessageId);
          callbacks.onError(error, aiMessageId);
        }
      };

      // Send streaming request
      await provider.sendStreamingMessage(aiMessages, streamingHandler, requestOptions);
      
      return aiMessage;
      
    } catch (error) {
      this.activeStreams.delete(aiMessageId);
      
      aiMessage.isStreaming = false;
      aiMessage.content = `I'm sorry, I encountered an error: ${error instanceof Error ? error.message : 'Unknown error'}`;
      
      callbacks.onError(error instanceof Error ? error : new Error('Unknown error'), aiMessageId);
      throw error;
    }
  }

  /**
   * Stop a streaming message
   */
  stopStreaming(messageId: string): boolean {
    const controller = this.activeStreams.get(messageId);
    if (controller) {
      controller.abort();
      this.activeStreams.delete(messageId);
      return true;
    }
    return false;
  }

  /**
   * Get conversation by ID
   */
  getConversation(id: string): ChatConversation | null {
    return this.conversations.get(id) || null;
  }

  /**
   * Create a new conversation
   */
  createConversation(title?: string): ChatConversation {
    const conversation: ChatConversation = {
      id: this.generateConversationId(),
      title: title || 'New Conversation',
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    this.conversations.set(conversation.id, conversation);
    return conversation;
  }

  /**
   * Get all conversations
   */
  getConversations(): ChatConversation[] {
    return Array.from(this.conversations.values())
      .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
  }

  /**
   * Delete a conversation
   */
  deleteConversation(id: string): boolean {
    return this.conversations.delete(id);
  }

  /**
   * Get available providers
   */
  getAvailableProviders(): string[] {
    return this.providerFactory.getAvailableProviders();
  }

  /**
   * Set default provider
   */
  setDefaultProvider(name: string): boolean {
    return this.providerFactory.setDefaultProvider(name);
  }

  /**
   * Get provider capabilities
   */
  getProviderCapabilities() {
    return this.providerFactory.getProviderCapabilities();
  }

  /**
   * Clean shutdown
   */
  async dispose(): Promise<void> {
    // Abort all active streams
    for (const controller of this.activeStreams.values()) {
      controller.abort();
    }
    this.activeStreams.clear();
    
    // Clear conversations
    this.conversations.clear();
  }

  // Private helper methods

  private getProvider(name?: string): BaseAIProvider | null {
    if (name) {
      return this.providerFactory.getProvider(name);
    }
    return this.providerFactory.getDefaultProvider();
  }

  private getOrCreateConversation(id: string): ChatConversation {
    let conversation = this.conversations.get(id);
    if (!conversation) {
      conversation = this.createConversation();
      // Update the ID to match the requested one
      this.conversations.delete(conversation.id);
      conversation.id = id;
      this.conversations.set(id, conversation);
    }
    return conversation;
  }

  private prepareMessagesForAI(
    conversation: ChatConversation,
    systemPrompt?: string,
    excludeLast: number = 0
  ): AIMessage[] {
    const messages: AIMessage[] = [];
    
    // Add system prompt if provided
    if (systemPrompt) {
      messages.push({
        role: 'system',
        content: systemPrompt
      });
    }
    
    // Add conversation history (excluding the last N messages if specified)
    const messagesToInclude = excludeLast > 0 
      ? conversation.messages.slice(0, -excludeLast)
      : conversation.messages;
    
    for (const msg of messagesToInclude) {
      messages.push({
        role: msg.role,
        content: msg.content,
        id: msg.id,
        timestamp: msg.timestamp
      });
    }
    
    return messages;
  }

  private async sendWithRetry(
    provider: BaseAIProvider,
    messages: AIMessage[],
    options: AIRequestOptions
  ): Promise<AIResponse> {
    if (!this.config.enableRetries) {
      return provider.sendMessage(messages, options);
    }

    let lastError: Error;
    const maxRetries = this.config.maxRetries || 3;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await provider.sendMessage(messages, options);
      } catch (error) {
        lastError = error instanceof Error ? error : new Error('Unknown error');
        
        if (attempt === maxRetries) {
          throw lastError;
        }
        
        // Exponential backoff
        const delay = Math.pow(2, attempt - 1) * 1000;
        console.warn(`Chat service retry ${attempt}/${maxRetries} in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }

    throw lastError!;
  }

  private generateMessageId(): string {
    return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private generateConversationId(): string {
    return `conv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

/**
 * Convenience functions for common chat operations
 */
export const ChatUtils = {
  /**
   * Initialize chat service with default configuration
   */
  async initializeChatService(): Promise<ChatService> {
    const service = ChatService.getInstance();
    await service.initialize();
    return service;
  },

  /**
   * Send a quick message without conversation management
   */
  async quickMessage(
    message: string,
    provider?: string,
    options?: { systemPrompt?: string; temperature?: number }
  ): Promise<string> {
    const service = ChatService.getInstance();
    const conversationId = `quick_${Date.now()}`;
    
    const result = await service.sendMessage(conversationId, message, {
      provider,
      ...options
    });
    
    return result.aiMessage.content;
  }
};