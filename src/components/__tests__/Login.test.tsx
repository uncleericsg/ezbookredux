import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import Login from '../Login';
import { describe, test, expect } from 'vitest';
import { ReactNode } from 'react';


// Test wrapper component
const TestWrapper = ({ children }: { children: ReactNode }) => (
  <MemoryRouter>
    {children}
  </MemoryRouter>
);

describe('Login Component', () => {
  test('renders login form', async () => {
    render(<Login />, { wrapper: TestWrapper });

    // Verify main elements
    expect(screen.getByText('Welcome to Easy Booking')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter 8 digit mobile number')).toBeInTheDocument();
  });

  test('handles login flow', async () => {
    render(<Login />, { wrapper: TestWrapper });
    const user = userEvent.setup();

    // Enter mobile number and send OTP
    const mobileInput = screen.getByPlaceholderText('Enter 8 digit mobile number');
    await user.type(mobileInput, '91874498');
    await user.click(screen.getByText('Send OTP'));

    // Enter OTP and verify login
    const otpInput = await screen.findByPlaceholderText('Enter 6-digit OTP');
    await user.type(otpInput, '123456');

    await waitFor(() => {
      expect(localStorage.setItem).toHaveBeenCalledWith('auth_token', expect.any(String));
    });
  });

  test('shows error for invalid credentials', async () => {
    render(<Login />, { wrapper: TestWrapper });
    const user = userEvent.setup();

    // Test invalid mobile number
    await user.type(screen.getByPlaceholderText('Enter 8 digit mobile number'), '12345678');
    await user.click(screen.getByText('Send OTP'));
    expect(await screen.findByText(/Invalid mobile number/)).toBeInTheDocument();

    // Test invalid OTP
    await user.type(screen.getByPlaceholderText('Enter 8 digit mobile number'), '91874498');
    await user.click(screen.getByText('Send OTP'));
    await user.type(screen.getByPlaceholderText('Enter 6-digit OTP'), '000000');
    expect(await screen.findByText(/Invalid OTP/)).toBeInTheDocument();
  });

  test('navigates to other routes', async () => {
    render(<Login />, { wrapper: TestWrapper });
    const user = userEvent.setup();

    // Test navigation buttons
    await user.click(screen.getByText('Enjoy First Time Customer Offer'));
    expect(window.location.pathname).toBe('/booking/price-selection');

    await user.click(screen.getByText('Browse All Services'));
    expect(window.location.pathname).toBe('/');

    await user.click(screen.getByText('Sign up for AMC Package'));
    expect(window.location.pathname).toBe('/amc/signup');
  });
});
