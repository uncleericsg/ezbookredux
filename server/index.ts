import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import type { Request, Response, NextFunction } from 'express';
import type { Server as HttpServer } from 'http';
import type { 
  Server,
  ServerConfig,
  ServerMiddleware,
  ServerStatus,
  ServerHealth,
  ServerMetrics,
  ServerEvent,
  ServerEventHandler,
  ServerPlugin,
  ServiceHealth,
  ServerContext
} from '@shared/types/server';
import type {
  MiddlewareHandler,
  CorsMiddlewareConfig,
  HelmetMiddlewareConfig,
  RateLimitOptions,
  ErrorHandlingMiddlewareConfig
} from '@shared/types/middleware';
import type { ServerLogger, LogMetadata } from '@shared/types/logger';
import { logger } from '@server/utils/logger';
import { errorHandler } from '@server/middleware/errorHandling';

// Extend Express Request type to include our custom properties
declare global {
  namespace Express {
    interface Request {
      id?: string;
      user?: any; // Replace with proper user type
      session?: any; // Replace with proper session type
    }
  }
}

class ExpressServer implements Server {
  private app: Application;
  private server!: HttpServer; // Using definite assignment assertion
  public config: ServerConfig;
  public status: ServerStatus = 'stopped';
  public metrics: ServerMetrics = {
    requestCount: 0,
    errorCount: 0,
    responseTime: {
      avg: 0,
      min: 0,
      max: 0,
      p95: 0,
      p99: 0
    },
    memory: {
      used: 0,
      total: 0,
      free: 0
    },
    cpu: {
      usage: 0,
      load: []
    }
  };
  public logger: ServerLogger;

  private eventHandlers: Map<ServerEvent, Set<ServerEventHandler>> = new Map();

  constructor(config: ServerConfig) {
    this.config = config;
    this.app = express();
    this.logger = logger;
    this.setupMiddleware();
  }

  private setupMiddleware(): void {
    // Basic middleware
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));

    // Security middleware
    const security = this.config.services.security;
    if (security?.cors?.enabled) {
      const corsOptions: cors.CorsOptions = {
        origin: security.cors.origins,
        methods: security.cors.methods,
        allowedHeaders: security.cors.headers,
        credentials: security.cors.credentials
      };
      this.app.use(cors(corsOptions));
    }

    if (security?.helmet?.enabled) {
      const helmetOptions = security.helmet.options || {};
      this.app.use(helmet(helmetOptions));
    }

    if (security?.rateLimit?.enabled) {
      const rateLimitOptions: RateLimitOptions = {
        windowMs: security.rateLimit.windowMs,
        max: security.rateLimit.max
      };
      this.app.use(rateLimit(rateLimitOptions));
    }

    // Performance middleware
    const performance = this.config.services.performance;
    if (performance?.static?.enabled) {
      this.app.use(express.static('public', {
        maxAge: performance.static.maxAge,
        etag: performance.static.etag
      }));
    }

    // Logging middleware
    const logging = this.config.services.logging;
    if (logging?.console?.enabled) {
      this.app.use((req: Request, res: Response, next: NextFunction) => {
        const metadata: LogMetadata = {
          method: req.method,
          url: req.url,
          ip: req.ip,
          userAgent: req.get('user-agent')
        };
        this.logger.info(`${req.method} ${req.url}`, metadata);
        next();
      });
    }

    // Error handling middleware (should be last)
    this.app.use(errorHandler);

    // 404 handler
    this.app.use((req: Request, res: Response) => {
      res.status(404).json({
        error: {
          code: 'NOT_FOUND',
          message: `Cannot ${req.method} ${req.url}`
        }
      });
    });

    // Method not allowed handler
    this.app.use((req: Request, res: Response) => {
      res.status(405).json({
        error: {
          code: 'METHOD_NOT_ALLOWED',
          message: `Method ${req.method} not allowed for ${req.url}`
        }
      });
    });
  }

  public async start(): Promise<void> {
    try {
      this.status = 'starting';
      this.server = this.app.listen(this.config.port, () => {
        this.status = 'running';
        this.logger.info(`Server running on port ${this.config.port}`);
        this.emit('start');
      });
    } catch (error) {
      this.status = 'error';
      this.logger.error('Failed to start server', error as Error);
      this.emit('error', error);
      throw error;
    }
  }

  public async stop(): Promise<void> {
    if (this.server) {
      try {
        this.status = 'stopping';
        await new Promise<void>((resolve, reject) => {
          this.server.close((err?: Error) => {
            if (err) reject(err);
            else resolve();
          });
        });
        this.status = 'stopped';
        this.logger.info('Server stopped');
        this.emit('stop');
      } catch (error) {
        this.status = 'error';
        this.logger.error('Failed to stop server', error as Error);
        this.emit('error', error);
        throw error;
      }
    }
  }

  public async restart(): Promise<void> {
    await this.stop();
    await this.start();
  }

  public use(middleware: ServerMiddleware): void {
    if (middleware.handler) {
      this.app.use(middleware.handler);
      this.emit('middleware', middleware);
    }
  }

  public async register(plugin: ServerPlugin): Promise<void> {
    try {
      await plugin.initialize(this);
      this.emit('plugin', plugin);
    } catch (error) {
      this.logger.error(`Failed to register plugin ${plugin.name}`, error as Error);
      throw error;
    }
  }

  public on(event: ServerEvent, handler: ServerEventHandler): void {
    if (!this.eventHandlers.has(event)) {
      this.eventHandlers.set(event, new Set());
    }
    this.eventHandlers.get(event)?.add(handler);
  }

  public off(event: ServerEvent, handler: ServerEventHandler): void {
    this.eventHandlers.get(event)?.delete(handler);
  }

  private emit(event: ServerEvent, data?: unknown): void {
    this.eventHandlers.get(event)?.forEach(handler => handler(event, data));
  }

  public async getHealth(): Promise<ServerHealth> {
    const uptime = process.uptime();
    const memory = process.memoryUsage();

    return {
      status: this.status,
      uptime,
      memory: {
        used: memory.heapUsed,
        total: memory.heapTotal
      },
      services: {
        database: await this.checkDatabaseHealth(),
        cache: await this.checkCacheHealth()
      }
    };
  }

  private async checkDatabaseHealth(): Promise<ServiceHealth> {
    try {
      // Implement database health check
      return { status: 'healthy' };
    } catch (error) {
      return {
        status: 'unhealthy',
        message: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  private async checkCacheHealth(): Promise<ServiceHealth> {
    try {
      // Implement cache health check
      return { status: 'healthy' };
    } catch (error) {
      return {
        status: 'unhealthy',
        message: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  public createContext(req: Request): ServerContext {
    return {
      requestId: req.id || crypto.randomUUID(),
      startTime: Date.now(),
      user: req.user,
      session: req.session
    };
  }

  public handleError(error: Error): void {
    this.logger.error('Unhandled server error', error);
    if (this.status === 'running') {
      this.status = 'error';
    }
    this.emit('error', error);
  }
}

export default ExpressServer;
