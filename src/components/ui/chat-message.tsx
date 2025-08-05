import * as React from "react";
import { cn } from "../../lib/utils";

export interface ChatMessageProps {
  message: string;
  isUser: boolean;
  isStreaming?: boolean;
  citations?: Array<{
    text: string;
    url: string;
  }>;
  timestamp?: Date;
  onCopy?: () => void;
  onFeedback?: (type: "up" | "down") => void;
  feedbackValue?: "up" | "down" | null;
}

const ChatMessage: React.FC<ChatMessageProps> = ({
  message,
  isUser,
  isStreaming = false,
  citations = [],
  timestamp,
  onCopy,
  onFeedback,
  feedbackValue,
}) => {
  const [showCopyToast, setShowCopyToast] = React.useState(false);

  // Handle copy to clipboard
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message);
      onCopy?.();
      setShowCopyToast(true);
      setTimeout(() => setShowCopyToast(false), 2000);
    } catch (error) {
      console.error("Failed to copy message:", error);
    }
  };

  // Handle feedback
  const handleFeedback = (type: "up" | "down") => {
    onFeedback?.(type);
  };

  // Process message with citations
  const processMessageWithCitations = (text: string) => {
    if (citations.length === 0) return text;
    
    let processedText = text;
    citations.forEach((citation, index) => {
      const citationPlaceholder = `[${index + 1}]`;
      const citationLink = (
        <a
          key={index}
          href={citation.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 underline hover:text-blue-800 font-medium"
          title={`Source: ${citation.text}`}
        >
          {citation.text}
        </a>
      );
      // Note: This is a simplified implementation. In a real app, you'd want to use a proper
      // text processing library to handle citation replacement with React elements
    });
    
    return processedText;
  };

  return (
    <div
      className={cn(
        "flex w-full mb-4",
        isUser ? "justify-end" : "justify-start"
      )}
      role="region"
      aria-label={isUser ? "Your message" : "AI assistant message"}
    >
      <div
        className={cn(
          "max-w-[85%] rounded-lg px-4 py-3 text-sm",
          isUser
            ? "bg-primary text-primary-foreground ml-auto"
            : "bg-muted text-muted-foreground mr-auto"
        )}
      >
        {/* Message content */}
        <div className="whitespace-pre-wrap break-words">
          {processMessageWithCitations(message)}
          {isStreaming && (
            <span className="inline-block w-2 h-4 ml-1 bg-current animate-pulse" />
          )}
        </div>

        {/* Citations */}
        {citations.length > 0 && (
          <div className="mt-3 pt-3 border-t border-border/20">
            <div className="text-xs font-medium mb-2 opacity-75">Sources:</div>
            <div className="space-y-1">
              {citations.map((citation, index) => (
                <div key={index}>
                  <a
                    href={citation.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline hover:text-blue-800 text-xs font-medium"
                  >
                    {citation.text}
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Timestamp */}
        {timestamp && (
          <div className="mt-2 text-xs opacity-50">
            {timestamp.toLocaleTimeString([], { 
              hour: "2-digit", 
              minute: "2-digit" 
            })}
          </div>
        )}

        {/* Action buttons for AI messages */}
        {!isUser && !isStreaming && (
          <div className="flex items-center gap-2 mt-3 pt-3 border-t border-border/20">
            {/* Copy button */}
            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-1 px-2 py-1 text-xs rounded hover:bg-background/50 transition-colors"
              aria-label="Copy message"
            >
              <svg
                className="w-3 h-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
              </svg>
              Copy
            </button>

            {/* Feedback buttons */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => handleFeedback("up")}
                className={cn(
                  "inline-flex items-center p-1 rounded hover:bg-background/50 transition-colors",
                  feedbackValue === "up" && "text-green-600"
                )}
                aria-label="Thumbs up"
              >
                <svg
                  className="w-3 h-3"
                  fill={feedbackValue === "up" ? "currentColor" : "none"}
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V8a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"
                  />
                </svg>
              </button>
              
              <button
                onClick={() => handleFeedback("down")}
                className={cn(
                  "inline-flex items-center p-1 rounded hover:bg-background/50 transition-colors",
                  feedbackValue === "down" && "text-red-600"
                )}
                aria-label="Thumbs down"
              >
                <svg
                  className="w-3 h-3"
                  fill={feedbackValue === "down" ? "currentColor" : "none"}
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 3h4.018c.163 0 .326.02.485.06L17 4m-7 10v2a2 2 0 002 2h.095c.5 0 .905-.405.905-.905 0-.714.211-1.412.608-2.006L17 13V4m-7 10h2M17 4h2a2 2 0 012 2v6a2 2 0 01-2 2h-2.5"
                  />
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* Copy success toast */}
        {showCopyToast && (
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full mt-2 px-3 py-1 bg-gray-900 text-white text-xs rounded shadow-lg">
            Copied to clipboard
          </div>
        )}
      </div>
    </div>
  );
};

export { ChatMessage };
export type { ChatMessageProps };