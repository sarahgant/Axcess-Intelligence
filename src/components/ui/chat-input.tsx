import * as React from "react";
import { cn } from "../../lib/utils";

export interface ChatInputProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  onSend?: (message: string) => void;
  onStop?: () => void;
  isStreaming?: boolean;
  maxLines?: number;
}

const ChatInput = React.forwardRef<HTMLTextAreaElement, ChatInputProps>(
  ({ className, onSend, onStop, isStreaming = false, maxLines = 10, ...props }, ref) => {
    const [value, setValue] = React.useState("");
    const textareaRef = React.useRef<HTMLTextAreaElement>(null);
    
    // Merge refs
    React.useImperativeHandle(ref, () => textareaRef.current!);

    // Auto-resize functionality
    const adjustHeight = React.useCallback(() => {
      const textarea = textareaRef.current;
      if (!textarea) return;

      // Reset height to calculate scrollHeight
      textarea.style.height = "auto";
      
      // Calculate line height and max height
      const lineHeight = parseInt(getComputedStyle(textarea).lineHeight);
      const maxHeight = lineHeight * maxLines;
      const newHeight = Math.min(textarea.scrollHeight, maxHeight);
      
      textarea.style.height = `${newHeight}px`;
    }, [maxLines]);

    // Handle input change
    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setValue(e.target.value);
      adjustHeight();
      props.onChange?.(e);
    };

    // Handle key press
    const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter") {
        if (e.shiftKey) {
          // Allow Shift+Enter for new line
          return;
        } else {
          // Send message on Enter
          e.preventDefault();
          handleSend();
        }
      }
      props.onKeyDown?.(e);
    };

    // Handle send message
    const handleSend = () => {
      const trimmedValue = value.trim();
      if (trimmedValue && onSend && !isStreaming) {
        onSend(trimmedValue);
        setValue("");
        // Reset height after clearing
        setTimeout(adjustHeight, 0);
      }
    };

    // Handle stop streaming
    const handleStop = () => {
      if (onStop && isStreaming) {
        onStop();
      }
    };

    // Adjust height on mount and value changes
    React.useEffect(() => {
      adjustHeight();
    }, [adjustHeight]);

    // Check if send button should be disabled
    const isSendDisabled = !value.trim() || isStreaming;

    return (
      <div className="relative flex items-end gap-2 p-4 border-t border-border bg-background">
        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            className={cn(
              "flex w-full resize-none rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
              "min-h-[2.5rem] max-h-[10rem] overflow-y-auto",
              className,
            )}
            value={value}
            onChange={handleChange}
            onKeyDown={handleKeyPress}
            placeholder="Type your message... (Enter to send, Shift+Enter for new line)"
            aria-label="Chat message input"
            aria-describedby="chat-input-help"
            role="textbox"
            aria-multiline="true"
            {...props}
          />
          <div id="chat-input-help" className="sr-only">
            Press Enter to send your message, or Shift+Enter to add a new line. Maximum 10 lines allowed.
          </div>
        </div>
        
        <div className="flex gap-2">
          {isStreaming ? (
            <button
              type="button"
              onClick={handleStop}
              className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring h-9 px-4 py-2 bg-destructive text-destructive-foreground shadow hover:bg-destructive/90"
              aria-label="Stop streaming response"
            >
              <div className="w-3 h-3 bg-current rounded-sm" />
              Stop
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSend}
              disabled={isSendDisabled}
              className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 h-9 px-4 py-2 bg-primary text-primary-foreground shadow hover:bg-primary/90"
              aria-label="Send message"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                />
              </svg>
              Send
            </button>
          )}
        </div>
      </div>
    );
  },
);

ChatInput.displayName = "ChatInput";

export { ChatInput };