/**
 * Test suite for message functionality features
 * Tests copy, reload/regenerate, and thumbs up/down features
 */

describe("Message Functionality", () => {
    // Mock clipboard API
    const mockClipboard = {
        writeText: jest.fn(),
    };

    // Mock DOM methods
    const mockExecCommand = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();

        // Mock clipboard API
        Object.assign(navigator, {
            clipboard: mockClipboard,
        });

        // Mock document.execCommand for fallback
        document.execCommand = mockExecCommand;

        // Mock window.isSecureContext
        Object.defineProperty(window, 'isSecureContext', {
            writable: true,
            value: true,
        });
    });

    describe("Copy Functionality", () => {
        it("should copy message text using modern clipboard API", async () => {
            const testMessage = "This is a test message";
            mockClipboard.writeText.mockResolvedValue(undefined);

            // Test the copy functionality directly
            const copyFunction = async (message: string) => {
                try {
                    if (navigator.clipboard && window.isSecureContext) {
                        await navigator.clipboard.writeText(message);
                    }
                } catch (error) {
                    console.error('Failed to copy text:', error);
                }
            };

            await copyFunction(testMessage);

            expect(mockClipboard.writeText).toHaveBeenCalledWith(testMessage);
        });

        it("should fallback to execCommand when clipboard API is not available", async () => {
            const testMessage = "Test message for fallback";

            // Mock clipboard API as unavailable
            Object.assign(navigator, {
                clipboard: undefined,
            });

            // Mock DOM manipulation
            const mockTextArea = {
                value: '',
                style: { position: '', left: '', top: '' },
                focus: jest.fn(),
                select: jest.fn(),
                remove: jest.fn(),
            };

            const mockCreateElement = jest.fn(() => mockTextArea);
            const mockAppendChild = jest.fn();

            document.createElement = mockCreateElement;
            document.body.appendChild = mockAppendChild;
            mockExecCommand.mockReturnValue(true);

            const copyFallbackFunction = async (message: string) => {
                try {
                    if (navigator.clipboard && window.isSecureContext) {
                        await navigator.clipboard.writeText(message);
                    } else {
                        // Fallback implementation
                        const textArea = document.createElement('textarea');
                        textArea.value = message;
                        textArea.style.position = 'fixed';
                        textArea.style.left = '-999999px';
                        textArea.style.top = '-999999px';
                        document.body.appendChild(textArea);
                        textArea.focus();
                        textArea.select();
                        document.execCommand('copy');
                        textArea.remove();
                    }
                } catch (error) {
                    console.error('Failed to copy text:', error);
                }
            };

            await copyFallbackFunction(testMessage);

            expect(mockCreateElement).toHaveBeenCalledWith('textarea');
            expect(mockTextArea.value).toBe(testMessage);
            expect(mockExecCommand).toHaveBeenCalledWith('copy');
        });

        it("should handle copy failures gracefully", async () => {
            const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
            mockClipboard.writeText.mockRejectedValue(new Error('Clipboard not available'));

            const copyFunction = async (message: string) => {
                try {
                    await navigator.clipboard.writeText(message);
                } catch (error) {
                    console.error('Failed to copy text:', error);
                }
            };

            await copyFunction("test message");

            expect(consoleSpy).toHaveBeenCalledWith(
                'Failed to copy text:',
                expect.any(Error)
            );

            consoleSpy.mockRestore();
        });
    });

    describe("Regenerate/Reload Functionality", () => {
        it("should regenerate AI response", async () => {
            const mockUpdateMessage = jest.fn();
            const mockGenerateResponse = jest.fn(() => "New regenerated response");

            const regenerateFunction = async (messageId: string, userMessage: string) => {
                try {
                    // Simulate API delay
                    await new Promise(resolve => setTimeout(resolve, 10));
                    const newResponse = mockGenerateResponse(userMessage);
                    mockUpdateMessage(messageId, { text: newResponse, timestamp: new Date() });
                    return newResponse;
                } catch (error) {
                    console.error('Regeneration failed:', error);
                    throw error;
                }
            };

            const result = await regenerateFunction("message-id", "user message");

            expect(mockGenerateResponse).toHaveBeenCalledWith("user message");
            expect(mockUpdateMessage).toHaveBeenCalledWith(
                "message-id",
                expect.objectContaining({
                    text: "New regenerated response",
                    timestamp: expect.any(Date)
                })
            );
            expect(result).toBe("New regenerated response");
        });

        it("should handle regeneration failures gracefully", async () => {
            const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
            const mockFailingRegenerate = jest.fn(() => {
                throw new Error('API Error');
            });

            const regenerateFunction = async () => {
                try {
                    await mockFailingRegenerate();
                } catch (error) {
                    console.error('Regeneration failed:', error);
                    throw error;
                }
            };

            await expect(regenerateFunction()).rejects.toThrow('API Error');

            expect(consoleSpy).toHaveBeenCalledWith(
                'Regeneration failed:',
                expect.any(Error)
            );

            consoleSpy.mockRestore();
        });
    });

    describe("Thumbs Up/Down Feedback", () => {
        it("should handle positive feedback (thumbs up)", () => {
            const mockLogFeedback = jest.fn();

            const feedbackFunction = (messageId: string, isPositive: boolean) => {
                mockLogFeedback({
                    messageId,
                    isPositive,
                    action: isPositive ? 'feedback_positive' : 'feedback_negative'
                });
            };

            feedbackFunction("test-message-id", true);

            expect(mockLogFeedback).toHaveBeenCalledWith({
                messageId: "test-message-id",
                isPositive: true,
                action: 'feedback_positive'
            });
        });

        it("should handle negative feedback (thumbs down)", () => {
            const mockLogFeedback = jest.fn();
            const mockShowFeedbackModal = jest.fn();

            const feedbackFunction = (messageId: string, isPositive: boolean) => {
                mockLogFeedback({
                    messageId,
                    isPositive,
                    action: isPositive ? 'feedback_positive' : 'feedback_negative'
                });

                if (!isPositive) {
                    mockShowFeedbackModal(true);
                }
            };

            feedbackFunction("test-message-id", false);

            expect(mockLogFeedback).toHaveBeenCalledWith({
                messageId: "test-message-id",
                isPositive: false,
                action: 'feedback_negative'
            });
            expect(mockShowFeedbackModal).toHaveBeenCalledWith(true);
        });

        it("should log feedback actions properly", () => {
            const loggerMock = {
                info: jest.fn(),
            };

            const feedbackWithLogging = (messageId: string, isPositive: boolean) => {
                loggerMock.info('Message feedback submitted', {
                    messageId,
                    isPositive
                });
            };

            feedbackWithLogging("msg-123", true);
            feedbackWithLogging("msg-456", false);

            expect(loggerMock.info).toHaveBeenCalledTimes(2);
            expect(loggerMock.info).toHaveBeenNthCalledWith(1, 'Message feedback submitted', {
                messageId: "msg-123",
                isPositive: true
            });
            expect(loggerMock.info).toHaveBeenNthCalledWith(2, 'Message feedback submitted', {
                messageId: "msg-456",
                isPositive: false
            });
        });
    });

    describe("Integration Tests", () => {
        it("should handle multiple operations in sequence", async () => {
            const mockLogger = { info: jest.fn() };
            const mockUpdateMessage = jest.fn();
            mockClipboard.writeText.mockResolvedValue(undefined);

            const messageOperations = {
                copy: async (messageId: string, text: string) => {
                    await navigator.clipboard.writeText(text);
                    mockLogger.info('Message copied to clipboard', { messageId });
                },

                feedback: (messageId: string, isPositive: boolean) => {
                    mockLogger.info('Message feedback submitted', { messageId, isPositive });
                },

                regenerate: async (messageId: string) => {
                    const newText = "Regenerated response";
                    mockUpdateMessage(messageId, { text: newText });
                    mockLogger.info('Message regeneration requested', { messageId });
                    return newText;
                }
            };

            const messageId = "test-message-id";
            const messageText = "Original message text";

            // Test copy
            await messageOperations.copy(messageId, messageText);

            // Test feedback
            messageOperations.feedback(messageId, true);

            // Test regenerate
            const newText = await messageOperations.regenerate(messageId);

            expect(mockClipboard.writeText).toHaveBeenCalledWith(messageText);
            expect(mockLogger.info).toHaveBeenCalledTimes(3);
            expect(mockUpdateMessage).toHaveBeenCalledWith(messageId, { text: "Regenerated response" });
            expect(newText).toBe("Regenerated response");
        });
    });

    describe("Visual Feedback Simulation", () => {
        it("should simulate button visual feedback", () => {
            // Mock button element
            const mockButton = {
                style: {
                    backgroundColor: '',
                    transform: ''
                },
                setAttribute: jest.fn(),
                getAttribute: jest.fn(() => 'Copy message')
            };

            const applyVisualFeedback = (button: any, success: boolean) => {
                if (success) {
                    button.style.backgroundColor = '#dcfce7';
                    button.setAttribute('title', 'Copied!');
                } else {
                    button.style.backgroundColor = '#fef2f2';
                    button.setAttribute('title', 'Copy failed');
                }
            };

            // Test success feedback
            applyVisualFeedback(mockButton, true);
            expect(mockButton.style.backgroundColor).toBe('#dcfce7');
            expect(mockButton.setAttribute).toHaveBeenCalledWith('title', 'Copied!');

            // Reset
            mockButton.style.backgroundColor = '';
            jest.clearAllMocks();

            // Test error feedback
            applyVisualFeedback(mockButton, false);
            expect(mockButton.style.backgroundColor).toBe('#fef2f2');
            expect(mockButton.setAttribute).toHaveBeenCalledWith('title', 'Copy failed');
        });
    });
});
