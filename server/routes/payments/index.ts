import { Router } from 'express';
import type { Request, Response, NextFunction } from 'express';
import { PaymentService } from '@server/services/payments/paymentService';
import { withErrorHandling } from '@server/middleware/errorHandling';
import { validateRequest } from '@server/middleware/validation';
import { paymentSchemas } from '@server/middleware/validation/paymentValidation';
import type { CheckoutResponse } from '@shared/types/payment';
import type { RouteResult, AuthenticatedValidatedRouteHandler } from '@shared/types/route';
import type { AuthenticatedRequest } from '@shared/types/middleware';
import { ApiError } from '@server/utils/apiErrors';
import { logger } from '@server/utils/logger';
import { withAuth } from '@server/middleware/authMiddleware';
import type { UserProfile } from '@shared/types/middleware';

const router = Router();
const paymentService = new PaymentService();

// Create checkout handler
class CheckoutHandler implements AuthenticatedValidatedRouteHandler<
  { body: { bookingId: string; amount: number; currency: string; customerEmail: string } },
  RouteResult<CheckoutResponse>
> {
  async validate(data: any, req: Request, res: Response): Promise<void> {
    await validateRequest(paymentSchemas.checkout)(req, res, () => {});
  }

  async authorize(user: UserProfile): Promise<void> {
    if (!user) {
      throw ApiError.unauthorized();
    }
  }

  async handle(req: AuthenticatedRequest & { body: { bookingId: string; amount: number; currency: string; customerEmail: string } }, res: Response): Promise<RouteResult<CheckoutResponse>> {
    const checkoutResponse = await paymentService.initiatePayment({
      ...req.body,
      userId: req.user.id
    });

    res.status(201).json({
      data: checkoutResponse
    });

    return { data: checkoutResponse };
  }
}

// Webhook handler
class WebhookHandler implements AuthenticatedValidatedRouteHandler<
  { body: any; headers: { 'stripe-signature': string } },
  RouteResult<{ received: boolean }>
> {
  async validate(data: any, req: Request, res: Response): Promise<void> {
    const signature = req.headers['stripe-signature'];
    if (!signature || typeof signature !== 'string') {
      throw ApiError.badRequest('Missing or invalid Stripe signature');
    }

    if (!req.body) {
      throw ApiError.badRequest('Missing webhook payload');
    }
  }

  async authorize(user: UserProfile): Promise<void> {
    // Webhooks don't require authentication
    return;
  }

  async handle(req: Request, res: Response): Promise<RouteResult<{ received: boolean }>> {
    const signature = req.headers['stripe-signature'] as string;
    await paymentService.handleWebhook(req.body, signature);
    
    res.json({ received: true });
    return { data: { received: true } };
  }
}

// Initialize handlers
const checkoutHandler = new CheckoutHandler();
const webhookHandler = new WebhookHandler();

// Helper to wrap handler methods
const wrapHandler = (handler: AuthenticatedValidatedRouteHandler<any, any>) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await handler.validate(req.method === 'GET' ? req.params : req.body, req, res);
      await handler.authorize((req as AuthenticatedRequest).user);
      await handler.handle(req as any, res);
    } catch (error) {
      next(error);
    }
  };
};

// Register routes
router.post('/checkout', withAuth(), withErrorHandling(wrapHandler(checkoutHandler)));
router.post('/webhook', withErrorHandling(wrapHandler(webhookHandler)));

export default router;
