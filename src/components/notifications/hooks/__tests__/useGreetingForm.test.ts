import { renderHook, act } from '@testing-library/react';
import { useGreetingForm } from '../useGreetingForm';
import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock localStorage
const mockStore: Record<string, string> = {};
const localStorageMock = {
  getItem: vi.fn((key: string) => mockStore[key] || null),
  setItem: vi.fn((key: string, value: string) => {
    mockStore[key] = value;
  }),
  removeItem: vi.fn((key: string) => {
    delete mockStore[key];
  }),
  clear: vi.fn(() => {
    Object.keys(mockStore).forEach(key => delete mockStore[key]);
  }),
  length: 0,
  key: vi.fn(),
};

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
  writable: true
});

// Mock API functions directly instead of importing
const mockSaveGreeting = vi.fn();
const mockGenerateAIGreeting = vi.fn();

vi.mock('../../../../api/greetings', () => ({
  saveGreeting: () => mockSaveGreeting,
  generateAIGreeting: () => mockGenerateAIGreeting,
}));

describe('useGreetingForm', () => {
  let mockStore: Record<string, string> = {};

  beforeEach(() => {
    mockStore = {};
    mockSaveGreeting.mockReset();
    mockGenerateAIGreeting.mockReset();

    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: (key: string) => mockStore[key] || null,
        setItem: (key: string, value: string) => {
          mockStore[key] = value;
        },
        removeItem: (key: string) => {
          delete mockStore[key];
        },
        clear: () => {
          mockStore = {};
        },
        length: 0,
        key: () => null,
      },
      writable: true,
    });
  });

  const defaultProps = {
    onSave: mockSaveGreeting,
    onGenerateAI: mockGenerateAIGreeting,
  };

  it('should initialize with default values', () => {
    const { result } = renderHook(() => useGreetingForm(defaultProps));

    expect(result.current.message).toBe('');
    expect(result.current.errors).toEqual({});
    expect(result.current.isValid).toBe(false);
  });

  it('should load draft message from localStorage', () => {
    mockStore['greetingDraft'] = 'Test draft message';
    
    const { result } = renderHook(() => useGreetingForm(defaultProps));
    
    expect(result.current.message).toBe('Test draft message');
  });

  it('should update message and save draft to localStorage', () => {
    const { result } = renderHook(() => useGreetingForm(defaultProps));

    act(() => {
      result.current.setMessage('Test message');
    });

    expect(result.current.message).toBe('Test message');
    expect(mockStore['greetingDraft']).toBe('Test message');
  });

  it('should validate message length', () => {
    const { result } = renderHook(() => useGreetingForm(defaultProps));

    act(() => {
      result.current.setMessage('Hi');
    });

    expect(result.current.errors).toHaveProperty('message', 'Message must be at least 5 characters');
    expect(result.current.isValid).toBe(false);

    act(() => {
      result.current.setMessage('Hello World');
    });

    expect(result.current.errors).toEqual({});
    expect(result.current.isValid).toBe(true);
  });

  it('should handle save action', async () => {
    const { result } = renderHook(() => useGreetingForm(defaultProps));

    act(() => {
      result.current.setMessage('Hello World');
    });

    await act(async () => {
      await result.current.handleSave();
    });

    expect(mockSaveGreeting).toHaveBeenCalledWith('Hello World');
    expect(mockStore['greetingDraft']).toBeUndefined();
  });

  it('should handle AI generation', async () => {
    mockGenerateAIGreeting.mockResolvedValueOnce('AI generated message');
    
    const { result } = renderHook(() => useGreetingForm(defaultProps));

    await act(async () => {
      await result.current.handleGenerateAI();
    });

    expect(result.current.message).toBe('AI generated message');
    expect(mockStore['greetingDraft']).toBe('AI generated message');
  });

  it('should handle errors during save', async () => {
    mockSaveGreeting.mockRejectedValueOnce(new Error('Save failed'));
    
    const { result } = renderHook(() => useGreetingForm(defaultProps));

    act(() => {
      result.current.setMessage('Hello World');
    });

    await act(async () => {
      await result.current.handleSave();
    });

    expect(result.current.error).toBe('Failed to save greeting');
  });

  it('should handle errors during AI generation', async () => {
    mockGenerateAIGreeting.mockRejectedValueOnce(new Error('Generation failed'));
    
    const { result } = renderHook(() => useGreetingForm(defaultProps));

    await act(async () => {
      await result.current.handleGenerateAI();
    });

    expect(result.current.error).toBe('Failed to generate message');
  });
});
