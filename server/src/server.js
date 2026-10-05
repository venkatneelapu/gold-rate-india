const path = require('path');
const fs = require('fs');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const goldRoutes = require('./routes/goldRoutes');
const errorHandler = require('./middleware/errorHandler');
const goldService = require('./services/goldService');

const app = express();
const PORT = process.env.PORT || 5000;
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || 'http://localhost:3000';

// Security middleware
app.use(helmet({
  contentSecurityPolicy: false // Allows inline scripts & fonts during local react serving
}));

// CORS configuration
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, curl, server-to-server)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = CLIENT_ORIGIN.split(',').map(o => o.trim());
    if (allowedOrigins.includes(origin) || allowedOrigins.includes('*') || origin.startsWith('http://localhost:')) {
      return callback(null, true);
    }
    return callback(new Error(`CORS blocked for origin: ${origin}`));
  },
  methods: ['GET', 'POST'],
  credentials: true
}));

app.use(express.json());

// General API Rate Limiting (e.g., 200 requests per 15 minutes)
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: 'Too many requests from this IP, please try again after 15 minutes.'
  }
});

// Apply rate limiter to /api routes
app.use('/api', apiLimiter);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.floor(process.uptime())
  });
});

// Gold API routes
app.use('/api/gold', goldRoutes);

// Social Media Posts API routes
const socialRoutes = require('./routes/socialRoutes');
app.use('/api/social-posts', socialRoutes);

// Static file serving for generated social PNG images
const generatedSocialPath = path.resolve(__dirname, '../generated/social');
if (!fs.existsSync(generatedSocialPath)) {
  fs.mkdirSync(generatedSocialPath, { recursive: true });
}
app.use('/generated/social', express.static(generatedSocialPath));

// Optional production static file serving for client/dist
const clientDistPath = path.join(__dirname, '../../client/dist');
if (fs.existsSync(clientDistPath)) {
  console.log(`[Server] Serving static production build from ${clientDistPath}`);
  app.use(express.static(clientDistPath));

  app.get('*', (req, res, next) => {
    // If request does not start with /api or /generated, serve index.html
    if (!req.path.startsWith('/api') && !req.path.startsWith('/generated')) {
      return res.sendFile(path.join(clientDistPath, 'index.html'));
    }
    next();
  });
}

// 404 handler for API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({
    success: false,
    error: `API route not found: ${req.method} ${req.originalUrl}`
  });
});

// Centralized error handling middleware
app.use(errorHandler);

// Start server and initialize hourly gold service
app.listen(PORT, async () => {
  console.log(`=========================================`);
  console.log(` Gold Rate India Backend running on :${PORT}`);
  console.log(` Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(` Base API: http://localhost:${PORT}/api/gold`);
  console.log(`=========================================`);

  await goldService.init();
});

module.exports = app;
