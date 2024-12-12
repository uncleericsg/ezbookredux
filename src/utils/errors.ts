import { toast } from 'sonner';

export enum BookingErrorCode {
  BOOKING_IN_PROGRESS = 'BOOKING_IN_PROGRESS',
  SLOT_UNAVAILABLE = 'SLOT_UNAVAILABLE',
  AMC_INVALID = 'AMC_INVALID',
  MAX_BOOKINGS = 'MAX_BOOKINGS',
  NETWORK = 'NETWORK_ERROR',
  VALIDATION = 'VALIDATION_ERROR',
  AVAILABILITY = 'AVAILABILITY_ERROR',
  AUTH = 'AUTH_ERROR',
  RATE_LIMIT = 'RATE_LIMIT',
  UNKNOWN = 'UNKNOWN_ERROR'
}

export class BookingError extends Error {
  constructor(
    message: string,
    public code: BookingErrorCode,
    public retry?: boolean,
    public toast?: boolean
  ) {
    super(message);
    this.name = 'BookingError';
  }

  static network(message = 'Network error. Please check your connection.'): BookingError {
    return new BookingError(message, BookingErrorCode.NETWORK, true, true);
  }

  static validation(message: string): BookingError {
    return new BookingError(message, BookingErrorCode.VALIDATION, false, true);
  }

  static availability(message: string): BookingError {
    return new BookingError(message, BookingErrorCode.AVAILABILITY, false, true);
  }

  static auth(message = 'Please log in to continue.'): BookingError {
    return new BookingError(message, BookingErrorCode.AUTH, false, true);
  }

  static rateLimit(message = 'Too many requests. Please try again later.'): BookingError {
    return new BookingError(message, BookingErrorCode.RATE_LIMIT, true, true);
  }

  static bookingInProgress(): BookingError {
    return new BookingError(
      'A booking is already in progress',
      BookingErrorCode.BOOKING_IN_PROGRESS,
      false,
      true
    );
  }

  static slotUnavailable(): BookingError {
    return new BookingError(
      'This time slot is no longer available',
      BookingErrorCode.SLOT_UNAVAILABLE,
      false,
      true
    );
  }

  static amcInvalid(message = 'Your AMC package is not active'): BookingError {
    return new BookingError(
      message,
      BookingErrorCode.AMC_INVALID,
      false,
      true
    );
  }

  static maxBookings(): BookingError {
    return new BookingError(
      'Maximum number of pending bookings reached',
      BookingErrorCode.MAX_BOOKINGS,
      false,
      true
    );
  }
}

export const handleBookingError = (error: unknown): string => {
  if (error instanceof BookingError) {
    if (error.toast) {
      toast.error(error.message);
      
      switch (error.code) {
        case BookingErrorCode.SLOT_UNAVAILABLE:
          toast.warning('Please select another time slot');
          break;
        case BookingErrorCode.AMC_INVALID:
          toast.warning('Please renew your AMC package to continue');
          break;
        case BookingErrorCode.MAX_BOOKINGS:
          toast.warning('Please complete or cancel existing bookings first');
          break;
        case BookingErrorCode.RATE_LIMIT:
          toast.warning('You will be automatically retried in a moment...');
          break;
      }
      
    }
    return error.message;
  }

  if (error instanceof Error) {
    if (error.message.includes('network')) {
      return handleBookingError(BookingError.network());
    }

    if (error.message.includes('timeout')) {
      return handleBookingError(
        BookingError.network('Request timed out. Please try again.')
      );
    }
    
    if (error.message.includes('rate limit')) {
      return handleBookingError(BookingError.rateLimit());
    }
  }

  const message = 'An unexpected error occurred. Please try again.';
  toast.error(message);
  return message;
};

export const isRetryableError = (error: unknown): boolean => {
  if (error instanceof BookingError) {
    return error.retry === true;
  }
  
  if (error instanceof Error) {
    return error.message.includes('network') || 
           error.message.includes('timeout') ||
           error.message.includes('rate limit') ||
           error.message.includes('unavailable');
  }
  
  return false;
};

export const getErrorRecoveryMessage = (error: unknown): string | null => {
  if (error instanceof BookingError) {
    switch (error.code) {
      case BookingErrorCode.SLOT_UNAVAILABLE:
        return 'Try selecting a different time slot';
      case BookingErrorCode.AMC_INVALID:
        return 'Visit the AMC page to renew your package';
      case BookingErrorCode.MAX_BOOKINGS:
        return 'View your dashboard to manage existing bookings';
      case BookingErrorCode.NETWORK:
        return 'Check your internet connection and try again';
      default:
        return null;
    }
  }
  return null;
};