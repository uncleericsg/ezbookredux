import { 
  getAuth, 
  fetchSignInMethodsForEmail,
  PhoneAuthProvider,
  RecaptchaVerifier
} from 'firebase/auth';

export interface ValidationResult {
  isValid: boolean;
  error?: string;
  verificationId?: string;
}

export interface OTPVerificationResult {
  isValid: boolean;
  error?: string;
}

class FirebaseValidationService {
  private auth = getAuth();
  private recaptchaVerifier: RecaptchaVerifier | null = null;

  // Initialize recaptcha verifier
  private initRecaptcha = (containerId: string) => {
    if (!this.recaptchaVerifier) {
      this.recaptchaVerifier = new RecaptchaVerifier(this.auth, containerId, {
        size: 'invisible',
        callback: () => {},
        'expired-callback': () => {}
      });
    }
    return this.recaptchaVerifier;
  };

  // Validate email by checking if it exists in Firebase
  public async validateEmail(email: string): Promise<ValidationResult> {
    try {
      const signInMethods = await fetchSignInMethodsForEmail(this.auth, email);
      // If email exists (has sign-in methods), it's invalid for new registration
      if (signInMethods.length > 0) {
        return {
          isValid: false,
          error: 'This email is already registered'
        };
      }
      return { isValid: true };
    } catch (error: any) {
      if (error.code === 'auth/invalid-email') {
        return {
          isValid: false,
          error: 'Invalid email format'
        };
      }
      return {
        isValid: false,
        error: 'Error validating email'
      };
    }
  }

  // Send OTP to mobile number
  public async sendOTP(phoneNumber: string, recaptchaContainerId: string): Promise<ValidationResult> {
    try {
      // Format phone number to E.164 format for Singapore
      const formattedPhone = phoneNumber.startsWith('+65') 
        ? phoneNumber 
        : `+65${phoneNumber.replace(/\D/g, '')}`;

      // For test phone number in development
      if (import.meta.env.DEV && formattedPhone === '+6591874498') {
        return {
          isValid: true,
          verificationId: formattedPhone // Use the phone number itself as verificationId for test number
        };
      }

      const verifier = this.initRecaptcha(recaptchaContainerId);
      const provider = new PhoneAuthProvider(this.auth);
      
      const verificationId = await provider.verifyPhoneNumber(
        formattedPhone,
        verifier
      );

      return {
        isValid: true,
        verificationId
      };
    } catch (error: any) {
      return {
        isValid: false,
        error: error.message || 'Error sending OTP'
      };
    }
  }

  // Verify OTP code
  public async verifyOTP(verificationId: string, code: string): Promise<OTPVerificationResult> {
    try {
      if (!verificationId || !code) {
        return {
          isValid: false,
          error: 'Verification ID and code are required'
        };
      }

      // For test phone number in development
      if (import.meta.env.DEV && verificationId === '+6591874498') {
        // In development, accept only '123456' as the test OTP
        if (code === '123456') {
          return { isValid: true };
        }
        return {
          isValid: false,
          error: 'Invalid test OTP code. Use 123456 for test numbers.'
        };
      }

      // For real phone numbers in production
      const credential = PhoneAuthProvider.credential(verificationId, code);
      await this.auth.signInWithCredential(credential);
      
      // If we reach here, the OTP was valid
      // Sign out immediately since we don't want to keep the user signed in
      await this.auth.signOut();
      
      return {
        isValid: true
      };
    } catch (error: any) {
      let errorMessage = 'Invalid OTP code';
      if (error.code === 'auth/invalid-verification-code') {
        errorMessage = 'The verification code is incorrect';
      } else if (error.code === 'auth/code-expired') {
        errorMessage = 'The verification code has expired';
      }
      
      return {
        isValid: false,
        error: errorMessage
      };
    }
  }

  // Clear recaptcha when component unmounts
  public clearRecaptcha() {
    if (this.recaptchaVerifier) {
      this.recaptchaVerifier.clear();
      this.recaptchaVerifier = null;
    }
  }
}

export const firebaseValidation = new FirebaseValidationService();
