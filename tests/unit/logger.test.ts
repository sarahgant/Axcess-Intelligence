import { logger, LogLevel } from '../../src/core/logging/logger';

// Mock console methods
const originalConsole = {
  log: console.log,
  error: console.error,
  warn: console.warn
};

beforeAll(() => {
  // Mock console methods
  console.log = jest.fn();
  console.error = jest.fn();
  console.warn = jest.fn();
});

afterAll(() => {
  // Restore console methods
  console.log = originalConsole.log;
  console.error = originalConsole.error;
  console.warn = originalConsole.warn;
});

beforeEach(() => {
  jest.clearAllMocks();
  // Clear log buffer
  if (typeof window !== 'undefined') {
    window.__logBuffer = [];
  }
});

describe('Logger', () => {
  describe('Log Buffer', () => {
    it('should store logs in buffer', () => {
      logger.info('Test message', { test: 'data' });
      
      const buffer = logger.getLogBuffer();
      expect(buffer).toHaveLength(1);
      expect(buffer[0].message).toBe('Test message');
      expect(buffer[0].meta).toEqual({ test: 'data' });
    });

    it('should limit buffer to 100 entries', () => {
      // Add 101 logs
      for (let i = 0; i < 101; i++) {
        logger.info(`Message ${i}`);
      }
      
      const buffer = logger.getLogBuffer();
      expect(buffer).toHaveLength(100);
      expect(buffer[0].message).toBe('Message 1'); // First message should be removed
      expect(buffer[99].message).toBe('Message 100');
    });

    it('should clear buffer', () => {
      logger.info('Test message');
      expect(logger.getLogBuffer()).toHaveLength(1);
      
      logger.clearLogBuffer();
      expect(logger.getLogBuffer()).toHaveLength(0);
    });
  });

  describe('Log Export', () => {
    it('should export logs as JSON', () => {
      logger.info('Test message', { test: 'data' });
      
      const exported = logger.exportLogs();
      const parsed = JSON.parse(exported);
      
      expect(parsed).toHaveLength(1);
      expect(parsed[0].message).toBe('Test message');
      expect(parsed[0].meta).toEqual({ test: 'data' });
      expect(parsed[0]).toHaveProperty('timestamp');
      expect(parsed[0]).toHaveProperty('level');
    });
  });

  describe('Context Information', () => {
    it('should include correlation ID', () => {
      // Mock sessionStorage
      Object.defineProperty(window, 'sessionStorage', {
        value: {
          getItem: jest.fn((key) => {
            if (key === 'correlationId') return 'test-correlation-id';
            return null;
          })
        },
        writable: true
      });

      logger.info('Test message');
      
      const buffer = logger.getLogBuffer();
      expect(buffer[0].correlationId).toBe('test-correlation-id');
    });

    it('should include user ID', () => {
      // Mock sessionStorage
      Object.defineProperty(window, 'sessionStorage', {
        value: {
          getItem: jest.fn((key) => {
            if (key === 'userId') return 'test-user-id';
            return null;
          })
        },
        writable: true
      });

      logger.info('Test message');
      
      const buffer = logger.getLogBuffer();
      expect(buffer[0].userId).toBe('test-user-id');
    });

    it('should include session ID', () => {
      // Mock sessionStorage
      Object.defineProperty(window, 'sessionStorage', {
        value: {
          getItem: jest.fn((key) => {
            if (key === 'sessionId') return 'test-session-id';
            return null;
          })
        },
        writable: true
      });

      logger.info('Test message');
      
      const buffer = logger.getLogBuffer();
      expect(buffer[0].sessionId).toBe('test-session-id');
    });
  });

  describe('Global Access', () => {
    it('should be available on window object', () => {
      expect(window.__logger).toBeDefined();
      expect(window.__logger).toBe(logger);
    });
  });

  describe('Log Levels', () => {
    it('should have correct log level enum values', () => {
      expect(LogLevel.DEBUG).toBe(0);
      expect(LogLevel.INFO).toBe(1);
      expect(LogLevel.WARN).toBe(2);
      expect(LogLevel.ERROR).toBe(3);
      expect(LogLevel.FATAL).toBe(4);
    });
  });
});
