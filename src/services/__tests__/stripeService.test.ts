import { StripeService } from '../payments/stripeService';
import type { PaymentConfig, CreatePaymentIntentParams, RefundParams } from '@shared/types/payment';
import { AppError } from '@shared/types/error';
import Stripe from 'stripe';

// Mock Stripe
jest.mock('stripe');

// Mock logger
jest.mock('@/utils/logger', () => ({
  logger: {
    info: jest.fn(),
    error: jest.fn(),
  },
}));

describe('StripeService', () => {
  let stripeService: StripeService;
  let mockStripe: jest.Mocked<Stripe>;

  const mockConfig: PaymentConfig = {
    provider: 'stripe',
    secretKey: 'test_secret_key',
    publishableKey: 'test_publishable_key',
    webhookSecret: 'test_webhook_secret',
    supportedMethods: ['card', 'paynow']
  };

  beforeEach(() => {
    // Clear all mocks
    jest.clearAllMocks();

    // Create a new instance for each test
    stripeService = new StripeService(mockConfig);
    mockStripe = (Stripe as jest.MockedClass<typeof Stripe>).mock.instances[0] as jest.Mocked<Stripe>;
  });

  describe('constructor', () => {
    it('should throw error if config is incomplete', () => {
      expect(() => new StripeService({
        ...mockConfig,
        secretKey: ''
      })).toThrow('Stripe configuration is incomplete');
    });

    it('should initialize with valid config', () => {
      expect(() => new StripeService(mockConfig)).not.toThrow();
    });
  });

  describe('createPaymentIntent', () => {
    const mockParams: CreatePaymentIntentParams = {
      amount: 1000,
      currency: 'sgd',
      metadata: { orderId: '123' }
    };

    const mockStripePaymentIntent = {
      id: 'pi_123',
      amount: 1000,
      currency: 'sgd',
      status: 'succeeded',
      client_secret: 'secret_123',
      metadata: { orderId: '123' },
      created: Date.now() / 1000
    };

    beforeEach(() => {
      mockStripe.paymentIntents = {
        create: jest.fn().mockResolvedValue(mockStripePaymentIntent)
      } as any;
    });

    it('should create payment intent successfully', async () => {
      const result = await stripeService.createPaymentIntent(mockParams);

      expect(mockStripe.paymentIntents.create).toHaveBeenCalledWith({
        amount: mockParams.amount,
        currency: mockParams.currency,
        metadata: mockParams.metadata,
        automatic_payment_methods: { enabled: true }
      });

      expect(result).toEqual(expect.objectContaining({
        id: mockStripePaymentIntent.id,
        amount: mockStripePaymentIntent.amount,
        currency: mockStripePaymentIntent.currency,
        status: 'succeeded'
      }));
    });

    it('should throw validation error for invalid amount', async () => {
      await expect(stripeService.createPaymentIntent({
        ...mockParams,
        amount: 0
      })).rejects.toThrow('Invalid payment amount');
    });

    it('should handle Stripe errors', async () => {
      const stripeError = new Stripe.errors.StripeError({
        type: 'card_error',
        message: 'Your card was declined',
        charge: 'ch_123'
      });

      mockStripe.paymentIntents.create.mockRejectedValue(stripeError);

      await expect(stripeService.createPaymentIntent(mockParams))
        .rejects.toThrow('Your card was declined');
    });
  });

  describe('getPaymentIntent', () => {
    const mockPaymentIntentId = 'pi_123';
    const mockStripePaymentIntent = {
      id: mockPaymentIntentId,
      amount: 1000,
      currency: 'sgd',
      status: 'succeeded',
      client_secret: 'secret_123',
      created: Date.now() / 1000
    };

    beforeEach(() => {
      mockStripe.paymentIntents = {
        retrieve: jest.fn().mockResolvedValue(mockStripePaymentIntent)
      } as any;
    });

    it('should retrieve payment intent successfully', async () => {
      const result = await stripeService.getPaymentIntent(mockPaymentIntentId);

      expect(mockStripe.paymentIntents.retrieve).toHaveBeenCalledWith(mockPaymentIntentId);
      expect(result).toEqual(expect.objectContaining({
        id: mockStripePaymentIntent.id,
        amount: mockStripePaymentIntent.amount,
        currency: mockStripePaymentIntent.currency,
        status: 'succeeded'
      }));
    });

    it('should throw validation error for missing ID', async () => {
      await expect(stripeService.getPaymentIntent('')).rejects.toThrow('Payment intent ID is required');
    });
  });

  describe('createRefund', () => {
    const mockParams: RefundParams = {
      paymentIntentId: 'pi_123',
      amount: 1000,
      reason: 'requested_by_customer'
    };

    beforeEach(() => {
      mockStripe.refunds = {
        create: jest.fn().mockResolvedValue({})
      } as any;
    });

    it('should process refund successfully', async () => {
      await stripeService.createRefund(mockParams);

      expect(mockStripe.refunds.create).toHaveBeenCalledWith({
        payment_intent: mockParams.paymentIntentId,
        amount: mockParams.amount,
        reason: mockParams.reason,
        metadata: undefined
      });
    });

    it('should throw validation error for missing payment intent ID', async () => {
      await expect(stripeService.createRefund({
        ...mockParams,
        paymentIntentId: ''
      })).rejects.toThrow('Payment intent ID is required');
    });
  });

  describe('verifyWebhookEvent', () => {
    const mockPayload = Buffer.from('test_payload');
    const mockSignature = 'test_signature';
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
      mockStripe.webhooks = {
        constructEvent: jest.fn().mockReturnValue(mockEvent)
      } as any;
    });

    it('should verify webhook event successfully', () => {
      const result = stripeService.verifyWebhookEvent(mockPayload, mockSignature);

      expect(mockStripe.webhooks.constructEvent).toHaveBeenCalledWith(
        mockPayload,
        mockSignature,
        mockConfig.webhookSecret
      );
      expect(result).toEqual(mockEvent);
    });

    it('should throw validation error for missing signature', () => {
      expect(() => stripeService.verifyWebhookEvent(mockPayload, ''))
        .toThrow('Stripe signature is required');
    });

    it('should handle signature verification errors', () => {
      const verificationError = new Stripe.errors.StripeSignatureVerificationError({
        message: 'Invalid signature',
        signature: mockSignature,
        payload: mockPayload
      });

      mockStripe.webhooks.constructEvent.mockImplementation(() => {
        throw verificationError;
      });

      expect(() => stripeService.verifyWebhookEvent(mockPayload, mockSignature))
        .toThrow('Invalid webhook signature');
    });
  });

  describe('mapPaymentStatus', () => {
    const testCases = [
      { input: 'requires_payment_method', expected: 'pending' },
      { input: 'requires_confirmation', expected: 'pending' },
      { input: 'requires_action', expected: 'pending' },
      { input: 'processing', expected: 'processing' },
      { input: 'succeeded', expected: 'succeeded' },
      { input: 'canceled', expected: 'cancelled' },
      { input: 'requires_capture', expected: 'processing' },
      { input: 'unknown_status', expected: 'failed' }
    ];

    testCases.forEach(({ input, expected }) => {
      it(`should map ${input} to ${expected}`, () => {
        const result = (stripeService as any).mapPaymentStatus(input);
        expect(result).toBe(expected);
      });
    });
  });
}); 