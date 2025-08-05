/**
 * Production API Client - Connects frontend to secure backend
 */

interface ChatMessage {
    message: string;
    conversationId?: string;
    provider?: 'anthropic' | 'openai';
    systemPrompt?: string;
    documents?: Array<{
        id: string;
        name: string;
        type: string;
        content: string;
    }>;
    options?: {
        temperature?: number;
        maxTokens?: number;
    };
}

interface ChatResponse {
    id: string;
    content: string;
    conversationId: string;
    provider: string;
    model: string;
    usage?: {
        prompt_tokens: number;
        completion_tokens: number;
        total_tokens: number;
    };
    timestamp: string;
}

interface StreamingCallbacks {
    onStart?: (data: { id: string; conversationId: string }) => void;
    onToken: (token: string) => void;
    onComplete: (data: {
        id: string;
        conversationId: string;
        provider: string;
        model: string;
        usage?: any
    }) => void;
    onError: (error: Error) => void;
}

class APIClient {
    private baseURL: string;

    constructor() {
        // Use environment variable for API URL, fallback to localhost for development
        this.baseURL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
    }

    async sendMessage(data: ChatMessage): Promise<ChatResponse> {
        try {
            const response = await fetch(`${this.baseURL}/api/chat/message`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || `HTTP ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('API Client Error:', error);
            throw error;
        }
    }

    async sendStreamingMessage(data: ChatMessage, callbacks: StreamingCallbacks): Promise<void> {
        try {
            const response = await fetch(`${this.baseURL}/api/chat/stream`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || `HTTP ${response.status}`);
            }

            const reader = response.body?.getReader();
            if (!reader) {
                throw new Error('No response body reader available');
            }

            const decoder = new TextDecoder();
            let buffer = '';

            while (true) {
                const { done, value } = await reader.read();

                if (done) break;

                buffer += decoder.decode(value, { stream: true });
                const lines = buffer.split('\n');
                buffer = lines.pop() || ''; // Keep incomplete line in buffer

                for (const line of lines) {
                    if (line.startsWith('data: ')) {
                        const data = line.slice(6).trim();

                        if (data === '[DONE]') {
                            return;
                        }

                        try {
                            const parsed = JSON.parse(data);

                            switch (parsed.type) {
                                case 'start':
                                    callbacks.onStart?.(parsed);
                                    break;
                                case 'token':
                                    callbacks.onToken(parsed.token);
                                    break;
                                case 'complete':
                                    callbacks.onComplete(parsed);
                                    break;
                                case 'error':
                                    callbacks.onError(new Error(parsed.error));
                                    break;
                            }
                        } catch (parseError) {
                            console.warn('Failed to parse SSE data:', data);
                        }
                    }
                }
            }
        } catch (error) {
            console.error('Streaming API Error:', error);
            callbacks.onError(error instanceof Error ? error : new Error('Unknown streaming error'));
        }
    }

    async getAvailableProviders() {
        try {
            const response = await fetch(`${this.baseURL}/api/chat/providers`);

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error fetching providers:', error);
            throw error;
        }
    }

    async getConversation(conversationId: string) {
        try {
            const response = await fetch(`${this.baseURL}/api/chat/conversations/${conversationId}`);

            if (!response.ok) {
                if (response.status === 404) {
                    return null;
                }
                throw new Error(`HTTP ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error fetching conversation:', error);
            throw error;
        }
    }

    async checkHealth() {
        try {
            const response = await fetch(`${this.baseURL}/health`);
            return response.ok;
        } catch (error) {
            return false;
        }
    }

    async checkDetailedHealth() {
        try {
            const response = await fetch(`${this.baseURL}/health/detailed?checkServices=true`);

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error checking detailed health:', error);
            throw error;
        }
    }
}

// Export singleton instance
export const apiClient = new APIClient();
export type { ChatMessage, ChatResponse, StreamingCallbacks };