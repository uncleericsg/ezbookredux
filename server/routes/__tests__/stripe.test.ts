import request from 'supertest';
import express from 'express';
import type { PaymentIntent } from '@shared/types/payment';
import { StripeService } from '@/services/payments/stripeService';
import stripeRouter from '../payments/stripe';

// Mock StripeService
jest.mock('@/services/payments/stripeService');

// Mock logger
jest.mock('@/utils/logger', () => ({
  logger: {
    info: jest.fn(),
    error: jest.fn(),
  },
}));

describe('Stripe Routes', () => {
  let app: express.Application;
  let mockStripeService: jest.Mocked<StripeService>;

  beforeEach(() => {
    // Clear all mocks
    jest.clearAllMocks();

    // Create express app
    app = express();
    app.use(express.json());
    app.use('/api/payments', stripeRouter);

    // Setup mock StripeService
    mockStripeService = (StripeService as jest.MockedClass<typeof StripeService>).mock.instances[0] as jest.Mocked<StripeService>;
  });

  describe('POST /api/payments/create-payment-intent', () => {
    const mockPaymentIntent: PaymentIntent = {
      id: 'pi_123',
      amount: 1000,
      currency: 'sgd',
      status: 'succeeded',
      clientSecret: 'secret_123',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    beforeEach(() => {
      mockStripeService.createPaymentIntent = jest.fn().mockResolvedValue(mockPaymentIntent);
    });

    it('should create payment intent successfully', async () => {
      const response = await request(app)
        .post('/api/payments/create-payment-intent')
        .send({
          amount: 1000,
          currency: 'sgd',
          metadata: { orderId: '123' }
        });

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockPaymentIntent);
      expect(mockStripeService.createPaymentIntent).toHaveBeenCalledWith({
        amount: 1000,
        currency: 'sgd',
        metadata: { orderId: '123' }
      });
    });

    it('should handle validation errors', async () => {
      mockStripeService.createPaymentIntent = jest.fn().mockRejectedValue(
        new Error('Invalid payment amount')
      );

      const response = await request(app)
        .post('/api/payments/create-payment-intent')
        .send({
          amount: 0,
          currency: 'sgd'
        });

      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        error: 'Invalid payment amount'
      });
    });
  });

  describe('GET /api/payments/payment-intent/:id', () => {
    const mockPaymentIntent: PaymentIntent = {
      id: 'pi_123',
      amount: 1000,
      currency: 'sgd',
      status: 'succeeded',
      clientSecret: 'secret_123',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    beforeEach(() => {
      mockStripeService.getPaymentIntent = jest.fn().mockResolvedValue(mockPaymentIntent);
    });

    it('should retrieve payment intent successfully', async () => {
      const response = await request(app)
        .get('/api/payments/payment-intent/pi_123');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockPaymentIntent);
      expect(mockStripeService.getPaymentIntent).toHaveBeenCalledWith('pi_123');
    });

    it('should handle not found errors', async () => {
      mockStripeService.getPaymentIntent = jest.fn().mockRejectedValue(
        new Error('Payment intent not found')
      );

      const response = await request(app)
        .get('/api/payments/payment-intent/invalid_id');

      expect(response.status).toBe(404);
      expect(response.body).toEqual({
        error: 'Payment intent not found'
      });
    });
  });

  describe('POST /api/payments/refund', () => {
    beforeEach(() => {
      mockStripeService.createRefund = jest.fn().mockResolvedValue(undefined);
    });

    it('should process refund successfully', async () => {
      const response = await request(app)
        .post('/api/payments/refund')
        .send({
          paymentIntentId: 'pi_123',
          amount: 1000,
          reason: 'requested_by_customer'
        });

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ success: true });
      expect(mockStripeService.createRefund).toHaveBeenCalledWith({
        paymentIntentId: 'pi_123',
        amount: 1000,
        reason: 'requested_by_customer'
      });
    });

    it('should handle refund errors', async () => {
      mockStripeService.createRefund = jest.fn().mockRejectedValue(
        new Error('Refund failed')
      );

      const response = await request(app)
        .post('/api/payments/refund')
        .send({
          paymentIntentId: 'pi_123',
          amount: 1000
        });

      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        error: 'Refund failed'
      });
    });
  });

  describe('POST /api/payments/webhook', () => {
    const mockEvent = {
      id: 'evt_123',
      type: 'payment_intent.succeeded',
      data: {
        object: {
          id: 'pi_123',
          status: 'succeeded'
        }
      }
    };

    beforeEach(() => {
      mockStripeService.verifyWebhookEvent = jest.fn().mockReturnValue(mockEvent);
    });

    it('should handle webhook event successfully', async () => {
      const response = await request(app)
        .post('/api/payments/webhook')
        .set('stripe-signature', 'test_signature')
        .send(Buffer.from('test_payload'));

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ received: true });
      expect(mockStripeService.verifyWebhookEvent).toHaveBeenCalled();
    });

    it('should handle webhook verification errors', async () => {
      mockStripeService.verifyWebhookEvent = jest.fn().mockImplementation(() => {
        throw new Error('Invalid webhook signature');
      });

      const response = await request(app)
        .post('/api/payments/webhook')
        .set('stripe-signature', 'invalid_signature')
        .send(Buffer.from('test_payload'));

      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        error: 'Invalid webhook signature'
      });
    });

    it('should handle missing signature header', async () => {
      const response = await request(app)
        .post('/api/payments/webhook')
        .send(Buffer.from('test_payload'));

      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        error: 'Missing stripe-signature header'
      });
    });
  });
}); 