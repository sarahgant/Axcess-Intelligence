import { logger } from '../core/logging/logger';
import type { IAIService } from './interfaces/IAIService';
import { AIService } from './implementations/AIService';

export interface ServiceConfig {
  aiService?: {
    provider?: string;
    timeout?: number;
    retryAttempts?: number;
  };
}

export class ServiceFactory {
  private static instance: ServiceFactory;
  private services: Map<string, any> = new Map();
  private logger = logger.component('ServiceFactory');

  private constructor() {}

  static getInstance(): ServiceFactory {
    if (!ServiceFactory.instance) {
      ServiceFactory.instance = new ServiceFactory();
    }
    return ServiceFactory.instance;
  }

  /**
   * Get or create an AI service instance
   */
  getAIService(config?: ServiceConfig['aiService']): IAIService {
    const serviceKey = 'ai-service';
    
    if (!this.services.has(serviceKey)) {
      this.logger.info('Creating new AI service instance');
      const aiService = new AIService();
      
      // Apply configuration if provided
      if (config?.provider) {
        aiService.selectProvider(config.provider).catch(error => {
          this.logger.warn('Failed to set default provider', { 
            provider: config.provider, 
            error: String(error) 
          });
        });
      }
      
      this.services.set(serviceKey, aiService);
    }

    return this.services.get(serviceKey);
  }

  /**
   * Reset all services (useful for testing)
   */
  reset(): void {
    this.logger.info('Resetting all services');
    this.services.clear();
  }

  /**
   * Get service statistics
   */
  getServiceStats(): Record<string, any> {
    return {
      totalServices: this.services.size,
      services: Array.from(this.services.keys()),
      factoryInstance: this === ServiceFactory.instance
    };
  }
}

// Export singleton instance
export const serviceFactory = ServiceFactory.getInstance();
