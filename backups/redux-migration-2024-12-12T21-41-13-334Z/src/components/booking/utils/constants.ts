export const ERROR_MESSAGES = {
  PHONE: {
    INVALID_FORMAT: 'Please enter a valid Singapore phone number',
    REQUIRED: 'Phone number is required',
    INVALID_PREFIX: 'Phone number must start with 6, 8, or 9',
    INVALID_LENGTH: 'Phone number must be 8 digits'
  },
  ADDRESS: {
    BLOCK: {
      REQUIRED: 'Block number is required',
      INVALID_FORMAT: 'Invalid block number format',
      TOO_LONG: 'Block number is too long'
    },
    STREET: {
      REQUIRED: 'Street name is required',
      TOO_SHORT: 'Street name is too short',
      TOO_LONG: 'Street name is too long'
    },
    UNIT: {
      INVALID_FORMAT: 'Invalid unit number format',
      TOO_LONG: 'Unit number is too long'
    },
    POSTAL_CODE: {
      REQUIRED: 'Postal code is required',
      INVALID_FORMAT: 'Please enter a valid 6-digit postal code'
    }
  },
  DATE: {
    REQUIRED: 'Date is required',
    INVALID: 'Please select a valid date',
    PAST: 'Cannot select a past date',
    TOO_FAR: 'Date is too far in the future'
  },
  TIME: {
    REQUIRED: 'Time slot is required',
    INVALID: 'Please select a valid time slot',
    PAST: 'Cannot select a past time',
    OUTSIDE_HOURS: 'Please select a time during business hours'
  }
} as const;

export const TIME_CONSTRAINTS = {
  businessHours: {
    start: 9, // 9 AM
    end: 18   // 6 PM
  },
  bookingWindow: {
    minDays: 1,
    maxDays: 30
  }
} as const;

export const INPUT_MASKS = {
  PHONE: {
    singapore: '+65 ____ ____',
    local: '____ ____'
  },
  POSTAL_CODE: '______',
  UNIT: {
    withHash: '#__-__',
    noHash: '__-__'
  }
} as const;
