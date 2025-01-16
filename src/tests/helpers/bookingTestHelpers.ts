import type { CreateBookingParams, BookingDetails } from '@shared/types/booking';

export const TEST_USER = {
  email: 'test@example.com',
  firstName: 'John',
  lastName: 'Doe',
  mobile: '91234567'
};

export const TEST_ADDRESS = {
  blockStreet: '123 Test Street',
  floorUnit: '#01-01',
  postalCode: '123456',
  condoName: 'Test Condo'
};

export const TEST_CARDS = {
  success: '4242424242424242',
  insufficient: '4000000000009995',
  declined: '4000000000000002'
};

export const TEST_SERVICES = [
  {
    id: 'basic-service',
    title: 'Basic Service',
    description: 'Standard maintenance and repair service',
    price: 89,
    duration: 60
  },
  {
    id: 'comprehensive-service',
    title: 'Comprehensive Service',
    description: 'Detailed inspection and maintenance',
    price: 149,
    duration: 90,
    isPopular: true
  }
];

export const generateTestBooking = (overrides?: Partial<CreateBookingParams>): CreateBookingParams => {
  const service = TEST_SERVICES[0];
  const date = new Date();
  date.setDate(date.getDate() + 1); // Tomorrow
  date.setHours(10, 0, 0, 0); // 10:00 AM

  return {
    service_id: service.id,
    service_title: service.title,
    service_description: service.description,
    service_price: service.price,
    service_duration: service.duration,
    customer_first_name: TEST_USER.firstName,
    customer_last_name: TEST_USER.lastName,
    customer_email: TEST_USER.email,
    customer_mobile: TEST_USER.mobile,
    block_street: TEST_ADDRESS.blockStreet,
    floor_unit: TEST_ADDRESS.floorUnit,
    postal_code: TEST_ADDRESS.postalCode,
    condo_name: TEST_ADDRESS.condoName,
    scheduled_datetime: date.toISOString(),
    scheduled_timeslot: '10:00',
    status: 'pending',
    brands: ['Samsung', 'LG'],
    issues: ['Not cooling', 'Strange noise'],
    ...overrides
  };
};

export const mockBookingResponse = (booking: CreateBookingParams): BookingDetails => ({
  id: 'test-booking-id',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  ...booking
});

export const simulateNetworkDelay = (min = 100, max = 1000): Promise<void> => {
  const delay = Math.random() * (max - min) + min;
  return new Promise(resolve => setTimeout(resolve, delay));
};

export const mockStripeElements = () => {
  return {
    create: jest.fn().mockReturnValue({
      mount: jest.fn(),
      destroy: jest.fn(),
      on: jest.fn(),
      update: jest.fn()
    })
  };
};

export const mockStripePaymentIntent = (status: 'succeeded' | 'failed' = 'succeeded') => {
  return {
    id: 'pi_test',
    client_secret: 'test_secret',
    status,
    amount: 8900,
    currency: 'sgd'
  };
};

export interface TestError {
  code: string;
  message: string;
  type: 'validation_error' | 'api_error' | 'payment_error';
}

export const generateTestError = (
  type: TestError['type'],
  message: string,
  code: string
): TestError => ({
  type,
  message,
  code
});

export const mockValidationError = (field: string): TestError =>
  generateTestError(
    'validation_error',
    `Invalid value for field: ${field}`,
    'invalid_field'
  );

export const mockPaymentError = (reason: string): TestError =>
  generateTestError(
    'payment_error',
    `Payment failed: ${reason}`,
    'payment_failed'
  );

export const mockApiError = (reason: string): TestError =>
  generateTestError(
    'api_error',
    `API Error: ${reason}`,
    'api_error'
  );

export const waitForBookingUpdate = async (
  getBooking: () => Promise<BookingDetails | null>,
  expectedStatus: string,
  maxAttempts = 10,
  interval = 1000
): Promise<BookingDetails> => {
  let attempts = 0;
  
  while (attempts < maxAttempts) {
    const booking = await getBooking();
    
    if (booking && booking.status === expectedStatus) {
      return booking;
    }
    
    await new Promise(resolve => setTimeout(resolve, interval));
    attempts++;
  }
  
  throw new Error(`Booking did not update to ${expectedStatus} after ${maxAttempts} attempts`);
};

export const mockTimeSlots = (date: Date, duration: number = 60) => {
  const slots: string[] = [];
  const startHour = 9;
  const endHour = 17;
  
  for (let hour = startHour; hour < endHour; hour++) {
    for (let minute = 0; minute < 60; minute += duration) {
      slots.push(
        `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
      );
    }
  }
  
  return slots;
};

export const validateBookingData = (booking: BookingDetails): string[] => {
  const errors: string[] = [];

  // Required fields
  const requiredFields = [
    'service_id',
    'service_title',
    'service_price',
    'customer_first_name',
    'customer_last_name',
    'customer_email',
    'customer_mobile',
    'block_street',
    'postal_code',
    'scheduled_datetime',
    'scheduled_timeslot'
  ];

  requiredFields.forEach(field => {
    if (!booking[field as keyof BookingDetails]) {
      errors.push(`Missing required field: ${field}`);
    }
  });

  // Email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (booking.customer_email && !emailRegex.test(booking.customer_email)) {
    errors.push('Invalid email format');
  }

  // Mobile format (Singapore)
  const mobileRegex = /^[89][0-9]{7}$/;
  if (booking.customer_mobile && !mobileRegex.test(booking.customer_mobile)) {
    errors.push('Invalid mobile number format');
  }

  // Postal code format (Singapore)
  const postalRegex = /^[0-9]{6}$/;
  if (booking.postal_code && !postalRegex.test(booking.postal_code)) {
    errors.push('Invalid postal code format');
  }

  // Date validation
  const bookingDate = new Date(booking.scheduled_datetime);
  const now = new Date();
  if (bookingDate < now) {
    errors.push('Booking date cannot be in the past');
  }

  // Price validation
  if (typeof booking.service_price !== 'number' || booking.service_price <= 0) {
    errors.push('Invalid service price');
  }

  return errors;
};

export const mockLocalStorage = () => {
  const store: { [key: string]: string } = {};
  
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      Object.keys(store).forEach(key => delete store[key]);
    }
  };
}; 