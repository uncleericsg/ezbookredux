import { screen, fireEvent, waitFor } from '@testing-library/react'
import { HolidayGreetingModal } from '@components/notifications/HolidayGreetingModal'
import { renderWithProviders } from '../../../setup/renderWithProviders'
import { vi } from 'vitest'

describe('HolidayGreetingModal', () => {
  const mockOnClose = vi.fn()
  const mockOnSubmit = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders holiday greeting form', () => {
    renderWithProviders(
      <HolidayGreetingModal 
        isOpen={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
      />
    )

    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(screen.getByText(/holiday greeting/i)).toBeInTheDocument()
  })

  it('handles form submission', async () => {
    renderWithProviders(
      <HolidayGreetingModal 
        isOpen={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
      />
    )

    const messageInput = screen.getByRole('textbox', { name: /message/i })
    await fireEvent.change(messageInput, { 
      target: { value: 'Happy Holidays!' } 
    })

    const submitButton = screen.getByRole('button', { name: /send/i })
    await fireEvent.click(submitButton)

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        message: 'Happy Holidays!'
      })
    })
  })

  it('validates required fields', async () => {
    renderWithProviders(
      <HolidayGreetingModal 
        isOpen={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
      />
    )

    const submitButton = screen.getByRole('button', { name: /send/i })
    await fireEvent.click(submitButton)

    expect(await screen.findByText(/message is required/i)).toBeInTheDocument()
    expect(mockOnSubmit).not.toHaveBeenCalled()
  })

  it('closes modal when cancel clicked', async () => {
    renderWithProviders(
      <HolidayGreetingModal 
        isOpen={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
      />
    )

    const cancelButton = screen.getByRole('button', { name: /cancel/i })
    await fireEvent.click(cancelButton)

    expect(mockOnClose).toHaveBeenCalled()
  })
})