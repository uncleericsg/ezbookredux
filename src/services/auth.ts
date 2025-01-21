import type { 
  User, 
  OTPVerificationPayload,
  UserProfile
} from '@shared/types/user';
import { logger } from '@/utils/logger';
import { supabaseClient } from '@/config/supabase/client';
import type { AsyncServiceResponse, ServiceResponse } from '../../types/api';
import { BaseService } from './base';
import { 
  BaseError,
  ValidationFailedError,
  AuthenticationError,
  DatabaseOperationError
} from '../../shared/types/error';
import { convertSupabaseUser } from '../../shared/types/supabase-bridge';
import type { SupabaseUser } from '../../shared/types/supabase-bridge';

export class AuthService extends BaseService {
  private validatePhoneNumber(phone: string): boolean {
    const phoneRegex = /^\+?[1-9]\d{1,14}$/;
    return phoneRegex.test(phone);
  }

  private validateOTPPayload(payload: Partial<OTPVerificationPayload>): void {
    const requiredFields = ['phone', 'code', 'verificationId'];
    const missingFields = requiredFields.filter(
      field => !payload[field as keyof OTPVerificationPayload]
    );
    
    if (missingFields.length > 0) {
      throw new ValidationFailedError([{
        field: 'otpPayload',
        message: `Missing required fields: ${missingFields.join(', ')}`,
        type: 'required',
        code: 'VALIDATION_ERROR'
      }]);
    }
  }

  async sendOTP(phoneNumber: string): Promise<ServiceResponse<string>> {
    return this.handleRequest(async () => {
      // Validation
      if (!phoneNumber) {
        throw new ValidationFailedError([{
          field: 'phoneNumber',
          message: 'Phone number is required',
          type: 'required',
          code: 'VALIDATION_ERROR'
        }]);
      }

      if (!this.validatePhoneNumber(phoneNumber)) {
        throw new ValidationFailedError([{
          field: 'phoneNumber',
          message: 'Invalid phone number format',
          type: 'format',
          code: 'VALIDATION_ERROR'
        }]);
      }

      // Send OTP
      const { error } = await supabaseClient.auth.signInWithOtp({
        phone: phoneNumber
      });

      if (error) {
        throw new AuthenticationError(error.message);
      }

      return 'OTP sent successfully';
    }, { path: 'auth/sendOTP' });
  }

  async verifyOTP(payload: OTPVerificationPayload): Promise<ServiceResponse<User>> {
    return this.handleRequest(async () => {
      // Validation
      this.validateOTPPayload(payload);

      // Verify OTP
      const { data, error } = await supabaseClient.auth.verifyOtp({
        phone: payload.phone,
        token: payload.code,
        type: 'sms'
      });

      if (error) {
        throw new AuthenticationError(error.message);
      }

      if (!data.user) {
        throw new AuthenticationError('No user data returned');
      }

      // Convert user data with retry logic
      const supabaseUser = data.user as SupabaseUser;
      return await this.withRetry(
        async () => convertSupabaseUser(supabaseUser),
        3,
        1000
      );
    }, { path: 'auth/verifyOTP' });
  }

  async getCurrentUser(): Promise<ServiceResponse<User | null>> {
    return this.handleRequest(async () => {
      // Get user
      const { data: { user }, error } = await supabaseClient.auth.getUser();

      if (error || !user) {
        logger.info('No authenticated user found');
        return null;
      }

      // Get profile
      const { data: profile, error: profileError } = await supabaseClient
        .from('profiles')
        .select()
        .eq('user_id', user.id)
        .single();

      if (profileError) {
        throw new DatabaseOperationError(
          'fetch_profile',
          { 
            code: profileError.code,
            userId: user.id
          }
        );
      }

      // Convert user data with retry logic
      const supabaseUser = user as SupabaseUser;
      const fullUser = await this.withRetry(
        async () => convertSupabaseUser(supabaseUser),
        3,
        1000
      );
      
      fullUser.profile = profile || null;
      return fullUser;
    }, { path: 'auth/getCurrentUser' });
  }

  async signOut(): Promise<ServiceResponse<void>> {
    return this.handleRequest(async () => {
      const { error } = await supabaseClient.auth.signOut();

      if (error) {
        throw new AuthenticationError(error.message);
      }

      logger.info('User signed out successfully');
    }, { path: 'auth/signOut' });
  }
}

// Create singleton instance
export const authService = new AuthService();
