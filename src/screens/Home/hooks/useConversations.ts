import { useState, useCallback, useEffect } from 'react';
import { logger } from '../../../core/logging/logger';
import { Message, Conversation } from '../components';
import { databaseAPI, type ConversationStats, type ConversationWithMessages } from '../../../services/database-api';

export const useConversations = () => {
    const loggerInstance = logger.component('useConversations');
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
    const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isInitialized, setIsInitialized] = useState(false);

    // Convert database conversation stats to frontend format
    const convertStatsToConversation = (stats: ConversationStats): Conversation => ({
        id: stats.id,
        title: stats.title || `Chat ${new Date(stats.created_at).toLocaleDateString()}`,
        messages: [], // Messages loaded separately when needed
        createdAt: new Date(stats.created_at),
        updatedAt: new Date(stats.updated_at),
        isFavorited: stats.is_favorited
    });

    // Convert database conversation with messages to frontend format
    const convertFullConversation = (conv: ConversationWithMessages): Conversation => ({
        id: conv.id,
        title: conv.title || `Chat ${new Date(conv.created_at).toLocaleDateString()}`,
        messages: conv.messages.map(msg => ({
            id: msg.id,
            text: msg.content,
            sender: msg.sender as 'user' | 'ai',
            timestamp: new Date(msg.timestamp)
        })),
        createdAt: new Date(conv.created_at),
        updatedAt: new Date(conv.updated_at),
        isFavorited: conv.is_favorited
    });

    // Load all conversations on mount - ONLY ONCE
    useEffect(() => {
        if (isInitialized) return; // Prevent multiple loads

        const loadConversations = async () => {
            try {
                setIsLoading(true);
                loggerInstance.info('Loading conversations from database');

                const stats = await databaseAPI.getConversations();
                const conversations = stats.map(convertStatsToConversation);

                setConversations(conversations);
                setIsInitialized(true);

                loggerInstance.info('Conversations loaded', { count: conversations.length });
            } catch (error) {
                loggerInstance.error('Failed to load conversations', { error: String(error) });
                // Fall back to empty state
                setConversations([]);
                setIsInitialized(true);
            } finally {
                setIsLoading(false);
            }
        };

        loadConversations();
    }, []); // Empty dependency array - load only once on mount

    // Load messages for a specific conversation
    const loadConversationMessages = useCallback(async (conversationId: string) => {
        try {
            loggerInstance.info('Loading conversation messages', { conversationId });

            const fullConversation = await databaseAPI.getConversation(conversationId);
            if (!fullConversation) {
                loggerInstance.warn('Conversation not found', { conversationId });
                return;
            }

            const conversation = convertFullConversation(fullConversation);

            // Update the conversation in state with messages
            setConversations(prev => prev.map(conv =>
                conv.id === conversationId ? conversation : conv
            ));

            loggerInstance.info('Conversation messages loaded', {
                conversationId,
                messageCount: conversation.messages.length
            });
        } catch (error) {
            loggerInstance.error('Failed to load conversation messages', {
                conversationId,
                error: String(error)
            });
        }
    }, [loggerInstance]);

    // Create a new conversation
    const createConversation = useCallback(async () => {
        try {
            setIsLoading(true);
            loggerInstance.info('Creating new conversation');

            const newConversation = await databaseAPI.createConversation();
            const conversation = convertFullConversation(newConversation);

            setConversations(prev => [conversation, ...prev]);
            setCurrentConversationId(conversation.id);

            loggerInstance.info('New conversation created', { conversationId: conversation.id });
            return conversation;
        } catch (error) {
            loggerInstance.error('Failed to create conversation', { error: String(error) });
            throw error;
        } finally {
            setIsLoading(false);
        }
    }, [loggerInstance]);

    // Delete a conversation
    const deleteConversation = useCallback(async (conversationId: string) => {
        try {
            await databaseAPI.deleteConversation(conversationId);

            setConversations(prev => prev.filter(conv => conv.id !== conversationId));

            // If we're deleting the current conversation, clear it
            if (currentConversationId === conversationId) {
                setCurrentConversationId(null);
            }

            loggerInstance.info('Conversation deleted', { conversationId });
        } catch (error) {
            loggerInstance.error('Failed to delete conversation', {
                conversationId,
                error: String(error)
            });
            throw error;
        }
    }, [currentConversationId, loggerInstance]);

    // Toggle favorite status
    const toggleFavorite = useCallback(async (conversationId: string) => {
        try {
            await databaseAPI.toggleFavorite(conversationId);

            setConversations(prev => prev.map(conv =>
                conv.id === conversationId
                    ? { ...conv, isFavorited: !conv.isFavorited, updatedAt: new Date() }
                    : conv
            ));

            loggerInstance.info('Conversation favorite toggled', { conversationId });
        } catch (error) {
            loggerInstance.error('Failed to toggle favorite', {
                conversationId,
                error: String(error)
            });
            throw error;
        }
    }, [loggerInstance]);

    // Add a message to a conversation
    const addMessage = useCallback(async (
        message: Omit<Message, 'id' | 'timestamp'>,
        conversationId?: string,
        options?: {
            tokensUsed?: number;
            modelUsed?: string;
            processingTimeMs?: number;
        }
    ): Promise<string | undefined> => {
        try {
            const targetConversationId = conversationId || currentConversationId;

            if (!targetConversationId) {
                loggerInstance.warn('No conversation ID provided for message');
                return;
            }

            // Create message in database
            const messageId = await databaseAPI.createMessage(
                targetConversationId,
                message.text,
                message.sender,
                options
            );

            // Create the message object for state
            const newMessage: Message = {
                id: messageId,
                text: message.text,
                sender: message.sender,
                timestamp: new Date()
            };

            // Update conversation in state
            setConversations(prev => prev.map(conv => {
                if (conv.id === targetConversationId) {
                    const updatedConv = {
                        ...conv,
                        messages: [...conv.messages, newMessage],
                        updatedAt: new Date()
                    };

                    // Auto-generate title from first user message if no title exists
                    if (!conv.title || conv.title.startsWith('Chat ')) {
                        if (message.sender === 'user' && conv.messages.length === 0) {
                            const title = message.text.substring(0, 50) + (message.text.length > 50 ? '...' : '');
                            // Update title in database async
                            databaseAPI.updateConversation(targetConversationId, { title }).catch(error => {
                                loggerInstance.error('Failed to update conversation title', { error: String(error) });
                            });
                            updatedConv.title = title;
                        }
                    }

                    return updatedConv;
                }
                return conv;
            }));

            loggerInstance.info('Message added', {
                messageId: messageId ? messageId.substring(0, 8) + '...' : 'unknown',
                conversationId: targetConversationId,
                sender: message.sender
            });

            return messageId;
        } catch (error) {
            loggerInstance.error('Failed to add message', { error: String(error) });
            throw error;
        }
    }, [currentConversationId, loggerInstance]);

    // Update a message
    const updateMessage = useCallback(async (messageId: string, updates: Partial<Message>) => {
        try {
            // Update in database
            await databaseAPI.updateMessage(messageId, {
                content: updates.text,
                metadata: updates
            });

            // Update in state
            setConversations(prev => prev.map(conv => ({
                ...conv,
                messages: conv.messages.map(msg =>
                    msg.id === messageId ? { ...msg, ...updates } : msg
                ),
                updatedAt: new Date()
            })));

            loggerInstance.info('Message updated', {
                messageId: messageId.substring(0, 8) + '...',
                updates
            });
        } catch (error) {
            loggerInstance.error('Failed to update message', {
                messageId: messageId.substring(0, 8) + '...',
                error: String(error)
            });
            throw error;
        }
    }, [loggerInstance]);

    // Delete a message
    const deleteMessage = useCallback(async (messageId: string) => {
        try {
            await databaseAPI.deleteMessage(messageId);

            setConversations(prev => prev.map(conv => ({
                ...conv,
                messages: conv.messages.filter(msg => msg.id !== messageId),
                updatedAt: new Date()
            })));

            loggerInstance.info('Message deleted', {
                messageId: messageId.substring(0, 8) + '...'
            });
        } catch (error) {
            loggerInstance.error('Failed to delete message', {
                messageId: messageId.substring(0, 8) + '...',
                error: String(error)
            });
            throw error;
        }
    }, [loggerInstance]);

    // Submit feedback for a message
    const submitFeedback = useCallback(async (
        messageId: string,
        type: 'positive' | 'negative',
        details?: string
    ) => {
        try {
            await databaseAPI.submitFeedback(messageId, { type, details });

            loggerInstance.info('Feedback submitted', {
                messageId: messageId.substring(0, 8) + '...',
                type
            });
        } catch (error) {
            loggerInstance.error('Failed to submit feedback', {
                messageId: messageId.substring(0, 8) + '...',
                type,
                error: String(error)
            });
            throw error;
        }
    }, [loggerInstance]);

    // Set current conversation and load messages if needed
    const setCurrentConversationIdWithLoad = useCallback(async (conversationId: string | null) => {
        setCurrentConversationId(conversationId);

        if (conversationId) {
            const conversation = conversations.find(c => c.id === conversationId);
            // Only load messages if they haven't been loaded yet
            if (conversation && conversation.messages.length === 0) {
                await loadConversationMessages(conversationId);
            }
        }
    }, [conversations, loadConversationMessages]);

    // Get current conversation
    const currentConversation = conversations.find(c => c.id === currentConversationId);
    const messages = currentConversation?.messages || [];

    return {
        conversations,
        currentConversationId,
        currentConversation,
        messages,
        editingMessageId,
        isLoading,
        isInitialized,
        setEditingMessageId,
        setCurrentConversationId: setCurrentConversationIdWithLoad,
        createConversation,
        deleteConversation,
        toggleFavorite,
        addMessage,
        updateMessage,
        deleteMessage,
        submitFeedback,
        loadConversationMessages
    };
};