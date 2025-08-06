const { initializeDatabase } = require('./database/init');

console.log('Testing database connection...');

try {
    console.log('About to initialize database...');
    const db = initializeDatabase();
    console.log('Database initialized successfully');
    
    // Test a simple query
    console.log('Testing simple query...');
    const testQuery = db.prepare('SELECT COUNT(*) as count FROM conversations');
    const result = testQuery.get();
    console.log('Test query result:', result);
    
    // Test the conversations query
    console.log('Testing conversations query...');
    const conversationsQuery = db.prepare(`
        SELECT id, title, created_at, updated_at, is_starred, user_id,
               (SELECT COUNT(*) FROM messages WHERE conversation_id = conversations.id) as message_count
        FROM conversations 
        WHERE user_id = ?
        ORDER BY updated_at DESC
    `);
    
    const conversations = conversationsQuery.all('test_user');
    console.log('Conversations query result:', conversations);
    
    db.close();
    console.log('Database test completed successfully');
} catch (error) {
    console.error('Database test failed:', error);
    console.error('Error stack:', error.stack);
}
