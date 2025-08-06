/**
 * CCH Axcess Intelligence - Security Middleware
 * Comprehensive security implementation for production readiness
 */

const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { body, validationResult } = require('express-validator');
const xss = require('xss-clean');
const hpp = require('hpp');
const mongoSanitize = require('express-mongo-sanitize');
const crypto = require('crypto');
const winston = require('winston');

// Configure security logger
const securityLogger = winston.createLogger({
    level: 'warn',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),
    transports: [
        new winston.transports.File({ filename: 'logs/security.log' }),
        new winston.transports.Console({
            format: winston.format.simple()
        })
    ]
});

/**
 * Enhanced Helmet Configuration
 * Comprehensive security headers with CSP
 */
const helmetConfig = {
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: [
                "'self'", 
                "'unsafe-inline'", 
                "https://fonts.googleapis.com",
                "https://cdn.jsdelivr.net"
            ],
            scriptSrc: [
                "'self'",
                "'unsafe-inline'", // Required for Vite HMR in development
                ...(process.env.NODE_ENV === 'development' ? ["'unsafe-eval'"] : [])
            ],
            fontSrc: [
                "'self'", 
                "https://fonts.gstatic.com", 
                "data:",
                "https://cdn.jsdelivr.net"
            ],
            imgSrc: [
                "'self'", 
                "data:", 
                "blob:", 
                "https:",
                "https://cdn.jsdelivr.net"
            ],
            connectSrc: [
                "'self'",
                "https://api.anthropic.com",
                "https://api.openai.com",
                "https://api.cch.com",
                ...(process.env.NODE_ENV === 'development' ? [
                    "ws://localhost:*", 
                    "http://localhost:*",
                    "http://127.0.0.1:*"
                ] : [])
            ],
            objectSrc: ["'none'"],
            baseUri: ["'self'"],
            formAction: ["'self'"],
            frameAncestors: ["'none'"],
            upgradeInsecureRequests: process.env.NODE_ENV === 'production' ? [] : null,
            workerSrc: ["'self'", "blob:"],
            childSrc: ["'self'"],
            manifestSrc: ["'self'"]
        },
    },
    crossOriginEmbedderPolicy: false, // Required for some browser APIs
    hsts: {
        maxAge: 31536000, // 1 year
        includeSubDomains: true,
        preload: true
    },
    frameguard: { action: 'deny' },
    noSniff: true,
    xssFilter: true,
    referrerPolicy: { policy: "strict-origin-when-cross-origin" },
    permittedCrossDomainPolicies: { permittedPolicies: "none" }
};

/**
 * Rate Limiting Configuration
 * Different limits for different endpoints and user types
 */
const rateLimitConfig = {
    // General API rate limiting
    general: {
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: process.env.NODE_ENV === 'production' ? 100 : 1000,
        message: { error: 'Too many requests from this IP, please try again later.' },
        standardHeaders: true,
        legacyHeaders: false,
        skipSuccessfulRequests: false,
        skipFailedRequests: false
    },
    // Chat-specific rate limiting (more restrictive)
    chat: {
        windowMs: 60 * 1000, // 1 minute
        max: process.env.NODE_ENV === 'production' ? 20 : 100,
        message: { error: 'Too many chat requests, please wait a moment before sending another message.' },
        standardHeaders: true,
        legacyHeaders: false,
        skipSuccessfulRequests: false,
        skipFailedRequests: false
    },
    // Authentication rate limiting (very restrictive)
    auth: {
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: 5, // Only 5 attempts per 15 minutes
        message: { error: 'Too many authentication attempts, please try again later.' },
        standardHeaders: true,
        legacyHeaders: false,
        skipSuccessfulRequests: true,
        skipFailedRequests: false
    },
    // File upload rate limiting
    upload: {
        windowMs: 60 * 60 * 1000, // 1 hour
        max: process.env.NODE_ENV === 'production' ? 10 : 50,
        message: { error: 'Too many file uploads, please try again later.' },
        standardHeaders: true,
        legacyHeaders: false,
        skipSuccessfulRequests: false,
        skipFailedRequests: false
    }
};

/**
 * Input Validation Rules
 * Comprehensive validation for all API endpoints
 */
const validationRules = {
    // Chat message validation
    chatMessage: [
        body('message')
            .trim()
            .isLength({ min: 1, max: 10000 })
            .withMessage('Message must be between 1 and 10,000 characters')
            .escape()
            .customSanitizer(value => {
                // Remove potentially dangerous HTML/script tags
                return value.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
            }),
        body('conversationId')
            .optional()
            .isUUID()
            .withMessage('Invalid conversation ID format'),
        body('provider')
            .optional()
            .isIn(['anthropic', 'openai'])
            .withMessage('Invalid AI provider specified')
    ],
    
    // Document upload validation
    documentUpload: [
        body('filename')
            .trim()
            .isLength({ min: 1, max: 255 })
            .withMessage('Filename must be between 1 and 255 characters')
            .matches(/^[a-zA-Z0-9._-]+$/)
            .withMessage('Filename contains invalid characters'),
        body('fileType')
            .isIn(['pdf', 'docx', 'xlsx', 'pptx', 'txt', 'jpg', 'jpeg', 'png', 'gif'])
            .withMessage('Invalid file type'),
        body('fileSize')
            .isInt({ min: 1, max: 20 * 1024 * 1024 }) // 20MB max
            .withMessage('File size must be between 1 byte and 20MB')
    ],
    
    // Conversation management validation
    conversation: [
        body('title')
            .optional()
            .trim()
            .isLength({ min: 1, max: 255 })
            .withMessage('Title must be between 1 and 255 characters')
            .escape(),
        body('starred')
            .optional()
            .isBoolean()
            .withMessage('Starred must be a boolean value')
    ],
    
    // API key validation
    apiKey: [
        body('apiKey')
            .trim()
            .isLength({ min: 20, max: 200 })
            .withMessage('API key must be between 20 and 200 characters')
            .matches(/^[a-zA-Z0-9._-]+$/)
            .withMessage('API key contains invalid characters')
    ]
};

/**
 * Security Middleware Functions
 */

/**
 * Apply comprehensive security headers
 */
const applySecurityHeaders = (req, res, next) => {
    // Permissions Policy (Feature Policy)
    res.setHeader('Permissions-Policy', [
        'camera=()',
        'microphone=()',
        'geolocation=()',
        'interest-cohort=()',
        'accelerometer=()',
        'gyroscope=()',
        'magnetometer=()',
        'payment=()',
        'usb=()',
        'fullscreen=()',
        'display-capture=()',
        'encrypted-media=()',
        'picture-in-picture=()',
        'publickey-credentials-get=()',
        'screen-wake-lock=()',
        'sync-xhr=()',
        'web-share=()',
        'xr-spatial-tracking=()'
    ].join(', '));

    // Additional security headers
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Download-Options', 'noopen');
    res.setHeader('X-Permitted-Cross-Domain-Policies', 'none');
    
    // Production-specific headers
    if (process.env.NODE_ENV === 'production') {
        res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
        res.setHeader('X-Frame-Options', 'DENY');
        res.setHeader('X-XSS-Protection', '1; mode=block');
    }

    // Request ID for tracking
    req.id = crypto.randomUUID();
    res.setHeader('X-Request-ID', req.id);

    next();
};

/**
 * API Key Validation Middleware
 */
const validateApiKey = (req, res, next) => {
    const apiKey = req.headers['x-api-key'] || req.headers['authorization']?.replace('Bearer ', '');
    
    if (!apiKey) {
        securityLogger.warn('Missing API key', {
            ip: req.ip,
            userAgent: req.get('User-Agent'),
            endpoint: req.path,
            requestId: req.id
        });
        return res.status(401).json({ error: 'API key required' });
    }

    // Validate API key format
    if (!/^[a-zA-Z0-9._-]{20,200}$/.test(apiKey)) {
        securityLogger.warn('Invalid API key format', {
            ip: req.ip,
            userAgent: req.get('User-Agent'),
            endpoint: req.path,
            requestId: req.id
        });
        return res.status(401).json({ error: 'Invalid API key format' });
    }

    // Store validated API key for later use
    req.validatedApiKey = apiKey;
    next();
};

/**
 * Request Size Limiting
 */
const requestSizeLimit = (req, res, next) => {
    const contentLength = parseInt(req.headers['content-length'], 10);
    
    if (contentLength > 10 * 1024 * 1024) { // 10MB limit
        securityLogger.warn('Request too large', {
            ip: req.ip,
            contentLength,
            endpoint: req.path,
            requestId: req.id
        });
        return res.status(413).json({ error: 'Request entity too large' });
    }
    
    next();
};

/**
 * SQL Injection Protection
 */
const sqlInjectionProtection = (req, res, next) => {
    const sqlPatterns = [
        /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|UNION|SCRIPT)\b)/i,
        /(\b(OR|AND)\s+\d+\s*=\s*\d+)/i,
        /(\b(OR|AND)\s+['"]?\w+['"]?\s*=\s*['"]?\w+['"]?)/i,
        /(--|\/\*|\*\/|;)/,
        /(\b(WAITFOR|DELAY)\b)/i
    ];

    const checkValue = (value) => {
        if (typeof value === 'string') {
            return sqlPatterns.some(pattern => pattern.test(value));
        }
        return false;
    };

    const checkObject = (obj) => {
        for (const [key, value] of Object.entries(obj)) {
            if (checkValue(value) || (typeof value === 'object' && checkObject(value))) {
                return true;
            }
        }
        return false;
    };

    if (checkObject(req.body) || checkObject(req.query) || checkObject(req.params)) {
        securityLogger.warn('Potential SQL injection attempt', {
            ip: req.ip,
            userAgent: req.get('User-Agent'),
            endpoint: req.path,
            requestId: req.id,
            body: req.body,
            query: req.query,
            params: req.params
        });
        return res.status(400).json({ error: 'Invalid request data' });
    }

    next();
};

/**
 * File Upload Security
 */
const fileUploadSecurity = (req, res, next) => {
    const allowedFileTypes = [
        'application/pdf',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        'text/plain',
        'image/jpeg',
        'image/png',
        'image/gif'
    ];

    const allowedExtensions = [
        '.pdf', '.docx', '.xlsx', '.pptx', '.txt', '.jpg', '.jpeg', '.png', '.gif'
    ];

    if (req.file) {
        // Check file type
        if (!allowedFileTypes.includes(req.file.mimetype)) {
            securityLogger.warn('Invalid file type uploaded', {
                ip: req.ip,
                mimetype: req.file.mimetype,
                originalname: req.file.originalname,
                requestId: req.id
            });
            return res.status(400).json({ error: 'Invalid file type' });
        }

        // Check file extension
        const fileExtension = req.file.originalname.toLowerCase().substring(
            req.file.originalname.lastIndexOf('.')
        );
        if (!allowedExtensions.includes(fileExtension)) {
            securityLogger.warn('Invalid file extension', {
                ip: req.ip,
                extension: fileExtension,
                originalname: req.file.originalname,
                requestId: req.id
            });
            return res.status(400).json({ error: 'Invalid file extension' });
        }

        // Check file size (20MB max)
        if (req.file.size > 20 * 1024 * 1024) {
            securityLogger.warn('File too large', {
                ip: req.ip,
                size: req.file.size,
                originalname: req.file.originalname,
                requestId: req.id
            });
            return res.status(413).json({ error: 'File too large' });
        }

        // Sanitize filename
        req.file.originalname = req.file.originalname
            .replace(/[^a-zA-Z0-9._-]/g, '_')
            .substring(0, 255);
    }

    next();
};

/**
 * Validation Error Handler
 */
const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        securityLogger.warn('Validation errors', {
            ip: req.ip,
            errors: errors.array(),
            requestId: req.id
        });
        return res.status(400).json({
            error: 'Validation failed',
            details: errors.array()
        });
    }
    next();
};

/**
 * Security Event Logging
 */
const securityEventLogger = (req, res, next) => {
    // Log security-relevant events
    const securityEvents = [
        'authentication',
        'authorization',
        'file_upload',
        'data_export',
        'admin_action'
    ];

    if (securityEvents.some(event => req.path.includes(event))) {
        securityLogger.info('Security event', {
            ip: req.ip,
            userAgent: req.get('User-Agent'),
            endpoint: req.path,
            method: req.method,
            requestId: req.id,
            timestamp: new Date().toISOString()
        });
    }

    next();
};

/**
 * Export middleware functions
 */
module.exports = {
    // Core security middleware
    helmet: helmet(helmetConfig),
    xss: xss(),
    hpp: hpp(),
    mongoSanitize: mongoSanitize(),
    
    // Rate limiting
    rateLimitConfig,
    
    // Custom middleware
    applySecurityHeaders,
    validateApiKey,
    requestSizeLimit,
    sqlInjectionProtection,
    fileUploadSecurity,
    securityEventLogger,
    
    // Validation
    validationRules,
    handleValidationErrors,
    
    // Logger
    securityLogger
};
