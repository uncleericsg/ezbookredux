import { ApiError } from './apiErrors';

import type { Request } from 'express';


interface ErrorReport {
  error: Error;
  timestamp: string;
  context?: string;
  request?: {
    method?: string;
    path?: string;
    params?: any;
    query?: any;
    body?: any;
  };
  environment: string;
  stack?: string;
}

class ErrorReportingService {
  private static instance: ErrorReportingService;
  private errorLog: ErrorReport[] = [];

  private constructor() {}

  public static getInstance(): ErrorReportingService {
    if (!ErrorReportingService.instance) {
      ErrorReportingService.instance = new ErrorReportingService();
    }
    return ErrorReportingService.instance;
  }

  public reportError(
    error: Error,
    context?: string,
    req?: Request
  ): void {
    const errorReport: ErrorReport = {
      error,
      timestamp: new Date().toISOString(),
      context,
      environment: process.env.NODE_ENV || 'development',
      stack: error.stack,
    };

    if (req) {
      errorReport.request = {
        method: req.method,
        path: req.path,
        params: req.params,
        query: req.query,
        body: req.body,
      };
    }

    this.errorLog.push(errorReport);
    this.sendToMonitoringService(errorReport);
    this.logToConsole(errorReport);
  }

  private logToConsole(errorReport: ErrorReport): void {
    if (process.env.NODE_ENV === 'development') {
      console.error('[Error Report]', {
        message: errorReport.error.message,
        stack: errorReport.stack,
        context: errorReport.context,
        timestamp: errorReport.timestamp,
      });
    }
  }

  private async sendToMonitoringService(
    errorReport: ErrorReport
  ): Promise<void> {
    try {
      // In production, send to monitoring service
      if (process.env.NODE_ENV === 'production') {
        // await fetch(process.env.ERROR_REPORTING_URL, {
        //   method: 'POST',
        //   headers: {
        //     'Content-Type': 'application/json',
        //   },
        //   body: JSON.stringify(errorReport),
        // });
      }
    } catch (err) {
      console.error('Failed to send error report:', err);
    }
  }

  public getErrorLog(): ErrorReport[] {
    return [...this.errorLog];
  }

  public clearErrorLog(): void {
    this.errorLog = [];
  }
}

export const errorReportingService = ErrorReportingService.getInstance();