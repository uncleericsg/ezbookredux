import type { 
  User, 
  OTPVerificationPayload,
  UserProfile
} from '@shared/types/user';
import { logger } from '@/utils/logger';
import { supabaseClient } from '@/config/supabase/client';
import { ServiceResponse, AsyncServiceResponse, createServiceHandler } from '@/types/api';
import { 
  APIError,
  handleValidationError,
  handleAuthenticationError,
  handleDatabaseError
} from '@/utils/apiErrors';
import { convertSupabaseUser } from '@shared/types/supabase-bridge';

const serviceHandler = createServiceHandler<User>();

const validatePhoneNumber = (phone: string): boolean => {
  const phoneRegex = /^\+?[1-9]\d{1,14}$/;
  return phoneRegex.test(phone);
};

const validateOTPPayload = (payload: Partial<OTPVerificationPayload>): void => {
  const requiredFields = ['phone', 'code', 'verificationId'];
  const missingFields = requiredFields.filter(field => !payload[field as keyof OTPVerificationPayload]);
  
  if (missingFields.length > 0) {
    throw new APIError(
      'VALIDATION_ERROR',
      `Missing required fields: ${missingFields.join(', ')}`,
      400
    );
  }
};

export const authService = {
  async sendOTP(phoneNumber: string): AsyncServiceResponse<string> {
    try {
      if (!phoneNumber) {
        return {
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Phone number is required'
          },
          status: 'error'
        };
      }

      if (!validatePhoneNumber(phoneNumber)) {
        return {
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid phone number format'
          },
          status: 'error'
        };
      }

      const { error } = await supabaseClient.auth.signInWithOtp({
        phone: phoneNumber
      });

      if (error) {
        throw new APIError(
          'AUTH_ERROR',
          error.message,
          error.status || 500,
          { name: error.name }
        );
      }

      return {
        data: 'OTP sent successfully',
        status: 'success'
      };
    } catch (err: unknown) {
      logger.error('Error sending OTP:', err);
      return {
        error: {
          code: 'INTERNAL_ERROR',
          message: err instanceof Error ? err.message : 'Failed to send OTP',
          details: err instanceof Error ? { stack: err.stack } : undefined
        },
        status: 'error'
      };
    }
  },

  async verifyOTP(payload: OTPVerificationPayload): AsyncServiceResponse<User> {
    try {
      validateOTPPayload(payload);
      return serviceHandler(
        supabaseClient.auth.verifyOtp({
          phone: payload.phone,
          token: payload.code,
          type: 'sms'
        }).then(result => {
          if (result.error) throw result.error;
          if (!result.data.user) throw new Error('No user data returned');
          return convertSupabaseUser(result.data.user);
        })
      );
    } catch (err: unknown) {
      logger.error('Error verifying OTP:', err);
      return {
        error: {
          code: 'AUTH_ERROR',
          message: err instanceof Error ? err.message : 'Failed to verify OTP',
          details: err instanceof Error ? { stack: err.stack } : undefined
        },
        status: 'error'
      };
    }
  },

  async getCurrentUser(): AsyncServiceResponse<User | null> {
    try {
      const { data: { user }, error } = await supabaseClient.auth.getUser();

      if (error || !user) {
        logger.info('No authenticated user found');
        return { data: null, status: 'success' };
      }

      const { data: profile, error: profileError } = await supabaseClient
        .from('profiles')
        .select()
        .eq('user_id', user.id)
        .single();

      if (profileError) {
        throw new APIError(
          'DATABASE_ERROR',
          profileError.message,
          500,
          { code: profileError.code }
        );
      }

      const fullUser = convertSupabaseUser(user);
      fullUser.profile = profile;

      return {
        data: fullUser,
        status: 'success'
      };
    } catch (error) {
      logger.error('Error getting current user:', error);
      return {
        error: {
          code: 'DATABASE_ERROR',
          message: error instanceof Error ? error.message : 'Failed to get current user',
          details: error instanceof Error ? { stack: error.stack } : undefined
        },
        status: 'error'
      };
    }
  },

  async signOut(): AsyncServiceResponse<void> {
    try {
      const { error } = await supabaseClient.auth.signOut();

      if (error) {
        throw new APIError(
          'AUTH_ERROR',
          error.message,
          error.status || 500,
          { name: error.name }
        );
      }

      logger.info('User signed out successfully');
      return { data: undefined, status: 'success' };
    } catch (error) {
      logger.error('Error signing out:', error);
      return {
        error: {
          code: 'AUTH_ERROR',
          message: error instanceof Error ? error.message : 'Failed to sign out',
          details: error instanceof Error ? { stack: error.stack } : undefined
        },
        status: 'error'
      };
    }
  }
};
