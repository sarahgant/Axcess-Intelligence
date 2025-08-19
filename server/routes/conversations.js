/**
 * Conversations API Routes - Production Ready
 * Handles all conversation, message, and feedback operations
 */

const express = require('express');
const { body, param, query, validationResult } = require('express-validator');
const database = require('../database/Database');
const logger = require('../utils/logger');
const { randomUUID } = require('crypto');

const router = express.Router();

// Middleware for validation error handling
const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        logger.warn('Validation errors', { errors: errors.array(), path: req.path });
        return res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors: errors.array()
        });
    }
    next();
};

// Middleware to ensure user session
const ensureUserSession = async (req, res, next) => {
    try {
        let sessionId = req.headers['x-session-id'];

        if (!sessionId) {
            // Generate new session
            sessionId = randomUUID();
            const userId = await database.createUser(
                sessionId,
                req.headers['user-agent'],
                req.ip
            );
            req.user = { id: userId, sessionId, isNew: true };
        } else {
            // Get existing user
            const user = await database.getUserBySession(sessionId);
            if (!user) {
                // Session expired, create new user
                const userId = await database.createUser(
                    sessionId,
                    req.headers['user-agent'],
                    req.ip
                );
                req.user = { id: userId, sessionId, isNew: true };
            } else {
                req.user = { ...user, isNew: false };
            }
        }

        res.setHeader('X-Session-ID', req.user.sessionId);
        next();
    } catch (error) {
        logger.error('Session middleware error', { error: error.message });
        res.status(500).json({
            success: false,
            message: 'Session management failed'
        });
    }
};

// Apply session middleware to all routes
router.use(ensureUserSession);

// ================================
// CONVERSATION ROUTES
// ================================

// GET /api/conversations - Get all conversations for user
router.get('/', async (req, res) => {
    try {
        const conversations = await database.getConversationsByUser(req.user.id);

        logger.info('Conversations retrieved', {
            userId: req.user.id,
            count: conversations.length
        });

        res.json({
            success: true,
            data: conversations,
            sessionId: req.user.sessionId
        });
    } catch (error) {
        logger.error('Failed to get conversations', {
            error: error.message,
            userId: req.user.id
        });
        res.status(500).json({
            success: false,
            message: 'Failed to retrieve conversations'
        });
    }
});

// POST /api/conversations - Create new conversation
router.post('/',
    [
        body('title').optional().isString().trim().isLength({ max: 200 }),
        body('metadata').optional().isObject()
    ],
    handleValidationErrors,
    async (req, res) => {
        try {
            const { title = '', metadata = {} } = req.body;

            const conversationId = await database.createConversation(
                req.user.id,
                title,
                metadata
            );

            const conversation = await database.getConversationWithMessages(conversationId);

            logger.info('Conversation created', {
                conversationId,
                userId: req.user.id
            });

            res.status(201).json({
                success: true,
                data: conversation,
                sessionId: req.user.sessionId
            });
        } catch (error) {
            logger.error('Failed to create conversation', {
                error: error.message,
                userId: req.user.id
            });
            res.status(500).json({
                success: false,
                message: 'Failed to create conversation'
            });
        }
    }
);

// GET /api/conversations/:id - Get specific conversation with messages
router.get('/:id',
    [param('id').isString().trim().notEmpty()],
    handleValidationErrors,
    async (req, res) => {
        try {
            const conversation = await database.getConversationWithMessages(req.params.id);

            if (!conversation) {
                return res.status(404).json({
                    success: false,
                    message: 'Conversation not found'
                });
            }

            logger.info('Conversation retrieved', {
                conversationId: req.params.id,
                messageCount: conversation.messages?.length || 0
            });

            res.json({
                success: true,
                data: conversation,
                sessionId: req.user.sessionId
            });
        } catch (error) {
            logger.error('Failed to get conversation', {
                error: error.message,
                conversationId: req.params.id
            });
            res.status(500).json({
                success: false,
                message: 'Failed to retrieve conversation'
            });
        }
    }
);

// PUT /api/conversations/:id - Update conversation
router.put('/:id',
    [
        param('id').isString().trim().notEmpty(),
        body('title').optional().isString().trim().isLength({ max: 200 }),
        body('isFavorited').optional().isBoolean()
    ],
    handleValidationErrors,
    async (req, res) => {
        try {
            const updates = {};
            if (req.body.title !== undefined) updates.title = req.body.title;
            if (req.body.isFavorited !== undefined) updates.isFavorited = req.body.isFavorited;

            await database.updateConversation(req.params.id, updates);

            logger.info('Conversation updated', {
                conversationId: req.params.id,
                updates
            });

            res.json({
                success: true,
                message: 'Conversation updated successfully',
                sessionId: req.user.sessionId
            });
        } catch (error) {
            logger.error('Failed to update conversation', {
                error: error.message,
                conversationId: req.params.id
            });
            res.status(500).json({
                success: false,
                message: 'Failed to update conversation'
            });
        }
    }
);

// POST /api/conversations/:id/favorite - Toggle favorite status
router.post('/:id/favorite',
    [param('id').isString().trim().notEmpty()],
    handleValidationErrors,
    async (req, res) => {
        try {
            await database.toggleFavorite(req.params.id);

            logger.info('Conversation favorite toggled', {
                conversationId: req.params.id
            });

            res.json({
                success: true,
                message: 'Favorite status toggled',
                sessionId: req.user.sessionId
            });
        } catch (error) {
            logger.error('Failed to toggle favorite', {
                error: error.message,
                conversationId: req.params.id
            });
            res.status(500).json({
                success: false,
                message: 'Failed to toggle favorite'
            });
        }
    }
);

// DELETE /api/conversations/:id - Delete conversation
router.delete('/:id',
    [param('id').isString().trim().notEmpty()],
    handleValidationErrors,
    async (req, res) => {
        try {
            await database.deleteConversation(req.params.id);

            logger.info('Conversation deleted', {
                conversationId: req.params.id
            });

            res.json({
                success: true,
                message: 'Conversation deleted successfully',
                sessionId: req.user.sessionId
            });
        } catch (error) {
            logger.error('Failed to delete conversation', {
                error: error.message,
                conversationId: req.params.id
            });
            res.status(500).json({
                success: false,
                message: 'Failed to delete conversation'
            });
        }
    }
);

// ================================
// MESSAGE ROUTES
// ================================

// POST /api/conversations/:id/messages - Add message to conversation
router.post('/:conversationId/messages',
    [
        param('conversationId').isString().trim().notEmpty(),
        body('content').isString().trim().isLength({ min: 1, max: 50000 }),
        body('sender').isIn(['user', 'ai']),
        body('tokensUsed').optional().isInt({ min: 0 }),
        body('modelUsed').optional().isString().trim(),
        body('processingTimeMs').optional().isInt({ min: 0 }),
        body('metadata').optional().isObject()
    ],
    handleValidationErrors,
    async (req, res) => {
        try {
            const { content, sender, tokensUsed, modelUsed, processingTimeMs, metadata } = req.body;

            const messageId = await database.createMessage(
                req.params.conversationId,
                content,
                sender,
                { tokensUsed, modelUsed, processingTimeMs, metadata }
            );

            logger.info('Message created', {
                messageId,
                conversationId: req.params.conversationId,
                sender,
                contentLength: content.length
            });

            res.status(201).json({
                success: true,
                data: { id: messageId },
                sessionId: req.user.sessionId
            });
        } catch (error) {
            logger.error('Failed to create message', {
                error: error.message,
                conversationId: req.params.conversationId
            });
            res.status(500).json({
                success: false,
                message: 'Failed to create message'
            });
        }
    }
);

// PUT /api/messages/:id - Update message
router.put('/messages/:id',
    [
        param('id').isString().trim().notEmpty(),
        body('content').optional().isString().trim().isLength({ max: 50000 }),
        body('metadata').optional().isObject()
    ],
    handleValidationErrors,
    async (req, res) => {
        try {
            const updates = {};
            if (req.body.content !== undefined) updates.content = req.body.content;
            if (req.body.metadata !== undefined) updates.metadata = req.body.metadata;

            await database.updateMessage(req.params.id, updates);

            logger.info('Message updated', {
                messageId: req.params.id
            });

            res.json({
                success: true,
                message: 'Message updated successfully',
                sessionId: req.user.sessionId
            });
        } catch (error) {
            logger.error('Failed to update message', {
                error: error.message,
                messageId: req.params.id
            });
            res.status(500).json({
                success: false,
                message: 'Failed to update message'
            });
        }
    }
);

// DELETE /api/messages/:id - Delete message
router.delete('/messages/:id',
    [param('id').isString().trim().notEmpty()],
    handleValidationErrors,
    async (req, res) => {
        try {
            await database.deleteMessage(req.params.id);

            logger.info('Message deleted', {
                messageId: req.params.id
            });

            res.json({
                success: true,
                message: 'Message deleted successfully',
                sessionId: req.user.sessionId
            });
        } catch (error) {
            logger.error('Failed to delete message', {
                error: error.message,
                messageId: req.params.id
            });
            res.status(500).json({
                success: false,
                message: 'Failed to delete message'
            });
        }
    }
);

// ================================
// FEEDBACK ROUTES
// ================================

// POST /api/messages/:id/feedback - Add feedback to message
router.post('/messages/:messageId/feedback',
    [
        param('messageId').isString().trim().notEmpty(),
        body('type').isIn(['positive', 'negative']),
        body('details').optional().isString().trim().isLength({ max: 1000 })
    ],
    handleValidationErrors,
    async (req, res) => {
        try {
            const { type, details } = req.body;

            await database.createFeedback(
                req.params.messageId,
                req.user.id,
                type,
                details
            );

            logger.info('Feedback created', {
                messageId: req.params.messageId,
                userId: req.user.id,
                type,
                hasDetails: !!details
            });

            res.status(201).json({
                success: true,
                message: 'Feedback recorded successfully',
                sessionId: req.user.sessionId
            });
        } catch (error) {
            logger.error('Failed to create feedback', {
                error: error.message,
                messageId: req.params.messageId
            });
            res.status(500).json({
                success: false,
                message: 'Failed to record feedback'
            });
        }
    }
);

// GET /api/messages/:id/feedback - Get feedback for message
router.get('/messages/:messageId/feedback',
    [param('messageId').isString().trim().notEmpty()],
    handleValidationErrors,
    async (req, res) => {
        try {
            const feedback = await database.getFeedbackByMessage(req.params.messageId);

            res.json({
                success: true,
                data: feedback,
                sessionId: req.user.sessionId
            });
        } catch (error) {
            logger.error('Failed to get feedback', {
                error: error.message,
                messageId: req.params.messageId
            });
            res.status(500).json({
                success: false,
                message: 'Failed to retrieve feedback'
            });
        }
    }
);

// ================================
// ANALYTICS ROUTES (Admin)
// ================================

// GET /api/analytics - Get usage analytics
router.get('/analytics',
    [query('admin_key').optional().isString()],
    async (req, res) => {
        try {
            // Simple admin key check (in production, use proper authentication)
            const adminKey = req.query.admin_key;
            if (adminKey !== process.env.ADMIN_KEY) {
                return res.status(403).json({
                    success: false,
                    message: 'Unauthorized'
                });
            }

            const analytics = await database.getAnalytics();

            res.json({
                success: true,
                data: analytics
            });
        } catch (error) {
            logger.error('Failed to get analytics', { error: error.message });
            res.status(500).json({
                success: false,
                message: 'Failed to retrieve analytics'
            });
        }
    }
);

// Health check for database
router.get('/health', async (req, res) => {
    try {
        const health = await database.healthCheck();
        res.json({
            success: true,
            data: health
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Database health check failed',
            error: error.message
        });
    }
});

module.exports = router;
