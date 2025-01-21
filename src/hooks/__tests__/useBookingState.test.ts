import { renderHook, act } from '@testing-library/react';
import type { RenderHookResult } from '@testing-library/react';
import { 
  useBookingState, 
  hasRequiredDetails, 
  hasPaymentDetails, 
  getFormattedBookingTime, 
  getBookingSummary,
  type BookingDetails,
  type PaymentDetails,
  type UseBookingState
} from '../useBookingState';
import type { BookingState } from '../../machines/bookingMachine';
import { toast } from 'sonner';

// Mock toast
jest.mock('sonner', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
    warning: jest.fn()
  }
}));

describe('Booking State Management', () => {
  const mockUser = {
    id: 'user-1',
    email: 'test@example.com',
    firstName: 'John',
    lastName: 'Doe',
    amcStatus: 'active'
  } as const;

  const mockService = {
    id: 'service-1',
    name: 'AC Service',
    description: 'Regular AC maintenance',
    type: 'maintenance',
    price: 100,
    visible: true,
    order: 1
  } as const;

  const mockBookingDetails: BookingDetails = {
    user: mockUser,
    notes: 'Test notes',
    phone: '1234567890',
    email: 'test@example.com'
  };

  const mockPaymentDetails: PaymentDetails = {
    amount: 100,
    currency: 'SGD',
    method: 'card',
    reference: 'pay_123'
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('useBookingState', () => {
    it('should initialize with default state', () => {
      const { result } = renderHook(() => useBookingState() as any);
      
      expect(result.current.state).toEqual({
        status: 'IDLE',
        warnings: [],
        error: undefined
      });
      expect(result.current.isInProgress).toBe(false);
    });

    it('should handle service selection', () => {
      const { result } = renderHook(() => useBookingState() as any);

      act(() => {
        result.current.dispatch({
          type: 'SELECT_SERVICE',
          payload: mockService
        });
      });

      expect(result.current.state.status).toBe('SELECTING_DATE');
      expect(result.current.state.service).toEqual(mockService);
      expect(result.current.isInProgress).toBe(true);
    });

    it('should handle date selection', () => {
      const { result } = renderHook(() => useBookingState() as any);

      act(() => {
        result.current.dispatch({
          type: 'SELECT_SERVICE',
          payload: mockService
        });
      });

      act(() => {
        result.current.dispatch({
          type: 'SELECT_DATE',
          payload: {
            date: '2025-01-21',
            time: '14:00'
          }
        });
      });

      expect(result.current.state.status).toBe('ENTERING_DETAILS');
      expect(result.current.state.date).toBe('2025-01-21');
      expect(result.current.state.time).toBe('14:00');
    });

    it('should prevent date selection without service', () => {
      const { result } = renderHook(() => useBookingState() as any);

      act(() => {
        result.current.dispatch({
          type: 'SELECT_DATE',
          payload: {
            date: '2025-01-21',
            time: '14:00'
          }
        });
      });

      expect(result.current.state.status).toBe('ERROR');
      expect(result.current.state.error).toBe('Must select service first');
    });
  });

  describe('Time Formatting', () => {
    it('should format valid date and time', () => {
      const state: BookingState = {
        status: 'CONFIRMING',
        date: '2025-01-21',
        time: '14:00',
        warnings: []
      };

      const formatted = getFormattedBookingTime(state);
      expect(formatted).toContain('Tuesday, January 21, 2025');
      expect(formatted).toContain('2:00 PM');
    });

    it('should handle invalid time format', () => {
      const state: BookingState = {
        status: 'CONFIRMING',
        date: '2025-01-21',
        time: 'invalid',
        warnings: []
      };

      const formatted = getFormattedBookingTime(state);
      expect(formatted).toBe('');
    });

    it('should handle invalid date format', () => {
      const state: BookingState = {
        status: 'CONFIRMING',
        date: 'invalid',
        time: '14:00',
        warnings: []
      };

      const formatted = getFormattedBookingTime(state);
      expect(formatted).toBe('');
    });

    it('should handle missing date or time', () => {
      const state: BookingState = {
        status: 'CONFIRMING',
        warnings: []
      };

      const formatted = getFormattedBookingTime(state);
      expect(formatted).toBe('');
    });
  });

  describe('State Validation', () => {
    it('should validate required details', () => {
      const validState: BookingState = {
        status: 'CONFIRMING',
        service: mockService,
        date: '2025-01-21',
        time: '14:00',
        details: mockBookingDetails,
        warnings: []
      };

      const invalidState: BookingState = {
        status: 'CONFIRMING',
        warnings: []
      };

      expect(hasRequiredDetails(validState)).toBe(true);
      expect(hasRequiredDetails(invalidState)).toBe(false);
    });

    it('should validate payment details', () => {
      const validState: BookingState = {
        status: 'CONFIRMED',
        payment: mockPaymentDetails,
        warnings: []
      };

      const invalidState: BookingState = {
        status: 'CONFIRMED',
        warnings: []
      };

      expect(hasPaymentDetails(validState)).toBe(true);
      expect(hasPaymentDetails(invalidState)).toBe(false);
    });
  });

  describe('Booking Summary', () => {
    it('should generate complete summary', () => {
      const state: BookingState = {
        status: 'CONFIRMED',
        service: mockService,
        date: '2025-01-21',
        time: '14:00',
        details: mockBookingDetails,
        payment: mockPaymentDetails,
        warnings: []
      };

      const summary = getBookingSummary(state);
      expect(summary).toContain('AC Service');
      expect(summary).toContain('Tuesday, January 21, 2025');
      expect(summary).toContain('2:00 PM');
      expect(summary).toContain('John Doe');
      expect(summary).toContain('100 SGD');
    });

    it('should handle missing optional fields', () => {
      const state: BookingState = {
        status: 'CONFIRMED',
        service: mockService,
        warnings: []
      };

      const summary = getBookingSummary(state);
      expect(summary).toContain('AC Service');
      expect(summary).not.toContain('Time:');
      expect(summary).not.toContain('Customer:');
      expect(summary).not.toContain('Payment:');
    });
  });
});