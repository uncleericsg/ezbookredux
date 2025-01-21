import { renderHook, act } from '@testing-library/react';
import { vi } from 'vitest';
import { toast } from 'sonner';
import { useBookingState } from '../useBookingState';

// Mock toast
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn()
  }
}));

describe('useBookingState', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('initializes with default state', () => {
    const { result } = renderHook(() => useBookingState());

    expect(result.current.state).toEqual({
      status: 'PENDING',
      data: {},
      error: null,
      warnings: [],
      isLoading: false
    });
    expect(result.current.isInProgress).toBe(true);
  });

  it('handles service selection', () => {
    const { result } = renderHook(() => useBookingState());

    act(() => {
      result.current.dispatch({ type: 'SET_SERVICE', serviceId: 'service-1' });
    });

    expect(result.current.state.data.serviceId).toBe('service-1');
  });

  it('handles date selection', () => {
    const { result } = renderHook(() => useBookingState());
    const date = '2025-01-21T10:00:00Z';

    act(() => {
      result.current.dispatch({ type: 'SET_DATE', scheduledAt: date });
    });

    expect(result.current.state.data.scheduledAt).toBe(date);
  });

  it('validates required fields before confirmation', () => {
    const { result } = renderHook(() => useBookingState());

    act(() => {
      result.current.dispatch({ type: 'CONFIRM_BOOKING' });
    });

    expect(result.current.state.error).toBe('Missing required booking information');
    expect(toast.error).toHaveBeenCalledWith('Missing required booking information');
  });

  it('confirms booking with valid data', () => {
    const { result } = renderHook(() => useBookingState());

    act(() => {
      result.current.dispatch({ type: 'SET_SERVICE', serviceId: 'service-1' });
      result.current.dispatch({ type: 'SET_DATE', scheduledAt: '2025-01-21T10:00:00Z' });
      result.current.dispatch({ type: 'CONFIRM_BOOKING' });
    });

    expect(result.current.state.status).toBe('CONFIRMED');
    expect(result.current.state.error).toBeNull();
    expect(toast.success).toHaveBeenCalledWith('Booking confirmed successfully');
  });

  it('handles booking cancellation', () => {
    const { result } = renderHook(() => useBookingState());

    act(() => {
      result.current.dispatch({ type: 'CANCEL_BOOKING' });
    });

    expect(result.current.state.status).toBe('CANCELLED');
    expect(toast.error).toHaveBeenCalledWith('Booking cancelled');
  });

  it('handles booking completion', () => {
    const { result } = renderHook(() => useBookingState());

    act(() => {
      result.current.dispatch({ type: 'COMPLETE_BOOKING' });
    });

    expect(result.current.state.status).toBe('COMPLETED');
    expect(toast.success).toHaveBeenCalledWith('Booking completed successfully');
  });

  it('handles errors', () => {
    const { result } = renderHook(() => useBookingState());
    const errorMessage = 'Test error message';

    act(() => {
      result.current.dispatch({ type: 'SET_ERROR', error: errorMessage });
    });

    expect(result.current.state.error).toBe(errorMessage);
    expect(toast.error).toHaveBeenCalledWith(errorMessage);
  });

  it('handles warnings', () => {
    const { result } = renderHook(() => useBookingState());
    const warning = 'Test warning message';

    act(() => {
      result.current.dispatch({ type: 'ADD_WARNING', warning });
    });

    expect(result.current.state.warnings).toContain(warning);
    expect(toast.error).toHaveBeenCalledWith(warning);
  });

  it('resets state', () => {
    const { result } = renderHook(() => useBookingState());

    act(() => {
      result.current.dispatch({ type: 'SET_SERVICE', serviceId: 'service-1' });
      result.current.dispatch({ type: 'SET_DATE', scheduledAt: '2025-01-21T10:00:00Z' });
      result.current.reset();
    });

    expect(result.current.state).toEqual({
      status: 'PENDING',
      data: {},
      error: null,
      warnings: [],
      isLoading: false
    });
  });

  it('tracks loading state', () => {
    const { result } = renderHook(() => useBookingState());

    act(() => {
      result.current.dispatch({ type: 'SET_LOADING', isLoading: true });
    });

    expect(result.current.state.isLoading).toBe(true);
    expect(result.current.isInProgress).toBe(true);

    act(() => {
      result.current.dispatch({ type: 'SET_LOADING', isLoading: false });
    });

    expect(result.current.state.isLoading).toBe(false);
  });
});