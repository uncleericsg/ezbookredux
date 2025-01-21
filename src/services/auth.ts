import type { 
  User, 
  OTPVerificationPayload, 
  OTPVerificationResponse,
  OTPRequestResponse 
} from '../types/user';

/**
 * Send OTP to phone number
 */
export const sendOTP = async (phoneNumber: string): Promise<OTPRequestResponse> => {
  // TODO: Replace with actual API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        verificationId: 'mock-verification-id'
      });
    }, 1000);
  });
};

/**
 * Verify OTP code
 */
export const verifyOTP = async (payload: OTPVerificationPayload): Promise<OTPVerificationResponse> => {
  // TODO: Replace with actual API call
  return new Promise((resolve) => {
    setTimeout(() => {
      if (payload.code === '123456') {
        resolve({
          success: true,
          user: {
            id: 'mock-user-id',
            email: 'user@example.com',
            firstName: 'John',
            lastName: 'Doe',
            phone: payload.phone,
            role: 'customer',
            status: 'active',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }
        });
      } else {
        resolve({
          success: false,
          error: 'Invalid OTP code'
        });
      }
    }, 1000);
  });
};
