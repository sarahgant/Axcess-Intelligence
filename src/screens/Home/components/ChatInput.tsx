import React, { useState, useRef, useEffect } from 'react';
import { Button } from '../../../components/ui/button';
import { WKIcons } from '../../../components/ui/wk-icon';
import { logger } from '../../../core/logging/logger';
import { PlusButtonDropdown } from '../../../components/document-upload';

interface ChatInputProps {
    onSend: (message: string) => void;
    onStop?: () => void;
    isStreaming?: boolean;
    isDisabled?: boolean;
    placeholder?: string;
    className?: string;
}

export const ChatInput: React.FC<ChatInputProps> = ({
    onSend,
    onStop,
    isStreaming = false,
    isDisabled = false,
    placeholder = "Type your message... (Enter to send, Shift+Enter for new line)",
    className = ""
}) => {
    const loggerInstance = logger.component('ChatInput');
    const [value, setValue] = useState('');
    const [isComposing, setIsComposing] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    // Handle input change from contenteditable div
    const handleInput = () => {
        if (containerRef.current) {
            const text = containerRef.current.innerText || '';
            setValue(text);
        }
    };

    // Handle key down event
    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
        // Handle Enter key
        if (e.key === 'Enter') {
            if (e.shiftKey) {
                // Shift+Enter: Let default behavior (new line) happen
                return;
            } else if (!isComposing) {
                // Enter without Shift: Send message
                e.preventDefault();
                handleSend();
            }
        }
    };

    // Handle paste event to paste as plain text
    const handlePaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
        e.preventDefault();
        const text = e.clipboardData.getData('text/plain');
        const selection = window.getSelection();
        if (!selection?.rangeCount) return;
        selection.deleteFromDocument();
        selection.getRangeAt(0).insertNode(document.createTextNode(text));
        selection.collapseToEnd();
        handleInput();
    };

    // Handle composition events for IME input
    const handleCompositionStart = () => {
        setIsComposing(true);
    };

    const handleCompositionEnd = () => {
        setIsComposing(false);
    };

    // Handle send message
    const handleSend = () => {
        const trimmedValue = value.trim();
        if (trimmedValue && !isDisabled && !isStreaming) {
            loggerInstance.info('Sending message', {
                messageLength: trimmedValue.length,
                isStreaming
            });

            onSend(trimmedValue);
            setValue("");
            // Clear the contenteditable div
            if (containerRef.current) {
                containerRef.current.innerText = '';
            }
        }
    };

    // Handle stop streaming
    const handleStop = () => {
        if (onStop && isStreaming) {
            loggerInstance.info('Stopping streaming response');
            onStop();
        }
    };

    // Update placeholder visibility
    useEffect(() => {
        if (containerRef.current) {
            containerRef.current.setAttribute('data-placeholder',
                value ? '' : placeholder);
        }
    }, [value, placeholder]);

    // Check if send button should be disabled
    const isSendDisabled = !value.trim() || isStreaming || isDisabled;

    return (
        <div className={`relative flex items-end gap-2 p-4 border-t border-border bg-background ${className}`}>
            <style dangerouslySetInnerHTML={{
                __html: `
                .chat-input-editable {
                    width: 100%;
                    min-height: 40px;
                    max-height: 240px;
                    padding: 8px 12px;
                    border: 1px solid #e0e0e0;
                    border-radius: 6px;
                    background-color: transparent;
                    font-size: 14px;
                    line-height: 20px;
                    font-family: inherit;
                    overflow-y: auto;
                    overflow-x: hidden;
                    outline: none;
                    transition: border-color 0.2s;
                    white-space: pre-wrap;
                    word-wrap: break-word;
                    word-break: break-word;
                }
                
                .chat-input-editable:focus {
                    border-color: #007ac3;
                    box-shadow: 0 0 0 1px #007ac3;
                }
                
                .chat-input-editable:empty:before {
                    content: attr(data-placeholder);
                    color: #999;
                    pointer-events: none;
                    position: absolute;
                }
                
                .chat-input-editable[contenteditable="false"] {
                    cursor: not-allowed;
                    opacity: 0.5;
                }
            `}} />
            <div className="flex-1 relative">
                <div
                    ref={containerRef}
                    className="chat-input-editable"
                    contentEditable={!isDisabled}
                    onInput={handleInput}
                    onKeyDown={handleKeyDown}
                    onPaste={handlePaste}
                    onCompositionStart={handleCompositionStart}
                    onCompositionEnd={handleCompositionEnd}
                    role="textbox"
                    aria-label="Chat message input"
                    aria-describedby="chat-input-help"
                    aria-multiline="true"
                    data-placeholder={placeholder}
                />
                <div id="chat-input-help" className="sr-only">
                    Press Enter to send your message, or Shift+Enter to add a new line. Maximum 10 lines allowed.
                </div>
            </div>

            <div className="flex gap-2">
                {isStreaming ? (
                    <Button
                        type="button"
                        onClick={handleStop}
                        className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring h-9 px-4 py-2 bg-destructive text-destructive-foreground shadow hover:bg-destructive/90"
                        disabled={isDisabled}
                    >
                        <WKIcons name="stop" className="w-4 h-4" />
                        Stop
                    </Button>
                ) : (
                    <Button
                        type="button"
                        onClick={handleSend}
                        className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 h-9 px-4 py-2 bg-primary text-primary-foreground shadow hover:bg-primary/90"
                        disabled={isSendDisabled}
                    >
                        <WKIcons name="send" className="w-4 h-4" />
                        Send
                    </Button>
                )}
            </div>
        </div>
    );
};