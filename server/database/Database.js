/**
 * Production-ready Database Service
 * Handles all database operations with connection pooling, transactions, and error handling
 */

const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');
const logger = require('../utils/logger');
const { randomUUID } = require('crypto');

class DatabaseService {
    constructor() {
        this.db = null;
        this.isInitialized = false;
        this.init();
    }

    init() {
        try {
            // Ensure database directory exists
            const dbDir = path.join(__dirname, '../data');
            if (!fs.existsSync(dbDir)) {
                fs.mkdirSync(dbDir, { recursive: true });
            }

            // Initialize database connection
            const dbPath = path.join(dbDir, 'intelligence.db');
            this.db = new Database(dbPath);

            // Configure database settings for production
            this.db.pragma('journal_mode = WAL');
            this.db.pragma('synchronous = NORMAL');
            this.db.pragma('cache_size = 1000000');
            this.db.pragma('temp_store = MEMORY');
            this.db.pragma('mmap_size = 268435456'); // 256MB

            // Load and execute schema
            this.createSchema();

            // Prepare common statements for performance
            this.prepareStatements();

            this.isInitialized = true;
            logger.info('🗄️ Database initialized successfully', { path: dbPath });
        } catch (error) {
            logger.error('❌ Database initialization failed', { error: error.message });
            throw error;
        }
    }

    createSchema() {
        const schemaPath = path.join(__dirname, 'schema.sql');
        const schema = fs.readFileSync(schemaPath, 'utf8');

        // Execute schema in a transaction
        const transaction = this.db.transaction(() => {
            this.db.exec(schema);
        });

        transaction();
        logger.info('📋 Database schema created/updated');
    }

    prepareStatements() {
        // User operations
        this.statements = {
            // User management
            createUser: this.db.prepare(`
                INSERT INTO users (id, session_id, user_agent, ip_address)
                VALUES (?, ?, ?, ?)
            `),
            getUserBySession: this.db.prepare(`
                SELECT * FROM users WHERE session_id = ?
            `),
            updateUserActivity: this.db.prepare(`
                UPDATE users SET last_active = CURRENT_TIMESTAMP WHERE id = ?
            `),

            // Conversation operations
            createConversation: this.db.prepare(`
                INSERT INTO conversations (id, user_id, title, metadata)
                VALUES (?, ?, ?, ?)
            `),
            getConversationsByUser: this.db.prepare(`
                SELECT * FROM conversation_stats 
                WHERE id IN (
                    SELECT id FROM conversations WHERE user_id = ?
                )
                ORDER BY updated_at DESC
            `),
            getConversation: this.db.prepare(`
                SELECT * FROM conversations WHERE id = ?
            `),
            updateConversation: this.db.prepare(`
                UPDATE conversations 
                SET title = ?, is_favorited = ?, updated_at = CURRENT_TIMESTAMP
                WHERE id = ?
            `),
            deleteConversation: this.db.prepare(`
                DELETE FROM conversations WHERE id = ?
            `),
            toggleFavorite: this.db.prepare(`
                UPDATE conversations 
                SET is_favorited = NOT is_favorited, updated_at = CURRENT_TIMESTAMP
                WHERE id = ?
            `),

            // Message operations
            createMessage: this.db.prepare(`
                INSERT INTO messages (id, conversation_id, content, sender, tokens_used, model_used, processing_time_ms, metadata)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            `),
            getMessagesByConversation: this.db.prepare(`
                SELECT * FROM messages 
                WHERE conversation_id = ? 
                ORDER BY timestamp ASC
            `),
            getMessage: this.db.prepare(`
                SELECT * FROM messages WHERE id = ?
            `),
            updateMessage: this.db.prepare(`
                UPDATE messages 
                SET content = ?, metadata = ?
                WHERE id = ?
            `),
            deleteMessage: this.db.prepare(`
                DELETE FROM messages WHERE id = ?
            `),

            // Feedback operations
            createFeedback: this.db.prepare(`
                INSERT INTO feedback (message_id, user_id, type, details)
                VALUES (?, ?, ?, ?)
            `),
            getFeedbackByMessage: this.db.prepare(`
                SELECT * FROM feedback WHERE message_id = ?
            `),
            updateFeedback: this.db.prepare(`
                UPDATE feedback SET resolved = ? WHERE id = ?
            `),

            // Analytics
            logEvent: this.db.prepare(`
                INSERT INTO analytics (event_type, user_id, conversation_id, message_id, data)
                VALUES (?, ?, ?, ?, ?)
            `),
            getAnalytics: this.db.prepare(`
                SELECT 
                    event_type,
                    COUNT(*) as count,
                    DATE(timestamp) as date
                FROM analytics 
                WHERE timestamp >= date('now', '-30 days')
                GROUP BY event_type, DATE(timestamp)
                ORDER BY date DESC
            `)
        };

        logger.info('📝 Database statements prepared');
    }

    // User Management
    async createUser(sessionId, userAgent = null, ipAddress = null) {
        try {
            const userId = randomUUID();
            this.statements.createUser.run(userId, sessionId, userAgent, ipAddress);

            await this.logEvent('user_created', userId);
            logger.info('👤 User created', { userId, sessionId });

            return userId;
        } catch (error) {
            logger.error('❌ Failed to create user', { error: error.message });
            throw error;
        }
    }

    async getUserBySession(sessionId) {
        try {
            const user = this.statements.getUserBySession.get(sessionId);
            if (user) {
                this.statements.updateUserActivity.run(user.id);
            }
            return user;
        } catch (error) {
            logger.error('❌ Failed to get user by session', { error: error.message });
            throw error;
        }
    }

    // Conversation Management
    async createConversation(userId, title = '', metadata = {}) {
        try {
            const conversationId = `conv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

            this.statements.createConversation.run(
                conversationId,
                userId,
                title,
                JSON.stringify(metadata)
            );

            await this.logEvent('conversation_created', userId, conversationId);
            logger.info('💬 Conversation created', { conversationId, userId });

            return conversationId;
        } catch (error) {
            logger.error('❌ Failed to create conversation', { error: error.message });
            throw error;
        }
    }

    async getConversationsByUser(userId) {
        try {
            const conversations = this.statements.getConversationsByUser.all(userId);
            return conversations.map(conv => ({
                ...conv,
                metadata: conv.metadata ? JSON.parse(conv.metadata) : {}
            }));
        } catch (error) {
            logger.error('❌ Failed to get conversations', { error: error.message });
            throw error;
        }
    }

    async getConversationWithMessages(conversationId) {
        try {
            const conversation = this.statements.getConversation.get(conversationId);
            if (!conversation) return null;

            const messages = this.statements.getMessagesByConversation.all(conversationId);

            return {
                ...conversation,
                metadata: conversation.metadata ? JSON.parse(conversation.metadata) : {},
                messages: messages.map(msg => ({
                    ...msg,
                    metadata: msg.metadata ? JSON.parse(msg.metadata) : {}
                }))
            };
        } catch (error) {
            logger.error('❌ Failed to get conversation with messages', { error: error.message });
            throw error;
        }
    }

    async updateConversation(conversationId, updates) {
        try {
            const { title, isFavorited } = updates;
            this.statements.updateConversation.run(title, isFavorited, conversationId);

            await this.logEvent('conversation_updated', null, conversationId);
            logger.info('✏️ Conversation updated', { conversationId, updates });
        } catch (error) {
            logger.error('❌ Failed to update conversation', { error: error.message });
            throw error;
        }
    }

    async deleteConversation(conversationId) {
        try {
            this.statements.deleteConversation.run(conversationId);

            await this.logEvent('conversation_deleted', null, conversationId);
            logger.info('🗑️ Conversation deleted', { conversationId });
        } catch (error) {
            logger.error('❌ Failed to delete conversation', { error: error.message });
            throw error;
        }
    }

    async toggleFavorite(conversationId) {
        try {
            this.statements.toggleFavorite.run(conversationId);

            await this.logEvent('conversation_favorited', null, conversationId);
            logger.info('⭐ Conversation favorite toggled', { conversationId });
        } catch (error) {
            logger.error('❌ Failed to toggle favorite', { error: error.message });
            throw error;
        }
    }

    // Message Management
    async createMessage(conversationId, content, sender, options = {}) {
        try {
            const messageId = `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
            const { tokensUsed = 0, modelUsed = null, processingTimeMs = 0, metadata = {} } = options;

            this.statements.createMessage.run(
                messageId,
                conversationId,
                content,
                sender,
                tokensUsed,
                modelUsed,
                processingTimeMs,
                JSON.stringify(metadata)
            );

            await this.logEvent('message_created', null, conversationId, messageId);
            logger.info('💬 Message created', { messageId, conversationId, sender });

            return messageId;
        } catch (error) {
            logger.error('❌ Failed to create message', { error: error.message });
            throw error;
        }
    }

    async updateMessage(messageId, updates) {
        try {
            const { content, metadata = {} } = updates;
            this.statements.updateMessage.run(content, JSON.stringify(metadata), messageId);

            await this.logEvent('message_updated', null, null, messageId);
            logger.info('✏️ Message updated', { messageId });
        } catch (error) {
            logger.error('❌ Failed to update message', { error: error.message });
            throw error;
        }
    }

    async deleteMessage(messageId) {
        try {
            this.statements.deleteMessage.run(messageId);

            await this.logEvent('message_deleted', null, null, messageId);
            logger.info('🗑️ Message deleted', { messageId });
        } catch (error) {
            logger.error('❌ Failed to delete message', { error: error.message });
            throw error;
        }
    }

    // Feedback Management
    async createFeedback(messageId, userId, type, details = null) {
        try {
            this.statements.createFeedback.run(messageId, userId, type, details);

            await this.logEvent('feedback_created', userId, null, messageId, { type, hasDetails: !!details });
            logger.info('👍 Feedback created', { messageId, userId, type });
        } catch (error) {
            logger.error('❌ Failed to create feedback', { error: error.message });
            throw error;
        }
    }

    async getFeedbackByMessage(messageId) {
        try {
            return this.statements.getFeedbackByMessage.all(messageId);
        } catch (error) {
            logger.error('❌ Failed to get feedback', { error: error.message });
            throw error;
        }
    }

    // Analytics
    async logEvent(eventType, userId = null, conversationId = null, messageId = null, data = {}) {
        try {
            this.statements.logEvent.run(
                eventType,
                userId,
                conversationId,
                messageId,
                JSON.stringify(data)
            );
        } catch (error) {
            logger.error('❌ Failed to log event', { error: error.message });
            // Don't throw - analytics shouldn't break the app
        }
    }

    async getAnalytics() {
        try {
            return this.statements.getAnalytics.all();
        } catch (error) {
            logger.error('❌ Failed to get analytics', { error: error.message });
            throw error;
        }
    }

    // Health check
    async healthCheck() {
        try {
            this.db.prepare('SELECT 1').get();
            return { status: 'healthy', initialized: this.isInitialized };
        } catch (error) {
            return { status: 'unhealthy', error: error.message };
        }
    }

    // Graceful shutdown
    close() {
        if (this.db) {
            this.db.close();
            logger.info('🔒 Database connection closed');
        }
    }
}

// Singleton instance
const database = new DatabaseService();

// Graceful shutdown
process.on('SIGINT', () => database.close());
process.on('SIGTERM', () => database.close());

module.exports = database;
