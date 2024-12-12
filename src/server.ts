// Monkey-patch util._extend to use Object.assign
import util from 'util';
if (util._extend) {
  (util as any)._extend = Object.assign;
}

import express from 'express';
import { config } from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import stripeRoutes from './api/stripe';

config(); // Load environment variables

const app = express();
const port = process.env.PORT || 3001;

// Serve static files from public directory
app.use(express.static('public'));

// Serve fonts from local directory
app.use('/fonts', express.static('public/fonts'));

// Webhook handling needs raw body
app.use('/api/payments/webhook', express.raw({ type: 'application/json' }));

// Middleware for parsing JSON payloads
app.use(express.json());

// CORS configuration
const corsOptions = {
  origin: ['https://localhost:5173', 'http://localhost:5173'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'stripe-signature'],
  credentials: true,
};

app.use(cors(corsOptions));

// Use Stripe routes
app.use('/api/payments', stripeRoutes);

// Basic security headers
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        connectSrc: ["'self'", "https://*.stripe.com", "https://*.google.com", "https://pay.google.com"],
        frameSrc: ["'self'", "https://*.stripe.com", "https://*.google.com", "https://pay.google.com"],
        childSrc: ["'self'", "https://*.stripe.com", "https://*.google.com", "https://pay.google.com"],
        scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'", "https://*.stripe.com", "https://*.google.com", "https://pay.google.com"],
        styleSrc: ["'self'", "'unsafe-inline'", "https://*.stripe.com", "https://*.google.com"],
        fontSrc: ["'self'", "data:", "https://*.stripe.com", "https://*.google.com", "https://fonts.gstatic.com"],
        imgSrc: ["'self'", "https://*.stripe.com", "data:", "https:", "http:"],
        workerSrc: ["'self'", "blob:", "https://*.stripe.com"],
        frameAncestors: ["'self'"],
        formAction: ["'self'", "https://*.stripe.com", "https://*.google.com", "https://pay.google.com"],
      },
    },
    crossOriginEmbedderPolicy: false
  })
);

// Health check endpoint
app.get('/health', (_req, res) => {
  res.json({ status: 'healthy' });
});

// Error handling middleware
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Server error:', err);
  
  // Create safe error response
  const errorResponse = {
    error: process.env.NODE_ENV === 'production' 
      ? 'Internal server error' 
      : err.message,
    status: 'error',
    ...(process.env.NODE_ENV !== 'production' && {
      stack: err.stack,
      path: req.path,
      method: req.method
    })
  };

  res.status(500).json(errorResponse);
});

// Start server
const server = app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
    process.exit(0);
  });
});

export default app;
