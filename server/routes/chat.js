/**
 * Chat API routes - handles AI conversations securely
 */

const express = require('express');
const router = express.Router();
const { z } = require('zod');
const ChatService = require('../services/ChatService');
const logger = require('../utils/logger');

// Validation schemas
const ChatMessageSchema = z.object({
    message: z.string().min(1).max(10000),
    conversationId: z.string().optional(),
    provider: z.enum(['anthropic', 'openai']).optional(),
    systemPrompt: z.string().optional(),
    documents: z.array(z.object({
        id: z.string(),
        name: z.string(),
        type: z.string(),
        content: z.string()
    })).optional(),
    options: z.object({
        temperature: z.number().min(0).max(2).optional(),
        maxTokens: z.number().min(1).max(8000).optional()
    }).optional()
});

// Initialize chat service
const chatService = new ChatService();

// Validation middleware
const validateChatRequest = (req, res, next) => {
    try {
        req.validatedData = ChatMessageSchema.parse(req.body);
        next();
    } catch (error) {
        logger.warn('Invalid chat request:', { error: error.errors, body: req.body });
        return res.status(400).json({
            error: 'Invalid request data',
            details: error.errors
        });
    }
};

// POST /api/chat/message - Send a chat message
router.post('/message', validateChatRequest, async (req, res) => {
    try {
        const { message, conversationId, provider, systemPrompt, documents, options } = req.validatedData;

        logger.info('Processing chat message', {
            conversationId,
            provider,
            messageLength: message.length,
            documentCount: documents?.length || 0
        });

        const response = await chatService.sendMessage({
            message,
            conversationId,
            provider,
            systemPrompt,
            documents,
            options
        });

        logger.info('Chat message processed successfully', {
            conversationId: response.conversationId,
            responseLength: response.content.length,
            provider: response.provider
        });

        res.json(response);

    } catch (error) {
        logger.error('Error processing chat message:', error);

        if (error.name === 'AuthenticationError') {
            return res.status(401).json({ error: 'AI service authentication failed' });
        }

        if (error.name === 'RateLimitError') {
            return res.status(429).json({ error: 'Rate limit exceeded, please try again later' });
        }

        res.status(500).json({
            error: 'Failed to process message',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

// POST /api/chat/stream - Send a streaming chat message
router.post('/stream', validateChatRequest, async (req, res) => {
    try {
        const { message, conversationId, provider, systemPrompt, documents, options } = req.validatedData;

        logger.info('Processing streaming chat message', {
            conversationId,
            provider,
            messageLength: message.length,
            documentCount: documents?.length || 0
        });

        // Set up Server-Sent Events
        res.writeHead(200, {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'Cache-Control'
        });

        // Send initial connection event
        res.write('data: {"type":"connected"}\n\n');

        let fullResponse = '';
        let responseId = null;

        await chatService.sendStreamingMessage({
            message,
            conversationId,
            provider,
            systemPrompt,
            documents,
            options
        }, {
            onStart: (data) => {
                responseId = data.id;
                res.write(`data: ${JSON.stringify({
                    type: 'start',
                    id: data.id,
                    conversationId: data.conversationId
                })}\n\n`);
            },
            onToken: (token) => {
                fullResponse += token;
                res.write(`data: ${JSON.stringify({
                    type: 'token',
                    token: token
                })}\n\n`);
            },
            onComplete: (data) => {
                res.write(`data: ${JSON.stringify({
                    type: 'complete',
                    id: responseId,
                    content: fullResponse,
                    conversationId: data.conversationId,
                    provider: data.provider,
                    usage: data.usage
                })}\n\n`);
                res.write('data: [DONE]\n\n');
                res.end();

                logger.info('Streaming chat completed', {
                    conversationId: data.conversationId,
                    responseLength: fullResponse.length,
                    provider: data.provider
                });
            },
            onError: (error) => {
                logger.error('Streaming chat error:', error);
                res.write(`data: ${JSON.stringify({
                    type: 'error',
                    error: process.env.NODE_ENV === 'development' ? error.message : 'Processing error'
                })}\n\n`);
                res.end();
            }
        });

    } catch (error) {
        logger.error('Error setting up streaming chat:', error);
        res.write(`data: ${JSON.stringify({
            type: 'error',
            error: 'Failed to initialize streaming'
        })}\n\n`);
        res.end();
    }
});

// GET /api/chat/providers - Get available AI providers
router.get('/providers', async (req, res) => {
    try {
        const providers = await chatService.getAvailableProviders();
        res.json(providers);
    } catch (error) {
        logger.error('Error getting providers:', error);
        res.status(500).json({ error: 'Failed to get providers' });
    }
});

// GET /api/chat/conversations/:id - Get conversation history
router.get('/conversations/:id', async (req, res) => {
    try {
        const conversation = await chatService.getConversation(req.params.id);
        if (!conversation) {
            return res.status(404).json({ error: 'Conversation not found' });
        }
        res.json(conversation);
    } catch (error) {
        logger.error('Error getting conversation:', error);
        res.status(500).json({ error: 'Failed to get conversation' });
    }
});

module.exports = router;