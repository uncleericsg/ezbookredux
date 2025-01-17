interface StripeConfig {
  secretKey: string;
  publishableKey: string;
  webhookSecret: string;
}

export const stripeConfig: StripeConfig = {
  secretKey: process.env.STRIPE_SECRET_KEY || '',
  publishableKey: process.env.STRIPE_PUBLISHABLE_KEY || '',
  webhookSecret: process.env.STRIPE_WEBHOOK_SECRET || ''
}; 