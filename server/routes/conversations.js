/**
 * Conversation Management Routes
 * Handles all conversation CRUD operations
 */

const express = require('express');
const router = express.Router();
const { z } = require('zod');
const winston = require('winston');

// Configure logger
const logger = winston.createLogger({
    level: process.env.LOG_LEVEL || 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.errors({ stack: true }),
        winston.format.json()
    ),
    defaultMeta: { service: 'conversation-api' },
    transports: [
        new winston.transports.Console({
            format: winston.format.simple()
        })
    ]
});

// In-memory storage for conversations (temporary until database is set up)
const conversations = new Map();

// Validation schemas
const CreateConversationSchema = z.object({
    title: z.string().min(1).max(255),
    userId: z.string().optional().default('default_user')
});

const UpdateConversationSchema = z.object({
    title: z.string().min(1).max(255).optional(),
    isStarred: z.boolean().optional()
});

const AddMessageSchema = z.object({
    content: z.string().min(1),
    sender: z.enum(['user', 'ai']),
    attachedDocuments: z.array(z.object({
        id: z.string(),
        name: z.string(),
        type: z.string()
    })).optional()
});

// GET /api/conversations - List all conversations
router.get('/', (req, res) => {
    try {
        const userId = req.query.userId || 'default_user';

        logger.info('Fetching conversations', { userId });

        // Return empty array for now
        const userConversations = [];

        logger.info('Conversations fetched successfully', {
            count: userConversations.length,
            userId
        });

        res.json(userConversations);

    } catch (error) {
        logger.error('Error fetching conversations:', error);
        res.status(500).json({ error: 'Failed to fetch conversations' });
    }
});

// GET /api/conversations/:id - Get single conversation with messages
router.get('/:id', (req, res) => {
    try {
        const conversationId = req.params.id;
        const userId = req.query.userId || 'default_user';

        logger.info('Fetching conversation', { conversationId, userId });

        // Return 404 for now since we don't have persistent storage
        return res.status(404).json({ error: 'Conversation not found' });

    } catch (error) {
        logger.error('Error fetching conversation:', error);
        res.status(500).json({ error: 'Failed to fetch conversation' });
    }
});

// POST /api/conversations - Create new conversation
router.post('/', (req, res) => {
    try {
        const validation = CreateConversationSchema.safeParse(req.body);
        
        if (!validation.success) {
            return res.status(400).json({ 
                error: 'Invalid conversation data',
                details: validation.error.errors 
            });
        }

        const { title, userId } = validation.data;

        logger.info('Creating new conversation', { title, userId });

        // Create a simple conversation object
        const conversation = {
            id: Date.now().toString(),
            title,
            userId,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            messages: [],
            isStarred: false
        };

        logger.info('Conversation created successfully', { conversationId: conversation.id });

        res.status(201).json(conversation);

    } catch (error) {
        logger.error('Error creating conversation:', error);
        res.status(500).json({ error: 'Failed to create conversation' });
    }
});

// PUT /api/conversations/:id - Update conversation
router.put('/:id', (req, res) => {
    try {
        const conversationId = req.params.id;
        const validation = UpdateConversationSchema.safeParse(req.body);
        
        if (!validation.success) {
            return res.status(400).json({ 
                error: 'Invalid update data',
                details: validation.error.errors 
            });
        }

        logger.info('Updating conversation', { conversationId, updates: validation.data });

        // Return 404 for now since we don't have persistent storage
        return res.status(404).json({ error: 'Conversation not found' });

    } catch (error) {
        logger.error('Error updating conversation:', error);
        res.status(500).json({ error: 'Failed to update conversation' });
    }
});

// DELETE /api/conversations/:id - Delete conversation
router.delete('/:id', (req, res) => {
    try {
        const conversationId = req.params.id;

        logger.info('Deleting conversation', { conversationId });

        // Return 404 for now since we don't have persistent storage
        return res.status(404).json({ error: 'Conversation not found' });

    } catch (error) {
        logger.error('Error deleting conversation:', error);
        res.status(500).json({ error: 'Failed to delete conversation' });
    }
});

// POST /api/conversations/:id/messages - Add message to conversation
router.post('/:id/messages', (req, res) => {
    try {
        const conversationId = req.params.id;
        const validation = AddMessageSchema.safeParse(req.body);
        
        if (!validation.success) {
            return res.status(400).json({ 
                error: 'Invalid message data',
                details: validation.error.errors 
            });
        }

        const { content, sender, attachedDocuments } = validation.data;

        logger.info('Adding message to conversation', { 
            conversationId, 
            sender, 
            contentLength: content.length 
        });

        // Return 404 for now since we don't have persistent storage
        return res.status(404).json({ error: 'Conversation not found' });

    } catch (error) {
        logger.error('Error adding message:', error);
        res.status(500).json({ error: 'Failed to add message' });
    }
});

module.exports = router;
