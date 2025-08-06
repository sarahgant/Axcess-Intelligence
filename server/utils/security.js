/**
 * CCH Axcess Intelligence - Security Utilities
 * Comprehensive security utilities for production readiness
 */

const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const fs = require('fs').promises;
const path = require('path');
const winston = require('winston');

// Configure security utilities logger
const securityLogger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),
    transports: [
        new winston.transports.File({ filename: 'logs/security-utils.log' }),
        new winston.transports.Console({
            format: winston.format.simple()
        })
    ]
});

/**
 * Encryption/Decryption Utilities
 */

/**
 * Generate a secure encryption key
 * @param {number} length - Key length in bytes (default: 32)
 * @returns {string} Base64 encoded key
 */
const generateEncryptionKey = (length = 32) => {
    return crypto.randomBytes(length).toString('base64');
};

/**
 * Encrypt sensitive data
 * @param {string} text - Text to encrypt
 * @param {string} key - Encryption key (base64)
 * @returns {string} Encrypted data (base64)
 */
const encryptData = (text, key) => {
    try {
        const algorithm = 'aes-256-gcm';
        const iv = crypto.randomBytes(16);
        const cipher = crypto.createCipher(algorithm, Buffer.from(key, 'base64'));
        
        let encrypted = cipher.update(text, 'utf8', 'hex');
        encrypted += cipher.final('hex');
        
        const authTag = cipher.getAuthTag();
        
        // Combine IV, encrypted data, and auth tag
        const result = iv.toString('hex') + ':' + encrypted + ':' + authTag.toString('hex');
        return Buffer.from(result).toString('base64');
    } catch (error) {
        securityLogger.error('Encryption failed', { error: error.message });
        throw new Error('Encryption failed');
    }
};

/**
 * Decrypt sensitive data
 * @param {string} encryptedData - Encrypted data (base64)
 * @param {string} key - Encryption key (base64)
 * @returns {string} Decrypted text
 */
const decryptData = (encryptedData, key) => {
    try {
        const algorithm = 'aes-256-gcm';
        const data = Buffer.from(encryptedData, 'base64').toString();
        const parts = data.split(':');
        
        if (parts.length !== 3) {
            throw new Error('Invalid encrypted data format');
        }
        
        const iv = Buffer.from(parts[0], 'hex');
        const encrypted = parts[1];
        const authTag = Buffer.from(parts[2], 'hex');
        
        const decipher = crypto.createDecipher(algorithm, Buffer.from(key, 'base64'));
        decipher.setAuthTag(authTag);
        
        let decrypted = decipher.update(encrypted, 'hex', 'utf8');
        decrypted += decipher.final('utf8');
        
        return decrypted;
    } catch (error) {
        securityLogger.error('Decryption failed', { error: error.message });
        throw new Error('Decryption failed');
    }
};

/**
 * API Key Management
 */

/**
 * Generate a secure API key
 * @param {string} prefix - Key prefix (e.g., 'cch_')
 * @param {number} length - Key length (default: 32)
 * @returns {string} Generated API key
 */
const generateApiKey = (prefix = 'cch_', length = 32) => {
    const randomBytes = crypto.randomBytes(length);
    const key = randomBytes.toString('base64url');
    return `${prefix}${key}`;
};

/**
 * Validate API key format
 * @param {string} apiKey - API key to validate
 * @returns {boolean} True if valid
 */
const validateApiKeyFormat = (apiKey) => {
    if (!apiKey || typeof apiKey !== 'string') {
        return false;
    }
    
    // Check length and format
    const minLength = 20;
    const maxLength = 200;
    const formatRegex = /^[a-zA-Z0-9._-]+$/;
    
    return apiKey.length >= minLength && 
           apiKey.length <= maxLength && 
           formatRegex.test(apiKey);
};

/**
 * Hash API key for storage
 * @param {string} apiKey - API key to hash
 * @returns {string} Hashed API key
 */
const hashApiKey = async (apiKey) => {
    const saltRounds = 12;
    return await bcrypt.hash(apiKey, saltRounds);
};

/**
 * Verify API key hash
 * @param {string} apiKey - Plain API key
 * @param {string} hashedKey - Hashed API key
 * @returns {boolean} True if match
 */
const verifyApiKey = async (apiKey, hashedKey) => {
    return await bcrypt.compare(apiKey, hashedKey);
};

/**
 * Session Token Management
 */

/**
 * Generate JWT token
 * @param {Object} payload - Token payload
 * @param {string} secret - JWT secret
 * @param {Object} options - JWT options
 * @returns {string} JWT token
 */
const generateJWT = (payload, secret, options = {}) => {
    const defaultOptions = {
        expiresIn: '24h',
        issuer: 'cch-intelligence',
        audience: 'cch-users'
    };
    
    const jwtOptions = { ...defaultOptions, ...options };
    
    try {
        return jwt.sign(payload, secret, jwtOptions);
    } catch (error) {
        securityLogger.error('JWT generation failed', { error: error.message });
        throw new Error('Token generation failed');
    }
};

/**
 * Verify JWT token
 * @param {string} token - JWT token
 * @param {string} secret - JWT secret
 * @returns {Object} Decoded payload
 */
const verifyJWT = (token, secret) => {
    try {
        return jwt.verify(token, secret);
    } catch (error) {
        securityLogger.error('JWT verification failed', { error: error.message });
        throw new Error('Token verification failed');
    }
};

/**
 * Generate session token
 * @param {string} userId - User ID
 * @param {string} sessionId - Session ID
 * @returns {string} Session token
 */
const generateSessionToken = (userId, sessionId) => {
    const payload = {
        userId,
        sessionId,
        type: 'session',
        iat: Math.floor(Date.now() / 1000)
    };
    
    const secret = process.env.JWT_SECRET || crypto.randomBytes(32).toString('hex');
    return generateJWT(payload, secret, { expiresIn: '8h' });
};

/**
 * Password Security
 */

/**
 * Hash password
 * @param {string} password - Plain password
 * @param {number} saltRounds - Salt rounds (default: 12)
 * @returns {string} Hashed password
 */
const hashPassword = async (password, saltRounds = 12) => {
    try {
        return await bcrypt.hash(password, saltRounds);
    } catch (error) {
        securityLogger.error('Password hashing failed', { error: error.message });
        throw new Error('Password hashing failed');
    }
};

/**
 * Verify password
 * @param {string} password - Plain password
 * @param {string} hashedPassword - Hashed password
 * @returns {boolean} True if match
 */
const verifyPassword = async (password, hashedPassword) => {
    try {
        return await bcrypt.compare(password, hashedPassword);
    } catch (error) {
        securityLogger.error('Password verification failed', { error: error.message });
        return false;
    }
};

/**
 * Validate password strength
 * @param {string} password - Password to validate
 * @returns {Object} Validation result
 */
const validatePasswordStrength = (password) => {
    const minLength = 8;
    const maxLength = 128;
    
    const checks = {
        length: password.length >= minLength && password.length <= maxLength,
        lowercase: /[a-z]/.test(password),
        uppercase: /[A-Z]/.test(password),
        numbers: /\d/.test(password),
        special: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
        noCommon: !['password', '123456', 'qwerty', 'admin'].includes(password.toLowerCase())
    };
    
    const passed = Object.values(checks).filter(Boolean).length;
    const strength = passed < 3 ? 'weak' : passed < 5 ? 'medium' : 'strong';
    
    return {
        isValid: passed >= 4,
        strength,
        checks,
        passed,
        total: Object.keys(checks).length
    };
};

/**
 * Input Validation and Sanitization
 */

/**
 * Sanitize HTML content
 * @param {string} html - HTML content to sanitize
 * @returns {string} Sanitized HTML
 */
const sanitizeHtml = (html) => {
    if (!html || typeof html !== 'string') {
        return '';
    }
    
    // Remove script tags and event handlers
    return html
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
        .replace(/on\w+\s*=\s*["'][^"']*["']/gi, '')
        .replace(/javascript:/gi, '')
        .replace(/vbscript:/gi, '')
        .replace(/data:/gi, '')
        .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
        .replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, '')
        .replace(/<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi, '');
};

/**
 * Sanitize filename
 * @param {string} filename - Original filename
 * @returns {string} Sanitized filename
 */
const sanitizeFilename = (filename) => {
    if (!filename || typeof filename !== 'string') {
        return 'unnamed_file';
    }
    
    // Remove path traversal and dangerous characters
    return filename
        .replace(/[<>:"/\\|?*]/g, '_')
        .replace(/\.\./g, '_')
        .replace(/^\./, '_')
        .substring(0, 255)
        .trim();
};

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} True if valid
 */
const validateEmail = (email) => {
    if (!email || typeof email !== 'string') {
        return false;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email) && email.length <= 254;
};

/**
 * Validate UUID format
 * @param {string} uuid - UUID to validate
 * @returns {boolean} True if valid
 */
const validateUUID = (uuid) => {
    if (!uuid || typeof uuid !== 'string') {
        return false;
    }
    
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(uuid);
};

/**
 * File Upload Security
 */

/**
 * Allowed file types configuration
 */
const ALLOWED_FILE_TYPES = {
    'application/pdf': ['.pdf'],
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
    'application/vnd.openxmlformats-officedocument.presentationml.presentation': ['.pptx'],
    'text/plain': ['.txt', '.rtf', '.log'],
    'image/jpeg': ['.jpg', '.jpeg'],
    'image/png': ['.png'],
    'image/gif': ['.gif'],
    'image/webp': ['.webp']
};

/**
 * Validate file type
 * @param {string} mimetype - File MIME type
 * @param {string} filename - Original filename
 * @returns {boolean} True if valid
 */
const validateFileType = (mimetype, filename) => {
    if (!mimetype || !filename) {
        return false;
    }
    
    const allowedTypes = Object.keys(ALLOWED_FILE_TYPES);
    const fileExtension = path.extname(filename).toLowerCase();
    
    // Check MIME type
    if (!allowedTypes.includes(mimetype)) {
        return false;
    }
    
    // Check file extension
    const allowedExtensions = ALLOWED_FILE_TYPES[mimetype];
    return allowedExtensions.includes(fileExtension);
};

/**
 * Validate file size
 * @param {number} size - File size in bytes
 * @param {number} maxSize - Maximum size in bytes (default: 20MB)
 * @returns {boolean} True if valid
 */
const validateFileSize = (size, maxSize = 20 * 1024 * 1024) => {
    return size > 0 && size <= maxSize;
};

/**
 * Scan file for malicious content
 * @param {Buffer} fileBuffer - File content
 * @param {string} filename - Filename
 * @returns {Object} Scan result
 */
const scanFile = async (fileBuffer, filename) => {
    const result = {
        isSafe: true,
        threats: [],
        warnings: []
    };
    
    try {
        // Check for executable content in non-executable files
        const executableSignatures = [
            { signature: 'MZ', description: 'Windows executable' },
            { signature: '\x7fELF', description: 'Linux executable' },
            { signature: '#!', description: 'Shell script' }
        ];
        
        const fileHeader = fileBuffer.slice(0, 10).toString('hex');
        
        for (const threat of executableSignatures) {
            if (fileHeader.includes(threat.signature)) {
                result.isSafe = false;
                result.threats.push(threat.description);
            }
        }
        
        // Check for suspicious patterns
        const content = fileBuffer.toString('utf8', 0, Math.min(1000, fileBuffer.length));
        const suspiciousPatterns = [
            { pattern: /<script/i, description: 'HTML script tag' },
            { pattern: /javascript:/i, description: 'JavaScript protocol' },
            { pattern: /vbscript:/i, description: 'VBScript protocol' },
            { pattern: /data:text\/html/i, description: 'Data URL with HTML' }
        ];
        
        for (const pattern of suspiciousPatterns) {
            if (pattern.pattern.test(content)) {
                result.warnings.push(pattern.description);
            }
        }
        
        // Check file extension vs content
        const extension = path.extname(filename).toLowerCase();
        if (extension === '.txt' && content.includes('<html')) {
            result.warnings.push('Text file contains HTML content');
        }
        
    } catch (error) {
        securityLogger.error('File scan failed', { 
            error: error.message, 
            filename 
        });
        result.isSafe = false;
        result.threats.push('File scan failed');
    }
    
    return result;
};

/**
 * Generate secure file path
 * @param {string} originalName - Original filename
 * @param {string} userId - User ID
 * @returns {string} Secure file path
 */
const generateSecureFilePath = (originalName, userId) => {
    const timestamp = Date.now();
    const randomId = crypto.randomBytes(8).toString('hex');
    const sanitizedName = sanitizeFilename(originalName);
    const extension = path.extname(sanitizedName);
    const nameWithoutExt = path.basename(sanitizedName, extension);
    
    return `${userId}/${timestamp}_${randomId}_${nameWithoutExt}${extension}`;
};

/**
 * Security Monitoring
 */

/**
 * Log security event
 * @param {string} event - Event type
 * @param {Object} data - Event data
 * @param {string} userId - User ID (optional)
 * @param {string} ip - IP address (optional)
 */
const logSecurityEvent = (event, data, userId = null, ip = null) => {
    const logEntry = {
        timestamp: new Date().toISOString(),
        event,
        data,
        userId,
        ip,
        userAgent: data.userAgent || null
    };
    
    securityLogger.info('Security event', logEntry);
};

/**
 * Generate security report
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @returns {Object} Security report
 */
const generateSecurityReport = async (startDate, endDate) => {
    // This would typically query a database for security events
    // For now, return a mock report structure
    return {
        period: { start: startDate, end: endDate },
        totalEvents: 0,
        eventsByType: {},
        threats: [],
        recommendations: []
    };
};

/**
 * Export all utilities
 */
module.exports = {
    // Encryption/Decryption
    generateEncryptionKey,
    encryptData,
    decryptData,
    
    // API Key Management
    generateApiKey,
    validateApiKeyFormat,
    hashApiKey,
    verifyApiKey,
    
    // Session Token Management
    generateJWT,
    verifyJWT,
    generateSessionToken,
    
    // Password Security
    hashPassword,
    verifyPassword,
    validatePasswordStrength,
    
    // Input Validation and Sanitization
    sanitizeHtml,
    sanitizeFilename,
    validateEmail,
    validateUUID,
    
    // File Upload Security
    ALLOWED_FILE_TYPES,
    validateFileType,
    validateFileSize,
    scanFile,
    generateSecureFilePath,
    
    // Security Monitoring
    logSecurityEvent,
    generateSecurityReport,
    
    // Logger
    securityLogger
};
