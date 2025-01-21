import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { vi } from 'vitest';
import { toast } from 'sonner';
import type { Holiday, HolidayGreeting } from '@/types/holiday';
import HolidayGreetingModal from '../HolidayGreetingModal';

// Mock toast
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn()
  }
}));

describe('HolidayGreetingModal', () => {
  const mockHoliday: Holiday = {
    id: '2025-01-01',
    name: 'New Year',
    date: '2025-01-01',
    type: 'public',
    description: 'New Year celebration'
  };

  const mockGreeting: HolidayGreeting = {
    id: '2025-01-01',
    holiday: 'New Year',
    date: '2025-01-01',
    message: 'Happy New Year!',
    enabled: true,
    sendTime: '2025-01-01T09:00:00Z'
  };

  const mockOnClose = vi.fn();
  const mockOnSave = vi.fn();
  const mockOnGenerateMessage = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders with default values', () => {
    render(
      <HolidayGreetingModal
        holiday={mockHoliday}
        isOpen={true}
        onClose={mockOnClose}
        onSave={mockOnSave}
      />
    );

    expect(screen.getByText('New Year Greeting')).toBeInTheDocument();
    expect(screen.getByText(/Create or edit the greeting message/)).toBeInTheDocument();
    expect(screen.getByRole('textbox')).toHaveValue('');
    expect(screen.getByRole('switch')).toBeChecked();
  });

  it('renders with existing greeting', () => {
    render(
      <HolidayGreetingModal
        holiday={mockHoliday}
        isOpen={true}
        onClose={mockOnClose}
        onSave={mockOnSave}
        existingGreeting={mockGreeting}
      />
    );

    expect(screen.getByRole('textbox')).toHaveValue('Happy New Year!');
    expect(screen.getByRole('switch')).toBeChecked();
  });

  it('handles message generation', async () => {
    mockOnGenerateMessage.mockResolvedValueOnce('Generated greeting message');

    render(
      <HolidayGreetingModal
        holiday={mockHoliday}
        isOpen={true}
        onClose={mockOnClose}
        onSave={mockOnSave}
        onGenerateMessage={mockOnGenerateMessage}
      />
    );

    const generateButton = screen.getByRole('button', { name: /Generate/i });
    fireEvent.click(generateButton);

    await waitFor(() => {
      expect(screen.getByRole('textbox')).toHaveValue('Generated greeting message');
    });

    expect(mockOnGenerateMessage).toHaveBeenCalledWith(mockHoliday);
    expect(toast.success).toHaveBeenCalledWith('Message generated successfully');
  });

  it('handles message generation error', async () => {
    mockOnGenerateMessage.mockRejectedValueOnce(new Error('Generation failed'));

    render(
      <HolidayGreetingModal
        holiday={mockHoliday}
        isOpen={true}
        onClose={mockOnClose}
        onSave={mockOnSave}
        onGenerateMessage={mockOnGenerateMessage}
      />
    );

    const generateButton = screen.getByRole('button', { name: /Generate/i });
    fireEvent.click(generateButton);

    await waitFor(() => {
      expect(screen.getByText('Failed to generate message')).toBeInTheDocument();
    });

    expect(toast.error).toHaveBeenCalledWith('Failed to generate message');
  });

  it('handles save action', async () => {
    render(
      <HolidayGreetingModal
        holiday={mockHoliday}
        isOpen={true}
        onClose={mockOnClose}
        onSave={mockOnSave}
      />
    );

    const messageInput = screen.getByRole('textbox');
    fireEvent.change(messageInput, { target: { value: 'Test message' } });

    const saveButton = screen.getByRole('button', { name: /Save Changes/i });
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(mockOnSave).toHaveBeenCalledWith({
        id: mockHoliday.date,
        holiday: mockHoliday.name,
        date: mockHoliday.date,
        message: 'Test message',
        enabled: true,
        sendTime: expect.any(String)
      });
    });

    expect(toast.success).toHaveBeenCalledWith('Holiday greeting saved successfully');
    expect(mockOnClose).toHaveBeenCalled();
  });

  it('handles save error', async () => {
    mockOnSave.mockRejectedValueOnce(new Error('Save failed'));

    render(
      <HolidayGreetingModal
        holiday={mockHoliday}
        isOpen={true}
        onClose={mockOnClose}
        onSave={mockOnSave}
      />
    );

    const messageInput = screen.getByRole('textbox');
    fireEvent.change(messageInput, { target: { value: 'Test message' } });

    const saveButton = screen.getByRole('button', { name: /Save Changes/i });
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(screen.getByText('Failed to save greeting')).toBeInTheDocument();
    });

    expect(toast.error).toHaveBeenCalledWith('Failed to save greeting');
    expect(mockOnClose).not.toHaveBeenCalled();
  });

  it('validates empty message', async () => {
    render(
      <HolidayGreetingModal
        holiday={mockHoliday}
        isOpen={true}
        onClose={mockOnClose}
        onSave={mockOnSave}
      />
    );

    const saveButton = screen.getByRole('button', { name: /Save Changes/i });
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(screen.getByText('Message cannot be empty')).toBeInTheDocument();
    });

    expect(mockOnSave).not.toHaveBeenCalled();
    expect(mockOnClose).not.toHaveBeenCalled();
  });

  it('closes modal on cancel', () => {
    render(
      <HolidayGreetingModal
        holiday={mockHoliday}
        isOpen={true}
        onClose={mockOnClose}
        onSave={mockOnSave}
      />
    );

    const cancelButton = screen.getByRole('button', { name: /Cancel/i });
    fireEvent.click(cancelButton);

    expect(mockOnClose).toHaveBeenCalled();
  });
});
