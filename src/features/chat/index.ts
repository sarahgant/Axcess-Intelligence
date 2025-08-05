/**
 * Chat Feature - Public API
 * Main chat interface and messaging functionality
 */

// Components
export { ChatInterface } from './components/ChatInterface';
export { MessageList } from './components/MessageList';
export { MessageInput } from './components/MessageInput';
export { ChatHeader } from './components/ChatHeader';

// Hooks
export { useChat } from './hooks/useChat';
export { useChatHistory } from './hooks/useChatHistory';
export { useMessageQueue } from './hooks/useMessageQueue';

// Services
export { ChatService } from './services/ChatService';
export { MessageService } from './services/MessageService';

// Types
export type {
    ChatMessage,
    ChatSession,
    ChatProvider,
    ChatSettings,
    MessageType,
    ChatState
} from './types';

// Store
export { useChatStore } from './stores/chatStore';

// Constants
export { CHAT_CONSTANTS } from './constants';