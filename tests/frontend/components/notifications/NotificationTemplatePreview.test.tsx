import { screen, waitFor, fireEvent } from '@testing-library/react'
import React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'

import { NotificationTemplatePreview } from '@/components/notifications/NotificationTemplatePreview.js'
import { renderWithProviders } from '@test-utils/renderWithProviders.js'
import { userEventSetup } from '@test-utils/test-setup.js'

import type { Template } from '@/types/notifications.js'


// Mock dependencies
vi.mock('@/hooks/useToast.js', () => ({
  useToast: () => ({
    toast: vi.fn()
  })
}))

vi.mock('@/components/notifications/adapters/validationAdapter.js', () => ({
  ValidationAdapter: {
    validate: vi.fn().mockReturnValue({ errors: [] })
  }
}))

vi.mock('@/components/ui/skeleton.js', () => ({
  Skeleton: () => <div data-testid="loading-skeleton">Loading...</div>
}))

// Mock clipboard API
const mockClipboard = {
  writeText: vi.fn()
}
Object.assign(navigator, {
  clipboard: mockClipboard
})

const mockTemplate: Template = {
  id: 'template-1',
  title: 'Test Template',
  content: 'Hello {{name}}, your appointment is on {{date}}',
  message: 'Hello {{name}}, your appointment is on {{date}}',
  type: 'sms',
  status: 'active',
  triggerType: 'manual',
  lastModified: new Date().toISOString(),
  order: 1,
  variables: [
    { key: 'name', value: '', required: true },
    { key: 'date', value: '', required: true }
  ]
}

const mockSampleData = {
  name: 'John Doe',
  date: '2024-01-26'
}

describe('NotificationTemplatePreview', () => {
  const user = userEventSetup()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders template preview correctly', () => {
    renderWithProviders(
      <NotificationTemplatePreview
        template={mockTemplate}
        sampleData={mockSampleData}
      />
    )

    expect(screen.getByText(/test template/i)).toBeInTheDocument()
    expect(screen.getByText(/hello john doe, your appointment is on 2024-01-26/i)).toBeInTheDocument()
  })

  it('shows loading state', () => {
    renderWithProviders(
      <NotificationTemplatePreview
        template={mockTemplate}
        sampleData={mockSampleData}
        isLoading={true}
      />
    )

    expect(screen.getByTestId('loading-skeleton')).toBeInTheDocument()
  })

  it('shows missing variable placeholders', () => {
    const incompleteSampleData = { name: 'John Doe' }
    
    renderWithProviders(
      <NotificationTemplatePreview
        template={mockTemplate}
        sampleData={incompleteSampleData}
      />
    )

    expect(screen.getByText(/hello john doe, your appointment is on \{\{date\}\}/i)).toBeInTheDocument()
  })

  it('toggles between desktop and mobile views', async () => {
    renderWithProviders(
      <NotificationTemplatePreview
        template={mockTemplate}
        sampleData={mockSampleData}
      />
    )

    const desktopButton = screen.getByRole('button', { name: /desktop view/i })
    const mobileButton = screen.getByRole('button', { name: /mobile view/i })

    await user.click(desktopButton)
    expect(desktopButton).toHaveClass('bg-muted')

    await user.click(mobileButton)
    expect(mobileButton).toHaveClass('bg-muted')
  })

  it('handles copy functionality', async () => {
    renderWithProviders(
      <NotificationTemplatePreview
        template={mockTemplate}
        sampleData={mockSampleData}
      />
    )

    const copyButton = screen.getByRole('button', { name: /copy message/i })
    await user.click(copyButton)

    expect(mockClipboard.writeText).toHaveBeenCalledWith(
      'Hello John Doe, your appointment is on 2024-01-26'
    )
  })
})