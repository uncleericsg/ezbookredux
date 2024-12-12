import { renderHook, act } from '@testing-library/react';
import { useGreetingForm } from '../useGreetingForm';
import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
};
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

// Mock API functions directly instead of importing
const mockSaveGreeting = vi.fn();
const mockGenerateAIGreeting = vi.fn();

vi.mock('../../../../api/greetings', () => ({
  saveGreeting: () => mockSaveGreeting,
  generateAIGreeting: () => mockGenerateAIGreeting,
}));

describe('useGreetingForm', () => {
  const mockProps = {
    onSave: vi.fn(),
    onGenerateAI: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    localStorageMock.getItem.mockReset();
    localStorageMock.setItem.mockReset();
    localStorageMock.removeItem.mockReset();
    mockSaveGreeting.mockReset();
    mockGenerateAIGreeting.mockReset();
  });

  it('initializes with default values', () => {
    const { result } = renderHook(() => useGreetingForm(mockProps));

    expect(result.current.message).toBe('');
    expect(result.current.isValid).toBe(false);
    expect(result.current.characterCount).toBe(0);
    expect(result.current.errors).toEqual(['Message is required']);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.isGenerating).toBe(false);
    expect(result.current.canUndo).toBe(false);
    expect(result.current.canRedo).toBe(false);
  });

  it('updates message and validation state', async () => {
    const { result } = renderHook(() => useGreetingForm(mockProps));

    await act(async () => {
      result.current.setMessage('Test message');
    });

    expect(result.current.message).toBe('Test message');
    expect(result.current.characterCount).toBe(12);
    expect(result.current.isValid).toBe(true);
    expect(result.current.errors).toEqual([]);
  });

  it('validates minimum message length', async () => {
    const { result } = renderHook(() => useGreetingForm(mockProps));

    await act(async () => {
      result.current.setMessage('');
    });

    expect(result.current.isValid).toBe(false);
    expect(result.current.errors).toContain('Message is required');
  });

  it('validates maximum message length', async () => {
    const { result } = renderHook(() => useGreetingForm(mockProps));

    await act(async () => {
      result.current.setMessage('a'.repeat(501));
      // Wait for validation to complete
      await result.current.form.trigger('message');
    });

    expect(result.current.isValid).toBe(false);
    expect(result.current.errors).toContain('Message must be less than 500 characters');
  });

  it('handles undo/redo correctly', async () => {
    const { result } = renderHook(() => useGreetingForm(mockProps));

    await act(async () => {
      result.current.setMessage('First message');
    });

    await act(async () => {
      result.current.setMessage('Second message');
    });

    expect(result.current.message).toBe('Second message');
    expect(result.current.canUndo).toBe(true);
    expect(result.current.canRedo).toBe(false);

    await act(async () => {
      result.current.handleUndo();
    });

    expect(result.current.message).toBe('First message');
    expect(result.current.canUndo).toBe(true);
    expect(result.current.canRedo).toBe(true);
  });

  it('saves draft messages to localStorage', async () => {
    const { result } = renderHook(() => useGreetingForm(mockProps));

    await act(async () => {
      result.current.setMessage('Draft message');
    });

    // Wait for the debounce timeout
    await new Promise(resolve => setTimeout(resolve, 1100));

    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      'greetingDraft',
      'Draft message'
    );
  });

  it('loads draft messages from localStorage', () => {
    localStorageMock.getItem.mockReturnValue('Saved draft');
    const { result } = renderHook(() => useGreetingForm(mockProps));

    expect(result.current.message).toBe('Saved draft');
  });

  it('handles save action with valid message', async () => {
    const { result } = renderHook(() => useGreetingForm(mockProps));

    await act(async () => {
      result.current.setMessage('Valid message');
      await result.current.handleSave({ message: 'Valid message' });
    });

    expect(mockProps.onSave).toHaveBeenCalledWith('Valid message');
  });

  it('handles AI generation', async () => {
    const generatedMessage = 'AI generated message';
    mockProps.onGenerateAI.mockResolvedValue(generatedMessage);

    const { result } = renderHook(() => useGreetingForm(mockProps));

    await act(async () => {
      result.current.setMessage('Initial message');
      await result.current.handleGenerateAI();
    });

    expect(result.current.message).toBe(generatedMessage);
  });

  it('handles API errors during save', async () => {
    const { result } = renderHook(() => useGreetingForm(mockProps));

    await act(async () => {
      result.current.setMessage('Test message');
      await result.current.form.trigger('message');
    });

    mockProps.onSave.mockRejectedValueOnce(new Error('Failed to save message'));

    await act(async () => {
      await result.current.handleSave({ message: 'Test message' });
    });

    expect(result.current.errors).toContain('Failed to save message');
  });
});
