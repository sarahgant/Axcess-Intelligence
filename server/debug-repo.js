console.log('Debugging ConversationRepository...');

try {
    console.log('1. Importing ConversationRepository...');
    const ConversationRepository = require('./repositories/conversation.repository');
    console.log('✅ ConversationRepository imported');
    
    console.log('2. Creating repository instance...');
    const repo = new ConversationRepository();
    console.log('✅ Repository instance created');
    
    console.log('3. Checking repository properties...');
    console.log('repo.db:', typeof repo.db);
    console.log('repo.statements:', typeof repo.statements);
    console.log('repo.statements keys:', Object.keys(repo.statements || {}));
    
    console.log('4. Testing getAllConversations...');
    const conversations = repo.getAllConversations('test_user');
    console.log('✅ getAllConversations result:', conversations);
    
    console.log('5. Testing createConversation...');
    const newConversation = repo.createConversation('Test Conversation', 'test_user');
    console.log('✅ createConversation result:', newConversation);
    
    console.log('6. Testing getAllConversations again...');
    const conversations2 = repo.getAllConversations('test_user');
    console.log('✅ getAllConversations result after creation:', conversations2);
    
    repo.close();
    console.log('✅ Repository test completed successfully');
} catch (error) {
    console.error('❌ Repository test failed:', error);
    console.error('Error stack:', error.stack);
}
