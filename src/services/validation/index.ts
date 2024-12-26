// Basic validation functions
export const validateMobileNumber = (number: string): boolean => {
  // Singapore mobile number format: 8 digits starting with 8 or 9
  const sgMobileRegex = /^[89]\d{7}$/;
  return sgMobileRegex.test(number);
};

// Re-export firebase validation
export * from './firebaseValidation';
