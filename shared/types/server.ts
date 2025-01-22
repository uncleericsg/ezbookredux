import type { Express, Request, Response, NextFunction } from 'express';
import type { Server } from 'http';
import type { MiddlewareConfig } from './middleware';
import type { LoggerConfig } from './logger';

/**
 * Server configuration
 */
export interface ServerConfig {
  /**
   * Port number
   */
  port: number;

  /**
   * Host name
   */
  host: string;

  /**
   * Environment
   */
  env: 'development' | 'production' | 'test';

  /**
   * API version
   */
  apiVersion: string;

  /**
   * Base URL
   */
  baseUrl: string;

  /**
   * Middleware configuration
   */
  middleware: MiddlewareConfig;

  /**
   * Logger configuration
   */
  logger: LoggerConfig;

  /**
   * Trust proxy
   */
  trustProxy?: boolean;

  /**
   * CORS origin
   */
  corsOrigin?: string | string[];

  /**
   * Rate limit window (ms)
   */
  rateLimitWindow?: number;

  /**
   * Rate limit max requests
   */
  rateLimitMax?: number;
}

/**
 * Server instance
 */
export interface ServerInstance {
  /**
   * Express app
   */
  app: Express;

  /**
   * HTTP server
   */
  server: Server;

  /**
   * Start server
   */
  start(): Promise<void>;

  /**
   * Stop server
   */
  stop(): Promise<void>;

  /**
   * Get server config
   */
  getConfig(): ServerConfig;

  /**
   * Use middleware
   */
  use(path: string, ...handlers: ((req: Request, res: Response, next: NextFunction) => void)[]): void;
}

export type { Express, Request, Response, NextFunction, Server };
