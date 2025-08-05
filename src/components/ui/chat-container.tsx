import * as React from "react";
import { cn } from "../../lib/utils";
import { ChatMessage, ChatMessageProps } from "./chat-message";
import { ChatInput } from "./chat-input";

export interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
  isStreaming?: boolean;
  citations?: Array<{
    text: string;
    url: string;
  }>;
  feedback?: "up" | "down" | null;
}

export interface ChatContainerProps {
  messages: Message[];
  onSendMessage: (message: string) => void;
  onStopStreaming?: () => void;
  onMessageFeedback?: (messageId: string, feedback: "up" | "down") => void;
  onMessageCopy?: (messageId: string) => void;
  isStreaming?: boolean;
  className?: string;
  placeholder?: string;
  disabled?: boolean;
}

const ChatContainer: React.FC<ChatContainerProps> = ({
  messages,
  onSendMessage,
  onStopStreaming,
  onMessageFeedback,
  onMessageCopy,
  isStreaming = false,
  className,
  placeholder,
  disabled = false,
}) => {
  const messagesEndRef = React.useRef<HTMLDivElement>(null);
  const messagesContainerRef = React.useRef<HTMLDivElement>(null);

  // Auto-scroll to newest message
  const scrollToBottom = React.useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ 
      behavior: "smooth",
      block: "nearest"
    });
  }, []);

  // Scroll to bottom when new messages appear
  React.useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // Handle message feedback
  const handleMessageFeedback = (messageId: string, feedback: "up" | "down") => {
    onMessageFeedback?.(messageId, feedback);
  };

  // Handle message copy
  const handleMessageCopy = (messageId: string) => {
    onMessageCopy?.(messageId);
  };

  // Handle send message
  const handleSendMessage = (message: string) => {
    if (!disabled) {
      onSendMessage(message);
    }
  };

  // Handle stop streaming
  const handleStopStreaming = () => {
    onStopStreaming?.();
  };

  return (
    <div className={cn("flex flex-col h-full bg-background", className)}>
      {/* Messages container */}
      <div 
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto px-4 py-6 space-y-4"
        role="log"
        aria-live="polite"
        aria-label="Chat conversation"
      >
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-center">
            <div className="max-w-md">
              <div className="text-lg font-medium text-muted-foreground mb-2">
                Start a conversation
              </div>
              <div className="text-sm text-muted-foreground/75">
                Ask questions about tax law, document analysis, or get research assistance
              </div>
            </div>
          </div>
        ) : (
          <>
            {messages.map((message) => (
              <ChatMessage
                key={message.id}
                message={message.content}
                isUser={message.isUser}
                isStreaming={message.isStreaming}
                citations={message.citations}
                timestamp={message.timestamp}
                feedbackValue={message.feedback}
                onCopy={() => handleMessageCopy(message.id)}
                onFeedback={(feedback) => handleMessageFeedback(message.id, feedback)}
              />
            ))}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Chat input */}
      <ChatInput
        onSend={handleSendMessage}
        onStop={handleStopStreaming}
        isStreaming={isStreaming}
        disabled={disabled}
        placeholder={placeholder || "Type your message... (Enter to send, Shift+Enter for new line)"}
      />
    </div>
  );
};

export { ChatContainer };
export type { ChatContainerProps, Message };