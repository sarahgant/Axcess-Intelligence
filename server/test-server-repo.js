console.log('Testing repository in server context...');

try {
    // Simulate the server environment
    console.log('1. Importing database initialization...');
    const { initializeDatabase } = require('./database/init');
    console.log('✅ Database initialization imported');

    console.log('2. Importing ConversationRepository...');
    const ConversationRepository = require('./repositories/conversation.repository');
    console.log('✅ ConversationRepository imported');

    console.log('3. Creating repository instance...');
    const repo = new ConversationRepository();
    console.log('✅ Repository instance created');

    console.log('4. Testing getAllConversations...');
    const conversations = repo.getAllConversations('test_user');
    console.log('✅ getAllConversations result:', conversations);

    repo.close();
    console.log('✅ Server context test completed successfully');
} catch (error) {
    console.error('❌ Server context test failed:', error);
    console.error('Error stack:', error.stack);
}
