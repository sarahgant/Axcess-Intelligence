/**
 * AI Providers module - Main exports
 * Centralized access to all AI provider functionality
 */

import { logger } from '../logging/logger';

// Base provider interface and types
export {
  BaseAIProvider,
  type AIMessage,
  type AIResponse,
  type StreamingHandler,
  type AIRequestOptions,
  type ProviderCapabilities,
  type ProviderHealth,
  type ProviderRegistry,
  ProviderUtils as BaseProviderUtils
} from './base-provider';

// Provider implementations
export { AnthropicProvider } from './anthropic-provider';
export { OpenAIProvider } from './openai-provider';

// Provider factory and management
export {
  ProviderFactory,
  ProviderUtils,
  type ProviderFactoryConfig,
  type ProviderInitResult
} from './provider-factory';

// Chat service
export {
  ChatService,
  ChatUtils,
  type ChatMessage,
  type ChatConversation,
  type ChatStreamingCallbacks,
  type ChatServiceConfig
} from './chat-service';

/**
 * Quick initialization function for the entire provider system
 */
export async function initializeAIProviders() {
  try {
    logger.info('Initializing AI provider system', { component: 'AIProviders' });

    // Initialize providers
    const factory = await ProviderUtils.initializeProviders();

    // Initialize chat service
    const chatService = await ChatUtils.initializeChatService();

    logger.info('AI provider system ready', { 
      component: 'AIProviders',
      providers: factory.getAvailableProviders().length,
      capabilities: Object.keys(factory.getProviderCapabilities())
    });

    return {
      factory,
      chatService,
      providers: factory.getAvailableProviders(),
      capabilities: factory.getProviderCapabilities()
    };
  } catch (error) {
    logger.error('Failed to initialize AI provider system', { 
      component: 'AIProviders',
      error: error instanceof Error ? error.message : String(error)
    });
    throw error;
  }
}

/**
 * Get the current status of the AI provider system
 */
export function getProviderSystemStatus() {
  try {
    const factory = ProviderFactory.getInstance();
    const chatService = ChatService.getInstance();

    return {
      isInitialized: true,
      availableProviders: factory.getAvailableProviders(),
      defaultProvider: factory.getDefaultProvider()?.getCapabilities().name,
      capabilities: factory.getProviderCapabilities(),
      hasActiveStreams: false // TODO: Implement active stream tracking
    };
  } catch (error) {
    return {
      isInitialized: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}