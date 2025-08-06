console.log('Starting simple test...');

try {
    console.log('Importing ConversationRepository...');
    const ConversationRepository = require('./repositories/conversation.repository');
    console.log('ConversationRepository imported successfully');
    
    console.log('Creating repository instance...');
    const repo = new ConversationRepository();
    console.log('Repository instance created successfully');
    
    console.log('Testing getAllConversations...');
    const conversations = repo.getAllConversations('test_user');
    console.log('getAllConversations result:', conversations);
    
    console.log('Test completed successfully');
} catch (error) {
    console.error('Test failed:', error);
    console.error('Error stack:', error.stack);
}
