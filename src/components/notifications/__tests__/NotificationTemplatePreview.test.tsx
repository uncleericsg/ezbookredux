import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { vi } from 'vitest';
import { Template } from '../types/templateTypes';
import { TEST_IDS } from '../constants/templateConstants';
import NotificationTemplatePreview from '../NotificationTemplatePreview';

// Mock clipboard API
Object.assign(navigator, {
  clipboard: {
    writeText: vi.fn()
  }
});

// Mock toast hook
vi.mock('@hooks/useToast', () => ({
  useToast: () => ({
    toast: vi.fn()
  })
}));

describe('NotificationTemplatePreview', () => {
  const mockTemplate: Template = {
    id: '1',
    name: 'Test Template',
    description: 'Test Description',
    content: 'Hello {{name}}, your appointment is on {{date}}.',
    type: 'email',
    category: 'transactional',
    userType: 'all',
    variables: ['name', 'date'],
    version: '1',
    lastModified: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy: 'test-user',
    isActive: true
  };

  const mockSampleData = {
    name: 'John',
    date: '2025-01-21'
  };

  it('renders preview with sample data', () => {
    render(
      <NotificationTemplatePreview
        template={mockTemplate}
        sampleData={mockSampleData}
      />
    );

    const preview = screen.getByTestId(TEST_IDS.messagePreview);
    expect(preview).toHaveTextContent('Hello John, your appointment is on 2025-01-21.');
  });

  it('switches between desktop and mobile views', () => {
    render(
      <NotificationTemplatePreview
        template={mockTemplate}
        sampleData={mockSampleData}
      />
    );

    const desktopButton = screen.getByTestId(TEST_IDS.desktopPreviewButton);
    const mobileButton = screen.getByTestId(TEST_IDS.mobilePreviewButton);

    fireEvent.click(mobileButton);
    expect(screen.getByTestId(TEST_IDS.messagePreview).parentElement).toHaveClass('max-w-sm');

    fireEvent.click(desktopButton);
    expect(screen.getByTestId(TEST_IDS.messagePreview).parentElement).not.toHaveClass('max-w-sm');
  });

  it('copies message to clipboard', async () => {
    render(
      <NotificationTemplatePreview
        template={mockTemplate}
        sampleData={mockSampleData}
      />
    );

    const copyButton = screen.getByTestId(TEST_IDS.copyButton);
    fireEvent.click(copyButton);

    await waitFor(() => {
      expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
        'Hello John, your appointment is on 2025-01-21.'
      );
    });
  });

  it('shows validation errors for invalid content', () => {
    const invalidTemplate = {
      ...mockTemplate,
      content: 'Hello {{name}}, your appointment is on {{invalidVar}}.'
    };

    render(
      <NotificationTemplatePreview
        template={invalidTemplate}
        sampleData={mockSampleData}
      />
    );

    expect(screen.getByText(/unprocessed variables/i)).toBeInTheDocument();
  });

  it('shows character count', () => {
    render(
      <NotificationTemplatePreview
        template={mockTemplate}
        sampleData={mockSampleData}
      />
    );

    const processedMessage = 'Hello John, your appointment is on 2025-01-21.';
    expect(screen.getByText(`${processedMessage.length} characters`)).toBeInTheDocument();
  });

  it('renders loading skeleton when isLoading is true', () => {
    render(
      <NotificationTemplatePreview
        template={mockTemplate}
        sampleData={mockSampleData}
        isLoading={true}
      />
    );

    expect(screen.getByTestId('preview-skeleton')).toBeInTheDocument();
  });

  it('sanitizes HTML content', () => {
    const templateWithHtml = {
      ...mockTemplate,
      content: '<p>Hello {{name}},</p><script>alert("xss")</script>'
    };

    render(
      <NotificationTemplatePreview
        template={templateWithHtml}
        sampleData={mockSampleData}
      />
    );

    const preview = screen.getByTestId(TEST_IDS.messagePreview);
    expect(preview).toHaveTextContent('Hello John,');
    expect(preview.innerHTML).not.toContain('<script>');
  });
});
