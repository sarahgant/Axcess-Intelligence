-- CCH Axcess Intelligence Database Schema
-- Production-ready SQLite schema with proper indexing

-- Users table for session management
CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    session_id TEXT UNIQUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    last_active DATETIME DEFAULT CURRENT_TIMESTAMP,
    user_agent TEXT,
    ip_address TEXT
);

-- Conversations table
CREATE TABLE IF NOT EXISTS conversations (
    id TEXT PRIMARY KEY,
    user_id TEXT,
    title TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    is_favorited BOOLEAN DEFAULT FALSE,
    metadata JSON, -- Store additional conversation metadata
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Messages table
CREATE TABLE IF NOT EXISTS messages (
    id TEXT PRIMARY KEY,
    conversation_id TEXT NOT NULL,
    content TEXT NOT NULL,
    sender TEXT NOT NULL CHECK (sender IN ('user', 'ai')),
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    tokens_used INTEGER DEFAULT 0,
    model_used TEXT,
    processing_time_ms INTEGER,
    metadata JSON, -- Store message-specific metadata
    FOREIGN KEY (conversation_id) REFERENCES conversations(id) ON DELETE CASCADE
);

-- Feedback table for thumbs up/down and detailed feedback
CREATE TABLE IF NOT EXISTS feedback (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    message_id TEXT NOT NULL,
    user_id TEXT,
    type TEXT NOT NULL CHECK (type IN ('positive', 'negative')),
    details TEXT, -- Optional detailed feedback
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    resolved BOOLEAN DEFAULT FALSE, -- For admin tracking
    FOREIGN KEY (message_id) REFERENCES messages(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Analytics table for usage tracking
CREATE TABLE IF NOT EXISTS analytics (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    event_type TEXT NOT NULL,
    user_id TEXT,
    conversation_id TEXT,
    message_id TEXT,
    data JSON, -- Flexible data storage
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (conversation_id) REFERENCES conversations(id) ON DELETE SET NULL,
    FOREIGN KEY (message_id) REFERENCES messages(id) ON DELETE SET NULL
);

-- Performance indexes
CREATE INDEX IF NOT EXISTS idx_conversations_user_id ON conversations(user_id);
CREATE INDEX IF NOT EXISTS idx_conversations_updated_at ON conversations(updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_messages_timestamp ON messages(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_feedback_message_id ON feedback(message_id);
CREATE INDEX IF NOT EXISTS idx_feedback_type ON feedback(type);
CREATE INDEX IF NOT EXISTS idx_analytics_event_type ON analytics(event_type);
CREATE INDEX IF NOT EXISTS idx_analytics_timestamp ON analytics(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_users_session_id ON users(session_id);
CREATE INDEX IF NOT EXISTS idx_users_last_active ON users(last_active DESC);

-- Views for common queries
CREATE VIEW IF NOT EXISTS conversation_stats AS
SELECT 
    c.id,
    c.title,
    c.created_at,
    c.updated_at,
    c.is_favorited,
    COUNT(m.id) as message_count,
    SUM(CASE WHEN f.type = 'positive' THEN 1 ELSE 0 END) as positive_feedback,
    SUM(CASE WHEN f.type = 'negative' THEN 1 ELSE 0 END) as negative_feedback,
    SUM(m.tokens_used) as total_tokens,
    AVG(m.processing_time_ms) as avg_response_time
FROM conversations c
LEFT JOIN messages m ON c.id = m.conversation_id
LEFT JOIN feedback f ON m.id = f.message_id
GROUP BY c.id, c.title, c.created_at, c.updated_at, c.is_favorited;

-- Triggers for automatic timestamp updates
CREATE TRIGGER IF NOT EXISTS update_conversation_timestamp 
    AFTER INSERT ON messages
BEGIN
    UPDATE conversations 
    SET updated_at = CURRENT_TIMESTAMP 
    WHERE id = NEW.conversation_id;
END;

CREATE TRIGGER IF NOT EXISTS update_user_last_active 
    AFTER INSERT ON messages
BEGIN
    UPDATE users 
    SET last_active = CURRENT_TIMESTAMP 
    WHERE id = (
        SELECT user_id FROM conversations 
        WHERE id = NEW.conversation_id
    );
END;
