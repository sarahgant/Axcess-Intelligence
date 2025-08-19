import { StreamingCallbacks } from '../api-client';

export interface AIProvider {
  id: string;
  name: string;
  isAvailable: boolean;
  capabilities: string[];
}

export interface ChatMessage {
  message: string;
  conversationId?: string;
  provider: 'anthropic' | 'openai';
  systemPrompt?: string;
  documents?: Array<{
    id: string;
    name: string;
    type: string;
    content: string;
  }>;
  options?: {
    temperature?: number;
    maxTokens?: number;
  };
}

export interface ChatResponse {
  id: string;
  text: string;
  provider: string;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
  timestamp: Date;
}

export interface HealthCheckResult {
  status: 'healthy' | 'unhealthy' | 'degraded';
  message?: string;
  timestamp: Date;
}

export interface IAIService {
  // Health and status
  checkHealth(): Promise<HealthCheckResult>;
  getAvailableProviders(): Promise<AIProvider[]>;

  // Chat functionality
  sendMessage(message: ChatMessage): Promise<ChatResponse>;
  sendStreamingMessage(message: ChatMessage, callbacks: StreamingCallbacks): Promise<void>;

  // Provider management
  selectProvider(providerId: string): Promise<void>;
  getSelectedProvider(): string | null;

  // Error handling
  isRetryableError(error: Error): boolean;
  getFallbackResponse(message: ChatMessage): ChatResponse;
}
