import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Add basic health checks here
    const healthCheck = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV
    };

    res.status(200).json(healthCheck);
  } catch (error) {
    res.status(500).json({ 
      status: 'unhealthy',
      error: 'Health check failed'
    });
  }
} 