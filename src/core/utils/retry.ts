import { logger } from '../logging/logger';

/**
 * Retry configuration interface
 */
interface RetryConfig {
  maxAttempts: number;
  initialDelay: number;
  maxDelay: number;
  backoffMultiplier: number;
  retryableErrors?: string[];
  jitterRange?: number;
}

/**
 * Retry attempt context interface
 */
interface RetryContext {
  attempt: number;
  maxAttempts: number;
  delay: number;
  error?: Error;
  context?: string;
}

/**
 * Retry result interface
 */
interface RetryResult<T> {
  success: boolean;
  data?: T;
  error?: Error;
  attempts: number;
  totalTime: number;
}

/**
 * Retry with exponential backoff implementation
 */
export class RetryWithBackoff {
  private config: RetryConfig = {
    maxAttempts: 3,
    initialDelay: 1000,
    maxDelay: 10000,
    backoffMultiplier: 2,
    retryableErrors: ['NETWORK_ERROR', 'TIMEOUT', '503', '429', '502', '504'],
    jitterRange: 1000
  };

  constructor(config?: Partial<RetryConfig>) {
    this.config = { ...this.config, ...config };
  }

  /**
   * Execute a function with retry logic
   */
  async execute<T>(
    fn: () => Promise<T>,
    context?: string
  ): Promise<T> {
    const startTime = Date.now();
    let lastError: Error;
    
    for (let attempt = 1; attempt <= this.config.maxAttempts; attempt++) {
      try {
        logger.debug(`Retry attempt ${attempt}/${this.config.maxAttempts}`, { 
          context,
          attempt,
          maxAttempts: this.config.maxAttempts
        });
        
        const result = await fn();
        
        // Log successful attempt
        if (attempt > 1) {
          logger.info(`Retry succeeded on attempt ${attempt}`, {
            context,
            attempts: attempt,
            totalTime: Date.now() - startTime
          });
        }
        
        return result;
      } catch (error) {
        lastError = error as Error;
        
        if (!this.isRetryable(error) || attempt === this.config.maxAttempts) {
          logger.error('Non-retryable error or max attempts reached', {
            error: lastError.message,
            errorCode: this.getErrorCode(error),
            attempt,
            maxAttempts: this.config.maxAttempts,
            context,
            totalTime: Date.now() - startTime
          });
          throw error;
        }

        const delay = this.calculateDelay(attempt);
        logger.warn(`Retrying after ${delay}ms`, {
          error: lastError.message,
          errorCode: this.getErrorCode(error),
          attempt,
          nextAttempt: attempt + 1,
          delay,
          context
        });
        
        await this.sleep(delay);
      }
    }
    
    throw lastError!;
  }

  /**
   * Execute with detailed result information
   */
  async executeWithResult<T>(
    fn: () => Promise<T>,
    context?: string
  ): Promise<RetryResult<T>> {
    const startTime = Date.now();
    let lastError: Error;
    
    for (let attempt = 1; attempt <= this.config.maxAttempts; attempt++) {
      try {
        const result = await fn();
        
        return {
          success: true,
          data: result,
          attempts: attempt,
          totalTime: Date.now() - startTime
        };
      } catch (error) {
        lastError = error as Error;
        
        if (!this.isRetryable(error) || attempt === this.config.maxAttempts) {
          return {
            success: false,
            error: lastError,
            attempts: attempt,
            totalTime: Date.now() - startTime
          };
        }

        const delay = this.calculateDelay(attempt);
        await this.sleep(delay);
      }
    }
    
    return {
      success: false,
      error: lastError!,
      attempts: this.config.maxAttempts,
      totalTime: Date.now() - startTime
    };
  }

  /**
   * Check if an error is retryable
   */
  private isRetryable(error: unknown): boolean {
    const errorMessage = this.getErrorMessage(error);
    const errorCode = this.getErrorCode(error);
    
    // Check if error message contains retryable patterns
    const isRetryableMessage = this.config.retryableErrors!.some(
      retryableError => errorMessage.includes(retryableError)
    );
    
    // Check if error code is retryable
    const isRetryableCode = this.config.retryableErrors!.some(
      retryableError => errorCode.includes(retryableError)
    );
    
    return isRetryableMessage || isRetryableCode;
  }

  /**
   * Calculate delay with exponential backoff and jitter
   */
  private calculateDelay(attempt: number): number {
    const baseDelay = Math.min(
      this.config.initialDelay * Math.pow(this.config.backoffMultiplier, attempt - 1),
      this.config.maxDelay
    );
    
    // Add jitter to prevent thundering herd
    const jitter = Math.random() * (this.config.jitterRange || 1000);
    
    return Math.floor(baseDelay + jitter);
  }

  /**
   * Sleep for specified milliseconds
   */
  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Extract error message from various error types
   */
  private getErrorMessage(error: unknown): string {
    if (error instanceof Error) {
      return error.message;
    }
    if (typeof error === 'string') {
      return error;
    }
    if (error && typeof error === 'object' && 'message' in error) {
      return String(error.message);
    }
    return 'Unknown error';
  }

  /**
   * Extract error code from various error types
   */
  private getErrorCode(error: unknown): string {
    if (error && typeof error === 'object') {
      if ('code' in error) {
        return String(error.code);
      }
      if ('status' in error) {
        return String(error.status);
      }
      if ('statusCode' in error) {
        return String(error.statusCode);
      }
    }
    return '';
  }

  /**
   * Get current retry configuration
   */
  getConfig(): RetryConfig {
    return { ...this.config };
  }

  /**
   * Update retry configuration
   */
  updateConfig(config: Partial<RetryConfig>): void {
    this.config = { ...this.config, ...config };
  }
}

/**
 * Default retry instance for common use cases
 */
export const defaultRetry = new RetryWithBackoff();

/**
 * Quick retry utility for simple operations
 */
export const quickRetry = new RetryWithBackoff({
  maxAttempts: 2,
  initialDelay: 500,
  maxDelay: 2000
});

/**
 * Aggressive retry utility for critical operations
 */
export const aggressiveRetry = new RetryWithBackoff({
  maxAttempts: 5,
  initialDelay: 2000,
  maxDelay: 30000,
  backoffMultiplier: 1.5
});
