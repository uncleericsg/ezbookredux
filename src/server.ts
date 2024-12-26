import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import https from 'https';
import fs from 'fs';
import path from 'path';
import stripeRouter from './api/stripe';

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

// Basic middleware
app.use(cors({
  origin: [
    'https://localhost:5173', 
    'http://localhost:5173',
    'http://192.168.4.118:5173',
    'https://192.168.4.118:5173'
  ],
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 200
}));

// Enable pre-flight requests
app.options('*', cors());

app.use(express.json());

// Routes
app.use('/api/payments', stripeRouter);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Server error:', err);
  // Send detailed error in development
  const error = process.env.NODE_ENV === 'development' 
    ? { message: err.message, stack: err.stack, details: err }
    : { message: 'Internal server error' };
    
  res.status(err.status || 500).json({ error });
});

// Start server
if (process.env.NODE_ENV === 'development') {
  // Use HTTP in development
  app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  });
} else {
  // Use HTTPS in production
  const options = {
    key: fs.readFileSync(path.join(process.cwd(), 'localhost+1-key.pem')),
    cert: fs.readFileSync(path.join(process.cwd(), 'localhost+1.pem')),
  };
  
  https.createServer(options, app).listen(port, () => {
    console.log(`Server running on https://localhost:${port}`);
  });
}
