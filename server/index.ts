import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import cors from 'cors';

// Load config
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const config = await import('./config.json', { assert: { type: 'json' } });

// Set environment variables from config
process.env.STRIPE_SECRET_KEY = config.default.stripe.secretKey;
process.env.STRIPE_WEBHOOK_SECRET = config.default.stripe.webhookSecret;
process.env.NODE_ENV = config.default.server.nodeEnv;
process.env.PORT = String(config.default.server.port);

// Import routes
import stripeRouter from './routes/payments/stripe.js';

const app = express();
const port = process.env.PORT || '3001';

// Configure CORS
app.use(cors({
  origin: [
    'https://localhost:5173',
    'http://localhost:5173'
  ],
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// Middleware
app.use(express.json());

// Routes
app.use('/api/payments', stripeRouter);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Start server
app.listen(Number(port), () => {
  console.log(`Server running on http://localhost:${port}`);
});
