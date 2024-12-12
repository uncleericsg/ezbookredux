import { MessageFormData } from './messageValidation';

export interface AnalyticsEvent {
  eventName: string;
  timestamp: string;
  data: Record<string, any>;
}

export interface MessageMetrics {
  totalScheduled: number;
  totalSent: number;
  totalFailed: number;
  averageDeliveryTime: number;
  clickThroughRate: number;
}

class AnalyticsManager {
  private static instance: AnalyticsManager;
  private events: AnalyticsEvent[] = [];
  private metricsCache: Map<string, MessageMetrics> = new Map();

  private constructor() {}

  static getInstance(): AnalyticsManager {
    if (!AnalyticsManager.instance) {
      AnalyticsManager.instance = new AnalyticsManager();
    }
    return AnalyticsManager.instance;
  }

  trackEvent(eventName: string, data: Record<string, any>) {
    const event: AnalyticsEvent = {
      eventName,
      timestamp: new Date().toISOString(),
      data,
    };

    this.events.push(event);
    this.sendToAnalytics(event);
  }

  private async sendToAnalytics(event: AnalyticsEvent) {
    try {
      // Implement your analytics API call here
      console.log('Analytics event:', event);
    } catch (error) {
      console.error('Failed to send analytics:', error);
    }
  }

  trackMessageScheduled(message: MessageFormData) {
    this.trackEvent('message_scheduled', {
      content: message.content,
      scheduledDate: message.scheduledDate,
      scheduledTime: message.scheduledTime,
      frequency: message.frequency,
      userType: message.userType,
    });
  }

  trackMessageSent(messageId: string, success: boolean) {
    this.trackEvent('message_sent', {
      messageId,
      success,
      timestamp: new Date().toISOString(),
    });
  }

  trackMessageClicked(messageId: string, userId: string) {
    this.trackEvent('message_clicked', {
      messageId,
      userId,
      timestamp: new Date().toISOString(),
    });
  }

  trackError(error: Error, context: string) {
    this.trackEvent('error', {
      message: error.message,
      stack: error.stack,
      context,
    });
  }

  async getMessageMetrics(timeframe: 'day' | 'week' | 'month'): Promise<MessageMetrics> {
    const cacheKey = `metrics_${timeframe}`;
    if (this.metricsCache.has(cacheKey)) {
      return this.metricsCache.get(cacheKey)!;
    }

    // Implement your metrics calculation here
    const metrics: MessageMetrics = {
      totalScheduled: 0,
      totalSent: 0,
      totalFailed: 0,
      averageDeliveryTime: 0,
      clickThroughRate: 0,
    };

    this.metricsCache.set(cacheKey, metrics);
    return metrics;
  }

  clearCache() {
    this.metricsCache.clear();
  }
}

export const analytics = AnalyticsManager.getInstance();

// React hooks for analytics
export function useMessageAnalytics() {
  const trackSchedule = useCallback((message: MessageFormData) => {
    analytics.trackMessageScheduled(message);
  }, []);

  const trackSend = useCallback((messageId: string, success: boolean) => {
    analytics.trackMessageSent(messageId, success);
  }, []);

  const trackClick = useCallback((messageId: string, userId: string) => {
    analytics.trackMessageClicked(messageId, userId);
  }, []);

  const trackError = useCallback((error: Error, context: string) => {
    analytics.trackError(error, context);
  }, []);

  return {
    trackSchedule,
    trackSend,
    trackClick,
    trackError,
  };
}

// Performance monitoring
export function usePerformanceMonitoring() {
  const startTime = useRef(Date.now());

  useEffect(() => {
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        analytics.trackEvent('performance', {
          name: entry.name,
          duration: entry.duration,
          startTime: entry.startTime,
          entryType: entry.entryType,
        });
      }
    });

    observer.observe({ entryTypes: ['measure', 'paint', 'largest-contentful-paint'] });

    return () => {
      observer.disconnect();
      const duration = Date.now() - startTime.current;
      analytics.trackEvent('component_lifetime', { duration });
    };
  }, []);

  const measureOperation = useCallback((name: string, operation: () => void) => {
    const start = performance.now();
    operation();
    const duration = performance.now() - start;
    analytics.trackEvent('operation_performance', { name, duration });
  }, []);

  return {
    measureOperation,
  };
}
