import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React from 'react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

import { useOtpVerification } from '../../../../src/components/auth/LoginPage/hooks'
import LoginPanel from '../../../../src/components/auth/LoginPage/LoginPanel'
import { renderWithProviders } from '../../../setup/test-utils'

vi.mock('../../../../src/components/auth/LoginPage/hooks', () => ({
  useOtpVerification: vi.fn()
}))

type OtpHookReturn = ReturnType<typeof useOtpVerification>
const mockOtpHook = vi.mocked(useOtpVerification)

describe('LoginPanel', () => {
  beforeEach(() => {
    mockOtpHook.mockReturnValue({
      mobileNumber: '',
      otp: '',
      loading: false,
      showOtpButton: true,
      otpSent: false,
      handleMobileNumberChange: vi.fn(),
      handleOtpChange: vi.fn(),
      handleSendOtp: vi.fn(),
      handleSubmit: vi.fn()
    } as OtpHookReturn)
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('renders initial login form', () => {
    renderWithProviders(<LoginPanel />)
    
    expect(screen.getByText(/welcome back/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/mobile number/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /send otp/i })).toBeInTheDocument()
  })

  it('handles mobile number input', async () => {
    const mockHandleChange = vi.fn()
    mockOtpHook.mockReturnValue({
      mobileNumber: '91234567',
      otp: '',
      loading: false,
      showOtpButton: true,
      otpSent: false,
      handleMobileNumberChange: mockHandleChange,
      handleOtpChange: vi.fn(),
      handleSendOtp: vi.fn(),
      handleSubmit: vi.fn()
    } as OtpHookReturn)
    
    renderWithProviders(<LoginPanel />)
    
    const input = screen.getByLabelText(/mobile number/i)
    await userEvent.type(input, '91234567')
    
    expect(mockHandleChange).toHaveBeenCalled()
  })

  it('shows OTP input after sending OTP', async () => {
    const mockSendOtp = vi.fn()
    mockOtpHook.mockReturnValue({
      mobileNumber: '91234567',
      otp: '',
      loading: false,
      showOtpButton: true,
      otpSent: true,
      handleMobileNumberChange: vi.fn(),
      handleOtpChange: vi.fn(),
      handleSendOtp: mockSendOtp,
      handleSubmit: vi.fn()
    } as OtpHookReturn)
    
    renderWithProviders(<LoginPanel />)
    
    await userEvent.click(screen.getByRole('button', { name: /send otp/i }))
    
    expect(screen.getByLabelText(/one time password/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /verify otp/i })).toBeInTheDocument()
  })

  it('handles OTP verification submission', async () => {
    const mockSubmit = vi.fn()
    mockOtpHook.mockReturnValue({
      mobileNumber: '91234567',
      otp: '123456',
      loading: false,
      showOtpButton: true,
      otpSent: true,
      handleMobileNumberChange: vi.fn(),
      handleOtpChange: vi.fn(),
      handleSendOtp: vi.fn(),
      handleSubmit: mockSubmit
    } as OtpHookReturn)
    
    renderWithProviders(<LoginPanel />)
    
    await userEvent.click(screen.getByRole('button', { name: /verify otp/i }))
    
    expect(mockSubmit).toHaveBeenCalled()
  })
})