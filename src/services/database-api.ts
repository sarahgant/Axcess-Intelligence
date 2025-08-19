/**
 * Database API Service - Frontend client for database operations
 * Handles all CRUD operations with proper error handling and session management
 */

import { logger } from '../core/logging/logger';
import { config } from '../config/environment';
import type { Conversation, Message } from '../screens/Home/components';

const loggerInstance = logger.component('DatabaseAPI');

// Types for API responses
interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    message?: string;
    errors?: any[];
    sessionId?: string;
}

interface FeedbackData {
    type: 'positive' | 'negative';
    details?: string;
}

interface ConversationStats {
    id: string;
    title: string;
    created_at: string;
    updated_at: string;
    is_favorited: boolean;
    message_count: number;
    positive_feedback: number;
    negative_feedback: number;
    total_tokens: number;
    avg_response_time: number;
}

interface ConversationWithMessages extends Conversation {
    messages: Message[];
}

class DatabaseAPIService {
    private baseUrl: string;
    private sessionId: string | null = null;

    constructor() {
        // Use environment config which properly handles /api suffix
        this.baseUrl = config.API_BASE_URL;

        // Try to restore session from localStorage
        this.sessionId = localStorage.getItem('session-id');

        loggerInstance.info('Database API initialized', { baseUrl: this.baseUrl });
    }

    /**
     * Make authenticated API request with session management
     */
    private async makeRequest<T>(
        endpoint: string,
        options: RequestInit = {}
    ): Promise<ApiResponse<T>> {
        try {
            const url = `${this.baseUrl}${endpoint}`;

            // Set up headers
            const headers: HeadersInit = {
                'Content-Type': 'application/json',
                ...options.headers,
            };

            // Add session ID if available
            if (this.sessionId) {
                headers['X-Session-ID'] = this.sessionId;
            }

            loggerInstance.debug('Making API request', {
                method: options.method || 'GET',
                url,
                hasSessionId: !!this.sessionId
            });

            const response = await fetch(url, {
                ...options,
                headers,
            });

            // Handle session ID from response
            const newSessionId = response.headers.get('X-Session-ID');
            if (newSessionId && newSessionId !== this.sessionId) {
                this.sessionId = newSessionId;
                localStorage.setItem('session-id', newSessionId);
                loggerInstance.info('Session ID updated', { sessionId: newSessionId });
            }

            const data: ApiResponse<T> = await response.json();

            if (!response.ok) {
                loggerInstance.error('API request failed', {
                    status: response.status,
                    statusText: response.statusText,
                    data
                });
                throw new Error(data.message || `API request failed: ${response.status}`);
            }

            loggerInstance.debug('API request successful', {
                endpoint,
                dataSize: JSON.stringify(data).length
            });

            return data;
        } catch (error) {
            loggerInstance.error('API request error', {
                endpoint,
                error: error instanceof Error ? error.message : String(error)
            });
            throw error;
        }
    }

    // ================================
    // CONVERSATION METHODS
    // ================================

    /**
     * Get all conversations for the current user
     */
    async getConversations(): Promise<ConversationStats[]> {
        const response = await this.makeRequest<ConversationStats[]>('/conversations');
        return response.data || [];
    }

    /**
     * Create a new conversation
     */
    async createConversation(title: string = '', metadata: any = {}): Promise<ConversationWithMessages> {
        const response = await this.makeRequest<ConversationWithMessages>('/conversations', {
            method: 'POST',
            body: JSON.stringify({ title, metadata }),
        });

        if (!response.data) {
            throw new Error('Failed to create conversation');
        }

        return response.data;
    }

    /**
     * Get a specific conversation with all messages
     */
    async getConversation(conversationId: string): Promise<ConversationWithMessages | null> {
        try {
            const response = await this.makeRequest<ConversationWithMessages>(`/conversations/${conversationId}`);
            return response.data || null;
        } catch (error) {
            if (error instanceof Error && error.message.includes('404')) {
                return null;
            }
            throw error;
        }
    }

    /**
     * Update conversation details
     */
    async updateConversation(conversationId: string, updates: { title?: string; isFavorited?: boolean }): Promise<void> {
        await this.makeRequest(`/conversations/${conversationId}`, {
            method: 'PUT',
            body: JSON.stringify(updates),
        });
    }

    /**
     * Toggle favorite status of a conversation
     */
    async toggleFavorite(conversationId: string): Promise<void> {
        await this.makeRequest(`/conversations/${conversationId}/favorite`, {
            method: 'POST',
        });
    }

    /**
     * Delete a conversation and all its messages
     */
    async deleteConversation(conversationId: string): Promise<void> {
        await this.makeRequest(`/conversations/${conversationId}`, {
            method: 'DELETE',
        });
    }

    // ================================
    // MESSAGE METHODS
    // ================================

    /**
     * Add a message to a conversation
     */
    async createMessage(
        conversationId: string,
        content: string,
        sender: 'user' | 'ai',
        options: {
            tokensUsed?: number;
            modelUsed?: string;
            processingTimeMs?: number;
            metadata?: any;
        } = {}
    ): Promise<string> {
        const response = await this.makeRequest<{ id: string }>(`/conversations/${conversationId}/messages`, {
            method: 'POST',
            body: JSON.stringify({
                content,
                sender,
                ...options,
            }),
        });

        if (!response.data?.id) {
            throw new Error('Failed to create message');
        }

        return response.data.id;
    }

    /**
     * Update a message
     */
    async updateMessage(messageId: string, updates: { content?: string; metadata?: any }): Promise<void> {
        await this.makeRequest(`/conversations/messages/${messageId}`, {
            method: 'PUT',
            body: JSON.stringify(updates),
        });
    }

    /**
     * Delete a message
     */
    async deleteMessage(messageId: string): Promise<void> {
        await this.makeRequest(`/conversations/messages/${messageId}`, {
            method: 'DELETE',
        });
    }

    // ================================
    // FEEDBACK METHODS
    // ================================

    /**
     * Submit feedback for a message
     */
    async submitFeedback(messageId: string, feedback: FeedbackData): Promise<void> {
        await this.makeRequest(`/conversations/messages/${messageId}/feedback`, {
            method: 'POST',
            body: JSON.stringify(feedback),
        });

        loggerInstance.info('Feedback submitted', {
            messageId: messageId.substring(0, 8) + '...',
            type: feedback.type,
            hasDetails: !!feedback.details
        });
    }

    /**
     * Get feedback for a message
     */
    async getFeedback(messageId: string): Promise<any[]> {
        const response = await this.makeRequest<any[]>(`/conversations/messages/${messageId}/feedback`);
        return response.data || [];
    }

    // ================================
    // UTILITY METHODS
    // ================================

    /**
     * Get current session ID
     */
    getSessionId(): string | null {
        return this.sessionId;
    }

    /**
     * Clear session (logout)
     */
    clearSession(): void {
        this.sessionId = null;
        localStorage.removeItem('session-id');
        loggerInstance.info('Session cleared');
    }

    /**
     * Health check for database connection
     */
    async healthCheck(): Promise<{ status: string; initialized: boolean }> {
        const response = await this.makeRequest<{ status: string; initialized: boolean }>('/conversations/health');
        return response.data || { status: 'unknown', initialized: false };
    }
}

// Singleton instance
export const databaseAPI = new DatabaseAPIService();
export type { ConversationStats, ConversationWithMessages, FeedbackData };
