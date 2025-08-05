import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ChatContainer, Message } from "../../src/components/ui/chat-container";

describe("ChatContainer", () => {
  const mockOnSendMessage = jest.fn();
  const mockOnStopStreaming = jest.fn();
  const mockOnMessageFeedback = jest.fn();
  const mockOnMessageCopy = jest.fn();

  const sampleMessages: Message[] = [
    {
      id: "1",
      content: "Hello, I have a tax question",
      isUser: true,
      timestamp: new Date("2024-01-01T12:00:00Z"),
    },
    {
      id: "2",
      content: "I'd be happy to help with your tax question. What specific area would you like to discuss?",
      isUser: false,
      timestamp: new Date("2024-01-01T12:01:00Z"),
      citations: [
        { text: "IRC Section 162", url: "https://www.irs.gov/pub/irs-pdf/p535.pdf" }
      ],
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders empty state when no messages", () => {
    render(
      <ChatContainer
        messages={[]}
        onSendMessage={mockOnSendMessage}
      />
    );

    expect(screen.getByText("Start a conversation")).toBeInTheDocument();
    expect(screen.getByText("Ask questions about tax law, document analysis, or get research assistance")).toBeInTheDocument();
  });

  it("renders messages when provided", () => {
    render(
      <ChatContainer
        messages={sampleMessages}
        onSendMessage={mockOnSendMessage}
      />
    );

    expect(screen.getByText("Hello, I have a tax question")).toBeInTheDocument();
    expect(screen.getByText("I'd be happy to help with your tax question. What specific area would you like to discuss?")).toBeInTheDocument();
  });

  it("renders chat input at the bottom", () => {
    render(
      <ChatContainer
        messages={sampleMessages}
        onSendMessage={mockOnSendMessage}
      />
    );

    const textInput = screen.getByRole("textbox");
    expect(textInput).toBeInTheDocument();
    
    const sendButton = screen.getByRole("button", { name: /send message/i });
    expect(sendButton).toBeInTheDocument();
  });

  it("calls onSendMessage when message is sent", async () => {
    const user = userEvent.setup();
    render(
      <ChatContainer
        messages={[]}
        onSendMessage={mockOnSendMessage}
      />
    );

    const textInput = screen.getByRole("textbox");
    await user.type(textInput, "Test message");
    await user.keyboard("{Enter}");

    expect(mockOnSendMessage).toHaveBeenCalledWith("Test message");
  });

  it("shows stop button when streaming", () => {
    render(
      <ChatContainer
        messages={sampleMessages}
        onSendMessage={mockOnSendMessage}
        onStopStreaming={mockOnStopStreaming}
        isStreaming={true}
      />
    );

    const stopButton = screen.getByRole("button", { name: /stop streaming response/i });
    expect(stopButton).toBeInTheDocument();
  });

  it("calls onStopStreaming when stop button is clicked", async () => {
    const user = userEvent.setup();
    render(
      <ChatContainer
        messages={sampleMessages}
        onSendMessage={mockOnSendMessage}
        onStopStreaming={mockOnStopStreaming}
        isStreaming={true}
      />
    );

    const stopButton = screen.getByRole("button", { name: /stop streaming response/i });
    await user.click(stopButton);

    expect(mockOnStopStreaming).toHaveBeenCalled();
  });

  it("calls onMessageFeedback when feedback is given", async () => {
    const user = userEvent.setup();
    render(
      <ChatContainer
        messages={sampleMessages}
        onSendMessage={mockOnSendMessage}
        onMessageFeedback={mockOnMessageFeedback}
      />
    );

    // Find thumbs up button for AI message
    const thumbsUpButtons = screen.getAllByRole("button", { name: /thumbs up/i });
    await user.click(thumbsUpButtons[0]);

    expect(mockOnMessageFeedback).toHaveBeenCalledWith("2", "up");
  });

  it("calls onMessageCopy when copy is clicked", async () => {
    // Mock clipboard API
    Object.assign(navigator, {
      clipboard: {
        writeText: jest.fn(() => Promise.resolve()),
      },
    });

    const user = userEvent.setup();
    render(
      <ChatContainer
        messages={sampleMessages}
        onSendMessage={mockOnSendMessage}
        onMessageCopy={mockOnMessageCopy}
      />
    );

    const copyButton = screen.getByRole("button", { name: /copy message/i });
    await user.click(copyButton);

    expect(mockOnMessageCopy).toHaveBeenCalledWith("2");
  });

  it("disables input when disabled prop is true", () => {
    render(
      <ChatContainer
        messages={[]}
        onSendMessage={mockOnSendMessage}
        disabled={true}
      />
    );

    const textInput = screen.getByRole("textbox");
    expect(textInput).toBeDisabled();
  });

  it("does not send message when disabled", async () => {
    const user = userEvent.setup();
    render(
      <ChatContainer
        messages={[]}
        onSendMessage={mockOnSendMessage}
        disabled={true}
      />
    );

    const textInput = screen.getByRole("textbox");
    await user.type(textInput, "Test message");
    await user.keyboard("{Enter}");

    expect(mockOnSendMessage).not.toHaveBeenCalled();
  });

  it("uses custom placeholder when provided", () => {
    const customPlaceholder = "Ask your tax question here...";
    render(
      <ChatContainer
        messages={[]}
        onSendMessage={mockOnSendMessage}
        placeholder={customPlaceholder}
      />
    );

    const textInput = screen.getByRole("textbox");
    expect(textInput).toHaveAttribute("placeholder", customPlaceholder);
  });

  it("scrolls to bottom when new messages are added", async () => {
    const scrollIntoViewMock = jest.fn();
    global.HTMLElement.prototype.scrollIntoView = scrollIntoViewMock;

    const { rerender } = render(
      <ChatContainer
        messages={[sampleMessages[0]]}
        onSendMessage={mockOnSendMessage}
      />
    );

    // Add a new message
    rerender(
      <ChatContainer
        messages={sampleMessages}
        onSendMessage={mockOnSendMessage}
      />
    );

    await waitFor(() => {
      expect(scrollIntoViewMock).toHaveBeenCalledWith({
        behavior: "smooth",
        block: "nearest"
      });
    });
  });

  it("handles streaming messages correctly", () => {
    const streamingMessages: Message[] = [
      ...sampleMessages,
      {
        id: "3",
        content: "This message is currently being streamed...",
        isUser: false,
        timestamp: new Date("2024-01-01T12:02:00Z"),
        isStreaming: true,
      }
    ];

    render(
      <ChatContainer
        messages={streamingMessages}
        onSendMessage={mockOnSendMessage}
        isStreaming={true}
      />
    );

    // Check that streaming message is rendered
    expect(screen.getByText("This message is currently being streamed...")).toBeInTheDocument();
    
    // Check that stop button is shown
    expect(screen.getByRole("button", { name: /stop streaming response/i })).toBeInTheDocument();
  });

  it("shows citations for messages that have them", () => {
    render(
      <ChatContainer
        messages={sampleMessages}
        onSendMessage={mockOnSendMessage}
      />
    );

    expect(screen.getByText("Sources:")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "IRC Section 162" })).toBeInTheDocument();
  });

  it("maintains message order", () => {
    const manyMessages: Message[] = [
      { id: "1", content: "First message", isUser: true, timestamp: new Date("2024-01-01T12:00:00Z") },
      { id: "2", content: "Second message", isUser: false, timestamp: new Date("2024-01-01T12:01:00Z") },
      { id: "3", content: "Third message", isUser: true, timestamp: new Date("2024-01-01T12:02:00Z") },
      { id: "4", content: "Fourth message", isUser: false, timestamp: new Date("2024-01-01T12:03:00Z") },
    ];

    render(
      <ChatContainer
        messages={manyMessages}
        onSendMessage={mockOnSendMessage}
      />
    );

    const messages = screen.getAllByText(/message/);
    expect(messages[0]).toHaveTextContent("First message");
    expect(messages[1]).toHaveTextContent("Second message");
    expect(messages[2]).toHaveTextContent("Third message");
    expect(messages[3]).toHaveTextContent("Fourth message");
  });

  it("handles messages with feedback values", () => {
    const messagesWithFeedback: Message[] = [
      {
        id: "1",
        content: "AI message with positive feedback",
        isUser: false,
        timestamp: new Date("2024-01-01T12:00:00Z"),
        feedback: "up",
      },
      {
        id: "2", 
        content: "AI message with negative feedback",
        isUser: false,
        timestamp: new Date("2024-01-01T12:01:00Z"),
        feedback: "down",
      }
    ];

    render(
      <ChatContainer
        messages={messagesWithFeedback}
        onSendMessage={mockOnSendMessage}
        onMessageFeedback={mockOnMessageFeedback}
      />
    );

    const thumbsUpButtons = screen.getAllByRole("button", { name: /thumbs up/i });
    const thumbsDownButtons = screen.getAllByRole("button", { name: /thumbs down/i });

    // First message should have thumbs up highlighted
    expect(thumbsUpButtons[0]).toHaveClass("text-green-600");
    
    // Second message should have thumbs down highlighted
    expect(thumbsDownButtons[1]).toHaveClass("text-red-600");
  });
});