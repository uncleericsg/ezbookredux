import { screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React from 'react'
import { describe, it, expect, vi } from 'vitest'

import { LoginModal } from '../../../../src/components/auth/LoginModal'
import { renderWithProviders } from '../../../setup/renderWithProviders'

describe('LoginModal', () => {
  const mockOnClose = vi.fn()
  const mockOnSuccess = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders login form', async () => {
    renderWithProviders(<LoginModal onClose={mockOnClose} onSuccess={mockOnSuccess} />)
    
    expect(screen.getByRole('textbox', { name: /mobile number/i })).toBeInTheDocument()
  })

  it('handles form submission and OTP verification', async () => {
    renderWithProviders(<LoginModal onClose={mockOnClose} onSuccess={mockOnSuccess} />)
    
    const phoneInput = screen.getByRole('textbox', { name: /mobile number/i })
    await fireEvent.change(phoneInput, { target: { value: '91874498' } })
    
    // Wait for the OTP button to be visible
    const getOtpButton = await waitFor(() => 
      screen.getByRole('button', { name: /send one-time password to your mobile/i })
    )
    await fireEvent.click(getOtpButton)
    
    // Wait for the OTP input to appear
    const otpInput = await waitFor(() => 
      screen.getByRole('textbox', { name: /one time password/i })
    )
    await fireEvent.change(otpInput, { target: { value: '123456' } })
    
    const verifyButton = screen.getByRole('button', { name: /verify one-time password/i })
    await fireEvent.click(verifyButton)
    
    await waitFor(() => {
      expect(screen.queryByText(/invalid credentials/i)).not.toBeInTheDocument()
    })
  })

  it('shows error for invalid phone number', async () => {
    renderWithProviders(<LoginModal onClose={mockOnClose} onSuccess={mockOnSuccess} />)
    
    const phoneInput = screen.getByRole('textbox', { name: /mobile number/i })
    await fireEvent.change(phoneInput, { target: { value: '1234' } })
    
    expect(phoneInput).toHaveAttribute('aria-invalid', 'true')
  })

  it('shows error for invalid OTP', async () => {
    renderWithProviders(<LoginModal onClose={mockOnClose} onSuccess={mockOnSuccess} />)
    
    const phoneInput = screen.getByRole('textbox', { name: /mobile number/i })
    await fireEvent.change(phoneInput, { target: { value: '91874498' } })
    
    // Wait for the OTP button to be visible
    const getOtpButton = await waitFor(() => 
      screen.getByRole('button', { name: /send one-time password to your mobile/i })
    )
    await fireEvent.click(getOtpButton)
    
    // Wait for the OTP input to appear
    const otpInput = await waitFor(() => 
      screen.getByRole('textbox', { name: /one time password/i })
    )
    await fireEvent.change(otpInput, { target: { value: '1234' } })
    expect(otpInput).toHaveAttribute('aria-invalid', 'true')
  })
})