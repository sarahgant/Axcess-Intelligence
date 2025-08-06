import React, { useState, useCallback } from "react";
import { ChatContainer, Message } from "../../../../components/ui/chat-container";
import { logger } from "../../../../core/logging/logger";

interface ChatSectionProps {
  className?: string;
}

// Mock function to simulate AI streaming response
const simulateAIResponse = async (
  message: string,
  onToken: (token: string) => void,
  onComplete: () => void,
  signal?: AbortSignal
): Promise<void> => {
  // Mock response based on input
  const responses = {
    default: "I understand you're asking about tax-related matters. Based on current tax regulations, here are some key considerations you should be aware of...",
    "tax deduction": "Regarding tax deductions, there are several categories you should consider. Business expenses, charitable contributions, and mortgage interest are common deductions that may apply to your situation...",
    "document analysis": "For document analysis, I can help you extract key information from tax documents, identify important clauses, and highlight potential compliance issues...",
  };

  let responseText = responses.default;
  
  // Simple keyword matching for demo
  const lowerMessage = message.toLowerCase();
  if (lowerMessage.includes("deduction")) {
    responseText = responses["tax deduction"];
  } else if (lowerMessage.includes("document")) {
    responseText = responses["document analysis"];
  }

  // Add mock citations
  responseText += "\n\nReferences:\n• IRC Section 162 - Business Expenses\n• Publication 535 - Business Expenses";

  const tokens = responseText.split(" ");
  const delay = 60; // ~50 tokens per second (1000ms / 50 ≈ 20ms per token, but we'll use 60ms for better visibility)

  for (let i = 0; i < tokens.length; i++) {
    if (signal?.aborted) {
      return;
    }

    await new Promise(resolve => setTimeout(resolve, delay));
    
    if (signal?.aborted) {
      return;
    }

    const token = i === 0 ? tokens[i] : " " + tokens[i];
    onToken(token);
  }

  onComplete();
};

export const ChatSection: React.FC<ChatSectionProps> = ({ className }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [currentStreamingId, setCurrentStreamingId] = useState<string | null>(null);
  const [abortController, setAbortController] = useState<AbortController | null>(null);

  // Handle sending a new message
  const handleSendMessage = useCallback(async (messageContent: string) => {
    if (isStreaming) return; // Prevent sending while streaming

    // Add user message
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      content: messageContent,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);

    // Start AI response
    const aiMessageId = `ai-${Date.now()}`;
    const aiMessage: Message = {
      id: aiMessageId,
      content: "",
      isUser: false,
      timestamp: new Date(),
      isStreaming: true,
      citations: [],
    };

    setMessages(prev => [...prev, aiMessage]);
    setIsStreaming(true);
    setCurrentStreamingId(aiMessageId);

    // Create abort controller for this request
    const controller = new AbortController();
    setAbortController(controller);

    try {
      await simulateAIResponse(
        messageContent,
        (token: string) => {
          setMessages(prev => 
            prev.map(msg => 
              msg.id === aiMessageId
                ? { ...msg, content: msg.content + token }
                : msg
            )
          );
        },
        () => {
          setMessages(prev => 
            prev.map(msg => 
              msg.id === aiMessageId
                ? { 
                    ...msg, 
                    isStreaming: false,
                    citations: [
                      { text: "IRC Section 162", url: "https://www.irs.gov/pub/irs-pdf/p535.pdf" },
                      { text: "Publication 535", url: "https://www.irs.gov/publications/p535" }
                    ]
                  }
                : msg
            )
          );
          setIsStreaming(false);
          setCurrentStreamingId(null);
          setAbortController(null);
        },
        controller.signal
      );
    } catch (error) {
      if (!controller.signal.aborted) {
        console.error("Error in AI response:", error);
        setMessages(prev => 
          prev.map(msg => 
            msg.id === aiMessageId
              ? { 
                  ...msg, 
                  content: "Sorry, I encountered an error while processing your request. Please try again.",
                  isStreaming: false 
                }
              : msg
          )
        );
      }
      setIsStreaming(false);
      setCurrentStreamingId(null);
      setAbortController(null);
    }
  }, [isStreaming]);

  // Handle stopping streaming
  const handleStopStreaming = useCallback(() => {
    if (abortController) {
      abortController.abort();
      setIsStreaming(false);
      setCurrentStreamingId(null);
      setAbortController(null);

      // Mark the current message as stopped
      if (currentStreamingId) {
        setMessages(prev => 
          prev.map(msg => 
            msg.id === currentStreamingId
              ? { ...msg, isStreaming: false, content: msg.content + " [Response stopped by user]" }
              : msg
          )
        );
      }
    }
  }, [abortController, currentStreamingId]);

  // Handle message feedback
  const handleMessageFeedback = useCallback((messageId: string, feedback: "up" | "down") => {
    setMessages(prev => 
      prev.map(msg => 
        msg.id === messageId
          ? { ...msg, feedback }
          : msg
      )
    );
    
    // Here you would typically send feedback to your analytics/improvement system
    logger.info('Message feedback submitted', { 
      component: 'ChatSection',
      messageId,
      feedback,
      action: 'message_feedback'
    });
  }, []);

  // Handle message copy
  const handleMessageCopy = useCallback((messageId: string) => {
    // Analytics tracking for copy events
    logger.info('Message copied', { 
      component: 'ChatSection',
      messageId,
      action: 'message_copy'
    });
  }, []);

  return (
    <div className={className}>
      <ChatContainer
        messages={messages}
        onSendMessage={handleSendMessage}
        onStopStreaming={handleStopStreaming}
        onMessageFeedback={handleMessageFeedback}
        onMessageCopy={handleMessageCopy}
        isStreaming={isStreaming}
        placeholder="Ask about tax regulations, document analysis, or research assistance..."
      />
    </div>
  );
};