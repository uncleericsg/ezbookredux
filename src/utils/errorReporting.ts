import type { ErrorInfo } from 'react';

interface ErrorReport {
  error: Error;
  errorInfo: ErrorInfo;
  timestamp: string;
  componentName?: string;
  userAgent: string;
  environment: string;
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

  public reportError(error: Error, errorInfo: ErrorInfo, componentName?: string): void {
    const errorReport: ErrorReport = {
      error,
      errorInfo,
      timestamp: new Date().toISOString(),
      componentName,
      userAgent: navigator.userAgent,
      environment: process.env.NODE_ENV,
    };

    this.errorLog.push(errorReport);
    this.sendErrorReport(errorReport);

    // Keep only last 100 errors
    if (this.errorLog.length > 100) {
      this.errorLog = this.errorLog.slice(-100);
    }
  }

  private async sendErrorReport(errorReport: ErrorReport): Promise<void> {
    // In development, just log to console
    if (process.env.NODE_ENV === 'development') {
      console.group('Error Report');
      console.error('Error:', errorReport.error);
      console.error('Component Stack:', errorReport.errorInfo.componentStack);
      console.error('Component Name:', errorReport.componentName);
      console.error('Timestamp:', errorReport.timestamp);
      console.groupEnd();
      return;
    }

    // In production, you would send to your error reporting service
    try {
      // Example: Send to your error reporting endpoint
      // await fetch('/api/error-reporting', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(errorReport),
      // });
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
