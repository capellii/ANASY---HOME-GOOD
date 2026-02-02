
import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
dotenv.config();

import authRoutes from './routes/authRoutes';
import deviceRoutes from './routes/deviceRoutes';
import scenarioRoutes from './routes/scenarioRoutes';
import energyRoutes from './routes/energyRoutes';
import securityRoutes from './routes/securityRoutes';
import healthRoutes from './routes/healthRoutes';
import eventRoutes from './routes/eventRoutes';

const app = express();
const PORT = process.env.PORT || 3000;

// CORS configuration - allow Expo mobile app and web clients
const corsOptions = {
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    const allowedOrigins = [
      'http://localhost:8082', // Expo Dev Tools
      'http://localhost:19006', // Expo Web
      'http://localhost:19000', // Expo Metro
      'exp://localhost:19000', // Expo Native
      'exp://192.168.1.1:19000', // Replace with your local IP
    ];
    
    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(express.json());

// Rate limiting configuration
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per windowMs
  message: 'Too many authentication attempts, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

app.get('/', (req, res) => {
  res.send('ANASY Backend API is running!');
});

// Rotas principais com rate limiting
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/devices', apiLimiter, deviceRoutes);
app.use('/api/scenarios', apiLimiter, scenarioRoutes);
app.use('/api/energy', apiLimiter, energyRoutes);
app.use('/api/security', apiLimiter, securityRoutes);
app.use('/api/health', apiLimiter, healthRoutes);
app.use('/api/events', apiLimiter, eventRoutes);

// Global error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err);
  
  if (err.message === 'Not allowed by CORS') {
    return res.status(403).json({ error: 'CORS policy violation' });
  }
  
  if (err.name === 'ValidationError') {
    return res.status(400).json({ error: 'Validation error', details: err.errors });
  }
  
  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  res.status(err.status || 500).json({ 
    error: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
