const ConversationRepository = require('./repositories/conversation.repository');

console.log('Testing ConversationRepository...');

try {
    console.log('Creating repository instance...');
    const repo = new ConversationRepository();
    console.log('Repository created successfully');
    
    console.log('Testing getAllConversations...');
    const conversations = repo.getAllConversations('test_user');
    console.log('Conversations result:', conversations);
    
    console.log('Testing createConversation...');
    const newConversation = repo.createConversation('Test Conversation', 'test_user');
    console.log('New conversation result:', newConversation);
    
    console.log('Testing getAllConversations again...');
    const conversations2 = repo.getAllConversations('test_user');
    console.log('Conversations result after creation:', conversations2);
    
    repo.close();
    console.log('Repository test completed successfully');
} catch (error) {
    console.error('Repository test failed:', error);
    console.error('Error stack:', error.stack);
}
