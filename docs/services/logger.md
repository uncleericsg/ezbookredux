# Logger Utility Documentation

## Overview

The Logger utility provides a consistent logging interface across the application. It implements a singleton pattern and supports different log levels with environment-aware output.

## Usage

```typescript
import { logger } from '@/server/utils/logger';

// Info level logging
logger.info('Operation completed', { operationId: '123' });

// Error level logging
logger.error('Operation failed', { error: new Error('Failed to process') });

// Warning level logging
logger.warn('Resource running low', { resourceType: 'memory' });

// Debug level logging (only in development)
logger.debug('Processing step', { step: 1, data: {...} });
```

## Log Levels

The logger supports four log levels:

1. **info**: General information about application operation
2. **warn**: Warning messages for potential issues
3. **error**: Error messages for actual problems
4. **debug**: Detailed information for debugging (development only)

## Log Format

Each log entry includes:

```typescript
interface LogEntry {
  timestamp: string;      // ISO timestamp
  level: LogLevel;        // 'info' | 'warn' | 'error' | 'debug'
  message: string;        // Log message
  metadata?: {           // Additional context
    environment: string; // Current environment
    [key: string]: any; // Custom metadata
  }
}
```

## Environment Awareness

- Debug logs are only output in development environment
- Environment is automatically detected from `process.env.NODE_ENV`
- Default environment is 'development' if not specified

## Methods

### `info(message: string, metadata?: Record<string, any>)`
Logs information messages.

### `warn(message: string, metadata?: Record<string, any>)`
Logs warning messages.

### `error(message: string, metadata?: Record<string, any>)`
Logs error messages.

### `debug(message: string, metadata?: Record<string, any>)`
Logs debug messages (development only).

## Best Practices

1. **Consistent Message Format**
   ```typescript
   // Good
   logger.info('User created', { userId: '123', email: 'user@example.com' });
   
   // Avoid
   logger.info('Created user 123 with email user@example.com');
   ```

2. **Error Logging**
   ```typescript
   try {
     // operation
   } catch (error) {
     logger.error('Operation failed', { error, operationName: 'createUser' });
   }
   ```

3. **Sensitive Data**
   - Never log passwords or sensitive tokens
   - Mask sensitive information in metadata
   ```typescript
   logger.info('Payment processed', {
     amount: payment.amount,
     last4: payment.card.last4,
     // Don't log full card details
   });
   ```

4. **Debug Logging**
   - Use debug level for detailed operation information
   - Keep production logs clean by using debug appropriately
   ```typescript
   logger.debug('Processing step completed', {
     step: 'validation',
     details: { ... }
   });
   ```

## Implementation Details

The logger is implemented as a singleton to ensure consistent logging across the application:

```typescript
class Logger {
  private static instance: Logger;
  
  public static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }
}
```

## Console Output

Logs are formatted as:
```
[2024-01-16T08:00:00.000Z] INFO: User logged in { userId: "123" }
[2024-01-16T08:00:01.000Z] ERROR: Database connection failed { error: "Connection timeout" }
``` 