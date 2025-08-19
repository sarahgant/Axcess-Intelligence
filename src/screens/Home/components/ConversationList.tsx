import React from 'react';
import { Button } from '../../../components/ui/button';
import { WKIcons } from '../../../components/ui/wk-icon';
import { logger } from '../../../core/logging/logger';

export interface Message {
    id: string;
    text: string;
    sender: 'user' | 'ai';
    timestamp: Date;
    attachedDocuments?: Array<{
        id: string;
        name: string;
        type: string;
    }>;
    isStreaming?: boolean;
    versions?: string[];
    currentVersion?: number;
}

export interface Conversation {
    id: string;
    title: string;
    messages: Message[];
    createdAt: Date;
    updatedAt: Date;
    isFavorited: boolean;
}

export interface ConversationSection {
    title: string;
    conversations: Conversation[];
    isCollapsed: boolean;
}

interface ConversationListProps {
    conversations: Conversation[];
    currentConversationId: string | null;
    onConversationSelect: (conversationId: string) => void;
    onNewConversation: () => void;
    onDeleteConversation: (conversationId: string) => void;
    onToggleFavorite: (conversationId: string) => void;
}

export const ConversationList: React.FC<ConversationListProps> = ({
    conversations,
    currentConversationId,
    onConversationSelect,
    onNewConversation,
    onDeleteConversation,
    onToggleFavorite
}) => {
    const loggerInstance = logger.component('ConversationList');

    const formatDate = (date: Date): string => {
        const now = new Date();
        const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

        if (diffInHours < 24) {
            return date.toLocaleTimeString('en-US', {
                hour: 'numeric',
                minute: '2-digit',
                hour12: true
            });
        } else if (diffInHours < 168) { // 7 days
            return date.toLocaleDateString('en-US', { weekday: 'short' });
        } else {
            return date.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric'
            });
        }
    };

    const getConversationTitle = (conversation: Conversation): string => {
        if (conversation.title) return conversation.title;

        const firstMessage = conversation.messages[0];
        if (firstMessage) {
            return firstMessage.text.length > 50
                ? firstMessage.text.substring(0, 50) + '...'
                : firstMessage.text;
        }

        return 'New Conversation';
    };

    const handleConversationClick = (conversationId: string) => {
        loggerInstance.info('Conversation selected', { conversationId });
        onConversationSelect(conversationId);
    };

    const handleDeleteClick = (e: React.MouseEvent, conversationId: string) => {
        e.stopPropagation();
        loggerInstance.info('Delete conversation requested', { conversationId });
        onDeleteConversation(conversationId);
    };

    const handleFavoriteClick = (e: React.MouseEvent, conversationId: string) => {
        e.stopPropagation();
        loggerInstance.info('Toggle favorite requested', { conversationId });
        onToggleFavorite(conversationId);
    };

    return (
        <div className="flex flex-col h-full">
            {/* New Conversation Button */}
            <Button
                onClick={onNewConversation}
                className="w-full mb-4 bg-[#005B92] hover:bg-[#005B92]/90 text-white"
                size="sm"
            >
                <WKIcons name="plus" className="w-4 h-4 mr-2" />
                New Conversation
            </Button>

            {/* Conversations List */}
            <div className="flex-1 overflow-y-auto space-y-1">
                {conversations.length === 0 ? (
                    <div className="text-center text-muted-foreground py-8">
                        <WKIcons name="message-circle" className="w-8 h-8 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">No conversations yet</p>
                        <p className="text-xs">Start a new conversation to begin</p>
                    </div>
                ) : (
                    conversations.map((conversation) => (
                        <div
                            key={conversation.id}
                            className={`group relative flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-colors ${currentConversationId === conversation.id
                                    ? 'bg-accent text-accent-foreground'
                                    : 'hover:bg-accent/50'
                                }`}
                            onClick={() => handleConversationClick(conversation.id)}
                        >
                            {/* Conversation Icon */}
                            <WKIcons
                                name="message-circle"
                                className={`w-4 h-4 ${currentConversationId === conversation.id
                                        ? 'text-accent-foreground'
                                        : 'text-muted-foreground'
                                    }`}
                            />

                            {/* Conversation Content */}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between">
                                    <h4 className="text-sm font-medium truncate">
                                        {getConversationTitle(conversation)}
                                    </h4>
                                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-6 w-6 p-0"
                                            onClick={(e) => handleFavoriteClick(e, conversation.id)}
                                        >
                                            <WKIcons
                                                name={conversation.isFavorited ? "star-filled" : "star"}
                                                className="w-3 h-3"
                                            />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-6 w-6 p-0 text-destructive hover:text-destructive"
                                            onClick={(e) => handleDeleteClick(e, conversation.id)}
                                        >
                                            <WKIcons name="trash" className="w-3 h-3" />
                                        </Button>
                                    </div>
                                </div>
                                <p className="text-xs text-muted-foreground truncate">
                                    {formatDate(conversation.updatedAt)}
                                </p>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};
