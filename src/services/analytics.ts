import { CustomerFormData } from '@components/booking/CustomerForm';

export interface BookingAnalytics {
  stepStarted: string;
  stepCompleted: string;
  timeSpent: number;
  userAgent: string;
  screenSize: {
    width: number;
    height: number;
  };
}

class AnalyticsService {
  private startTime: number = Date.now();
  private readonly SESSION_ID = Math.random().toString(36).substring(7);

  private track(eventName: string, properties: Record<string, any> = {}) {
    // Replace with your actual analytics provider (e.g., Google Analytics, Mixpanel)
    console.log('Analytics Event:', {
      eventName,
      sessionId: this.SESSION_ID,
      timestamp: new Date().toISOString(),
      ...properties,
    });
  }

  public trackStepStart(stepId: string) {
    this.startTime = Date.now();
    this.track('booking_step_started', {
      stepId,
      deviceType: this.getDeviceType(),
      screenSize: {
        width: window.innerWidth,
        height: window.innerHeight
      }
    });
  }

  public trackStepComplete(stepId: string, success: boolean = true) {
    const timeSpent = Date.now() - this.startTime;
    this.track('booking_step_completed', {
      stepId,
      success,
      timeSpent,
      deviceType: this.getDeviceType()
    });
  }

  public trackFormValidation(stepId: string, errors: Record<string, string>) {
    this.track('form_validation_error', {
      stepId,
      errorCount: Object.keys(errors).length,
      errorFields: Object.keys(errors),
      deviceType: this.getDeviceType()
    });
  }

  public trackBookingTimeout() {
    this.track('booking_timeout', {
      lastStepId: window.location.pathname,
      timeSpent: Date.now() - this.startTime,
      deviceType: this.getDeviceType()
    });
  }

  public trackBookingComplete(customerData: CustomerFormData) {
    this.track('booking_completed', {
      timeSpent: Date.now() - this.startTime,
      deviceType: this.getDeviceType(),
      postalCode: customerData.postalCode // For geographic analysis
    });
  }

  private getDeviceType(): 'mobile' | 'tablet' | 'desktop' {
    const width = window.innerWidth;
    if (width < 768) return 'mobile';
    if (width < 1024) return 'tablet';
    return 'desktop';
  }
}

export const analytics = new AnalyticsService();
