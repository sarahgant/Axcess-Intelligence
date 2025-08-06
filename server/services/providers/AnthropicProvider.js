/**
 * Backend Anthropic Provider - Secure server-side implementation
 */

const Anthropic = require('@anthropic-ai/sdk');
const logger = require('../../utils/logger');
const { randomUUID } = require('crypto');

class AnthropicProvider {
    constructor(config) {
        this.id = 'anthropic';
        this.displayName = 'Claude (Anthropic)';
        this.client = new Anthropic({
            apiKey: config.apiKey
        });
        // Map custom model names to actual API model IDs
        const modelMapping = {
            'claude-sonnet-4-20250514': 'claude-3-5-sonnet-20241022',
            'claude-3.5-sonnet': 'claude-3-5-sonnet-20241022',
            'claude-3-5-sonnet-20241022': 'claude-3-5-sonnet-20241022',
            'claude-3-sonnet-20240229': 'claude-3-sonnet-20240229'
        };

        this.defaultModel = modelMapping[config.defaultModel] || config.defaultModel || 'claude-3-5-sonnet-20241022';

        this.capabilities = {
            streaming: true,
            documentContext: true,
            retries: true,
            models: ['claude-3-5-sonnet-20241022', 'claude-3-opus-20240229', 'claude-3-sonnet-20240229', 'claude-3-haiku-20240307']
        };

        logger.info(`🤖 Anthropic provider initialized with model: ${this.defaultModel}`);
    }

    async sendMessage(messages, options = {}) {
        try {
            const startTime = Date.now();

            // Convert messages format for Anthropic
            const anthropicMessages = this.convertMessages(messages);

            const response = await this.client.messages.create({
                model: options.model || this.defaultModel,
                max_tokens: options.maxTokens || 4000,
                temperature: options.temperature || 0.7,
                messages: anthropicMessages.messages,
                system: anthropicMessages.system
            });

            const duration = Date.now() - startTime;

            logger.info('Anthropic API call completed', {
                model: response.model,
                usage: response.usage,
                duration: `${duration}ms`
            });

            return {
                id: randomUUID(),
                content: response.content[0].text,
                model: response.model,
                provider: this.id,
                usage: {
                    prompt_tokens: response.usage.input_tokens,
                    completion_tokens: response.usage.output_tokens,
                    total_tokens: response.usage.input_tokens + response.usage.output_tokens
                },
                finish_reason: response.stop_reason
            };

        } catch (error) {
            logger.error('Anthropic API error:', {
                error: error.message,
                type: error.type,
                status: error.status
            });

            // Handle specific error types
            if (error.status === 401) {
                throw new Error('Anthropic API authentication failed - check API key');
            } else if (error.status === 429) {
                const rateLimitError = new Error('Anthropic rate limit exceeded');
                rateLimitError.name = 'RateLimitError';
                throw rateLimitError;
            } else if (error.status >= 500) {
                throw new Error('Anthropic service temporarily unavailable');
            }

            throw new Error(`Anthropic API error: ${error.message}`);
        }
    }

    async sendStreamingMessage(messages, callbacks, options = {}) {
        try {
            const startTime = Date.now();
            callbacks.onStart?.();

            // Convert messages format for Anthropic
            const anthropicMessages = this.convertMessages(messages);

            const stream = await this.client.messages.create({
                model: options.model || this.defaultModel,
                max_tokens: options.maxTokens || 4000,
                temperature: options.temperature || 0.7,
                messages: anthropicMessages.messages,
                system: anthropicMessages.system,
                stream: true
            });

            let fullContent = '';
            let usage = null;
            let model = null;

            for await (const chunk of stream) {
                if (chunk.type === 'message_start') {
                    model = chunk.message.model;
                    usage = chunk.message.usage;
                } else if (chunk.type === 'content_block_delta') {
                    const token = chunk.delta.text || '';
                    fullContent += token;
                    callbacks.onToken?.(token);
                } else if (chunk.type === 'message_delta') {
                    // Update usage with final counts
                    if (chunk.usage) {
                        usage = chunk.usage;
                    }
                } else if (chunk.type === 'message_stop') {
                    const duration = Date.now() - startTime;

                    logger.info('Anthropic streaming completed', {
                        model,
                        contentLength: fullContent.length,
                        duration: `${duration}ms`,
                        usage
                    });

                    callbacks.onComplete?.({
                        model,
                        usage: usage ? {
                            prompt_tokens: usage.input_tokens,
                            completion_tokens: usage.output_tokens,
                            total_tokens: usage.input_tokens + usage.output_tokens
                        } : undefined
                    });
                    break;
                }
            }

        } catch (error) {
            logger.error('Anthropic streaming error:', error);
            callbacks.onError?.(error);
        }
    }

    convertMessages(messages) {
        const systemMessages = messages.filter(m => m.role === 'system');
        const conversationMessages = messages.filter(m => m.role !== 'system');

        return {
            system: systemMessages.map(m => m.content).join('\n\n') || undefined,
            messages: conversationMessages.map(msg => ({
                role: msg.role,
                content: msg.content
            }))
        };
    }

    async checkHealth() {
        try {
            // Simple health check - create a minimal request
            await this.client.messages.create({
                model: this.defaultModel,
                max_tokens: 10,
                messages: [{ role: 'user', content: 'Hi' }]
            });
            return true;
        } catch (error) {
            logger.warn('Anthropic health check failed:', error.message);
            return false;
        }
    }
}

module.exports = AnthropicProvider;