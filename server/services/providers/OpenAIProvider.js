/**
 * Backend OpenAI Provider - Secure server-side implementation
 */

const OpenAI = require('openai');
const logger = require('../../utils/logger');
const { randomUUID } = require('crypto');

class OpenAIProvider {
    constructor(config) {
        this.id = 'openai';
        this.displayName = 'GPT (OpenAI)';
        this.client = new OpenAI({
            apiKey: config.apiKey
        });
        this.defaultModel = config.defaultModel || 'gpt-4';

        this.capabilities = {
            streaming: true,
            documentContext: true,
            retries: true,
            models: ['gpt-4', 'gpt-4-turbo-preview', 'gpt-3.5-turbo']
        };

        logger.info(`🤖 OpenAI provider initialized with model: ${this.defaultModel}`);
    }

    async sendMessage(messages, options = {}) {
        try {
            const startTime = Date.now();

            const response = await this.client.chat.completions.create({
                model: options.model || this.defaultModel,
                messages: messages,
                max_tokens: options.maxTokens || 4000,
                temperature: options.temperature || 0.7,
                top_p: options.topP || 1,
                frequency_penalty: options.frequencyPenalty || 0,
                presence_penalty: options.presencePenalty || 0
            });

            const duration = Date.now() - startTime;

            logger.info('OpenAI API call completed', {
                model: response.model,
                usage: response.usage,
                duration: `${duration}ms`
            });

            return {
                id: response.id,
                content: response.choices[0].message.content,
                model: response.model,
                provider: this.id,
                usage: response.usage,
                finish_reason: response.choices[0].finish_reason
            };

        } catch (error) {
            logger.error('OpenAI API error:', {
                error: error.message,
                type: error.type,
                code: error.code,
                status: error.status
            });

            // Handle specific error types
            if (error.status === 401 || error.code === 'invalid_api_key') {
                const authError = new Error('OpenAI API authentication failed - check API key');
                authError.name = 'AuthenticationError';
                throw authError;
            } else if (error.status === 429 || error.code === 'rate_limit_exceeded') {
                const rateLimitError = new Error('OpenAI rate limit exceeded');
                rateLimitError.name = 'RateLimitError';
                throw rateLimitError;
            } else if (error.status === 400 && error.code === 'context_length_exceeded') {
                throw new Error('Message too long - please reduce the content length');
            } else if (error.status >= 500) {
                throw new Error('OpenAI service temporarily unavailable');
            }

            throw new Error(`OpenAI API error: ${error.message}`);
        }
    }

    async sendStreamingMessage(messages, callbacks, options = {}) {
        try {
            const startTime = Date.now();
            callbacks.onStart?.();

            const stream = await this.client.chat.completions.create({
                model: options.model || this.defaultModel,
                messages: messages,
                max_tokens: options.maxTokens || 4000,
                temperature: options.temperature || 0.7,
                top_p: options.topP || 1,
                frequency_penalty: options.frequencyPenalty || 0,
                presence_penalty: options.presencePenalty || 0,
                stream: true
            });

            let fullContent = '';
            let model = null;
            let usage = null;

            for await (const chunk of stream) {
                const choice = chunk.choices[0];

                if (choice?.delta?.content) {
                    const token = choice.delta.content;
                    fullContent += token;
                    callbacks.onToken?.(token);
                }

                if (chunk.model) {
                    model = chunk.model;
                }

                if (choice?.finish_reason) {
                    const duration = Date.now() - startTime;

                    logger.info('OpenAI streaming completed', {
                        model,
                        contentLength: fullContent.length,
                        duration: `${duration}ms`,
                        finishReason: choice.finish_reason
                    });

                    // Note: OpenAI doesn't provide usage in streaming mode
                    callbacks.onComplete?.({
                        model,
                        finishReason: choice.finish_reason,
                        usage: null // Not available in streaming
                    });
                    break;
                }
            }

        } catch (error) {
            logger.error('OpenAI streaming error:', error);
            callbacks.onError?.(error);
        }
    }

    async checkHealth() {
        try {
            // Simple health check - create a minimal request
            await this.client.chat.completions.create({
                model: this.defaultModel,
                messages: [{ role: 'user', content: 'Hi' }],
                max_tokens: 5
            });
            return true;
        } catch (error) {
            logger.warn('OpenAI health check failed:', error.message);
            return false;
        }
    }
}

module.exports = OpenAIProvider;