/**
 * CCH Axcess Intelligence - Security Configuration
 * Centralized security configuration for production readiness
 */

const path = require('path');
const fs = require('fs');

// Try to find the .env file in the server directory
const envPath = path.join(__dirname, '..', '.env');
if (fs.existsSync(envPath)) {
    require('dotenv').config({ path: envPath });
} else {
    // Fallback to relative path
    require('dotenv').config({ path: './server/.env' });
}

/**
 * Security Configuration Object
 * All security-related settings in one place
 */
const securityConfig = {
    // Environment
    environment: process.env.NODE_ENV || 'development',
    isProduction: process.env.NODE_ENV === 'production',
    isDevelopment: process.env.NODE_ENV === 'development',

    // Server Security
    server: {
        port: process.env.PORT || 3001,
        host: process.env.HOST || 'localhost',
        trustProxy: process.env.TRUST_PROXY === 'true',
        maxRequestSize: process.env.MAX_REQUEST_SIZE || '10mb',
        requestTimeout: parseInt(process.env.REQUEST_TIMEOUT) || 30000,
        keepAliveTimeout: parseInt(process.env.KEEP_ALIVE_TIMEOUT) || 65000,
        headersTimeout: parseInt(process.env.HEADERS_TIMEOUT) || 66000
    },

    // CORS Configuration
    cors: {
        enabled: process.env.CORS_ENABLED !== 'false',
        origins: process.env.CORS_ORIGINS
            ? process.env.CORS_ORIGINS.split(',')
            : (process.env.NODE_ENV === 'production'
                ? [process.env.FRONTEND_URL || 'https://your-domain.com']
                : ['http://localhost:3000', 'http://localhost:5173']),
        credentials: process.env.CORS_CREDENTIALS !== 'false',
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowedHeaders: [
            'Content-Type',
            'Authorization',
            'X-Requested-With',
            'X-API-Key',
            'X-Request-ID'
        ],
        exposedHeaders: ['X-Request-ID', 'X-Rate-Limit-Remaining'],
        maxAge: parseInt(process.env.CORS_MAX_AGE) || 86400
    },

    // Rate Limiting
    rateLimit: {
        enabled: process.env.RATE_LIMIT_ENABLED !== 'false',
        general: {
            windowMs: parseInt(process.env.RATE_LIMIT_GENERAL_WINDOW) || 15 * 60 * 1000, // 15 minutes
            max: parseInt(process.env.RATE_LIMIT_GENERAL_MAX) || (process.env.NODE_ENV === 'production' ? 100 : 1000),
            skipSuccessfulRequests: process.env.RATE_LIMIT_SKIP_SUCCESS === 'true',
            skipFailedRequests: process.env.RATE_LIMIT_SKIP_FAILED === 'false'
        },
        chat: {
            windowMs: parseInt(process.env.RATE_LIMIT_CHAT_WINDOW) || 60 * 1000, // 1 minute
            max: parseInt(process.env.RATE_LIMIT_CHAT_MAX) || (process.env.NODE_ENV === 'production' ? 20 : 100),
            skipSuccessfulRequests: false,
            skipFailedRequests: false
        },
        auth: {
            windowMs: parseInt(process.env.RATE_LIMIT_AUTH_WINDOW) || 15 * 60 * 1000, // 15 minutes
            max: parseInt(process.env.RATE_LIMIT_AUTH_MAX) || 5,
            skipSuccessfulRequests: true,
            skipFailedRequests: false
        },
        upload: {
            windowMs: parseInt(process.env.RATE_LIMIT_UPLOAD_WINDOW) || 60 * 60 * 1000, // 1 hour
            max: parseInt(process.env.RATE_LIMIT_UPLOAD_MAX) || (process.env.NODE_ENV === 'production' ? 10 : 50),
            skipSuccessfulRequests: false,
            skipFailedRequests: false
        }
    },

    // Authentication & Authorization
    auth: {
        enabled: process.env.AUTH_ENABLED !== 'false',
        jwtSecret: process.env.JWT_SECRET || require('crypto').randomBytes(32).toString('hex'),
        jwtExpiresIn: process.env.JWT_EXPIRES_IN || '24h',
        jwtRefreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
        sessionTimeout: parseInt(process.env.SESSION_TIMEOUT) || 8 * 60 * 60 * 1000, // 8 hours
        passwordMinLength: parseInt(process.env.PASSWORD_MIN_LENGTH) || 8,
        passwordMaxLength: parseInt(process.env.PASSWORD_MAX_LENGTH) || 128,
        passwordSaltRounds: parseInt(process.env.PASSWORD_SALT_ROUNDS) || 12,
        apiKeyPrefix: process.env.API_KEY_PREFIX || 'cch_',
        apiKeyLength: parseInt(process.env.API_KEY_LENGTH) || 32
    },

    // Encryption
    encryption: {
        algorithm: process.env.ENCRYPTION_ALGORITHM || 'aes-256-gcm',
        keyLength: parseInt(process.env.ENCRYPTION_KEY_LENGTH) || 32,
        ivLength: parseInt(process.env.ENCRYPTION_IV_LENGTH) || 16
    },

    // File Upload Security
    fileUpload: {
        enabled: process.env.FILE_UPLOAD_ENABLED !== 'false',
        maxFileSize: parseInt(process.env.MAX_FILE_SIZE) || 20 * 1024 * 1024, // 20MB
        maxFiles: parseInt(process.env.MAX_FILES) || 10,
        allowedTypes: process.env.ALLOWED_FILE_TYPES
            ? process.env.ALLOWED_FILE_TYPES.split(',')
            : ['pdf', 'docx', 'xlsx', 'pptx', 'txt', 'jpg', 'jpeg', 'png', 'gif'],
        scanFiles: process.env.SCAN_FILES !== 'false',
        virusScan: process.env.VIRUS_SCAN === 'true',
        quarantineSuspicious: process.env.QUARANTINE_SUSPICIOUS === 'true',
        uploadPath: process.env.UPLOAD_PATH || './uploads',
        tempPath: process.env.TEMP_PATH || './temp'
    },

    // Content Security Policy
    csp: {
        enabled: process.env.CSP_ENABLED !== 'false',
        reportOnly: process.env.CSP_REPORT_ONLY === 'true',
        reportUri: process.env.CSP_REPORT_URI,
        nonceEnabled: process.env.CSP_NONCE_ENABLED !== 'false',
        strictDynamic: process.env.CSP_STRICT_DYNAMIC === 'true',
        upgradeInsecureRequests: process.env.CSP_UPGRADE_INSECURE === 'true'
    },

    // Logging & Monitoring
    logging: {
        enabled: process.env.LOGGING_ENABLED !== 'false',
        level: process.env.LOG_LEVEL || 'info',
        securityLevel: process.env.SECURITY_LOG_LEVEL || 'warn',
        logSecurityEvents: process.env.LOG_SECURITY_EVENTS !== 'false',
        logPath: process.env.LOG_PATH || './logs',
        maxLogSize: process.env.MAX_LOG_SIZE || '10m',
        maxLogFiles: parseInt(process.env.MAX_LOG_FILES) || 5,
        logFormat: process.env.LOG_FORMAT || 'json'
    },

    // Database Security
    database: {
        usePreparedStatements: process.env.DB_USE_PREPARED_STATEMENTS !== 'false',
        encryptConnections: process.env.DB_ENCRYPT_CONNECTIONS === 'true',
        connectionTimeout: parseInt(process.env.DB_CONNECTION_TIMEOUT) || 30000,
        queryTimeout: parseInt(process.env.DB_QUERY_TIMEOUT) || 10000,
        maxConnections: parseInt(process.env.DB_MAX_CONNECTIONS) || 10,
        idleTimeout: parseInt(process.env.DB_IDLE_TIMEOUT) || 60000
    },

    // API Security
    api: {
        versioning: process.env.API_VERSIONING !== 'false',
        version: process.env.API_VERSION || 'v1',
        requireApiKey: process.env.REQUIRE_API_KEY !== 'false',
        validateApiKey: process.env.VALIDATE_API_KEY !== 'false',
        apiKeyHeader: process.env.API_KEY_HEADER || 'X-API-Key',
        requestIdHeader: process.env.REQUEST_ID_HEADER || 'X-Request-ID',
        maxRequestIdLength: parseInt(process.env.MAX_REQUEST_ID_LENGTH) || 36
    },

    // Input Validation
    validation: {
        enabled: process.env.VALIDATION_ENABLED !== 'false',
        sanitizeInput: process.env.SANITIZE_INPUT !== 'false',
        escapeHtml: process.env.ESCAPE_HTML !== 'false',
        validateEmail: process.env.VALIDATE_EMAIL !== 'false',
        validateUuid: process.env.VALIDATE_UUID !== 'false',
        maxStringLength: parseInt(process.env.MAX_STRING_LENGTH) || 10000,
        maxArrayLength: parseInt(process.env.MAX_ARRAY_LENGTH) || 1000,
        maxObjectDepth: parseInt(process.env.MAX_OBJECT_DEPTH) || 10
    },

    // Headers Security
    headers: {
        hsts: {
            enabled: process.env.HSTS_ENABLED !== 'false',
            maxAge: parseInt(process.env.HSTS_MAX_AGE) || 31536000,
            includeSubDomains: process.env.HSTS_INCLUDE_SUBDOMAINS !== 'false',
            preload: process.env.HSTS_PRELOAD !== 'false'
        },
        frameOptions: process.env.FRAME_OPTIONS || 'DENY',
        contentTypeOptions: process.env.CONTENT_TYPE_OPTIONS || 'nosniff',
        xssProtection: process.env.XSS_PROTECTION !== 'false',
        referrerPolicy: process.env.REFERRER_POLICY || 'strict-origin-when-cross-origin',
        permissionsPolicy: process.env.PERMISSIONS_POLICY_ENABLED !== 'false'
    },

    // Session Security
    session: {
        enabled: process.env.SESSION_ENABLED !== 'false',
        secret: process.env.SESSION_SECRET || require('crypto').randomBytes(32).toString('hex'),
        name: process.env.SESSION_NAME || 'cch.sid',
        cookie: {
            secure: process.env.SESSION_COOKIE_SECURE === 'true',
            httpOnly: process.env.SESSION_COOKIE_HTTP_ONLY !== 'false',
            sameSite: process.env.SESSION_COOKIE_SAME_SITE || 'strict',
            maxAge: parseInt(process.env.SESSION_COOKIE_MAX_AGE) || 8 * 60 * 60 * 1000 // 8 hours
        },
        resave: process.env.SESSION_RESAVE === 'true',
        saveUninitialized: process.env.SESSION_SAVE_UNINITIALIZED === 'false',
        rolling: process.env.SESSION_ROLLING === 'true'
    },

    // Threat Detection
    threatDetection: {
        enabled: process.env.THREAT_DETECTION_ENABLED !== 'false',
        sqlInjection: process.env.DETECT_SQL_INJECTION !== 'false',
        xss: process.env.DETECT_XSS !== 'false',
        pathTraversal: process.env.DETECT_PATH_TRAVERSAL !== 'false',
        commandInjection: process.env.DETECT_COMMAND_INJECTION !== 'false',
        suspiciousPatterns: process.env.DETECT_SUSPICIOUS_PATTERNS !== 'false',
        blockSuspicious: process.env.BLOCK_SUSPICIOUS === 'true',
        logThreats: process.env.LOG_THREATS !== 'false'
    },

    // Backup & Recovery
    backup: {
        enabled: process.env.BACKUP_ENABLED !== 'false',
        frequency: process.env.BACKUP_FREQUENCY || 'daily',
        retention: parseInt(process.env.BACKUP_RETENTION) || 30, // days
        encryptBackups: process.env.ENCRYPT_BACKUPS === 'true',
        backupPath: process.env.BACKUP_PATH || './backups',
        includeLogs: process.env.BACKUP_INCLUDE_LOGS === 'true',
        includeUploads: process.env.BACKUP_INCLUDE_UPLOADS === 'true'
    }
};

/**
 * Environment-specific overrides
 */
const environmentOverrides = {
    development: {
        cors: {
            origins: ['http://localhost:3000', 'http://localhost:5173', 'http://127.0.0.1:3000', 'http://127.0.0.1:5173']
        },
        logging: {
            level: 'debug',
            securityLevel: 'info'
        },
        csp: {
            reportOnly: true
        },
        headers: {
            hsts: {
                enabled: false
            }
        }
    },

    production: {
        cors: {
            origins: [process.env.FRONTEND_URL || 'https://your-domain.com']
        },
        logging: {
            level: 'warn',
            securityLevel: 'error'
        },
        csp: {
            reportOnly: false
        },
        headers: {
            hsts: {
                enabled: true
            }
        },
        session: {
            cookie: {
                secure: true
            }
        }
    }
};

/**
 * Apply environment-specific overrides
 */
const applyEnvironmentOverrides = (config, environment) => {
    const overrides = environmentOverrides[environment];
    if (overrides) {
        Object.keys(overrides).forEach(key => {
            if (config[key]) {
                config[key] = { ...config[key], ...overrides[key] };
            }
        });
    }
    return config;
};

/**
 * Validate security configuration
 */
const validateSecurityConfig = (config) => {
    const errors = [];
    const warnings = [];

    // Check required environment variables
    if (config.isProduction) {
        if (!process.env.JWT_SECRET) {
            warnings.push('JWT_SECRET not set in production - using random key');
        }
        if (!process.env.SESSION_SECRET) {
            warnings.push('SESSION_SECRET not set in production - using random key');
        }
        if (!process.env.FRONTEND_URL) {
            warnings.push('FRONTEND_URL not set in production');
        }
    }

    // Validate rate limits
    if (config.rateLimit.general.max < 10) {
        errors.push('General rate limit too restrictive (min 10)');
    }
    if (config.rateLimit.auth.max < 3) {
        errors.push('Auth rate limit too restrictive (min 3)');
    }

    // Validate file upload settings
    if (config.fileUpload.maxFileSize > 100 * 1024 * 1024) {
        warnings.push('File upload size limit very high (100MB+)');
    }

    // Validate password settings
    if (config.auth.passwordMinLength < 8) {
        errors.push('Password minimum length too short (min 8)');
    }

    return { errors, warnings };
};

/**
 * Get final security configuration
 */
const getSecurityConfig = () => {
    const config = { ...securityConfig };
    const environment = config.environment;

    // Apply environment overrides
    const finalConfig = applyEnvironmentOverrides(config, environment);

    // Validate configuration
    const validation = validateSecurityConfig(finalConfig);

    return {
        ...finalConfig,
        validation
    };
};

/**
 * Export configuration
 */
module.exports = {
    securityConfig: getSecurityConfig(),
    validateSecurityConfig,
    applyEnvironmentOverrides
};
