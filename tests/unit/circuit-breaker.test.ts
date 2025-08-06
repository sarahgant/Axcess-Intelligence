import { CircuitBreaker, defaultCircuitBreaker, aggressiveCircuitBreaker, conservativeCircuitBreaker } from '../../src/core/utils/circuit-breaker';

// Mock the logger to avoid console output during tests
jest.mock('../../src/core/logging/logger', () => ({
  logger: {
    debug: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
    fatal: jest.fn()
  }
}));

describe('CircuitBreaker', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('Configuration', () => {
    it('should use default configuration when no config provided', () => {
      const circuitBreaker = new CircuitBreaker();
      const config = circuitBreaker.getConfig();

      expect(config.failureThreshold).toBe(5);
      expect(config.resetTimeout).toBe(60000);
      expect(config.monitoringPeriod).toBe(10000);
      expect(config.successThreshold).toBe(2);
      expect(config.volumeThreshold).toBe(10);
    });

    it('should merge custom configuration with defaults', () => {
      const circuitBreaker = new CircuitBreaker({
        failureThreshold: 3,
        resetTimeout: 30000
      });
      const config = circuitBreaker.getConfig();

      expect(config.failureThreshold).toBe(3);
      expect(config.resetTimeout).toBe(30000);
      expect(config.monitoringPeriod).toBe(10000); // Default
      expect(config.successThreshold).toBe(2); // Default
    });

    it('should update configuration after creation', () => {
      const circuitBreaker = new CircuitBreaker();
      circuitBreaker.updateConfig({ failureThreshold: 10 });

      expect(circuitBreaker.getConfig().failureThreshold).toBe(10);
    });
  });

  describe('State transitions', () => {
    it('should start in CLOSED state', () => {
      const circuitBreaker = new CircuitBreaker();
      expect(circuitBreaker.getState()).toBe('CLOSED');
    });

    it('should transition to OPEN after failure threshold', async () => {
      const circuitBreaker = new CircuitBreaker({ failureThreshold: 2 });
      const mockFn = jest.fn().mockRejectedValue(new Error('Service error'));

      // First failure
      await expect(circuitBreaker.execute(mockFn)).rejects.toThrow('Service error');
      expect(circuitBreaker.getState()).toBe('CLOSED');

      // Second failure - should open circuit
      await expect(circuitBreaker.execute(mockFn)).rejects.toThrow('Service error');
      expect(circuitBreaker.getState()).toBe('OPEN');
    });

    it('should transition to HALF_OPEN after reset timeout', async () => {
      const circuitBreaker = new CircuitBreaker({
        failureThreshold: 1,
        resetTimeout: 1000
      });
      const mockFn = jest.fn().mockRejectedValue(new Error('Service error'));

      // Trigger OPEN state
      await expect(circuitBreaker.execute(mockFn)).rejects.toThrow('Service error');
      expect(circuitBreaker.getState()).toBe('OPEN');

      // Advance time past reset timeout
      jest.advanceTimersByTime(1000);

      // Next execution should be HALF_OPEN
      const successFn = jest.fn().mockResolvedValue('success');
      await circuitBreaker.execute(successFn);
      expect(circuitBreaker.getState()).toBe('HALF_OPEN');
    });

    it('should transition back to CLOSED after success threshold in HALF_OPEN', async () => {
      const circuitBreaker = new CircuitBreaker({
        failureThreshold: 1,
        resetTimeout: 1000,
        successThreshold: 2
      });
      const mockFn = jest.fn().mockRejectedValue(new Error('Service error'));

      // Trigger OPEN state
      await expect(circuitBreaker.execute(mockFn)).rejects.toThrow('Service error');
      expect(circuitBreaker.getState()).toBe('OPEN');

      // Advance time past reset timeout
      jest.advanceTimersByTime(1000);

      // First success in HALF_OPEN
      const successFn = jest.fn().mockResolvedValue('success');
      await circuitBreaker.execute(successFn);
      expect(circuitBreaker.getState()).toBe('HALF_OPEN');

      // Second success should close circuit
      await circuitBreaker.execute(successFn);
      expect(circuitBreaker.getState()).toBe('CLOSED');
    });
  });

  describe('Fallback behavior', () => {
    it('should use fallback when circuit is OPEN', async () => {
      const circuitBreaker = new CircuitBreaker({ failureThreshold: 1 });
      const mockFn = jest.fn().mockRejectedValue(new Error('Service error'));
      const fallbackFn = jest.fn().mockResolvedValue('fallback result');

      // Trigger OPEN state
      await expect(circuitBreaker.execute(mockFn)).rejects.toThrow('Service error');
      expect(circuitBreaker.getState()).toBe('OPEN');

      // Should use fallback
      const result = await circuitBreaker.execute(mockFn, fallbackFn);
      expect(result).toBe('fallback result');
      expect(fallbackFn).toHaveBeenCalledTimes(1);
      expect(mockFn).not.toHaveBeenCalledTimes(2); // Should not call original function
    });

    it('should throw error when circuit is OPEN and no fallback provided', async () => {
      const circuitBreaker = new CircuitBreaker({ failureThreshold: 1 });
      const mockFn = jest.fn().mockRejectedValue(new Error('Service error'));

      // Trigger OPEN state
      await expect(circuitBreaker.execute(mockFn)).rejects.toThrow('Service error');
      expect(circuitBreaker.getState()).toBe('OPEN');

      // Should throw error without fallback
      await expect(circuitBreaker.execute(mockFn)).rejects.toThrow('Circuit breaker is OPEN');
    });

    it('should handle fallback errors', async () => {
      const circuitBreaker = new CircuitBreaker({ failureThreshold: 1 });
      const mockFn = jest.fn().mockRejectedValue(new Error('Service error'));
      const fallbackFn = jest.fn().mockRejectedValue(new Error('Fallback error'));

      // Trigger OPEN state
      await expect(circuitBreaker.execute(mockFn)).rejects.toThrow('Service error');
      expect(circuitBreaker.getState()).toBe('OPEN');

      // Should throw fallback error
      await expect(circuitBreaker.execute(mockFn, fallbackFn)).rejects.toThrow('Fallback error');
    });
  });

  describe('Metrics', () => {
    it('should track request metrics correctly', async () => {
      const circuitBreaker = new CircuitBreaker({ failureThreshold: 3 });
      const successFn = jest.fn().mockResolvedValue('success');
      const failureFn = jest.fn().mockRejectedValue(new Error('Service error'));

      // Successful requests
      await circuitBreaker.execute(successFn);
      await circuitBreaker.execute(successFn);

      // Failed requests
      await expect(circuitBreaker.execute(failureFn)).rejects.toThrow('Service error');
      await expect(circuitBreaker.execute(failureFn)).rejects.toThrow('Service error');

      const metrics = circuitBreaker.getMetrics();

      expect(metrics.totalRequests).toBe(4);
      expect(metrics.successfulRequests).toBe(2);
      expect(metrics.failedRequests).toBe(2);
      expect(metrics.failureRate).toBe(50);
    });

    it('should track timing information', async () => {
      const circuitBreaker = new CircuitBreaker();
      const mockFn = jest.fn().mockResolvedValue('success');

      await circuitBreaker.execute(mockFn);

      const metrics = circuitBreaker.getMetrics();

      expect(metrics.lastSuccessTime).toBeInstanceOf(Date);
      expect(metrics.lastFailureTime).toBeUndefined();
    });
  });

  describe('executeWithResult', () => {
    it('should return detailed result on success', async () => {
      const circuitBreaker = new CircuitBreaker();
      const mockFn = jest.fn().mockResolvedValue('success');

      const result = await circuitBreaker.executeWithResult(mockFn);

      expect(result.success).toBe(true);
      expect(result.data).toBe('success');
      expect(result.usedFallback).toBe(false);
      expect(result.circuitState).toBe('CLOSED');
      expect(result.error).toBeUndefined();
    });

    it('should return detailed result on failure', async () => {
      const circuitBreaker = new CircuitBreaker({ failureThreshold: 1 });
      const mockFn = jest.fn().mockRejectedValue(new Error('Service error'));

      const result = await circuitBreaker.executeWithResult(mockFn);

      expect(result.success).toBe(false);
      expect(result.data).toBeUndefined();
      expect(result.usedFallback).toBe(false);
      expect(result.circuitState).toBe('OPEN');
      expect(result.error).toBeInstanceOf(Error);
      expect(result.error?.message).toBe('Service error');
    });

    it('should return fallback result when circuit is OPEN', async () => {
      const circuitBreaker = new CircuitBreaker({ failureThreshold: 1 });
      const mockFn = jest.fn().mockRejectedValue(new Error('Service error'));
      const fallbackFn = jest.fn().mockResolvedValue('fallback');

      // Trigger OPEN state
      await circuitBreaker.executeWithResult(mockFn);

      const result = await circuitBreaker.executeWithResult(mockFn, fallbackFn);

      expect(result.success).toBe(true);
      expect(result.data).toBe('fallback');
      expect(result.usedFallback).toBe(true);
      expect(result.circuitState).toBe('OPEN');
    });
  });

  describe('Manual control', () => {
    it('should allow manual reset', async () => {
      const circuitBreaker = new CircuitBreaker({ failureThreshold: 1 });
      const mockFn = jest.fn().mockRejectedValue(new Error('Service error'));

      // Trigger OPEN state
      await expect(circuitBreaker.execute(mockFn)).rejects.toThrow('Service error');
      expect(circuitBreaker.getState()).toBe('OPEN');

      // Manual reset
      circuitBreaker.reset();
      expect(circuitBreaker.getState()).toBe('CLOSED');
    });

    it('should allow manual force open', () => {
      const circuitBreaker = new CircuitBreaker();
      expect(circuitBreaker.getState()).toBe('CLOSED');

      circuitBreaker.forceOpen();
      expect(circuitBreaker.getState()).toBe('OPEN');
    });
  });

  describe('Health checks', () => {
    it('should report healthy when CLOSED', () => {
      const circuitBreaker = new CircuitBreaker();
      expect(circuitBreaker.isHealthy()).toBe(true);
    });

    it('should report unhealthy when OPEN', async () => {
      const circuitBreaker = new CircuitBreaker({ failureThreshold: 1 });
      const mockFn = jest.fn().mockRejectedValue(new Error('Service error'));

      await expect(circuitBreaker.execute(mockFn)).rejects.toThrow('Service error');
      expect(circuitBreaker.isHealthy()).toBe(false);
    });

    it('should report healthy when HALF_OPEN with success', async () => {
      const circuitBreaker = new CircuitBreaker({
        failureThreshold: 1,
        resetTimeout: 1000
      });
      const mockFn = jest.fn().mockRejectedValue(new Error('Service error'));

      // Trigger OPEN state
      await expect(circuitBreaker.execute(mockFn)).rejects.toThrow('Service error');

      // Advance time past reset timeout
      jest.advanceTimersByTime(1000);

      // Success in HALF_OPEN
      const successFn = jest.fn().mockResolvedValue('success');
      await circuitBreaker.execute(successFn);

      expect(circuitBreaker.isHealthy()).toBe(true);
    });
  });

  describe('Pre-configured instances', () => {
    it('should have different configurations for different use cases', () => {
      const defaultConfig = defaultCircuitBreaker.getConfig();
      const aggressiveConfig = aggressiveCircuitBreaker.getConfig();
      const conservativeConfig = conservativeCircuitBreaker.getConfig();

      expect(defaultConfig.failureThreshold).toBe(5);
      expect(aggressiveConfig.failureThreshold).toBe(3);
      expect(conservativeConfig.failureThreshold).toBe(10);

      expect(aggressiveConfig.resetTimeout).toBe(30000);
      expect(conservativeConfig.resetTimeout).toBe(120000);
    });
  });

  describe('Time until next attempt', () => {
    it('should return 0 when not OPEN', () => {
      const circuitBreaker = new CircuitBreaker();
      expect(circuitBreaker.getTimeUntilNextAttempt()).toBe(0);
    });

    it('should return time until next attempt when OPEN', async () => {
      const circuitBreaker = new CircuitBreaker({
        failureThreshold: 1,
        resetTimeout: 5000
      });
      const mockFn = jest.fn().mockRejectedValue(new Error('Service error'));

      // Trigger OPEN state
      await expect(circuitBreaker.execute(mockFn)).rejects.toThrow('Service error');

      const timeUntilNext = circuitBreaker.getTimeUntilNextAttempt();
      expect(timeUntilNext).toBeGreaterThan(0);
      expect(timeUntilNext).toBeLessThanOrEqual(5000);
    });
  });
});
