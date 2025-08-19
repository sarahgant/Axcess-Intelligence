/**
 * Production Configuration
 * Production-ready settings and optimizations
 */

const path = require('path');
const fs = require('fs');

// Load environment variables
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const productionConfig = {
    // Server Configuration
    server: {
        port: process.env.PORT || 3001,
        host: process.env.HOST || '0.0.0.0',
        frontendUrl: process.env.FRONTEND_URL || 'https://your-domain.com',
        trustProxy: true,
        maxRequestSize: process.env.MAX_REQUEST_SIZE || '10mb',
        requestTimeout: parseInt(process.env.REQUEST_TIMEOUT) || 30000,
        keepAliveTimeout: parseInt(process.env.KEEP_ALIVE_TIMEOUT) || 65000,
        headersTimeout: parseInt(process.env.HEADERS_TIMEOUT) || 66000
    },

    // Database Configuration
    database: {
        path: process.env.DATABASE_PATH || path.join(__dirname, '..', 'data', 'intelligence.db'),
        backupPath: process.env.DATABASE_BACKUP_PATH || path.join(__dirname, '..', 'backups'),
        enableBackups: process.env.ENABLE_DATABASE_BACKUPS === 'true',
        backupIntervalHours: parseInt(process.env.BACKUP_INTERVAL_HOURS) || 24,

        // SQLite Production Optimizations
        pragmas: {
            journal_mode: 'WAL',
            synchronous: 'NORMAL',
            cache_size: 1000000,
            temp_store: 'MEMORY',
            mmap_size: 268435456, // 256MB
            foreign_keys: 'ON',
            busy_timeout: 30000
        }
    },

    // Security Configuration
    security: {
        adminKey: process.env.ADMIN_KEY || 'change-me-in-production',
        sessionSecret: process.env.SESSION_SECRET || 'change-me-in-production',
        jwtSecret: process.env.JWT_SECRET || 'change-me-in-production',

        // Rate Limiting
        rateLimit: {
            windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 900000, // 15 minutes
            maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
            message: process.env.RATE_LIMIT_MESSAGE || "Too many requests from this IP"
        },

        // CORS Configuration
        cors: {
            origin: process.env.FRONTEND_URL ? [process.env.FRONTEND_URL] : ['http://localhost:3000'],
            credentials: true,
            optionsSuccessStatus: 200
        },

        // Content Security Policy
        csp: {
            directives: {
                defaultSrc: ["'self'"],
                scriptSrc: ["'self'", "'unsafe-inline'"],
                styleSrc: ["'self'", "'unsafe-inline'"],
                imgSrc: ["'self'", "data:", "https:"],
                connectSrc: ["'self'"],
                fontSrc: ["'self'"],
                objectSrc: ["'none'"],
                mediaSrc: ["'self'"],
                frameSrc: ["'none'"],
            }
        }
    },

    // AI Provider Configuration
    ai: {
        anthropic: {
            apiKey: process.env.ANTHROPIC_API_KEY,
            defaultModel: process.env.ANTHROPIC_DEFAULT_MODEL || 'claude-3-5-sonnet-20241022',
            maxTokens: 4000,
            temperature: 0.7
        },
        openai: {
            apiKey: process.env.OPENAI_API_KEY,
            organizationId: process.env.OPENAI_ORGANIZATION_ID,
            defaultModel: process.env.OPENAI_DEFAULT_MODEL || 'gpt-4-turbo-preview',
            maxTokens: 4000,
            temperature: 0.7
        }
    },

    // Logging Configuration
    logging: {
        level: process.env.LOG_LEVEL || 'info',
        filePath: process.env.LOG_FILE_PATH || path.join(__dirname, '..', 'logs', 'application.log'),
        enableRotation: process.env.ENABLE_LOG_ROTATION === 'true',
        maxFileSize: process.env.MAX_LOG_FILE_SIZE || '100MB',
        maxFiles: parseInt(process.env.MAX_LOG_FILES) || 10,

        // Production log format
        format: {
            timestamp: true,
            level: true,
            message: true,
            meta: true,
            colorize: false
        }
    },

    // Monitoring Configuration
    monitoring: {
        healthCheckInterval: parseInt(process.env.HEALTH_CHECK_INTERVAL) || 30000,
        enableMetrics: process.env.ENABLE_METRICS === 'true',
        metricsPort: parseInt(process.env.METRICS_PORT) || 3002
    },

    // SSL/TLS Configuration
    ssl: {
        enabled: process.env.ENABLE_HTTPS === 'true',
        keyPath: process.env.SSL_KEY_PATH,
        certPath: process.env.SSL_CERT_PATH
    },

    // Feature Flags
    features: {
        feedbackCollection: process.env.ENABLE_FEEDBACK_COLLECTION !== 'false',
        conversationExport: process.env.ENABLE_CONVERSATION_EXPORT !== 'false',
        adminDashboard: process.env.ENABLE_ADMIN_DASHBOARD !== 'false',
        userRegistration: process.env.ENABLE_USER_REGISTRATION === 'true'
    },

    // Performance Optimizations
    performance: {
        compression: true,
        staticFileCache: '1y',
        apiResponseCache: '5m',
        enableEtags: true,
        enableGzip: true
    }
};

// Validation function
const validateConfig = () => {
    const errors = [];

    // Required environment variables
    const required = [
        'ANTHROPIC_API_KEY',
        'ADMIN_KEY'
    ];

    required.forEach(key => {
        if (!process.env[key] || process.env[key] === 'change-me-in-production') {
            errors.push(`${key} must be set in production`);
        }
    });

    // Create required directories
    const dirs = [
        path.dirname(productionConfig.database.path),
        productionConfig.database.backupPath,
        path.dirname(productionConfig.logging.filePath)
    ];

    dirs.forEach(dir => {
        if (!fs.existsSync(dir)) {
            try {
                fs.mkdirSync(dir, { recursive: true });
            } catch (error) {
                errors.push(`Failed to create directory: ${dir}`);
            }
        }
    });

    if (errors.length > 0) {
        console.error('❌ Production configuration errors:');
        errors.forEach(error => console.error(`  - ${error}`));
        process.exit(1);
    }
};

// Auto-validate in production
if (process.env.NODE_ENV === 'production') {
    validateConfig();
}

module.exports = {
    productionConfig,
    validateConfig
};
