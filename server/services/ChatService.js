/**
 * Backend Chat Service - Secure AI provider management
 */

const AnthropicProvider = require('./providers/AnthropicProvider');
const OpenAIProvider = require('./providers/OpenAIProvider');
const logger = require('../utils/logger');
const { randomUUID } = require('crypto');
const uuidv4 = randomUUID;

class ChatService {
    constructor() {
        this.providers = new Map();
        this.conversations = new Map(); // In production, use a database
        this.initializeProviders();
    }

    initializeProviders() {
        try {
            // Initialize Anthropic provider
            if (process.env.ANTHROPIC_API_KEY) {
                this.providers.set('anthropic', new AnthropicProvider({
                    apiKey: process.env.ANTHROPIC_API_KEY,
                    defaultModel: process.env.ANTHROPIC_DEFAULT_MODEL || 'claude-3-5-sonnet-20241022'
                }));
                logger.info('✅ Anthropic provider initialized');
            } else {
                logger.warn('⚠️ Anthropic API key not found');
            }

            // Initialize OpenAI provider
            if (process.env.OPENAI_API_KEY) {
                this.providers.set('openai', new OpenAIProvider({
                    apiKey: process.env.OPENAI_API_KEY,
                    defaultModel: process.env.OPENAI_DEFAULT_MODEL || 'gpt-4.1'
                }));
                logger.info('✅ OpenAI provider initialized');
            } else {
                logger.warn('⚠️ OpenAI API key not found');
            }

            if (this.providers.size === 0) {
                throw new Error('No AI providers available - check API key configuration');
            }

        } catch (error) {
            logger.error('Failed to initialize providers:', error);
            throw error;
        }
    }

    async sendMessage({ message, conversationId, provider, systemPrompt, documents, options = {} }) {
        try {
            // Get or create conversation
            const convId = conversationId || uuidv4();
            let conversation = this.conversations.get(convId);

            if (!conversation) {
                conversation = {
                    id: convId,
                    messages: [],
                    createdAt: new Date(),
                    updatedAt: new Date()
                };
                this.conversations.set(convId, conversation);
            }

            // Add user message to conversation
            const userMessage = {
                id: uuidv4(),
                role: 'user',
                content: message,
                timestamp: new Date(),
                documents: documents || []
            };
            conversation.messages.push(userMessage);

            // Select provider
            const selectedProvider = this.selectProvider(provider);

            // Prepare messages for AI
            const messages = this.prepareMessages(conversation.messages, systemPrompt, documents);

            // Send to AI provider
            const response = await selectedProvider.sendMessage(messages, {
                temperature: options.temperature || 0.7,
                maxTokens: options.maxTokens || 4000,
                ...options
            });

            // Add AI response to conversation
            const aiMessage = {
                id: response.id,
                role: 'assistant',
                content: response.content,
                timestamp: new Date(),
                provider: selectedProvider.id,
                model: response.model,
                usage: response.usage
            };
            conversation.messages.push(aiMessage);
            conversation.updatedAt = new Date();

            return {
                id: response.id,
                content: response.content,
                conversationId: convId,
                provider: selectedProvider.id,
                model: response.model,
                usage: response.usage,
                timestamp: new Date()
            };

        } catch (error) {
            logger.error('Error in sendMessage:', error);
            throw error;
        }
    }

    async sendStreamingMessage({ message, conversationId, provider, systemPrompt, documents, options = {} }, callbacks) {
        try {
            // Get or create conversation
            const convId = conversationId || uuidv4();
            let conversation = this.conversations.get(convId);

            if (!conversation) {
                conversation = {
                    id: convId,
                    messages: [],
                    createdAt: new Date(),
                    updatedAt: new Date()
                };
                this.conversations.set(convId, conversation);
            }

            // Add user message to conversation
            const userMessage = {
                id: uuidv4(),
                role: 'user',
                content: message,
                timestamp: new Date(),
                documents: documents || []
            };
            conversation.messages.push(userMessage);

            // Select provider
            const selectedProvider = this.selectProvider(provider);

            // Prepare messages for AI
            const messages = this.prepareMessages(conversation.messages, systemPrompt, documents);

            const responseId = uuidv4();
            let fullContent = '';

            // Enhanced callbacks for backend
            const enhancedCallbacks = {
                onStart: () => {
                    callbacks.onStart?.({
                        id: responseId,
                        conversationId: convId
                    });
                },
                onToken: (token) => {
                    fullContent += token;
                    callbacks.onToken?.(token);
                },
                onComplete: (finalResponse) => {
                    // Add AI response to conversation
                    const aiMessage = {
                        id: responseId,
                        role: 'assistant',
                        content: fullContent,
                        timestamp: new Date(),
                        provider: selectedProvider.id,
                        model: finalResponse.model,
                        usage: finalResponse.usage
                    };
                    conversation.messages.push(aiMessage);
                    conversation.updatedAt = new Date();

                    callbacks.onComplete?.({
                        id: responseId,
                        conversationId: convId,
                        provider: selectedProvider.id,
                        model: finalResponse.model,
                        usage: finalResponse.usage
                    });
                },
                onError: (error) => {
                    callbacks.onError?.(error);
                }
            };

            // Send streaming request to provider
            await selectedProvider.sendStreamingMessage(messages, enhancedCallbacks, {
                temperature: options.temperature || 0.7,
                maxTokens: options.maxTokens || 4000,
                ...options
            });

        } catch (error) {
            logger.error('Error in sendStreamingMessage:', error);
            callbacks.onError?.(error);
        }
    }

    selectProvider(requestedProvider) {
        if (requestedProvider && this.providers.has(requestedProvider)) {
            return this.providers.get(requestedProvider);
        }

        // Default to first available provider
        const availableProviders = Array.from(this.providers.values());
        if (availableProviders.length === 0) {
            throw new Error('No AI providers available');
        }

        return availableProviders[0];
    }

    prepareMessages(conversationMessages, systemPrompt, documents) {
        const messages = [];

        // Add system prompt if provided
        if (systemPrompt) {
            messages.push({
                role: 'system',
                content: systemPrompt
            });
        }

        // Add document context if provided
        if (documents && documents.length > 0) {
            const documentContext = documents.map(doc =>
                `Document: ${doc.name} (${doc.type})\n${doc.content}`
            ).join('\n\n');

            messages.push({
                role: 'system',
                content: `The following documents have been provided for context:\n\n${documentContext}`
            });
        }

        // Add conversation messages (excluding document metadata)
        for (const msg of conversationMessages) {
            messages.push({
                role: msg.role,
                content: msg.content
            });
        }

        return messages;
    }

    async getAvailableProviders() {
        const providers = [];

        for (const [id, provider] of this.providers) {
            try {
                const isHealthy = await provider.checkHealth();
                providers.push({
                    id,
                    displayName: provider.displayName,
                    isAvailable: isHealthy,
                    capabilities: provider.capabilities
                });
            } catch (error) {
                providers.push({
                    id,
                    displayName: provider.displayName,
                    isAvailable: false,
                    error: error.message
                });
            }
        }

        return providers;
    }

    async getConversation(conversationId) {
        return this.conversations.get(conversationId) || null;
    }

    // Cleanup old conversations (in production, implement proper database cleanup)
    cleanupOldConversations() {
        const maxAge = 24 * 60 * 60 * 1000; // 24 hours
        const now = Date.now();

        for (const [id, conversation] of this.conversations) {
            if (now - conversation.updatedAt.getTime() > maxAge) {
                this.conversations.delete(id);
                logger.info(`Cleaned up old conversation: ${id}`);
            }
        }
    }
}

module.exports = ChatService;