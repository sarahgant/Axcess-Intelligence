# CCH Axcess Intelligence - Security Implementation Guide

## Overview

This document outlines the comprehensive security implementation for the CCH Axcess Intelligence application. The security system is designed to provide enterprise-grade protection while maintaining usability and performance.

## Security Architecture

### Security Layers

1. **Network Security** - CORS, rate limiting, request validation
2. **Application Security** - Input sanitization, XSS protection, SQL injection prevention
3. **Data Security** - Encryption, secure file handling, API key management
4. **Session Security** - JWT tokens, secure cookies, session management
5. **Monitoring** - Security logging, threat detection, audit trails

## Implemented Security Features

### 1. Security Middleware (`server/middleware/security.js`)

#### Core Security Components
- **Helmet.js** - Comprehensive security headers
- **XSS Protection** - Cross-site scripting prevention
- **HPP Protection** - HTTP Parameter Pollution prevention
- **Mongo Sanitize** - NoSQL injection prevention
- **Rate Limiting** - Request throttling and abuse prevention

#### Key Features
```javascript
// Comprehensive security middleware stack
app.use(securityMiddleware.helmet);
app.use(securityMiddleware.xss);
app.use(securityMiddleware.hpp);
app.use(securityMiddleware.mongoSanitize);
app.use(securityMiddleware.applySecurityHeaders);
app.use(securityMiddleware.requestSizeLimit);
app.use(securityMiddleware.sqlInjectionProtection);
app.use(securityMiddleware.securityEventLogger);
```

#### Rate Limiting Configuration
- **General API**: 100 requests per 15 minutes (production)
- **Chat Endpoints**: 20 requests per minute (production)
- **Authentication**: 5 attempts per 15 minutes
- **File Uploads**: 10 uploads per hour (production)

### 2. Security Utilities (`server/utils/security.js`)

#### Encryption & Decryption
```javascript
// AES-256-GCM encryption
const encrypted = encryptData(sensitiveData, encryptionKey);
const decrypted = decryptData(encrypted, encryptionKey);
```

#### API Key Management
```javascript
// Generate secure API keys
const apiKey = generateApiKey('cch_', 32);
const isValid = validateApiKeyFormat(apiKey);
const hashedKey = await hashApiKey(apiKey);
```

#### Password Security
```javascript
// Bcrypt password hashing
const hashedPassword = await hashPassword(password, 12);
const isValid = await verifyPassword(password, hashedPassword);
const strength = validatePasswordStrength(password);
```

#### File Upload Security
```javascript
// Comprehensive file validation
const isValidType = validateFileType(mimetype, filename);
const isValidSize = validateFileSize(size, 20 * 1024 * 1024);
const scanResult = await scanFile(fileBuffer, filename);
```

### 3. Content Security Policy (`server/middleware/csp.js`)

#### CSP Directives
```javascript
// Strict CSP configuration
defaultSrc: ["'self'"]
scriptSrc: ["'self'", "'unsafe-inline'"] // Required for Vite
styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"]
connectSrc: ["'self'", "https://api.anthropic.com", "https://api.openai.com"]
frameAncestors: ["'none'"] // Prevent clickjacking
```

#### Nonce Generation
```javascript
// Secure nonce for inline scripts
const nonce = generateNonce();
// Usage: <script nonce="generated-nonce">...</script>
```

### 4. Security Configuration (`server/config/security.js`)

#### Environment-Based Configuration
```javascript
// Production vs Development settings
const config = {
    environment: process.env.NODE_ENV || 'development',
    isProduction: process.env.NODE_ENV === 'production',
    // ... comprehensive configuration
};
```

## Security Headers

### Implemented Headers
- **Content-Security-Policy** - XSS and injection protection
- **X-Frame-Options: DENY** - Clickjacking prevention
- **X-Content-Type-Options: nosniff** - MIME sniffing prevention
- **X-XSS-Protection: 1; mode=block** - Legacy XSS protection
- **Strict-Transport-Security** - HTTPS enforcement (production)
- **Referrer-Policy** - Referrer information control
- **Permissions-Policy** - Feature access control

### Permissions Policy
```javascript
// Restrict potentially dangerous features
'camera=()',
'microphone=()',
'geolocation=()',
'payment=()',
'usb=()',
'fullscreen=()',
'display-capture=()'
```

## Input Validation & Sanitization

### Validation Rules
```javascript
// Comprehensive input validation
const validationRules = {
    chatMessage: [
        body('message')
            .trim()
            .isLength({ min: 1, max: 10000 })
            .escape()
            .customSanitizer(value => {
                return value.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
            })
    ],
    documentUpload: [
        body('filename')
            .trim()
            .isLength({ min: 1, max: 255 })
            .matches(/^[a-zA-Z0-9._-]+$/)
    ]
};
```

### SQL Injection Protection
```javascript
// Pattern-based SQL injection detection
const sqlPatterns = [
    /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|UNION|SCRIPT)\b)/i,
    /(\b(OR|AND)\s+\d+\s*=\s*\d+)/i,
    /(--|\/\*|\*\/|;)/,
    /(\b(WAITFOR|DELAY)\b)/i
];
```

## File Upload Security

### Allowed File Types
```javascript
const ALLOWED_FILE_TYPES = {
    'application/pdf': ['.pdf'],
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
    'text/plain': ['.txt', '.rtf', '.log'],
    'image/jpeg': ['.jpg', '.jpeg'],
    'image/png': ['.png'],
    'image/gif': ['.gif']
};
```

### File Scanning
- **Executable Detection** - Identifies executable content in non-executable files
- **Suspicious Pattern Detection** - Detects HTML, JavaScript, and other potentially dangerous content
- **File Extension Validation** - Ensures file extension matches MIME type
- **Size Limits** - 20MB maximum file size

## API Security

### API Key Management
```javascript
// Secure API key generation and validation
const apiKey = generateApiKey('cch_', 32);
const isValid = validateApiKeyFormat(apiKey);
const hashedKey = await hashApiKey(apiKey);
const isVerified = await verifyApiKey(apiKey, hashedKey);
```

### Request Validation
```javascript
// Comprehensive request validation
app.use(securityMiddleware.validateApiKey);
app.use(securityMiddleware.requestSizeLimit);
app.use(securityMiddleware.sqlInjectionProtection);
app.use(securityMiddleware.handleValidationErrors);
```

## Session Security

### JWT Token Management
```javascript
// Secure JWT token generation
const token = generateJWT(payload, secret, {
    expiresIn: '24h',
    issuer: 'cch-intelligence',
    audience: 'cch-users'
});
```

### Session Configuration
```javascript
// Secure session settings
const sessionConfig = {
    secret: process.env.SESSION_SECRET,
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        sameSite: 'strict',
        maxAge: 8 * 60 * 60 * 1000 // 8 hours
    }
};
```

## Security Monitoring

### Security Logging
```javascript
// Comprehensive security event logging
const securityLogger = winston.createLogger({
    level: 'warn',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),
    transports: [
        new winston.transports.File({ filename: 'logs/security.log' }),
        new winston.transports.Console()
    ]
});
```

### Threat Detection
- **SQL Injection Attempts** - Logged and blocked
- **XSS Attempts** - Detected and sanitized
- **Rate Limit Violations** - Logged with IP and user agent
- **File Upload Violations** - Logged with file details
- **Authentication Failures** - Tracked for brute force detection

## Environment Configuration

### Required Environment Variables

#### Production Environment
```bash
# Security Secrets
JWT_SECRET=your-secure-jwt-secret
SESSION_SECRET=your-secure-session-secret
ENCRYPTION_KEY=your-encryption-key

# Application URLs
FRONTEND_URL=https://your-domain.com
NODE_ENV=production

# Security Settings
CORS_ENABLED=true
RATE_LIMIT_ENABLED=true
CSP_ENABLED=true
HSTS_ENABLED=true
```

#### Development Environment
```bash
# Development settings
NODE_ENV=development
CORS_ENABLED=true
RATE_LIMIT_ENABLED=true
CSP_REPORT_ONLY=true
HSTS_ENABLED=false
```

### Security Configuration Validation
```javascript
// Automatic configuration validation
const validation = validateSecurityConfig(config);
if (validation.errors.length > 0) {
    console.error('Security configuration errors:', validation.errors);
}
if (validation.warnings.length > 0) {
    console.warn('Security configuration warnings:', validation.warnings);
}
```

## Security Best Practices

### 1. Regular Security Updates
- Keep all dependencies updated
- Monitor security advisories
- Regular security audits

### 2. Access Control
- Implement proper authentication
- Use role-based access control
- Regular access reviews

### 3. Data Protection
- Encrypt sensitive data at rest
- Use secure communication protocols
- Implement data retention policies

### 4. Monitoring & Alerting
- Monitor security logs
- Set up alerting for security events
- Regular security assessments

### 5. Incident Response
- Document incident response procedures
- Regular security drills
- Post-incident analysis

## Security Testing

### Automated Security Tests
```javascript
// Security test examples
describe('Security Middleware', () => {
    test('should block SQL injection attempts', () => {
        // Test SQL injection patterns
    });
    
    test('should sanitize XSS attempts', () => {
        // Test XSS patterns
    });
    
    test('should validate file uploads', () => {
        // Test file upload security
    });
});
```

### Manual Security Testing
1. **OWASP ZAP** - Automated security testing
2. **Burp Suite** - Manual security testing
3. **Security Headers** - Header validation
4. **CSP Evaluator** - Content Security Policy testing

## Compliance & Standards

### Security Standards
- **OWASP Top 10** - Web application security
- **NIST Cybersecurity Framework** - Security controls
- **GDPR** - Data protection and privacy
- **SOC 2** - Security, availability, and confidentiality

### Security Controls
- **Access Control** - Authentication and authorization
- **Data Protection** - Encryption and secure handling
- **Monitoring** - Logging and alerting
- **Incident Response** - Security event handling

## Deployment Security

### Production Deployment Checklist
- [ ] All security environment variables set
- [ ] HTTPS enabled and configured
- [ ] Security headers properly configured
- [ ] Rate limiting enabled
- [ ] File upload restrictions in place
- [ ] Security logging enabled
- [ ] Backup and recovery procedures tested
- [ ] Security monitoring configured

### Security Hardening
1. **Server Hardening** - OS-level security
2. **Network Security** - Firewall and network controls
3. **Application Security** - Code-level security measures
4. **Data Security** - Encryption and access controls

## Maintenance & Updates

### Regular Security Tasks
1. **Dependency Updates** - Weekly security updates
2. **Log Review** - Daily security log review
3. **Configuration Review** - Monthly security configuration review
4. **Security Assessment** - Quarterly security assessments

### Security Metrics
- Security incidents per month
- Failed authentication attempts
- Rate limit violations
- File upload rejections
- Security log entries

## Troubleshooting

### Common Security Issues

#### CORS Errors
```javascript
// Check CORS configuration
const corsOptions = {
    origin: process.env.CORS_ORIGINS?.split(',') || ['http://localhost:3000'],
    credentials: true
};
```

#### Rate Limiting Issues
```javascript
// Adjust rate limits if needed
const rateLimitConfig = {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // requests per window
};
```

#### CSP Violations
```javascript
// Use CSP Report-Only mode for testing
app.use(cspMiddleware.cspReportOnlyMiddleware);
```

## Conclusion

This security implementation provides comprehensive protection for the CCH Axcess Intelligence application. The multi-layered approach ensures that security is maintained at all levels while preserving application functionality and performance.

For additional security questions or concerns, please refer to the security team or consult the security documentation.
