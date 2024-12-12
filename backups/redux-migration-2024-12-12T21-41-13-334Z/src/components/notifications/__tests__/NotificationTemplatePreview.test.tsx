import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { NotificationTemplatePreview } from '../NotificationTemplatePreview';
import { Template } from '../../../types/notifications';
import { TEST_IDS } from '../constants/templateConstants';
import { LoadingScreen } from '../../LoadingScreen';

// Mock the clipboard API
Object.assign(navigator, {
  clipboard: {
    writeText: jest.fn(),
  },
});

// Mock the toast hook
jest.mock('../../../hooks/useToast', () => ({
  useToast: () => ({
    showToast: jest.fn(),
  }),
}));

const mockTemplate: Template = {
  id: '1',
  title: 'Welcome Message',
  message: 'Hello {name}, welcome to {company}!',
  type: 'email',
  variables: [
    { key: 'name', value: '', required: true },
    { key: 'company', value: '', required: true },
  ],
  status: 'active',
  lastModified: new Date().toISOString(),
  order: 1,
  content: '',
  triggerType: 'manual',
};

const mockSampleData = {
  name: 'John',
  company: 'Acme Inc',
};

describe('NotificationTemplatePreview', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders template with substituted variables', () => {
    render(
      <NotificationTemplatePreview
        template={mockTemplate}
        sampleData={mockSampleData}
      />
    );

    expect(screen.getByText('Welcome Message')).toBeInTheDocument();
    expect(screen.getByText('Hello John, welcome to Acme Inc!')).toBeInTheDocument();
  });

  it('shows error when required variables are missing', () => {
    render(
      <NotificationTemplatePreview
        template={mockTemplate}
        sampleData={{}}
      />
    );

    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByText(/Missing required variables/)).toBeInTheDocument();
  });

  it('shows character count and type', () => {
    render(
      <NotificationTemplatePreview
        template={mockTemplate}
        sampleData={mockSampleData}
      />
    );

    expect(screen.getByText(/characters/)).toBeInTheDocument();
    expect(screen.getByText('EMAIL')).toBeInTheDocument();
  });

  it('copies message to clipboard when copy button is clicked', async () => {
    render(
      <NotificationTemplatePreview
        template={mockTemplate}
        sampleData={mockSampleData}
      />
    );

    const copyButton = screen.getByRole('button', { name: /copy to clipboard/i });
    await userEvent.click(copyButton);

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
      'Hello John, welcome to Acme Inc!'
    );
  });

  it('renders in mobile preview mode', () => {
    render(
      <NotificationTemplatePreview
        template={mockTemplate}
        sampleData={mockSampleData}
        previewMode="mobile"
      />
    );

    expect(screen.getByText('Mobile Preview')).toBeInTheDocument();
  });

  it('renders in desktop preview mode by default', () => {
    render(
      <NotificationTemplatePreview
        template={mockTemplate}
        sampleData={mockSampleData}
      />
    );

    expect(screen.getByText('Desktop Preview')).toBeInTheDocument();
  });

  it('displays template variables section', () => {
    render(
      <NotificationTemplatePreview
        template={mockTemplate}
        sampleData={mockSampleData}
      />
    );

    expect(screen.getByText('Template Variables')).toBeInTheDocument();
    expect(screen.getByText('name: John')).toBeInTheDocument();
    expect(screen.getByText('company: Acme Inc')).toBeInTheDocument();
  });

  it('shows warning when message exceeds character limit', () => {
    const longTemplate = {
      ...mockTemplate,
      type: 'sms',
      message: 'A'.repeat(161),
    };

    render(
      <NotificationTemplatePreview
        template={longTemplate}
        sampleData={mockSampleData}
      />
    );

    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByText(/exceeds maximum length/)).toBeInTheDocument();
  });

  it('shows loading screen while loading', () => {
    render(<NotificationTemplatePreview isLoading={true} template={null} />);
    expect(screen.getByTestId('loading-screen')).toBeInTheDocument();
  });

  it('renders template content when not loading', () => {
    const template = {
      title: 'Test Template',
      content: 'Test Content',
      type: 'email'
    };
    render(<NotificationTemplatePreview isLoading={false} template={template} />);
    expect(screen.getByText('Test Template')).toBeInTheDocument();
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });
});
