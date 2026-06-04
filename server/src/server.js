import express from 'express';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';
import watchlistRoutes from './routes/watchlist.routes.js';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;

// ==========================================
// MIDDLEWARE
// ==========================================

// Security headers
app.use(helmet());

// CORS configuration
app.use(cors({
  origin: [
    process.env.CLIENT_URL,
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:5175'
  ].filter(Boolean),
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Request parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// HTTP request logging
app.use(morgan('dev'));

// Global rate limiter — generous for SPA usage (500 req / 15 min)
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 500,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many requests, please try again later.' },
  skip: () => process.env.NODE_ENV === 'development', // disable in dev
});
app.use('/api/', globalLimiter);

// Strict auth limiter — 20 attempts per 15 min to prevent brute force
// Disabled entirely in development so hot-reloads never cause 429s.
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many login attempts, please try again after 15 minutes.' },
  skip: () => process.env.NODE_ENV === 'development', // disable in dev
});
app.use('/api/auth/login',    authLimiter);
app.use('/api/auth/register', authLimiter);
// /api/auth/me is called on every app load — protect it in prod too
app.use('/api/auth/me',       authLimiter);

// ==========================================
// DATABASE CONNECTION
// ==========================================

/**
 * Connect to MongoDB (Atlas primary, in-memory fallback for dev)
 */
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB Atlas Connected');
  } catch (err) {
    if (process.env.NODE_ENV === 'production') {
      console.error('❌ Atlas connection failed in production. Exiting.');
      process.exit(1);
    }

    // Dev only fallback
    console.warn('⚠️ Falling back to in-memory MongoDB...');
    const mongod = await MongoMemoryServer.create();
    await mongoose.connect(mongod.getUri());
    console.log('✅ In-Memory MongoDB Connected');
  }
};

// ==========================================
// ROUTES
// ==========================================

// Basic health check route
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'NetStream API is running' });
});

app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/watchlist', watchlistRoutes);

// ==========================================
// ERROR HANDLING
// ==========================================

/**
 * Global Error Handler Middleware
 */
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  
  if (process.env.NODE_ENV === 'development') {
    console.error(`[Error] ${statusCode} - ${message}`);
    console.error(err.stack);
  }
  
  res.status(statusCode).json({
    success: false,
    message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack
  });
});

/**
 * Handle 404 - Not Found
 */
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
});

// ==========================================
// SERVER START
// ==========================================

// Connect to database then start server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
  });
});

export default app;
