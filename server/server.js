/**
 * CCH Axcess Intelligence - Backend Server
 * Secure API server for AI chat functionality
 */

const express = require('express');
const cors = require('cors');
const winston = require('winston');
const path = require('path');
const fs = require('fs');

// Try to find the .env file in the server directory
const envPath = path.join(__dirname, '.env');
if (fs.existsSync(envPath)) {
    require('dotenv').config({ path: envPath });
} else {
    // Fallback to relative path
    require('dotenv').config({ path: './server/.env' });
}

// Import routes
const chatRoutes = require('./routes/chat');
const healthRoutes = require('./routes/health');
const conversationsRoutes = require('./routes/conversations');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3001;

// Configure logging
const logger = winston.createLogger({
    level: process.env.LOG_LEVEL || 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.errors({ stack: true }),
        winston.format.json()
    ),
    defaultMeta: { service: 'cch-intelligence-api' },
    transports: [
        new winston.transports.Console({
            format: winston.format.simple()
        })
    ]
});

// CORS configuration
const corsOptions = {
    origin: process.env.NODE_ENV === 'production'
        ? process.env.FRONTEND_URL || 'https://your-domain.com'
        : ['http://localhost:3000', 'http://localhost:5173'],
    credentials: true,
    optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging
app.use((req, res, next) => {
    logger.info(`${req.method} ${req.path}`, {
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        timestamp: new Date().toISOString()
    });
    next();
});

// Health check
app.use('/api/health', healthRoutes);

// API routes
app.use('/api/chat', chatRoutes);
app.use('/api/conversations', conversationsRoutes);

// Serve static files from React build in production
if (process.env.NODE_ENV === 'production') {
    const buildPath = path.join(__dirname, '..', 'dist');
    app.use(express.static(buildPath));

    // Handle React routing, return all requests to React app
    app.get('*', (req, res) => {
        res.sendFile(path.join(buildPath, 'index.html'));
    });
}

// 404 handler for API routes only (before React catch-all)
app.use('/api/*', (req, res) => {
    res.status(404).json({
        error: 'API endpoint not found',
        path: req.originalUrl
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    logger.error('Unhandled error:', {
        error: err.message,
        stack: err.stack,
        url: req.url,
        method: req.method,
        ip: req.ip
    });

    res.status(err.status || 500).json({
        error: process.env.NODE_ENV === 'production'
            ? 'Internal server error'
            : err.message
    });
});

// Graceful shutdown
process.on('SIGTERM', () => {
    logger.info('SIGTERM received, shutting down gracefully');
    process.exit(0);
});

process.on('SIGINT', () => {
    logger.info('SIGINT received, shutting down gracefully');
    process.exit(0);
});

// Start server
app.listen(PORT, () => {
    logger.info(`🚀 CCH Intelligence API server running on port ${PORT}`);
    logger.info(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
    logger.info(`🔒 CORS origins: ${JSON.stringify(corsOptions.origin)}`);
});

module.exports = app;