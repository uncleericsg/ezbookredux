type LogLevel = 'info' | 'warn' | 'error' | 'debug';

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  metadata?: Record<string, any>;
}

class Logger {
  private static instance: Logger;
  private environment: string;

  private constructor() {
    this.environment = process.env.NODE_ENV || 'development';
  }

  public static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  private formatLog(level: LogLevel, message: string, metadata?: Record<string, any>): LogEntry {
    return {
      timestamp: new Date().toISOString(),
      level,
      message,
      metadata: {
        environment: this.environment,
        ...metadata
      }
    };
  }

  private output(entry: LogEntry): void {
    const logString = `[${entry.timestamp}] ${entry.level.toUpperCase()}: ${entry.message}`;
    
    switch (entry.level) {
      case 'error':
        console.error(logString, entry.metadata);
        break;
      case 'warn':
        console.warn(logString, entry.metadata);
        break;
      case 'debug':
        if (this.environment === 'development') {
          console.debug(logString, entry.metadata);
        }
        break;
      default:
        console.log(logString, entry.metadata);
    }
  }

  public info(message: string, metadata?: Record<string, any>): void {
    this.output(this.formatLog('info', message, metadata));
  }

  public warn(message: string, metadata?: Record<string, any>): void {
    this.output(this.formatLog('warn', message, metadata));
  }

  public error(message: string, metadata?: Record<string, any>): void {
    this.output(this.formatLog('error', message, metadata));
  }

  public debug(message: string, metadata?: Record<string, any>): void {
    this.output(this.formatLog('debug', message, metadata));
  }
}

export const logger = Logger.getInstance(); 