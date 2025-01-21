import {
  createMockUser,
  createMockService,
  createMockBookingDetails,
  createMockPaymentDetails,
  createDynamicMock,
  createMockArray,
  createSequentialMock,
  type MockBehavior
} from '../createMock';
import type { User } from '@/types/auth';
import type { ServiceCategory } from '@/types/homepage';
import type { BookingDetails, PaymentDetails } from '@/machines/bookingMachine';

describe('Mock Data Utilities', () => {
  describe('createMockUser', () => {
    it('should create a default user', () => {
      const user = createMockUser();
      
      expect(user).toEqual({
        id: expect.any(String),
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
        amcStatus: 'active'
      });
    });

    it('should create a partial user', () => {
      const user = createMockUser({ partial: true });
      const keys = Object.keys(user);
      
      // Should have some but not all fields
      expect(keys.length).toBeGreaterThan(0);
      expect(keys.length).toBeLessThan(5);
    });

    it('should apply overrides', () => {
      const user = createMockUser({
        overrides: {
          firstName: 'Jane',
          email: 'jane@example.com'
        }
      });

      expect(user.firstName).toBe('Jane');
      expect(user.email).toBe('jane@example.com');
    });

    it('should apply behaviors', () => {
      const behaviors: MockBehavior<User>[] = [
        {
          field: 'id',
          generator: () => 'custom-id'
        }
      ];

      const user = createMockUser({ behaviors });
      expect(user.id).toBe('custom-id');
    });
  });

  describe('createMockService', () => {
    it('should create a default service', () => {
      const service = createMockService();
      
      expect(service).toEqual({
        id: expect.any(String),
        name: 'AC Service',
        description: 'Regular AC maintenance',
        type: 'maintenance',
        price: 100,
        visible: true,
        order: 1
      });
    });

    it('should create a partial service', () => {
      const service = createMockService({ partial: true });
      const keys = Object.keys(service);
      
      expect(keys.length).toBeGreaterThan(0);
      expect(keys.length).toBeLessThan(7);
    });

    it('should apply overrides', () => {
      const service = createMockService({
        overrides: {
          name: 'Custom Service',
          price: 200
        }
      });

      expect(service.name).toBe('Custom Service');
      expect(service.price).toBe(200);
    });
  });

  describe('createMockBookingDetails', () => {
    it('should create default booking details', () => {
      const details = createMockBookingDetails();
      
      expect(details).toEqual({
        user: expect.any(Object),
        notes: 'Test booking notes',
        address: '123 Test Street',
        phone: '1234567890',
        email: 'test@example.com'
      });
    });

    it('should create partial booking details', () => {
      const details = createMockBookingDetails({ partial: true });
      const keys = Object.keys(details);
      
      expect(keys.length).toBeGreaterThan(0);
      expect(keys.length).toBeLessThan(5);
    });
  });

  describe('createMockPaymentDetails', () => {
    it('should create default payment details', () => {
      const payment = createMockPaymentDetails();
      
      expect(payment).toEqual({
        amount: 100,
        currency: 'SGD',
        method: 'card',
        reference: expect.any(String)
      });
    });

    it('should create partial payment details', () => {
      const payment = createMockPaymentDetails({ partial: true });
      const keys = Object.keys(payment);
      
      expect(keys.length).toBeGreaterThan(0);
      expect(keys.length).toBeLessThan(4);
    });
  });

  describe('createDynamicMock', () => {
    it('should create a mock from template', () => {
      const template = {
        name: 'Test',
        value: 123,
        active: true
      };

      const mock = createDynamicMock(template);
      expect(mock).toEqual(template);
    });

    it('should create partial mock from template', () => {
      const template = {
        name: 'Test',
        value: 123,
        active: true
      };

      const mock = createDynamicMock(template, { partial: true });
      const keys = Object.keys(mock);
      
      expect(keys.length).toBeGreaterThan(0);
      expect(keys.length).toBeLessThan(3);
    });
  });

  describe('createMockArray', () => {
    it('should create an array of mocks', () => {
      const users = createMockArray(createMockUser, 3);
      
      expect(users).toHaveLength(3);
      users.forEach(user => {
        expect(user).toHaveProperty('id');
        expect(user).toHaveProperty('email');
      });
    });

    it('should create an array of partial mocks', () => {
      const users = createMockArray(createMockUser, 3, { partial: true });
      
      expect(users).toHaveLength(3);
      users.forEach(user => {
        const keys = Object.keys(user);
        expect(keys.length).toBeGreaterThan(0);
        expect(keys.length).toBeLessThan(5);
      });
    });
  });

  describe('createSequentialMock', () => {
    it('should create sequential mocks', () => {
      const template = {
        id: 'test',
        index: 0
      };

      const mocks = createSequentialMock(template, 3, (_, index) => ({
        id: `test-${index}`,
        index
      }));

      expect(mocks).toHaveLength(3);
      mocks.forEach((mock, index) => {
        expect(mock.id).toBe(`test-${index}`);
        expect(mock.index).toBe(index);
      });
    });
  });
});