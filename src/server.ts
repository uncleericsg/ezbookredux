import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import stripeRouter from './api/stripe';
import https from 'https';
import fs from 'fs';
import path from 'path';

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

// Basic middleware
app.use(cors({
  origin: ['https://localhost:5173', 'http://localhost:5173'], // Allow both HTTP and HTTPS
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

// Start server with HTTPS
const options = {
  key: fs.readFileSync(path.join(process.cwd(), 'localhost+1-key.pem')),
  cert: fs.readFileSync(path.join(process.cwd(), 'localhost+1.pem')),
  requestCert: false,
  rejectUnauthorized: false // Allow self-signed certificates
};

https.createServer(options, app).listen(port, () => {
  console.log(`HTTPS Server running on port ${port}`);
});
