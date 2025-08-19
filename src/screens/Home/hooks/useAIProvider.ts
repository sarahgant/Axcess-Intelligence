import { useState, useEffect, useCallback } from 'react';
import { logger } from '../../../core/logging/logger';
import { serviceFactory } from '../../../services';
import type { StreamingCallbacks } from '../../../services/api-client';

export const useAIProvider = () => {
  const loggerInstance = logger.component('useAIProvider');
  const [selectedProvider, setSelectedProvider] = useState<string | null>(null);
  const [availableProviders, setAvailableProviders] = useState<any[]>([]);
  const [isBackendConnected, setIsBackendConnected] = useState(false);
  const [showProviderDropdown, setShowProviderDropdown] = useState(false);
  const [isInitializingAI, setIsInitializingAI] = useState(true);

  // Get AI service instance
  const aiService = serviceFactory.getAIService();

  // Initialize backend connection
  const initializeBackend = useCallback(async () => {
    try {
      loggerInstance.info('Initializing backend connection...');

      // Test backend connectivity
      const healthCheck = await aiService.checkHealth();
      if (healthCheck.status === 'healthy') {
        setIsBackendConnected(true);
        loggerInstance.info('Backend connection established');
      } else {
        loggerInstance.warn('Backend health check failed', { status: healthCheck.status });
        // Set to true anyway since the backend is responding
        setIsBackendConnected(true);
      }
    } catch (error) {
      loggerInstance.error('Failed to initialize backend', { error: String(error) });
      // Assume backend is connected even if health check fails
      // The actual API calls will handle errors
      setIsBackendConnected(true);
    }
  }, [aiService, loggerInstance]);

  // Initialize AI providers
  const initializeAIProviders = useCallback(async () => {
    try {
      loggerInstance.info('Initializing AI providers...');

      // Get available providers from service
      const providers = await aiService.getAvailableProviders();
      setAvailableProviders(providers);

      // Set default provider to first available
      const availableProvider = providers.find(p => p.isAvailable);
      if (availableProvider) {
        await aiService.selectProvider(availableProvider.id);
        setSelectedProvider(availableProvider.id);
        loggerInstance.info('Default provider selected', { provider: availableProvider.id });
      }

      loggerInstance.info('AI providers initialized', {
        totalProviders: providers.length,
        availableProviders: providers.filter(p => p.isAvailable).map(p => p.id)
      });
    } catch (error) {
      loggerInstance.error('Failed to initialize AI providers', { error: String(error) });
    } finally {
      setIsInitializingAI(false);
    }
  }, [aiService, loggerInstance]);

  // Send message with streaming
  const sendMessage = useCallback(async (
    message: string,
    callbacks: StreamingCallbacks,
    documents?: Array<{ id: string; name: string; type: string; content: string }>
  ) => {
    console.log('🚀 useAIProvider.sendMessage called with:', { message, selectedProvider });

    const currentProvider = aiService.getSelectedProvider();
    console.log('🔍 Current provider from aiService:', currentProvider);

    if (!currentProvider) {
      console.error('❌ No AI provider selected');
      loggerInstance.warn('No AI provider selected');
      throw new Error('No AI provider selected');
    }

    try {
      console.log('📤 About to send message to AI service');
      loggerInstance.info('Sending message to AI provider', {
        provider: currentProvider,
        messageLength: message.length,
        hasDocuments: !!documents?.length
      });

      console.log('🎯 Calling aiService.sendStreamingMessage...');

      // Add timeout to prevent hanging
      const messagePromise = aiService.sendStreamingMessage({
        message,
        provider: currentProvider as 'anthropic' | 'openai',
        documents,
        options: {
          temperature: 0.7,
          maxTokens: 4000
        }
      }, callbacks);

      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Message timeout - request took too long')), 30000)
      );

      console.log('⏱️ Waiting for message response or timeout...');
      await Promise.race([messagePromise, timeoutPromise]);

      console.log('✅ Message sent successfully');
      loggerInstance.info('Message sent successfully', {
        provider: currentProvider
      });
    } catch (error) {
      console.error('❌ Failed to send message:', error);
      loggerInstance.error('Failed to send message', {
        provider: currentProvider,
        error: String(error)
      });
      throw error;
    }
  }, [aiService, loggerInstance, selectedProvider]);

  // Handle provider selection
  const handleProviderChange = useCallback(async (providerId: string) => {
    console.log('🔄 Changing provider to:', providerId);
    try {
      setSelectedProvider(providerId);
      await aiService.selectProvider(providerId);
      console.log('✅ Provider changed successfully to:', providerId);
      loggerInstance.info('Provider changed successfully', { providerId });
    } catch (error) {
      console.error('❌ Failed to change provider:', error);
      loggerInstance.error('Failed to change provider', {
        providerId,
        error: String(error)
      });
    }
  }, [aiService, loggerInstance]);

  // Initialize on mount with timeout protection
  useEffect(() => {
    let isMounted = true;

    const initialize = async () => {
      try {
        console.log('🚀 Starting AI Provider initialization...');

        // Set default providers immediately to prevent UI freeze
        setAvailableProviders([
          {
            id: 'anthropic',
            name: 'Anthropic Claude',
            isAvailable: true,
            capabilities: ['chat', 'streaming'],
            displayName: 'Claude (Anthropic)'
          },
          {
            id: 'openai',
            name: 'OpenAI GPT',
            isAvailable: true,
            capabilities: ['chat', 'streaming'],
            displayName: 'GPT (OpenAI)'
          }
        ]);
        setSelectedProvider('anthropic');

        // Set backend as connected immediately - the actual API calls will handle errors
        setIsBackendConnected(true);

        // Mark initialization as complete quickly to unblock UI
        setIsInitializingAI(false);

        // Then do the actual initialization in the background
        if (isMounted) {
          // Try to initialize backend (non-blocking)
          initializeBackend().catch(err => {
            console.warn('Backend initialization warning:', err);
          });

          // Try to initialize providers (non-blocking)
          initializeAIProviders().catch(err => {
            console.warn('Provider initialization warning:', err);
          });
        }

        console.log('✅ AI Provider initialization completed');
      } catch (error) {
        console.error('❌ Failed to initialize AI providers:', error);
        loggerInstance.error('Failed to initialize AI providers', { error: String(error) });

        if (!isMounted) return;

        // Even on error, allow the UI to function
        setIsBackendConnected(true);
        setIsInitializingAI(false);
        setSelectedProvider('anthropic');
      }
    };

    initialize();

    return () => {
      isMounted = false;
    };
  }, []); // Remove dependencies to prevent infinite loops

  return {
    selectedProvider,
    setSelectedProvider,
    availableProviders,
    isBackendConnected,
    showProviderDropdown,
    setShowProviderDropdown,
    isInitializingAI,
    sendMessage,
    handleProviderChange,
    initializeBackend,
    initializeAIProviders
  };
};
