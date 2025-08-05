/**
 * Centralized Logging System
 * Structured logging with multiple transports and log levels
 */

export enum LogLevel {
  ERROR = 0,
  WARN = 1,
  INFO = 2,
  DEBUG = 3,
}

export interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: number;
  context?: Record<string, any>;
  userId?: string;
  sessionId?: string;
  error?: Error;
  stack?: string;
}

export interface LoggerConfig {
  level: LogLevel;
  enableConsole: boolean;
  enableRemote: boolean;
  enableStorage: boolean;
  remoteEndpoint?: string;
  batchSize?: number;
  batchTimeout?: number;
}

export class Logger {
  private static instance: Logger;
  private config: LoggerConfig;
  private logBuffer: LogEntry[] = [];
  private batchTimer?: NodeJS.Timeout;

  private constructor(config: LoggerConfig) {
    this.config = config;
    this.setupBatchLogging();
  }

  static getInstance(config?: LoggerConfig): Logger {
    if (!Logger.instance) {
      const defaultConfig: LoggerConfig = {
        level: process.env.NODE_ENV === 'production' ? LogLevel.INFO : LogLevel.DEBUG,
        enableConsole: true,
        enableRemote: process.env.NODE_ENV === 'production',
        enableStorage: false,
        batchSize: 10,
        batchTimeout: 5000,
      };
      Logger.instance = new Logger(config || defaultConfig);
    }
    return Logger.instance;
  }

  /**
   * Log an error message
   */
  error(message: string, context?: Record<string, any>, error?: Error): void {
    this.log(LogLevel.ERROR, message, context, error);
  }

  /**
   * Log a warning message
   */
  warn(message: string, context?: Record<string, any>): void {
    this.log(LogLevel.WARN, message, context);
  }

  /**
   * Log an info message
   */
  info(message: string, context?: Record<string, any>): void {
    this.log(LogLevel.INFO, message, context);
  }

  /**
   * Log a debug message
   */
  debug(message: string, context?: Record<string, any>): void {
    this.log(LogLevel.DEBUG, message, context);
  }

  /**
   * Core logging method
   */
  private log(
    level: LogLevel,
    message: string,
    context?: Record<string, any>,
    error?: Error
  ): void {
    if (level > this.config.level) {
      return; // Skip if level is below threshold
    }

    const logEntry: LogEntry = {
      level,
      message,
      timestamp: Date.now(),
      context: this.sanitizeContext(context),
      userId: this.getCurrentUserId(),
      sessionId: this.getSessionId(),
      error,
      stack: error?.stack,
    };

    this.processLogEntry(logEntry);
  }

  /**
   * Process a log entry through various transports
   */
  private processLogEntry(logEntry: LogEntry): void {
    if (this.config.enableConsole) {
      this.logToConsole(logEntry);
    }

    if (this.config.enableStorage) {
      this.logToStorage(logEntry);
    }

    if (this.config.enableRemote) {
      this.bufferForRemote(logEntry);
    }
  }

  /**
   * Log to browser console
   */
  private logToConsole(logEntry: LogEntry): void {
    const { level, message, timestamp, context, error } = logEntry;
    const timeStr = new Date(timestamp).toISOString();
    const logMessage = `[${timeStr}] ${LogLevel[level]}: ${message}`;

    switch (level) {
      case LogLevel.ERROR:
        console.error(logMessage, context, error);
        break;
      case LogLevel.WARN:
        console.warn(logMessage, context);
        break;
      case LogLevel.INFO:
        console.info(logMessage, context);
        break;
      case LogLevel.DEBUG:
        console.debug(logMessage, context);
        break;
    }
  }

  /**
   * Log to local storage
   */
  private logToStorage(logEntry: LogEntry): void {
    try {
      const storageKey = 'app_logs';
      const existingLogs = JSON.parse(localStorage.getItem(storageKey) || '[]');
      
      // Keep only last 100 logs
      const logs = [...existingLogs, logEntry].slice(-100);
      
      localStorage.setItem(storageKey, JSON.stringify(logs));
    } catch (error) {
      console.warn('Failed to log to storage:', error);
    }
  }

  /**
   * Buffer logs for remote transmission
   */
  private bufferForRemote(logEntry: LogEntry): void {
    this.logBuffer.push(logEntry);

    if (this.logBuffer.length >= (this.config.batchSize || 10)) {
      this.flushRemoteLogs();
    }
  }

  /**
   * Setup batch logging timer
   */
  private setupBatchLogging(): void {
    if (this.config.enableRemote) {
      this.batchTimer = setInterval(() => {
        if (this.logBuffer.length > 0) {
          this.flushRemoteLogs();
        }
      }, this.config.batchTimeout || 5000);
    }
  }

  /**
   * Flush logs to remote endpoint
   */
  private async flushRemoteLogs(): Promise<void> {
    if (this.logBuffer.length === 0 || !this.config.remoteEndpoint) {
      return;
    }

    const logsToSend = [...this.logBuffer];
    this.logBuffer = [];

    try {
      await fetch(this.config.remoteEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          logs: logsToSend,
          timestamp: Date.now(),
          userAgent: navigator.userAgent,
          url: window.location.href,
        }),
      });
    } catch (error) {
      // If remote logging fails, log to console
      console.warn('Failed to send logs to remote endpoint:', error);
      
      // Put logs back in buffer for retry
      this.logBuffer.unshift(...logsToSend);
    }
  }

  /**
   * Sanitize context to remove sensitive data
   */
  private sanitizeContext(context?: Record<string, any>): Record<string, any> | undefined {
    if (!context) return undefined;

    const sanitized = { ...context };
    const sensitiveKeys = ['password', 'token', 'apiKey', 'secret', 'credential'];

    const sanitizeObject = (obj: any): any => {
      if (typeof obj !== 'object' || obj === null) return obj;
      
      if (Array.isArray(obj)) {
        return obj.map(sanitizeObject);
      }

      const result: any = {};
      for (const [key, value] of Object.entries(obj)) {
        const lowerKey = key.toLowerCase();
        if (sensitiveKeys.some(sensitive => lowerKey.includes(sensitive))) {
          result[key] = '[REDACTED]';
        } else if (typeof value === 'object') {
          result[key] = sanitizeObject(value);
        } else {
          result[key] = value;
        }
      }
      return result;
    };

    return sanitizeObject(sanitized);
  }

  /**
   * Get current user ID (implement based on your auth system)
   */
  private getCurrentUserId(): string | undefined {
    try {
      // This would typically get the user ID from your auth context
      // For now, return undefined or implement based on your auth system
      return undefined;
    } catch {
      return undefined;
    }
  }

  /**
   * Get current session ID
   */
  private getSessionId(): string {
    try {
      let sessionId = sessionStorage.getItem('sessionId');
      if (!sessionId) {
        sessionId = crypto.randomUUID();
        sessionStorage.setItem('sessionId', sessionId);
      }
      return sessionId;
    } catch {
      return 'unknown';
    }
  }

  /**
   * Create a child logger with additional context
   */
  child(context: Record<string, any>): Logger {
    const childLogger = Object.create(this);
    childLogger.defaultContext = { ...this.defaultContext, ...context };
    return childLogger;
  }

  /**
   * Get recent logs from storage
   */
  getRecentLogs(count: number = 50): LogEntry[] {
    try {
      const logs = JSON.parse(localStorage.getItem('app_logs') || '[]');
      return logs.slice(-count);
    } catch {
      return [];
    }
  }

  /**
   * Clear all stored logs
   */
  clearLogs(): void {
    try {
      localStorage.removeItem('app_logs');
      this.logBuffer = [];
    } catch (error) {
      console.warn('Failed to clear logs:', error);
    }
  }

  /**
   * Update logger configuration
   */
  updateConfig(newConfig: Partial<LoggerConfig>): void {
    this.config = { ...this.config, ...newConfig };
    
    // Restart batch timer if configuration changed
    if (this.batchTimer) {
      clearInterval(this.batchTimer);
    }
    this.setupBatchLogging();
  }

  /**
   * Cleanup resources
   */
  destroy(): void {
    if (this.batchTimer) {
      clearInterval(this.batchTimer);
    }
    this.flushRemoteLogs(); // Send any remaining logs
  }
}

// Export singleton instance
export const logger = Logger.getInstance();

// Export factory function for creating loggers with specific config
export function createLogger(config: LoggerConfig): Logger {
  return Logger.getInstance(config);
}