/**
 * Chat Feature Types
 */

export interface ChatMessage {
    id: string;
    content: string;
    type: MessageType;
    timestamp: number;
    sender: 'user' | 'assistant' | 'system';
    metadata?: MessageMetadata;
}

export interface MessageMetadata {
    provider?: 'anthropic' | 'openai';
    model?: string;
    tokens?: number;
    processingTime?: number;
    error?: string;
}

export type MessageType = 'text' | 'document' | 'system' | 'error';

export interface ChatSession {
    id: string;
    title: string;
    messages: ChatMessage[];
    createdAt: number;
    updatedAt: number;
    settings: ChatSettings;
}

export interface ChatSettings {
    provider: 'anthropic' | 'openai';
    model: string;
    temperature: number;
    maxTokens: number;
    enableStreaming: boolean;
}

export interface ChatProvider {
    id: string;
    name: string;
    models: string[];
    available: boolean;
    configuration: Record<string, any>;
}

export interface ChatState {
    currentSession: ChatSession | null;
    sessions: ChatSession[];
    isLoading: boolean;
    isConnected: boolean;
    error: string | null;
    messageQueue: ChatMessage[];
}

export interface SendMessageOptions {
    provider?: 'anthropic' | 'openai';
    model?: string;
    stream?: boolean;
    context?: string;
}

export interface ChatResponse {
    message: ChatMessage;
    usage?: {
        promptTokens: number;
        completionTokens: number;
        totalTokens: number;
    };
    provider: string;
    model: string;
}