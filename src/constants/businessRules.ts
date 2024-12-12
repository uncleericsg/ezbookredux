export const BUSINESS_RULES = {
  SLOT_DURATION: {
    AMC: 90,
    REGULAR: 60,
    REPAIR: 120
  },
  BUFFER_TIME: 30, // 30 minutes buffer between appointments
  MIN_BOOKING_HOURS: 24,
  MAX_BOOKING_DAYS: 104,
  BUFFER_MINUTES: 30,
  BUSINESS_START_HOUR: {
    START: 9.5,  // 9:30 AM
    MIN_TIME: '09:30',
    MAX_TIME: {
      FRIDAY: '16:30',  // Last booking at 4:30 PM for Fridays
      DEFAULT: '17:00'   // Last booking at 5 PM otherwise
    }
  },
  PEAK_HOURS_LIMIT: {
    AMC: 2,      // Max 2 AMC bookings during peak hours
    REGULAR: 3    // Max 3 regular bookings during peak hours
  },
  PEAK_HOURS: {
    START: 14, // 2 PM
    END: 18,   // 6 PM
    WARNING: 'Peak hours (2 PM - 6 PM) may experience delays due to high demand'
  },
  MAX_SLOTS_PER_DAY: {
    AMC: 3,         // Maximum 3 AMC slots per day
    TOTAL: 6,       // Maximum 6 total slots per day
    MIN_REGULAR: 4  // Minimum 4 slots reserved for regular bookings
  },
  RECOMMENDED_HOURS: {
    AMC: {
      START: 9.5,  // 9:30 AM
      END: 13,     // 1 PM
      MESSAGE: 'Non-peak hours (9 AM - 1 PM)  Best time for punctual service'
    }
  }
};