import type { Request, Response, NextFunction } from 'express';
import type { DatabaseConfig } from './database';
import type { ServiceConfig } from './service';
import type { ValidationOptions } from './route';
import type { ServerLogger, LogMetadata } from './logger';
import type { UserProfile } from './middleware';

/**
 * Server environment type
 */
export type ServerEnvironment = 'development' | 'production' | 'test';

/**
 * Server configuration interface
 */
export interface ServerConfig {
  port: number;
  env: ServerEnvironment;
  database: DatabaseConfig;
  services: ServiceConfig;
  validation?: ValidationOptions;
}

/**
 * Server initialization options
 */
export interface ServerOptions {
  config: ServerConfig;
  middleware?: ServerMiddleware[];
  plugins?: ServerPlugin[];
}

/**
 * Server middleware interface
 */
export interface ServerMiddleware {
  name: string;
  priority: number;
  handler: ServerMiddlewareHandler;
}

/**
 * Server middleware handler type
 */
export type ServerMiddlewareHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<void>;

/**
 * Server plugin interface
 */
export interface ServerPlugin {
  name: string;
  version: string;
  initialize(server: Server): Promise<void>;
}

/**
 * Server status type
 */
export type ServerStatus = 'starting' | 'running' | 'stopping' | 'stopped' | 'error';

/**
 * Server health check result
 */
export interface ServerHealth {
  status: ServerStatus;
  uptime: number;
  memory: {
    used: number;
    total: number;
  };
  services: Record<string, ServiceHealth>;
}

/**
 * Service health check result
 */
export interface ServiceHealth {
  status: 'healthy' | 'unhealthy' | 'degraded';
  message?: string;
  details?: Record<string, unknown>;
}

/**
 * Server error interface
 */
export interface ServerError extends Error {
  code: string;
  statusCode: number;
  details?: Record<string, unknown>;
}

/**
 * Server request context
 */
export interface ServerContext {
  requestId: string;
  startTime: number;
  user?: UserProfile;
  session?: SessionData;
  [key: string]: unknown;
}

/**
 * Server session data
 */
export interface SessionData {
  id: string;
  userId: string;
  role: string;
  permissions: string[];
  expiresAt: Date;
  metadata?: Record<string, unknown>;
}

/**
 * Server metrics interface
 */
export interface ServerMetrics {
  requestCount: number;
  errorCount: number;
  responseTime: {
    avg: number;
    min: number;
    max: number;
    p95: number;
    p99: number;
  };
  memory: {
    used: number;
    total: number;
    free: number;
  };
  cpu: {
    usage: number;
    load: number[];
  };
}

/**
 * Server event types
 */
export type ServerEvent =
  | 'start'
  | 'stop'
  | 'error'
  | 'request'
  | 'response'
  | 'middleware'
  | 'plugin';

/**
 * Server event handler type
 */
export type ServerEventHandler = (event: ServerEvent, data?: unknown) => void;

/**
 * Server class interface
 */
export interface Server {
  config: ServerConfig;
  status: ServerStatus;
  metrics: ServerMetrics;
  logger: ServerLogger;
  
  // Lifecycle methods
  start(): Promise<void>;
  stop(): Promise<void>;
  restart(): Promise<void>;
  
  // Middleware and plugins
  use(middleware: ServerMiddleware): void;
  register(plugin: ServerPlugin): Promise<void>;
  
  // Event handling
  on(event: ServerEvent, handler: ServerEventHandler): void;
  off(event: ServerEvent, handler: ServerEventHandler): void;
  
  // Health checks
  getHealth(): Promise<ServerHealth>;
  
  // Utility methods
  createContext(req: Request): ServerContext;
  handleError(error: Error): void;
}

/**
 * Server factory interface
 */
export interface ServerFactory {
  create(options: ServerOptions): Server;
}

/**
 * Server builder interface
 */
export interface ServerBuilder {
  setConfig(config: ServerConfig): this;
  addMiddleware(middleware: ServerMiddleware): this;
  addPlugin(plugin: ServerPlugin): this;
  build(): Server;
}
