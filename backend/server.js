import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
const __dirname = dirname(fileURLToPath(import.meta.url));
import 'express-async-errors';
import 'dotenv/config.js';
import mongoose from 'mongoose';

import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import express from 'express';
import cors from 'cors';

// Security middleware
import helmet from 'helmet';
import xss from 'xss-clean';
import mongoSanitize from 'express-mongo-sanitize';
import rateLimit from 'express-rate-limit';
import hpp from 'hpp';

// =====================
// GLOBAL ERROR HANDLERS
// =====================

// Handle uncaught exceptions (synchronous errors) i.e undefined value
process.on('uncaughtException', (err) => {
  console.error('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  console.error('Error:', err.name, err.message);
  console.error(err.stack);
  process.exit(1);
});

// Initialize Express app
const app = express();

app.set('trust proxy', 1); // trust first proxy (Render)

// =====================
// GLOBAL MIDDLEWARE
// =====================

// Enable CORS
app.use(
  cors({
    origin: ['http://localhost:5173', 'https://markethub.netlify.app'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// =====================
// SECURITY MIDDLEWARE
// =====================

// Set security HTTP headers
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'", 'trusted-cdn.com'],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", 'data:', 'blob:'],
        connectSrc: ["'self'", 'api.yourservice.com'],
      },
    },
    crossOriginEmbedderPolicy: false,
    crossOriginOpenerPolicy: { policy: 'same-origin' },
    crossOriginResourcePolicy: { policy: 'same-site' },
    hsts: { maxAge: 15552000, includeSubDomains: true },
  })
);

// Data sanitization against NoSQL injection
app.use(mongoSanitize());

// Parse JSON and URL-encoded request bodies
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Clean any user input from XSS attacks
app.use(xss());

// Parse cookies
app.use(cookieParser());

// Prevent parameter pollution
app.use(
  hpp({
    whitelist: ['page', 'limit', 'sort', 'fields', 'search', 'status'],
  })
);

// =====================
// LOGGING (Development only)
// =====================
if (/dev/i.test(process.env.NODE_ENV)) {
  app.use(morgan('dev'));
}

// =====================
// RATE LIMITING
// =====================
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 10 requests per window
  message: 'Too many login attempts. Please try again later.',
  skip: (req) => req.path === '/health',
});

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per window
  message: 'Too many requests from this IP, please try again later.',
  skip: (req) => req.path.startsWith('/api/health'),
});

// app.use('/api', apiLimiter);
// app.use('/api/v1/auth', authLimiter);

// =====================
// ROUTES
// =====================

/**
 * Simple health check endpoint for uptime and environment monitoring.
 *
 * Returns a JSON payload with basic status information that can be used by
 * load balancers or monitoring tools.
 *
 * @route GET /api/health
 */
app.get('/api/health', (req, res) => {
  res.set('Cache-Control', 'no-store');
  res.status(200).json({
    status: 'success',
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    uptime: process.uptime(),
  });
});

import productRoutes from './routes/product.js';
import authRoutes from './routes/auth.js';
import orderRoutes from './routes/order.js';
import paymentRoutes from './routes/payment.js';

app.use('/api/v1', productRoutes);
app.use('/api/v1', authRoutes);
app.use('/api/v1', orderRoutes);
app.use('/api/v1', paymentRoutes);

// =====================
// SERVE STATIC FILES (Production Only)
// =====================
if (/production/.test(process.env.NODE_ENV)) {
  // Serve static files with 1-year cache for better performance
  app.use(
    express.static(path.join(__dirname, '../frontend/dist'), {
      maxAge: '1y',
      setHeaders: (res, path) => {
        if (path.endsWith('.html')) {
          res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
        }
      },
    })
  );

  // Handle Single Page Application (SPA) routing
  app.get('*', (req, res) => {
    if (req.path.startsWith('/api/')) {
      return res.status(404).json({ message: 'Not Found' });
    }
    res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
  });
}

// =====================
// ERROR HANDLING
// =====================
import notFoundMiddleware from './middleware/notFound.js';
import errorHandlerMiddleware from './middleware/errorHandler.js';

// 404 handler (must be after routes)
app.use(notFoundMiddleware);

// Global error handler (must be last)
app.use(errorHandlerMiddleware);

// =====================
// DATABASE CONNECTION
// =====================
mongoose.set('strictQuery', false);

if (!process.env.MONGO_URI) {
  console.error('MONGO_URI is not defined in environment variables');
  process.exit(1);
}

const DB = process.env.MONGO_URI.replace(
  '<PASSWORD>',
  process.env.MONGO_PASSWORD || ''
);

const mongooseOptions = {
  serverSelectionTimeoutMS: 10000, // Wait up to 10s for server selection
  socketTimeoutMS: 30000, // Close idle connections after 30s
  maxPoolSize: 10, // Reasonable default for most apps
  w: 'majority', // Ensure write acknowledgement
};

mongoose
  .connect(DB, mongooseOptions)
  .then(() => console.log('✅ MongoDB connection successful'))
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  });

// =====================
// SERVER SETUP
// =====================
const PORT = process.env.PORT || 5001;
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(
    `🚀 Server running in ${
      process.env.NODE_ENV || 'development'
    } mode on port ${PORT}`
  );
  console.log(`📡 Connect: http://localhost:${PORT}`);
});

// =====================
// GLOBAL ERROR HANDLERS
// =====================

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('UNHANDLED REJECTION! 💥 Shutting down...');
  console.error('Error:', err.name, err.message);
  console.error(err.stack); // Add stack trace for debugging
  server.close(() => {
    process.exit(1);
  });
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  console.error('Error:', err.name, err.message);
  console.error(err.stack); // Add stack trace for debugging
  server.close(() => {
    process.exit(1);
  });
});

// Handle SIGTERM (for Heroku, etc.)
process.on('SIGTERM', () => {
  console.log('👋 SIGTERM RECEIVED. Shutting down gracefully');
  server.close(() => {
    console.log('💥 Process terminated!');
  });
});

// Handle process termination (Ctrl+C)
process.on('SIGINT', () => {
  console.log('👋 SIGINT RECEIVED. Shutting down gracefully');
  server.close(() => {
    console.log('💥 Process terminated!');
    process.exit(0);
  });
});

export default app;
