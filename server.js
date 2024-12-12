import Stripe from 'stripe';
import express from 'express';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const ENVIRONMENT = process.env.NODE_ENV || 'development';

// Select the appropriate webhook secret based on environment
const getWebhookSecret = () => {
  switch(ENVIRONMENT) {
    case 'production':
      return process.env.PRODUCTION_STRIPE_WEBHOOK_SECRET;
    case 'staging':
      return process.env.STAGING_STRIPE_WEBHOOK_SECRET;
    default:
      return process.env.STRIPE_WEBHOOK_SECRET; // local development
  }
};

const stripe = new Stripe(process.env.VITE_STRIPE_SECRET_KEY);
const app = express();

// Get the appropriate webhook secret
const endpointSecret = getWebhookSecret();

app.post('/webhook', express.raw({type: 'application/json'}), (request, response) => {
  const sig = request.headers['stripe-signature'];

  let event;

  try {
    event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
  } catch (err) {
    response.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntentSucceeded = event.data.object;
      console.log('PaymentIntent succeeded:', paymentIntentSucceeded.id);
      break;
    case 'payment_intent.payment_failed':
      const paymentIntentFailed = event.data.object;
      console.log('PaymentIntent failed:', paymentIntentFailed.id);
      break;
    case 'charge.succeeded':
      const chargeSucceeded = event.data.object;
      console.log('Charge succeeded:', chargeSucceeded.id);
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  // Return a 200 response to acknowledge receipt of the event
  response.send();
});

app.listen(4242, () => console.log('Running on port 4242'));
