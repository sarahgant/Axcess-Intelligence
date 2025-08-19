import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ChatInput } from "../../src/components/ui/chat-input";

describe("ChatInput", () => {
  const mockOnSend = jest.fn();
  const mockOnStop = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders chat input with correct placeholder", () => {
    render(<ChatInput onSend={mockOnSend} />);

    const textarea = screen.getByRole("textbox");
    expect(textarea).toBeInTheDocument();
    expect(textarea).toHaveAttribute(
      "placeholder",
      "Type your message... (Enter to send, Shift+Enter for new line)"
    );
  });

  it("displays send button when not streaming", () => {
    render(<ChatInput onSend={mockOnSend} isStreaming={false} />);

    const sendButton = screen.getByRole("button", { name: /send message/i });
    expect(sendButton).toBeInTheDocument();
    expect(sendButton).toHaveTextContent("Send");
  });

  it("displays stop button when streaming", () => {
    render(<ChatInput onSend={mockOnSend} onStop={mockOnStop} isStreaming={true} />);

    const stopButton = screen.getByRole("button", { name: /stop streaming response/i });
    expect(stopButton).toBeInTheDocument();
    expect(stopButton).toHaveTextContent("Stop");
  });

  it("sends message on Enter key press", async () => {
    const user = userEvent.setup();
    render(<ChatInput onSend={mockOnSend} />);

    const textarea = screen.getByRole("textbox");
    await user.type(textarea, "Test message");
    await user.keyboard("{Enter}");

    expect(mockOnSend).toHaveBeenCalledWith("Test message");
  });

  it("adds new line on Shift+Enter", async () => {
    const user = userEvent.setup();
    render(<ChatInput onSend={mockOnSend} />);

    const textarea = screen.getByRole("textbox");
    await user.type(textarea, "Line 1");
    await user.keyboard("{Shift>}{Enter}{/Shift}");
    await user.type(textarea, "Line 2");

    expect(textarea).toHaveValue("Line 1\nLine 2");
    expect(mockOnSend).not.toHaveBeenCalled();
  });

  it("sends message on button click", async () => {
    const user = userEvent.setup();
    render(<ChatInput onSend={mockOnSend} />);

    const textarea = screen.getByRole("textbox");
    const sendButton = screen.getByRole("button", { name: /send message/i });

    await user.type(textarea, "Test message");
    await user.click(sendButton);

    expect(mockOnSend).toHaveBeenCalledWith("Test message");
  });

  it("clears input after sending message", async () => {
    const user = userEvent.setup();
    render(<ChatInput onSend={mockOnSend} />);

    const textarea = screen.getByRole("textbox");
    await user.type(textarea, "Test message");
    await user.keyboard("{Enter}");

    expect(textarea).toHaveValue("");
  });

  it("disables send button for empty input", () => {
    render(<ChatInput onSend={mockOnSend} />);

    const sendButton = screen.getByRole("button", { name: /send message/i });
    expect(sendButton).toBeDisabled();
  });

  it("disables send button for whitespace-only input", async () => {
    const user = userEvent.setup();
    render(<ChatInput onSend={mockOnSend} />);

    const textarea = screen.getByRole("textbox");
    const sendButton = screen.getByRole("button", { name: /send message/i });

    await user.type(textarea, "   ");
    expect(sendButton).toBeDisabled();
  });

  it("enables send button for valid input", async () => {
    const user = userEvent.setup();
    render(<ChatInput onSend={mockOnSend} />);

    const textarea = screen.getByRole("textbox");
    const sendButton = screen.getByRole("button", { name: /send message/i });

    await user.type(textarea, "Valid message");
    expect(sendButton).not.toBeDisabled();
  });

  it("calls onStop when stop button is clicked", async () => {
    const user = userEvent.setup();
    render(<ChatInput onSend={mockOnSend} onStop={mockOnStop} isStreaming={true} />);

    const stopButton = screen.getByRole("button", { name: /stop streaming response/i });
    await user.click(stopButton);

    expect(mockOnStop).toHaveBeenCalled();
  });

  it("auto-resizes textarea as content grows", async () => {
    const user = userEvent.setup();
    render(<ChatInput onSend={mockOnSend} maxLines={5} />);

    const textarea = screen.getByRole("textbox");
    const initialHeight = textarea.getBoundingClientRect().height;

    // Add multiple lines
    await user.type(textarea, "Line 1\nLine 2\nLine 3\nLine 4");

    // Wait for height adjustment
    await waitFor(() => {
      const newHeight = textarea.getBoundingClientRect().height;
      expect(newHeight).toBeGreaterThan(initialHeight);
    });
  });

  it("does not send empty messages", async () => {
    const user = userEvent.setup();
    render(<ChatInput onSend={mockOnSend} />);

    const textarea = screen.getByRole("textbox");
    await user.keyboard("{Enter}");

    expect(mockOnSend).not.toHaveBeenCalled();
  });

  it("trims whitespace from messages before sending", async () => {
    const user = userEvent.setup();
    render(<ChatInput onSend={mockOnSend} />);

    const textarea = screen.getByRole("textbox");
    await user.type(textarea, "  Test message  ");
    await user.keyboard("{Enter}");

    expect(mockOnSend).toHaveBeenCalledWith("Test message");
  });

  it("prevents sending when streaming", async () => {
    const user = userEvent.setup();
    render(<ChatInput onSend={mockOnSend} isStreaming={true} />);

    const textarea = screen.getByRole("textbox");
    await user.type(textarea, "Test message");
    await user.keyboard("{Enter}");

    expect(mockOnSend).not.toHaveBeenCalled();
  });

  it("maintains focus after sending message", async () => {
    const user = userEvent.setup();
    render(<ChatInput onSend={mockOnSend} />);

    const textarea = screen.getByRole("textbox");
    await user.type(textarea, "Test message");
    await user.keyboard("{Enter}");

    await waitFor(() => {
      expect(textarea).toHaveFocus();
    });
  });
});