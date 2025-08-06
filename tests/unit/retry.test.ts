import { RetryWithBackoff, defaultRetry, quickRetry, aggressiveRetry } from '../../src/core/utils/retry';

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

describe('RetryWithBackoff', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Configuration', () => {
    it('should use default configuration when no config provided', () => {
      const retry = new RetryWithBackoff();
      const config = retry.getConfig();

      expect(config.maxAttempts).toBe(3);
      expect(config.initialDelay).toBe(1000);
      expect(config.maxDelay).toBe(10000);
      expect(config.backoffMultiplier).toBe(2);
      expect(config.retryableErrors).toContain('NETWORK_ERROR');
      expect(config.retryableErrors).toContain('TIMEOUT');
    });

    it('should merge custom configuration with defaults', () => {
      const retry = new RetryWithBackoff({
        maxAttempts: 5,
        initialDelay: 500
      });
      const config = retry.getConfig();

      expect(config.maxAttempts).toBe(5);
      expect(config.initialDelay).toBe(500);
      expect(config.maxDelay).toBe(10000); // Default
      expect(config.backoffMultiplier).toBe(2); // Default
    });

    it('should update configuration after creation', () => {
      const retry = new RetryWithBackoff();
      retry.updateConfig({ maxAttempts: 10 });

      expect(retry.getConfig().maxAttempts).toBe(10);
    });
  });

  describe('Successful execution', () => {
    it('should return result immediately on success', async () => {
      const retry = new RetryWithBackoff();
      const mockFn = jest.fn().mockResolvedValue('success');

      const result = await retry.execute(mockFn, 'test');

      expect(result).toBe('success');
      expect(mockFn).toHaveBeenCalledTimes(1);
    });
  });

  describe('Failed execution', () => {
    it('should not retry non-retryable errors', async () => {
      const retry = new RetryWithBackoff({ maxAttempts: 3 });
      const mockFn = jest.fn().mockRejectedValue(new Error('AUTHENTICATION_FAILED'));

      await expect(retry.execute(mockFn, 'test')).rejects.toThrow('AUTHENTICATION_FAILED');
      expect(mockFn).toHaveBeenCalledTimes(1); // Should not retry
    });
  });

  describe('Error detection', () => {
    it('should detect retryable errors by message', () => {
      const retry = new RetryWithBackoff();
      const error = new Error('NETWORK_ERROR occurred');

      // Test the private method through reflection
      const isRetryable = (retry as any).isRetryable(error);
      expect(isRetryable).toBe(true);
    });

    it('should detect retryable errors by code', () => {
      const retry = new RetryWithBackoff();
      const error = new Error('Connection failed');
      (error as any).code = '503'; // Use a code that's in the default retryable errors list

      // Test the private method through reflection
      const isRetryable = (retry as any).isRetryable(error);
      expect(isRetryable).toBe(true);
    });

    it('should not retry non-retryable errors', () => {
      const retry = new RetryWithBackoff();
      const error = new Error('AUTHENTICATION_FAILED');

      // Test the private method through reflection
      const isRetryable = (retry as any).isRetryable(error);
      expect(isRetryable).toBe(false);
    });
  });

  describe('executeWithResult', () => {
    it('should return detailed result on success', async () => {
      const retry = new RetryWithBackoff();
      const mockFn = jest.fn().mockResolvedValue('success');

      const result = await retry.executeWithResult(mockFn, 'test');

      expect(result.success).toBe(true);
      expect(result.data).toBe('success');
      expect(result.attempts).toBe(1);
      expect(result.totalTime).toBeGreaterThanOrEqual(0);
      expect(result.error).toBeUndefined();
    });
  });

  describe('Pre-configured instances', () => {
    it('should have different configurations for different use cases', () => {
      const defaultConfig = defaultRetry.getConfig();
      const quickConfig = quickRetry.getConfig();
      const aggressiveConfig = aggressiveRetry.getConfig();

      expect(defaultConfig.maxAttempts).toBe(3);
      expect(quickConfig.maxAttempts).toBe(2);
      expect(aggressiveConfig.maxAttempts).toBe(5);

      expect(quickConfig.initialDelay).toBe(500);
      expect(aggressiveConfig.initialDelay).toBe(2000);
    });
  });

  describe('Delay calculation', () => {
    it('should calculate exponential backoff delays', () => {
      const retry = new RetryWithBackoff({
        initialDelay: 1000,
        backoffMultiplier: 2,
        maxDelay: 5000
      });

      // Test the private method through reflection
      const delay1 = (retry as any).calculateDelay(1);
      const delay2 = (retry as any).calculateDelay(2);
      const delay3 = (retry as any).calculateDelay(3);

      expect(delay1).toBeGreaterThanOrEqual(1000);
      expect(delay2).toBeGreaterThanOrEqual(2000);
      expect(delay3).toBeGreaterThanOrEqual(4000);
    });

    it('should respect max delay limit', () => {
      const retry = new RetryWithBackoff({
        initialDelay: 1000,
        backoffMultiplier: 10, // Very aggressive
        maxDelay: 2000
      });

      // Test the private method through reflection
      const delay = (retry as any).calculateDelay(3);
      expect(delay).toBeLessThanOrEqual(2000 + 1000); // maxDelay + jitter
    });
  });
});
