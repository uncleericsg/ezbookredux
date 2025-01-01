import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import Login from '../Login';
import { describe, test, expect } from 'vitest';
import { ReactNode } from 'react';
import store from '../../store';


// Test wrapper component
const TestWrapper = ({ children }: { children: ReactNode }) => (
  <Provider store={store}>
    <MemoryRouter>
      {children}
    </MemoryRouter>
  </Provider>
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
    await act(async () => {
      await user.type(mobileInput, '91874498');
      await user.click(screen.getByText('Send OTP'));
    });

    // Enter OTP and verify login
    const otpInput = await screen.findByPlaceholderText('Enter 6-digit OTP');
    
    await act(async () => {
      await user.type(otpInput, '123456');
    });

    await act(async () => {
      await waitFor(() => {
        expect(localStorage.setItem).toHaveBeenCalledWith('auth_token', expect.any(String));
      });
    });
  });

  test('navigates to other routes', async () => {
    render(<Login />, { wrapper: TestWrapper });
    const user = userEvent.setup();

    // Test navigation buttons
    await user.click(screen.getByText('Enjoy First Time Customer Offer'));
    expect(window.location.pathname).toBe('/');

    await user.click(screen.getByText('Browse All Services'));
    expect(window.location.pathname).toBe('/');

    await user.click(screen.getByText('Sign up for AMC Package'));
    expect(window.location.pathname).toBe('/');
  });
});
