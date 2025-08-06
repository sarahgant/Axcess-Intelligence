import { RetryWithBackoff, CircuitBreaker } from '../core/utils';
import { logger } from '../core/logging/logger';
import { env } from '../config/environment';

/**
 * Usage statistics interface for API responses
 */
interface UsageStats {
  prompt_tokens: number;
  completion_tokens: number;
  total_tokens: number;
  [key: string]: number; // Allow for additional usage metrics
}

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
        usage?: UsageStats
    }) => void;
    onError: (error: Error) => void;
}

/**
 * API client with retry logic and circuit breaker
 */
class APIClient {
    private baseURL: string;
    private retry: RetryWithBackoff;
    private circuitBreaker: CircuitBreaker;
    private cache: Map<string, { data: unknown; timestamp: number; ttl: number }> = new Map();

    constructor() {
        // Use environment configuration
        this.baseURL = env.api.baseUrl();
        
        // Initialize retry and circuit breaker with environment configuration
        this.retry = new RetryWithBackoff({
            maxAttempts: env.retry.maxAttempts(),
            initialDelay: env.retry.initialDelay(),
            maxDelay: env.retry.maxDelay(),
            retryableErrors: ['NETWORK_ERROR', 'TIMEOUT', '503', '429', '502', '504']
        });
        
        this.circuitBreaker = new CircuitBreaker({
            failureThreshold: env.circuitBreaker.failureThreshold(),
            resetTimeout: env.circuitBreaker.resetTimeout(),
            successThreshold: env.circuitBreaker.successThreshold()
        });
    }

    /**
     * Generic request method with retry and circuit breaker
     */
    async request<T>(url: string, options: RequestInit, context?: string): Promise<T> {
        const fullUrl = url.startsWith('http') ? url : `${this.baseURL}${url}`;
        
        return this.circuitBreaker.execute(
            () => this.retry.execute(
                () => this.performRequest<T>(fullUrl, options),
                context || `API Request: ${fullUrl}`
            ),
            () => this.getCachedResponse<T>(fullUrl) as T // Fallback to cache
        );
    }

    /**
     * Perform the actual HTTP request
     */
    private async performRequest<T>(url: string, options: RequestInit): Promise<T> {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), env.api.timeout());

        try {
            const response = await fetch(url, {
                ...options,
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(`HTTP ${response.status}: ${response.statusText} - ${errorData.error || ''}`);
            }

            return await response.json();
        } catch (error) {
            clearTimeout(timeoutId);
            
            if (error instanceof Error) {
                if (error.name === 'AbortError') {
                    throw new Error('Request timeout');
                }
                throw error;
            }
            
            throw new Error('Unknown request error');
        }
    }

    /**
     * Get cached response if available
     */
    private getCachedResponse<T>(url: string): T | null {
        const cached = this.cache.get(url);
        if (cached && Date.now() - cached.timestamp < cached.ttl) {
            logger.info('Using cached response', { url });
            return cached.data as T;
        }
        
        if (cached) {
            this.cache.delete(url); // Remove expired cache
        }
        
        return null;
    }

    /**
     * Cache a response
     */
    private cacheResponse<T>(url: string, data: T, ttl: number = env.performance.cacheTTL() * 1000): void { // Use environment TTL
        this.cache.set(url, {
            data,
            timestamp: Date.now(),
            ttl
        });
    }

    /**
     * Send a chat message with retry and circuit breaker
     */
    async sendMessage(data: ChatMessage): Promise<ChatResponse> {
        const context = `Chat Message: ${data.provider || 'default'}`;
        
        try {
            const response = await this.request<ChatResponse>('/api/chat/message', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            }, context);

            // Cache successful responses using environment TTL
            this.cacheResponse(`/api/chat/message:${JSON.stringify(data)}`, response, env.performance.cacheTTL() * 1000);

            return response;
        } catch (error) {
            logger.error('Failed to send chat message', {
                error: error instanceof Error ? error.message : String(error),
                provider: data.provider,
                conversationId: data.conversationId
            });
            throw error;
        }
    }

    /**
     * Send a streaming message with retry and circuit breaker
     */
    async sendStreamingMessage(data: ChatMessage, callbacks: StreamingCallbacks): Promise<void> {
        const context = `Streaming Chat: ${data.provider || 'default'}`;
        
        return this.circuitBreaker.execute(
            () => this.retry.execute(
                async () => {
                    const response = await fetch(`${this.baseURL}/api/chat/stream`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(data),
                        signal: AbortSignal.timeout(env.api.timeout()) // Use environment timeout for streaming
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
                                    logger.warn('Failed to parse SSE data', { 
                                        data,
                                        error: parseError instanceof Error ? parseError.message : String(parseError)
                                    });
                                }
                            }
                        }
                    }
                },
                context
            ),
            () => {
                // Fallback: return a simple error response
                callbacks.onError(new Error('Streaming service unavailable'));
            },
            context
        );
    }

    /**
     * Get available providers with retry and circuit breaker
     */
    async getAvailableProviders() {
        return this.request<{ providers: string[] }>('/api/health/providers', {
            method: 'GET',
        }, 'Get Available Providers');
    }

    /**
     * Get conversation with retry and circuit breaker
     */
    async getConversation(conversationId: string) {
        return this.request<{ messages: unknown[] }>(`/api/conversations/${conversationId}`, {
            method: 'GET',
        }, `Get Conversation: ${conversationId}`);
    }

    /**
     * Check health with retry and circuit breaker
     */
    async checkHealth() {
        return this.request<{ status: string }>('/api/health', {
            method: 'GET',
        }, 'Health Check');
    }

    /**
     * Check detailed health with retry and circuit breaker
     */
    async checkDetailedHealth() {
        return this.request<{ status: string; details: unknown }>('/api/health/detailed', {
            method: 'GET',
        }, 'Detailed Health Check');
    }

    /**
     * Get circuit breaker metrics
     */
    getCircuitBreakerMetrics() {
        return this.circuitBreaker.getMetrics();
    }

    /**
     * Get retry configuration
     */
    getRetryConfig() {
        return this.retry.getConfig();
    }

    /**
     * Reset circuit breaker
     */
    resetCircuitBreaker() {
        this.circuitBreaker.reset();
    }

    /**
     * Clear cache
     */
    clearCache() {
        this.cache.clear();
        logger.info('API client cache cleared');
    }
}

export default APIClient;
export type { StreamingCallbacks };