export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
  FATAL = 4
}

/**
 * Log metadata interface for structured logging
 */
interface LogMetadata {
  [key: string]: string | number | boolean | null | undefined | Record<string, unknown> | unknown[];
}

/**
 * Log context interface for structured logging
 */
interface LogContext {
  timestamp: string;
  level: LogLevel;
  message: string;
  meta?: LogMetadata;
  correlationId?: string;
  userId?: string;
  sessionId?: string;
  component?: string; // Added for component-specific logging
  action?: string;    // Added for action-specific logging
}

// Extend Window interface for debugging
declare global {
  interface Window {
    __logBuffer?: LogContext[];
    __logger?: Logger;
  }
}

class Logger {
  private isDevelopment = process.env.NODE_ENV === 'development';
  private isLoggingEnabled = true; // Will be set by environment config
  private logLevel = this.isDevelopment ? LogLevel.DEBUG : LogLevel.INFO;

  private formatLog(context: LogContext): string {
    return JSON.stringify(context);
  }

  private shouldLog(level: LogLevel): boolean {
    return level >= this.logLevel;
  }

  private log(level: LogLevel, message: string, meta?: LogMetadata, context?: Partial<LogContext>) {
    if (!this.shouldLog(level) || !this.isLoggingEnabled) return;

    const logContext: LogContext = {
      timestamp: new Date().toISOString(),
      level,
      message,
      meta,
      correlationId: this.getCorrelationId(),
      userId: this.getUserId(),
      sessionId: this.getSessionId(),
      ...context
    };

    // In development, use console for readability
    if (this.isDevelopment) {
      const color = this.getConsoleColor(level);
      const levelName = LogLevel[level];
      console.log(`%c[${levelName}]`, color, message, meta || '');
    } else {
      // In production, send to monitoring service
      this.sendToMonitoring(logContext);
    }

    // Store in local buffer for debugging
    this.storeInBuffer(logContext);
  }

  debug(message: string, meta?: LogMetadata, context?: Partial<LogContext>) {
    this.log(LogLevel.DEBUG, message, meta, context);
  }

  info(message: string, meta?: LogMetadata, context?: Partial<LogContext>) {
    this.log(LogLevel.INFO, message, meta, context);
  }

  warn(message: string, meta?: LogMetadata, context?: Partial<LogContext>) {
    this.log(LogLevel.WARN, message, meta, context);
  }

  error(message: string, meta?: LogMetadata, context?: Partial<LogContext>) {
    this.log(LogLevel.ERROR, message, meta, context);
  }

  fatal(message: string, meta?: LogMetadata, context?: Partial<LogContext>) {
    this.log(LogLevel.FATAL, message, meta, context);
  }

  // Component-specific logging methods
  component(componentName: string) {
    return {
      debug: (message: string, meta?: LogMetadata) => this.debug(message, meta, { component: componentName }),
      info: (message: string, meta?: LogMetadata) => this.info(message, meta, { component: componentName }),
      warn: (message: string, meta?: LogMetadata) => this.warn(message, meta, { component: componentName }),
      error: (message: string, meta?: LogMetadata) => this.error(message, meta, { component: componentName }),
      fatal: (message: string, meta?: LogMetadata) => this.fatal(message, meta, { component: componentName })
    };
  }

  // Action-specific logging methods
  action(actionName: string) {
    return {
      debug: (message: string, meta?: LogMetadata) => this.debug(message, meta, { action: actionName }),
      info: (message: string, meta?: LogMetadata) => this.info(message, meta, { action: actionName }),
      warn: (message: string, meta?: LogMetadata) => this.warn(message, meta, { action: actionName }),
      error: (message: string, meta?: LogMetadata) => this.error(message, meta, { action: actionName }),
      fatal: (message: string, meta?: LogMetadata) => this.fatal(message, meta, { action: actionName })
    };
  }

  // Helper methods
  private getConsoleColor(level: LogLevel): string {
    const colors = {
      [LogLevel.DEBUG]: 'color: gray',
      [LogLevel.INFO]: 'color: blue',
      [LogLevel.WARN]: 'color: orange',
      [LogLevel.ERROR]: 'color: red',
      [LogLevel.FATAL]: 'color: darkred; font-weight: bold'
    };
    return colors[level];
  }

  private getCorrelationId(): string {
    if (typeof window === 'undefined') return 'server-side';
    return sessionStorage.getItem('correlationId') || 'no-correlation-id';
  }

  private getUserId(): string {
    if (typeof window === 'undefined') return 'server-side';
    return sessionStorage.getItem('userId') || 'anonymous';
  }

  private getSessionId(): string {
    if (typeof window === 'undefined') return 'server-side';
    return sessionStorage.getItem('sessionId') || 'no-session';
  }

  private sendToMonitoring(context: LogContext) {
    // Future: Send to Azure Application Insights
    // For now, store in IndexedDB for retrieval
    if (typeof window !== 'undefined') {
      this.storeInIndexedDB(context);
    }
  }

  private storeInBuffer(context: LogContext) {
    // Store last 100 logs in memory for debugging
    if (typeof window === 'undefined') return;

    if (!window.__logBuffer) window.__logBuffer = [];
    window.__logBuffer.push(context);
    if (window.__logBuffer.length > 100) {
      window.__logBuffer.shift();
    }
  }

  private async storeInIndexedDB(context: LogContext) {
    try {
      // Simple IndexedDB storage for production logs
      const dbName = 'CCHLogs';
      const storeName = 'logs';

      const request = indexedDB.open(dbName, 1);

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(storeName)) {
          db.createObjectStore(storeName, { keyPath: 'timestamp' });
        }
      };

      request.onsuccess = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        const transaction = db.transaction([storeName], 'readwrite');
        const store = transaction.objectStore(storeName);
        store.add(context);
      };
    } catch (error) {
      // Fallback to console if IndexedDB fails
      console.error('Failed to store log in IndexedDB:', error);
    }
  }

  // Utility methods for debugging
  getLogBuffer(): LogContext[] {
    if (typeof window === 'undefined') return [];
    return window.__logBuffer || [];
  }

  clearLogBuffer(): void {
    if (typeof window === 'undefined') return;
    window.__logBuffer = [];
  }

  // Export logs for debugging
  exportLogs(): string {
    const logs = this.getLogBuffer();
    return JSON.stringify(logs, null, 2);
  }
}

export const logger = new Logger();

// Add to window for debugging in production
if (typeof window !== 'undefined') {
  window.__logger = logger;
}
