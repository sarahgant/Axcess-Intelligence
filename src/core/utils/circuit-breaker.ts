import { logger } from '../logging/logger';

/**
 * Circuit breaker states
 */
enum CircuitState {
  CLOSED = 'CLOSED',
  OPEN = 'OPEN',
  HALF_OPEN = 'HALF_OPEN'
}

/**
 * Circuit breaker configuration interface
 */
interface CircuitBreakerConfig {
  failureThreshold: number;
  resetTimeout: number;
  monitoringPeriod: number;
  successThreshold: number;
  volumeThreshold: number;
}

/**
 * Circuit breaker metrics interface
 */
interface CircuitBreakerMetrics {
  totalRequests: number;
  successfulRequests: number;
  failedRequests: number;
  lastFailureTime?: Date;
  lastSuccessTime?: Date;
  currentState: CircuitState;
  failureRate: number;
}

/**
 * Circuit breaker result interface
 */
interface CircuitBreakerResult<T> {
  success: boolean;
  data?: T;
  error?: Error;
  usedFallback: boolean;
  circuitState: CircuitState;
}

/**
 * Circuit breaker implementation with failure detection and automatic recovery
 */
export class CircuitBreaker {
  private state: CircuitState = CircuitState.CLOSED;
  private failureCount: number = 0;
  private successCount: number = 0;
  private totalRequests: number = 0;
  private nextAttempt: number = Date.now();
  private lastFailureTime?: Date;
  private lastSuccessTime?: Date;
  private config: CircuitBreakerConfig = {
    failureThreshold: 5,
    resetTimeout: 60000, // 1 minute
    monitoringPeriod: 10000, // 10 seconds
    successThreshold: 2,
    volumeThreshold: 10
  };

  constructor(config?: Partial<CircuitBreakerConfig>) {
    this.config = { ...this.config, ...config };
  }

  /**
   * Execute a function with circuit breaker protection
   */
  async execute<T>(
    fn: () => Promise<T>,
    fallback?: () => T | Promise<T>,
    context?: string
  ): Promise<T> {
    this.totalRequests++;

    if (this.state === CircuitState.OPEN) {
      if (Date.now() < this.nextAttempt) {
        logger.warn('Circuit breaker is OPEN, using fallback', {
          context,
          nextAttempt: new Date(this.nextAttempt).toISOString(),
          failureCount: this.failureCount
        });
        
        if (fallback) {
          try {
            const fallbackResult = await fallback();
            logger.info('Fallback executed successfully', { context });
            return fallbackResult;
          } catch (fallbackError) {
            logger.error('Fallback also failed', {
              context,
              error: fallbackError instanceof Error ? fallbackError.message : String(fallbackError)
            });
            throw fallbackError;
          }
        }
        throw new Error(`Circuit breaker is OPEN - service unavailable until ${new Date(this.nextAttempt).toISOString()}`);
      }
      
      this.state = CircuitState.HALF_OPEN;
      logger.info('Circuit breaker transitioning to HALF_OPEN', {
        context,
        failureCount: this.failureCount
      });
    }

    try {
      const result = await fn();
      this.onSuccess(context);
      return result;
    } catch (error) {
      this.onFailure(error, context);
      throw error;
    }
  }

  /**
   * Execute with detailed result information
   */
  async executeWithResult<T>(
    fn: () => Promise<T>,
    fallback?: () => T | Promise<T>,
    context?: string
  ): Promise<CircuitBreakerResult<T>> {
    this.totalRequests++;

    if (this.state === CircuitState.OPEN) {
      if (Date.now() < this.nextAttempt) {
        logger.warn('Circuit breaker is OPEN, using fallback', {
          context,
          nextAttempt: new Date(this.nextAttempt).toISOString()
        });
        
        if (fallback) {
          try {
            const fallbackResult = await fallback();
            return {
              success: true,
              data: fallbackResult,
              usedFallback: true,
              circuitState: this.state
            };
          } catch (fallbackError) {
            return {
              success: false,
              error: fallbackError instanceof Error ? fallbackError : new Error(String(fallbackError)),
              usedFallback: true,
              circuitState: this.state
            };
          }
        }
        
        return {
          success: false,
          error: new Error(`Circuit breaker is OPEN - service unavailable until ${new Date(this.nextAttempt).toISOString()}`),
          usedFallback: false,
          circuitState: this.state
        };
      }
      
      this.state = CircuitState.HALF_OPEN;
      logger.info('Circuit breaker transitioning to HALF_OPEN', { context });
    }

    try {
      const result = await fn();
      this.onSuccess(context);
      return {
        success: true,
        data: result,
        usedFallback: false,
        circuitState: this.state
      };
    } catch (error) {
      this.onFailure(error, context);
      return {
        success: false,
        error: error instanceof Error ? error : new Error(String(error)),
        usedFallback: false,
        circuitState: this.state
      };
    }
  }

  /**
   * Handle successful execution
   */
  private onSuccess(context?: string): void {
    this.failureCount = 0;
    this.lastSuccessTime = new Date();
    
    if (this.state === CircuitState.HALF_OPEN) {
      this.successCount++;
      if (this.successCount >= this.config.successThreshold) {
        this.state = CircuitState.CLOSED;
        this.successCount = 0;
        logger.info('Circuit breaker is CLOSED - service recovered', {
          context,
          successCount: this.successCount
        });
      }
    }
  }

  /**
   * Handle failed execution
   */
  private onFailure(error: unknown, context?: string): void {
    this.failureCount++;
    this.successCount = 0;
    this.lastFailureTime = new Date();
    
    const errorMessage = error instanceof Error ? error.message : String(error);
    
    if (this.failureCount >= this.config.failureThreshold) {
      this.state = CircuitState.OPEN;
      this.nextAttempt = Date.now() + this.config.resetTimeout;
      
      logger.error('Circuit breaker is OPEN - too many failures', {
        context,
        failures: this.failureCount,
        threshold: this.config.failureThreshold,
        error: errorMessage,
        nextAttempt: new Date(this.nextAttempt).toISOString()
      });
    } else {
      logger.warn('Circuit breaker failure count increased', {
        context,
        failures: this.failureCount,
        threshold: this.config.failureThreshold,
        error: errorMessage
      });
    }
  }

  /**
   * Get current circuit breaker state
   */
  getState(): CircuitState {
    return this.state;
  }

  /**
   * Get circuit breaker metrics
   */
  getMetrics(): CircuitBreakerMetrics {
    const failureRate = this.totalRequests > 0 ? (this.failedRequests / this.totalRequests) * 100 : 0;
    
    return {
      totalRequests: this.totalRequests,
      successfulRequests: this.totalRequests - this.failedRequests,
      failedRequests: this.failedRequests,
      lastFailureTime: this.lastFailureTime,
      lastSuccessTime: this.lastSuccessTime,
      currentState: this.state,
      failureRate
    };
  }

  /**
   * Get failed requests count
   */
  get failedRequests(): number {
    return this.failureCount;
  }

  /**
   * Reset circuit breaker to CLOSED state
   */
  reset(): void {
    this.state = CircuitState.CLOSED;
    this.failureCount = 0;
    this.successCount = 0;
    this.nextAttempt = Date.now();
    logger.info('Circuit breaker manually reset to CLOSED');
  }

  /**
   * Force circuit breaker to OPEN state
   */
  forceOpen(): void {
    this.state = CircuitState.OPEN;
    this.nextAttempt = Date.now() + this.config.resetTimeout;
    logger.warn('Circuit breaker manually forced to OPEN');
  }

  /**
   * Get current configuration
   */
  getConfig(): CircuitBreakerConfig {
    return { ...this.config };
  }

  /**
   * Update configuration
   */
  updateConfig(config: Partial<CircuitBreakerConfig>): void {
    this.config = { ...this.config, ...config };
  }

  /**
   * Check if circuit breaker is healthy
   */
  isHealthy(): boolean {
    return this.state === CircuitState.CLOSED || 
           (this.state === CircuitState.HALF_OPEN && this.successCount > 0);
  }

  /**
   * Get time until next attempt
   */
  getTimeUntilNextAttempt(): number {
    if (this.state !== CircuitState.OPEN) {
      return 0;
    }
    return Math.max(0, this.nextAttempt - Date.now());
  }
}

/**
 * Default circuit breaker instance
 */
export const defaultCircuitBreaker = new CircuitBreaker();

/**
 * Aggressive circuit breaker for critical services
 */
export const aggressiveCircuitBreaker = new CircuitBreaker({
  failureThreshold: 3,
  resetTimeout: 30000, // 30 seconds
  successThreshold: 1
});

/**
 * Conservative circuit breaker for stable services
 */
export const conservativeCircuitBreaker = new CircuitBreaker({
  failureThreshold: 10,
  resetTimeout: 120000, // 2 minutes
  successThreshold: 3
});
