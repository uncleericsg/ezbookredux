import React from 'react';
import { render, screen, fireEvent, waitFor } from '../../../__test__/test-utils';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import HolidayGreetingModal from '../HolidayGreetingModal';
import { ErrorBoundary } from '../ErrorBoundary';

// Mock the useGreetingForm hook
const mockUseGreetingForm = {
  message: 'Test message',
  setMessage: vi.fn(),
  isValid: true,
  characterCount: 12,
  errors: [],
  isLoading: false,
  isGenerating: false,
  canUndo: true,
  canRedo: true,
  handleSave: vi.fn(),
  handleGenerateAI: vi.fn(),
  handleUndo: vi.fn(),
  handleRedo: vi.fn(),
  form: {
    register: vi.fn(() => ({ onChange: vi.fn(), onBlur: vi.fn(), name: 'message' })),
    handleSubmit: (fn: any) => (e: any) => { e?.preventDefault(); return fn(); },
    formState: { errors: {} },
    watch: vi.fn(),
    setValue: vi.fn(),
  },
};

vi.mock('../hooks/useGreetingForm', () => ({
  useGreetingForm: vi.fn(() => mockUseGreetingForm),
}));

// Mock the useModalAccessibility hook
vi.mock('../hooks/useModalAccessibility', () => ({
  useModalAccessibility: () => ({
    modalRef: { current: null },
  }),
}));

// Mock the formatDate function
vi.mock('../utils/holidayGreetings', () => ({
  formatDate: vi.fn(() => 'Monday, January 1, 2024'),
}));

// Mock the ErrorBoundary component
vi.mock('../ErrorBoundary', () => ({
  ErrorBoundary: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

describe('HolidayGreetingModal', () => {
  const mockHoliday = {
    id: '1',
    holiday: 'New Year',
    date: '2024-01-01',
  };

  const defaultProps = {
    holiday: mockHoliday,
    isOpen: true,
    onClose: vi.fn(),
    onSave: vi.fn(),
    aiEnabled: true,
    onGenerateAI: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockUseGreetingForm.message = 'Test message';
    mockUseGreetingForm.isValid = true;
    mockUseGreetingForm.characterCount = 12;
    mockUseGreetingForm.errors = [];
    mockUseGreetingForm.isLoading = false;
  });

  it('renders correctly when open', () => {
    render(<HolidayGreetingModal {...defaultProps} />);
    
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('New Year')).toBeInTheDocument();
    expect(screen.getByText('Monday, January 1, 2024')).toBeInTheDocument();
    expect(screen.getByLabelText(/greeting message/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/enter your holiday greeting message/i)).toBeInTheDocument();
  });

  it('does not render when closed', () => {
    render(<HolidayGreetingModal {...defaultProps} isOpen={false} />);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('handles close button click', async () => {
    render(<HolidayGreetingModal {...defaultProps} />);
    const closeButton = screen.getByRole('button', { name: /close/i });
    await userEvent.click(closeButton);
    expect(defaultProps.onClose).toHaveBeenCalled();
  });

  it('shows AI generation button when aiEnabled is true', () => {
    render(<HolidayGreetingModal {...defaultProps} />);
    expect(screen.getByRole('button', { name: /generate with ai/i })).toBeInTheDocument();
  });

  it('hides AI generation button when aiEnabled is false', () => {
    render(<HolidayGreetingModal {...defaultProps} aiEnabled={false} />);
    expect(screen.queryByRole('button', { name: /generate with ai/i })).not.toBeInTheDocument();
  });

  it('displays character count', () => {
    mockUseGreetingForm.message = 'Hello';
    mockUseGreetingForm.characterCount = 5;

    render(<HolidayGreetingModal {...defaultProps} />);
    expect(screen.getByText(/5\/500/)).toBeInTheDocument();
  });

  it('displays undo/redo buttons', () => {
    render(<HolidayGreetingModal {...defaultProps} />);
    
    expect(screen.getByRole('button', { name: /undo/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /redo/i })).toBeInTheDocument();
  });

  it('handles form submission', async () => {
    mockUseGreetingForm.handleSave.mockResolvedValueOnce(undefined);

    render(<HolidayGreetingModal {...defaultProps} />);
    
    const submitButton = screen.getByRole('button', { name: /save/i });
    await userEvent.click(submitButton);
    
    expect(mockUseGreetingForm.handleSave).toHaveBeenCalled();
  });

  it('displays loading state during save', () => {
    mockUseGreetingForm.isLoading = true;

    render(<HolidayGreetingModal {...defaultProps} />);
    
    const saveButton = screen.getByRole('button', { name: /saving\.\.\./i });
    expect(saveButton).toBeInTheDocument();
    expect(saveButton).toBeDisabled();
  });

  it('displays validation errors', () => {
    mockUseGreetingForm.errors = ['Message is required'];
    mockUseGreetingForm.isValid = false;

    render(<HolidayGreetingModal {...defaultProps} />);
    
    expect(screen.getByText('Message is required')).toBeInTheDocument();
  });
});
