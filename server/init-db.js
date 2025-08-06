const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

console.log('🗄️ Initializing SQLite database...');

// Database file path
const dbPath = path.join(__dirname, '../database/conversations.db');
console.log('Database path:', dbPath);

// Ensure database directory exists
const dbDir = path.dirname(dbPath);
if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
    console.log('Created database directory:', dbDir);
}

// Initialize database connection
const db = new Database(dbPath);

// Enable foreign keys
db.pragma('foreign_keys = ON');

console.log('📋 Creating database tables...');

// Create conversations table
const createConversationsTable = `
  CREATE TABLE IF NOT EXISTS conversations (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    is_starred BOOLEAN DEFAULT FALSE,
    user_id TEXT DEFAULT 'default_user'
  )
`;

// Create messages table
const createMessagesTable = `
  CREATE TABLE IF NOT EXISTS messages (
    id TEXT PRIMARY KEY,
    conversation_id TEXT NOT NULL,
    content TEXT NOT NULL,
    sender TEXT NOT NULL CHECK (sender IN ('user', 'ai')),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    is_streaming BOOLEAN DEFAULT FALSE,
    attached_documents TEXT, -- JSON array of document info
    FOREIGN KEY (conversation_id) REFERENCES conversations(id) ON DELETE CASCADE
  )
`;

// Create indexes for better performance
const createIndexes = [
    'CREATE INDEX IF NOT EXISTS idx_conversations_user_id ON conversations(user_id)',
    'CREATE INDEX IF NOT EXISTS idx_conversations_updated_at ON conversations(updated_at DESC)',
    'CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON messages(conversation_id)',
    'CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at DESC)'
];

try {
    // Create tables
    db.exec(createConversationsTable);
    console.log('✅ Created conversations table');

    db.exec(createMessagesTable);
    console.log('✅ Created messages table');

    // Create indexes
    createIndexes.forEach((indexSQL, i) => {
        db.exec(indexSQL);
        console.log(`✅ Created index ${i + 1}/${createIndexes.length}`);
    });

    // Test the database connection
    const testQuery = db.prepare('SELECT COUNT(*) as count FROM conversations');
    const result = testQuery.get();
    console.log('🧪 Database test successful - conversations count:', result.count);

    console.log('🎉 Database initialization complete!');
    console.log('Database file:', dbPath);

} catch (error) {
    console.error('❌ Database initialization failed:', error);
    process.exit(1);
} finally {
    db.close();
}
