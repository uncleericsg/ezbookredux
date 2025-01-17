import { ApiError, ErrorMetadata, ErrorReport } from '@server/types/error';
import type { Request } from 'express';

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

  public reportError(error: unknown, context?: string, req?: Request): void {
    const errorReport = this.createErrorReport(error, context, req);
    this.logError(errorReport);
    this.storeError(errorReport);
    this.sendToMonitoringService(errorReport);
  }

  private createErrorReport(error: unknown, context?: string, req?: Request): ErrorReport {
    const metadata = this.getErrorMetadata(error);
    const timestamp = new Date().toISOString();
    const environment = process.env.NODE_ENV || 'development';

    const errorReport: ErrorReport = {
      ...metadata,
      timestamp,
      environment,
      context: context ? { context } : undefined
    };

    if (req) {
      errorReport.request = {
        method: req.method,
        path: req.path,
        params: req.params,
        query: req.query,
        body: req.body
      };
    }

    return errorReport;
  }

  private getErrorMetadata(error: unknown): ErrorMetadata {
    if (error instanceof ApiError) {
      return {
        name: error.name,
        message: error.message,
        code: error.code,
        details: error.details,
        stack: error.stack
      };
    }

    if (error instanceof Error) {
      return {
        name: error.name,
        message: error.message,
        stack: error.stack
      };
    }

    return {
      message: String(error)
    };
  }

  private logError(errorReport: ErrorReport): void {
    console.error('[Error Report]', JSON.stringify(errorReport, null, 2));
  }

  private storeError(errorReport: ErrorReport): void {
    this.errorLog.push(errorReport);
    if (this.errorLog.length > 100) {
      this.errorLog.shift();
    }
  }

  private async sendToMonitoringService(errorReport: ErrorReport): Promise<void> {
    try {
      if (process.env.NODE_ENV === 'production' && process.env.ERROR_REPORTING_URL) {
        await fetch(process.env.ERROR_REPORTING_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(errorReport),
        });
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