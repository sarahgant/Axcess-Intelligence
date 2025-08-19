// Service interfaces
export type { 
  IAIService, 
  AIProvider, 
  ChatMessage, 
  ChatResponse, 
  HealthCheckResult 
} from './interfaces/IAIService';

// Service implementations
export { AIService } from './implementations/AIService';

// Service factory
export { ServiceFactory, serviceFactory } from './ServiceFactory';
export type { ServiceConfig } from './ServiceFactory';

// API client (for backward compatibility)
export { default as APIClient } from './api-client';
export type { StreamingCallbacks } from './api-client';
