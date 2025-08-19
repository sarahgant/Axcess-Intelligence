import React from 'react';
import { Button } from '../../../components/ui/button';
import { WKIcons } from '../../../components/ui/wk-icon';
import { logger } from '../../../core/logging/logger';
import { Message } from './ConversationList';

interface ChatMessageProps {
    message: Message;
    onCopy: (messageId: string) => void;
    onRegenerate: (messageId: string) => void;
    onEdit: (messageId: string) => void;
    onFeedback: (messageId: string, isPositive: boolean) => void;
    isEditing: boolean;
    onSaveEdit: (messageId: string, newText: string) => void;
    onCancelEdit: () => void;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({
    message,
    onCopy,
    onRegenerate,
    onEdit,
    onFeedback,
    isEditing,
    onSaveEdit,
    onCancelEdit
}) => {
    const loggerInstance = logger.component('ChatMessage');
    const [editText, setEditText] = React.useState(message.text);

    const isUser = message.sender === 'user';

    const handleCopy = () => {
        navigator.clipboard.writeText(message.text);
        onCopy(message.id);
        loggerInstance.info('Message copied to clipboard', { messageId: message.id });
    };

    const handleRegenerate = () => {
        onRegenerate(message.id);
        loggerInstance.info('Message regeneration requested', { messageId: message.id });
    };

    const handleEdit = () => {
        onEdit(message.id);
        loggerInstance.info('Message edit requested', { messageId: message.id });
    };

    const handleSaveEdit = () => {
        onSaveEdit(message.id, editText);
        loggerInstance.info('Message edit saved', { messageId: message.id });
    };

    const handleCancelEdit = () => {
        setEditText(message.text);
        onCancelEdit();
        loggerInstance.info('Message edit cancelled', { messageId: message.id });
    };

    const handleFeedback = (isPositive: boolean) => {
        onFeedback(message.id, isPositive);
        loggerInstance.info('Message feedback submitted', {
            messageId: message.id,
            isPositive
        });
    };

    const getDocumentIconProps = (fileName: string) => {
        const getFileType = (ext: string): string => {
            const fileTypes: Record<string, string> = {
                '.pdf': 'pdf',
                '.doc': 'word',
                '.docx': 'word',
                '.docm': 'word',
                '.xls': 'excel',
                '.xlsx': 'excel',
                '.xlsm': 'excel',
                '.csv': 'excel',
                '.ppt': 'powerpoint',
                '.pptx': 'powerpoint',
                '.pptm': 'powerpoint',
                '.txt': 'text',
                '.rtf': 'text',
                '.log': 'text',
                '.jpg': 'image',
                '.jpeg': 'image',
                '.png': 'image',
                '.gif': 'image',
                '.webp': 'image',
                '.bmp': 'image',
                '.svg': 'image'
            };
            return fileTypes[ext.toLowerCase()] || 'document';
        };

        const extension = fileName.substring(fileName.lastIndexOf('.'));
        return getFileType(extension);
    };

    if (isEditing) {
        return (
            <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
                <div className={`max-w-[80%] ${isUser ? 'order-2' : 'order-1'}`}>
                    <div className="bg-background border border-input rounded-lg p-3">
                        <textarea
                            value={editText}
                            onChange={(e) => setEditText(e.target.value)}
                            className="w-full min-h-[100px] resize-none bg-transparent border-none outline-none text-sm"
                            placeholder="Edit your message..."
                        />
                        <div className="flex justify-end gap-2 mt-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleCancelEdit}
                            >
                                Cancel
                            </Button>
                            <Button
                                size="sm"
                                onClick={handleSaveEdit}
                            >
                                Save
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
            <div className={`max-w-[80%] ${isUser ? 'order-2' : 'order-1'}`}>
                {/* Message Content */}
                <div className={`rounded-lg p-3 ${isUser
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted'
                    }`}>
                    <div className="text-sm whitespace-pre-wrap">{message.text}</div>

                    {/* Attached Documents */}
                    {message.attachedDocuments && message.attachedDocuments.length > 0 && (
                        <div className="mt-2 space-y-1">
                            {message.attachedDocuments.map((doc) => (
                                <div
                                    key={doc.id}
                                    className="flex items-center gap-2 text-xs opacity-80"
                                >
                                    <WKIcons
                                        name={getDocumentIconProps(doc.name)}
                                        className="w-3 h-3"
                                    />
                                    <span className="truncate">{doc.name}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Message Actions */}
                <div className={`flex items-center gap-1 mt-1 ${isUser ? 'justify-end' : 'justify-start'
                    }`}>
                    {!isUser && (
                        <>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={() => handleFeedback(true)}
                                title="Thumbs up"
                            >
                                <WKIcons name="thumbs-up" className="w-3 h-3" />
                            </Button>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={() => handleFeedback(false)}
                                title="Thumbs down"
                            >
                                <WKIcons name="thumbs-down" className="w-3 h-3" />
                            </Button>
                        </>
                    )}

                    <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={handleCopy}
                        title="Copy message"
                    >
                        <WKIcons name="copy" className="w-3 h-3" />
                    </Button>

                    {isUser && (
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={handleEdit}
                            title="Edit message"
                        >
                            <WKIcons name="edit" className="w-3 h-3" />
                        </Button>
                    )}

                    {!isUser && (
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={handleRegenerate}
                            title="Regenerate response"
                        >
                            <WKIcons name="refresh" className="w-3 h-3" />
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
};
