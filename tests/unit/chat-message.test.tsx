import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ChatMessage } from "../../src/components/ui/chat-message";

// Mock clipboard API
Object.assign(navigator, {
  clipboard: {
    writeText: jest.fn(() => Promise.resolve()),
  },
});

describe("ChatMessage", () => {
  const mockOnCopy = jest.fn();
  const mockOnFeedback = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders user message with correct styling", () => {
    render(
      <ChatMessage
        message="Hello, this is a user message"
        isUser={true}
        timestamp={new Date("2024-01-01T12:00:00Z")}
      />
    );

    const messageContainer = screen.getByText("Hello, this is a user message").closest("div");
    expect(messageContainer).toHaveClass("bg-primary", "text-primary-foreground");
  });

  it("renders AI message with correct styling", () => {
    render(
      <ChatMessage
        message="Hello, this is an AI response"
        isUser={false}
        timestamp={new Date("2024-01-01T12:00:00Z")}
      />
    );

    const messageContainer = screen.getByText("Hello, this is an AI response").closest("div");
    expect(messageContainer).toHaveClass("bg-muted", "text-muted-foreground");
  });

  it("displays timestamp in correct format", () => {
    const timestamp = new Date("2024-01-01T12:30:00Z");
    render(
      <ChatMessage
        message="Test message"
        isUser={false}
        timestamp={timestamp}
      />
    );

    // Should display time in HH:MM format
    expect(screen.getByText("12:30")).toBeInTheDocument();
  });

  it("shows streaming indicator for streaming messages", () => {
    render(
      <ChatMessage
        message="Partial message"
        isUser={false}
        isStreaming={true}
      />
    );

    // Streaming indicator should be present (animated cursor)
    const streamingIndicator = screen.getByText("Partial message").parentElement?.querySelector(".animate-pulse");
    expect(streamingIndicator).toBeInTheDocument();
  });

  it("displays citations with correct links", () => {
    const citations = [
      { text: "IRC Section 162", url: "https://www.irs.gov/pub/irs-pdf/p535.pdf" },
      { text: "Publication 535", url: "https://www.irs.gov/publications/p535" }
    ];

    render(
      <ChatMessage
        message="Tax information with citations"
        isUser={false}
        citations={citations}
      />
    );

    // Check sources section exists
    expect(screen.getByText("Sources:")).toBeInTheDocument();
    
    // Check citation links
    const ircLink = screen.getByRole("link", { name: "IRC Section 162" });
    const pubLink = screen.getByRole("link", { name: "Publication 535" });
    
    expect(ircLink).toHaveAttribute("href", "https://www.irs.gov/pub/irs-pdf/p535.pdf");
    expect(ircLink).toHaveAttribute("target", "_blank");
    expect(ircLink).toHaveAttribute("rel", "noopener noreferrer");
    
    expect(pubLink).toHaveAttribute("href", "https://www.irs.gov/publications/p535");
    expect(pubLink).toHaveAttribute("target", "_blank");
    expect(pubLink).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("shows copy button for AI messages", () => {
    render(
      <ChatMessage
        message="AI response message"
        isUser={false}
        onCopy={mockOnCopy}
      />
    );

    const copyButton = screen.getByRole("button", { name: /copy message/i });
    expect(copyButton).toBeInTheDocument();
  });

  it("does not show copy button for user messages", () => {
    render(
      <ChatMessage
        message="User message"
        isUser={true}
      />
    );

    const copyButton = screen.queryByRole("button", { name: /copy message/i });
    expect(copyButton).not.toBeInTheDocument();
  });

  it("does not show action buttons for streaming messages", () => {
    render(
      <ChatMessage
        message="Streaming message"
        isUser={false}
        isStreaming={true}
        onCopy={mockOnCopy}
        onFeedback={mockOnFeedback}
      />
    );

    const copyButton = screen.queryByRole("button", { name: /copy message/i });
    const thumbsUpButton = screen.queryByRole("button", { name: /thumbs up/i });
    
    expect(copyButton).not.toBeInTheDocument();
    expect(thumbsUpButton).not.toBeInTheDocument();
  });

  it("copies message to clipboard when copy button is clicked", async () => {
    const user = userEvent.setup();
    render(
      <ChatMessage
        message="Message to copy"
        isUser={false}
        onCopy={mockOnCopy}
      />
    );

    const copyButton = screen.getByRole("button", { name: /copy message/i });
    await user.click(copyButton);

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith("Message to copy");
    expect(mockOnCopy).toHaveBeenCalled();
  });

  it("shows copy success toast after copying", async () => {
    const user = userEvent.setup();
    render(
      <ChatMessage
        message="Message to copy"
        isUser={false}
        onCopy={mockOnCopy}
      />
    );

    const copyButton = screen.getByRole("button", { name: /copy message/i });
    await user.click(copyButton);

    expect(screen.getByText("Copied to clipboard")).toBeInTheDocument();
    
    // Toast should disappear after 2 seconds
    await waitFor(
      () => {
        expect(screen.queryByText("Copied to clipboard")).not.toBeInTheDocument();
      },
      { timeout: 3000 }
    );
  });

  it("shows feedback buttons for AI messages", () => {
    render(
      <ChatMessage
        message="AI response"
        isUser={false}
        onFeedback={mockOnFeedback}
      />
    );

    const thumbsUpButton = screen.getByRole("button", { name: /thumbs up/i });
    const thumbsDownButton = screen.getByRole("button", { name: /thumbs down/i });
    
    expect(thumbsUpButton).toBeInTheDocument();
    expect(thumbsDownButton).toBeInTheDocument();
  });

  it("calls onFeedback when thumbs up is clicked", async () => {
    const user = userEvent.setup();
    render(
      <ChatMessage
        message="AI response"
        isUser={false}
        onFeedback={mockOnFeedback}
      />
    );

    const thumbsUpButton = screen.getByRole("button", { name: /thumbs up/i });
    await user.click(thumbsUpButton);

    expect(mockOnFeedback).toHaveBeenCalledWith("up");
  });

  it("calls onFeedback when thumbs down is clicked", async () => {
    const user = userEvent.setup();
    render(
      <ChatMessage
        message="AI response"
        isUser={false}
        onFeedback={mockOnFeedback}
      />
    );

    const thumbsDownButton = screen.getByRole("button", { name: /thumbs down/i });
    await user.click(thumbsDownButton);

    expect(mockOnFeedback).toHaveBeenCalledWith("down");
  });

  it("highlights selected feedback button", () => {
    render(
      <ChatMessage
        message="AI response"
        isUser={false}
        feedbackValue="up"
        onFeedback={mockOnFeedback}
      />
    );

    const thumbsUpButton = screen.getByRole("button", { name: /thumbs up/i });
    const thumbsDownButton = screen.getByRole("button", { name: /thumbs down/i });
    
    expect(thumbsUpButton).toHaveClass("text-green-600");
    expect(thumbsDownButton).not.toHaveClass("text-red-600");
  });

  it("preserves line breaks in message content", () => {
    const multilineMessage = "Line 1\nLine 2\nLine 3";
    render(
      <ChatMessage
        message={multilineMessage}
        isUser={false}
      />
    );

    const messageElement = screen.getByText(multilineMessage);
    expect(messageElement).toHaveClass("whitespace-pre-wrap");
  });

  it("handles long messages with word wrapping", () => {
    const longMessage = "This is a very long message that should wrap to multiple lines when the container width is exceeded. It should break words appropriately and maintain readability.";
    
    render(
      <ChatMessage
        message={longMessage}
        isUser={false}
      />
    );

    const messageElement = screen.getByText(longMessage);
    expect(messageElement).toHaveClass("break-words");
  });

  it("handles error when clipboard API fails", async () => {
    const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});
    (navigator.clipboard.writeText as jest.Mock).mockRejectedValueOnce(new Error("Clipboard error"));
    
    const user = userEvent.setup();
    render(
      <ChatMessage
        message="Message to copy"
        isUser={false}
        onCopy={mockOnCopy}
      />
    );

    const copyButton = screen.getByRole("button", { name: /copy message/i });
    await user.click(copyButton);

    expect(consoleSpy).toHaveBeenCalledWith("Failed to copy message:", expect.any(Error));
    consoleSpy.mockRestore();
  });
});