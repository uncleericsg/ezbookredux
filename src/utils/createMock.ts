import type { User } from '@/types/auth';
import type { ServiceCategory } from '@/types/homepage';
import type { BookingDetails, PaymentDetails } from '@/machines/bookingMachine';

export interface MockConfig<T> {
  partial?: boolean;
  overrides?: Partial<T>;
  behaviors?: MockBehavior<T>[];
}

export interface MockBehavior<T> {
  field: keyof T;
  generator: () => T[keyof T];
}

export type MockGenerator<T> = {
  (config?: Omit<MockConfig<T>, 'partial'>): T;
  (config: MockConfig<T> & { partial: true }): Partial<T>;
};

// Helper function to merge mock data with overrides
function mergeMockData<T extends object>(base: T, overrides?: Partial<T>): T {
  if (!overrides) return base;
  return { ...base, ...overrides };
}

// Helper function to apply behaviors
function applyBehaviors<T extends object>(data: T, behaviors?: MockBehavior<T>[]): T {
  if (!behaviors) return data;
  
  const result = { ...data };
  behaviors.forEach(behavior => {
    result[behavior.field] = behavior.generator();
  });
  
  return result;
}

// Helper function to create partial mock data
function createPartialMock<T extends object>(data: T): Partial<T> {
  const result: Partial<T> = {};
  const fields = Object.keys(data) as Array<keyof T>;
  
  // Randomly select 60-80% of fields
  const fieldCount = Math.floor(fields.length * (0.6 + Math.random() * 0.2));
  const selectedFields = fields
    .sort(() => Math.random() - 0.5)
    .slice(0, fieldCount);
  
  selectedFields.forEach(field => {
    result[field] = data[field];
  });
  
  return result;
}

// Create mock user data
export const createMockUser: MockGenerator<User> = ((config?: MockConfig<User>) => {
  const base: User = {
    id: `user-${Date.now()}`,
    email: 'test@example.com',
    firstName: 'John',
    lastName: 'Doe',
    amcStatus: 'active'
  };

  const withBehaviors = applyBehaviors(base, config?.behaviors);
  const withOverrides = mergeMockData(withBehaviors, config?.overrides);
  
  return config?.partial 
    ? createPartialMock(withOverrides)
    : withOverrides;
}) as MockGenerator<User>;

// Create mock service data
export const createMockService: MockGenerator<ServiceCategory> = ((config?: MockConfig<ServiceCategory>) => {
  const base: ServiceCategory = {
    id: `service-${Date.now()}`,
    name: 'AC Service',
    description: 'Regular AC maintenance',
    type: 'maintenance',
    price: 100,
    visible: true,
    order: 1
  };

  const withBehaviors = applyBehaviors(base, config?.behaviors);
  const withOverrides = mergeMockData(withBehaviors, config?.overrides);
  
  return config?.partial 
    ? createPartialMock(withOverrides)
    : withOverrides;
}) as MockGenerator<ServiceCategory>;

// Create mock booking details
export const createMockBookingDetails: MockGenerator<BookingDetails> = ((config?: MockConfig<BookingDetails>) => {
  const base: BookingDetails = {
    user: createMockUser(),
    notes: 'Test booking notes',
    address: '123 Test Street',
    phone: '1234567890',
    email: 'test@example.com'
  };

  const withBehaviors = applyBehaviors(base, config?.behaviors);
  const withOverrides = mergeMockData(withBehaviors, config?.overrides);
  
  return config?.partial 
    ? createPartialMock(withOverrides)
    : withOverrides;
}) as MockGenerator<BookingDetails>;

// Create mock payment details
export const createMockPaymentDetails: MockGenerator<PaymentDetails> = ((config?: MockConfig<PaymentDetails>) => {
  const base: PaymentDetails = {
    amount: 100,
    currency: 'SGD',
    method: 'card',
    reference: `pay-${Date.now()}`
  };

  const withBehaviors = applyBehaviors(base, config?.behaviors);
  const withOverrides = mergeMockData(withBehaviors, config?.overrides);
  
  return config?.partial 
    ? createPartialMock(withOverrides)
    : withOverrides;
}) as MockGenerator<PaymentDetails>;

// Helper to create dynamic mock data
export function createDynamicMock<T extends object>(
  template: T,
  config?: MockConfig<T>
): T | Partial<T> {
  const withBehaviors = applyBehaviors(template, config?.behaviors);
  const withOverrides = mergeMockData(withBehaviors, config?.overrides);
  
  return config?.partial 
    ? createPartialMock(withOverrides)
    : withOverrides;
}

// Helper to create an array of mock data
export function createMockArray<T>(
  generator: MockGenerator<T>,
  count: number,
  config?: Omit<MockConfig<T>, 'partial'>
): T[];
export function createMockArray<T>(
  generator: MockGenerator<T>,
  count: number,
  config: MockConfig<T> & { partial: true }
): Partial<T>[];
export function createMockArray<T>(
  generator: MockGenerator<T>,
  count: number,
  config?: MockConfig<T>
): (T | Partial<T>)[] {
  return Array.from({ length: count }, () => generator(config as any));
}

// Helper to create sequential mock data
export function createSequentialMock<T extends object>(
  template: T,
  count: number,
  sequencer: (base: T, index: number) => Partial<T>
): T[] {
  return Array.from({ length: count }, (_, index) => ({
    ...template,
    ...sequencer(template, index)
  }));
}