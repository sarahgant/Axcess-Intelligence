# CCH Axcess Intelligence - Security Environment Setup Guide

## Overview

This guide provides comprehensive instructions for setting up the security environment variables for the CCH Axcess Intelligence application. Proper security configuration is critical for production deployment.

## Environment Files Structure

### Development Environment (`.env.development`)
```bash
# Development-specific security settings
NODE_ENV=development
CORS_ENABLED=true
RATE_LIMIT_ENABLED=true
CSP_REPORT_ONLY=true
HSTS_ENABLED=false
```

### Production Environment (`.env.production`)
```bash
# Production security settings
NODE_ENV=production
CORS_ENABLED=true
RATE_LIMIT_ENABLED=true
CSP_ENABLED=true
HSTS_ENABLED=true
```

### Local Development (`.env.local`)
```bash
# Local development overrides
NODE_ENV=development
LOG_LEVEL=debug
SECURITY_LOG_LEVEL=info
```

## Required Security Environment Variables

### 1. Core Security Secrets

#### JWT Configuration
```bash
# JWT Secret (REQUIRED for production)
JWT_SECRET=your-super-secure-jwt-secret-key-here-minimum-32-characters

# JWT Expiration Settings
JWT_EXPIRES_IN=24h
JWT_REFRESH_EXPIRES_IN=7d

# JWT Issuer and Audience
JWT_ISSUER=cch-intelligence
JWT_AUDIENCE=cch-users
```

#### Session Security
```bash
# Session Secret (REQUIRED for production)
SESSION_SECRET=your-super-secure-session-secret-key-here-minimum-32-characters

# Session Configuration
SESSION_TIMEOUT=28800000  # 8 hours in milliseconds
SESSION_NAME=cch.sid
SESSION_COOKIE_SECURE=true  # true for production, false for development
SESSION_COOKIE_HTTP_ONLY=true
SESSION_COOKIE_SAME_SITE=strict
SESSION_COOKIE_MAX_AGE=28800000  # 8 hours in milliseconds
```

#### Encryption Keys
```bash
# Encryption Key (REQUIRED for production)
ENCRYPTION_KEY=your-base64-encoded-32-byte-encryption-key

# Encryption Algorithm
ENCRYPTION_ALGORITHM=aes-256-gcm
ENCRYPTION_KEY_LENGTH=32
ENCRYPTION_IV_LENGTH=16
```

### 2. Application URLs and CORS

#### Frontend URL
```bash
# Frontend URL (REQUIRED for production)
FRONTEND_URL=https://your-domain.com

# CORS Configuration
CORS_ENABLED=true
CORS_ORIGINS=https://your-domain.com,https://www.your-domain.com
CORS_CREDENTIALS=true
CORS_MAX_AGE=86400
```

#### Development CORS
```bash
# Development CORS settings
CORS_ORIGINS=http://localhost:3000,http://localhost:5173,http://127.0.0.1:3000,http://127.0.0.1:5173
```

### 3. Rate Limiting Configuration

#### General Rate Limits
```bash
# Rate Limiting Settings
RATE_LIMIT_ENABLED=true

# General API Rate Limiting
RATE_LIMIT_GENERAL_WINDOW=900000  # 15 minutes in milliseconds
RATE_LIMIT_GENERAL_MAX=100  # 100 requests per 15 minutes (production)
RATE_LIMIT_SKIP_SUCCESS=false
RATE_LIMIT_SKIP_FAILED=false
```

#### Specific Endpoint Rate Limits
```bash
# Chat Endpoint Rate Limiting
RATE_LIMIT_CHAT_WINDOW=60000  # 1 minute in milliseconds
RATE_LIMIT_CHAT_MAX=20  # 20 requests per minute (production)

# Authentication Rate Limiting
RATE_LIMIT_AUTH_WINDOW=900000  # 15 minutes in milliseconds
RATE_LIMIT_AUTH_MAX=5  # 5 attempts per 15 minutes

# File Upload Rate Limiting
RATE_LIMIT_UPLOAD_WINDOW=3600000  # 1 hour in milliseconds
RATE_LIMIT_UPLOAD_MAX=10  # 10 uploads per hour (production)
```

### 4. Content Security Policy (CSP)

#### CSP Configuration
```bash
# Content Security Policy
CSP_ENABLED=true
CSP_REPORT_ONLY=false  # true for testing, false for production
CSP_REPORT_URI=https://your-domain.com/csp-report
CSP_NONCE_ENABLED=true
CSP_STRICT_DYNAMIC=true
CSP_UPGRADE_INSECURE=true
```

### 5. File Upload Security

#### File Upload Configuration
```bash
# File Upload Security
FILE_UPLOAD_ENABLED=true
MAX_FILE_SIZE=20971520  # 20MB in bytes
MAX_FILES=10
ALLOWED_FILE_TYPES=pdf,docx,xlsx,pptx,txt,jpg,jpeg,png,gif
SCAN_FILES=true
VIRUS_SCAN=false  # Set to true if virus scanning is available
QUARANTINE_SUSPICIOUS=true
UPLOAD_PATH=./uploads
TEMP_PATH=./temp
```

### 6. API Security

#### API Configuration
```bash
# API Security Settings
API_VERSIONING=true
API_VERSION=v1
REQUIRE_API_KEY=true
VALIDATE_API_KEY=true
API_KEY_HEADER=X-API-Key
API_KEY_PREFIX=cch_
API_KEY_LENGTH=32
REQUEST_ID_HEADER=X-Request-ID
MAX_REQUEST_ID_LENGTH=36
```

### 7. Input Validation

#### Validation Settings
```bash
# Input Validation
VALIDATION_ENABLED=true
SANITIZE_INPUT=true
ESCAPE_HTML=true
VALIDATE_EMAIL=true
VALIDATE_UUID=true
MAX_STRING_LENGTH=10000
MAX_ARRAY_LENGTH=1000
MAX_OBJECT_DEPTH=10
```

### 8. Security Headers

#### Header Configuration
```bash
# Security Headers
HSTS_ENABLED=true
HSTS_MAX_AGE=31536000  # 1 year in seconds
HSTS_INCLUDE_SUBDOMAINS=true
HSTS_PRELOAD=true
FRAME_OPTIONS=DENY
CONTENT_TYPE_OPTIONS=nosniff
XSS_PROTECTION=true
REFERRER_POLICY=strict-origin-when-cross-origin
PERMISSIONS_POLICY_ENABLED=true
```

### 9. Logging and Monitoring

#### Logging Configuration
```bash
# Logging Settings
LOGGING_ENABLED=true
LOG_LEVEL=info  # debug, info, warn, error
SECURITY_LOG_LEVEL=warn  # info, warn, error
LOG_SECURITY_EVENTS=true
LOG_PATH=./logs
MAX_LOG_SIZE=10m
MAX_LOG_FILES=5
LOG_FORMAT=json
```

### 10. Database Security

#### Database Configuration
```bash
# Database Security
DB_USE_PREPARED_STATEMENTS=true
DB_ENCRYPT_CONNECTIONS=false  # Set to true if database supports encryption
DB_CONNECTION_TIMEOUT=30000
DB_QUERY_TIMEOUT=10000
DB_MAX_CONNECTIONS=10
DB_IDLE_TIMEOUT=60000
```

### 11. Threat Detection

#### Threat Detection Settings
```bash
# Threat Detection
THREAT_DETECTION_ENABLED=true
DETECT_SQL_INJECTION=true
DETECT_XSS=true
DETECT_PATH_TRAVERSAL=true
DETECT_COMMAND_INJECTION=true
DETECT_SUSPICIOUS_PATTERNS=true
BLOCK_SUSPICIOUS=true
LOG_THREATS=true
```

### 12. Backup and Recovery

#### Backup Configuration
```bash
# Backup Settings
BACKUP_ENABLED=true
BACKUP_FREQUENCY=daily  # hourly, daily, weekly, monthly
BACKUP_RETENTION=30  # days
ENCRYPT_BACKUPS=true
BACKUP_PATH=./backups
BACKUP_INCLUDE_LOGS=true
BACKUP_INCLUDE_UPLOADS=true
```

### 13. Server Configuration

#### Server Security Settings
```bash
# Server Configuration
PORT=3001
HOST=localhost
TRUST_PROXY=false  # Set to true if behind a reverse proxy
MAX_REQUEST_SIZE=10mb
REQUEST_TIMEOUT=30000
KEEP_ALIVE_TIMEOUT=65000
HEADERS_TIMEOUT=66000
```

## Environment-Specific Configurations

### Development Environment
```bash
# Development Environment (.env.development)
NODE_ENV=development
LOG_LEVEL=debug
SECURITY_LOG_LEVEL=info
CSP_REPORT_ONLY=true
HSTS_ENABLED=false
SESSION_COOKIE_SECURE=false
TRUST_PROXY=false
RATE_LIMIT_GENERAL_MAX=1000
RATE_LIMIT_CHAT_MAX=100
RATE_LIMIT_UPLOAD_MAX=50
```

### Staging Environment
```bash
# Staging Environment (.env.staging)
NODE_ENV=staging
LOG_LEVEL=info
SECURITY_LOG_LEVEL=warn
CSP_REPORT_ONLY=true
HSTS_ENABLED=true
SESSION_COOKIE_SECURE=true
TRUST_PROXY=true
RATE_LIMIT_GENERAL_MAX=500
RATE_LIMIT_CHAT_MAX=50
RATE_LIMIT_UPLOAD_MAX=25
```

### Production Environment
```bash
# Production Environment (.env.production)
NODE_ENV=production
LOG_LEVEL=warn
SECURITY_LOG_LEVEL=error
CSP_REPORT_ONLY=false
HSTS_ENABLED=true
SESSION_COOKIE_SECURE=true
TRUST_PROXY=true
RATE_LIMIT_GENERAL_MAX=100
RATE_LIMIT_CHAT_MAX=20
RATE_LIMIT_UPLOAD_MAX=10
```

## Security Key Generation

### Generate Secure Secrets

#### JWT Secret Generation
```bash
# Generate a secure JWT secret
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

#### Session Secret Generation
```bash
# Generate a secure session secret
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

#### Encryption Key Generation
```bash
# Generate a secure encryption key
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

#### API Key Generation
```bash
# Generate a secure API key
node -e "console.log('cch_' + require('crypto').randomBytes(32).toString('base64url'))"
```

## Environment File Templates

### Complete Development Template
```bash
# .env.development
NODE_ENV=development

# Security Secrets (use generated values)
JWT_SECRET=your-generated-jwt-secret-here
SESSION_SECRET=your-generated-session-secret-here
ENCRYPTION_KEY=your-generated-encryption-key-here

# Application URLs
FRONTEND_URL=http://localhost:3000
CORS_ORIGINS=http://localhost:3000,http://localhost:5173

# Security Settings
CORS_ENABLED=true
RATE_LIMIT_ENABLED=true
CSP_REPORT_ONLY=true
HSTS_ENABLED=false
SESSION_COOKIE_SECURE=false

# Rate Limiting (relaxed for development)
RATE_LIMIT_GENERAL_MAX=1000
RATE_LIMIT_CHAT_MAX=100
RATE_LIMIT_AUTH_MAX=10
RATE_LIMIT_UPLOAD_MAX=50

# Logging
LOG_LEVEL=debug
SECURITY_LOG_LEVEL=info
```

### Complete Production Template
```bash
# .env.production
NODE_ENV=production

# Security Secrets (use generated values)
JWT_SECRET=your-generated-jwt-secret-here
SESSION_SECRET=your-generated-session-secret-here
ENCRYPTION_KEY=your-generated-encryption-key-here

# Application URLs
FRONTEND_URL=https://your-domain.com
CORS_ORIGINS=https://your-domain.com,https://www.your-domain.com

# Security Settings
CORS_ENABLED=true
RATE_LIMIT_ENABLED=true
CSP_ENABLED=true
HSTS_ENABLED=true
SESSION_COOKIE_SECURE=true

# Rate Limiting (strict for production)
RATE_LIMIT_GENERAL_MAX=100
RATE_LIMIT_CHAT_MAX=20
RATE_LIMIT_AUTH_MAX=5
RATE_LIMIT_UPLOAD_MAX=10

# Logging
LOG_LEVEL=warn
SECURITY_LOG_LEVEL=error
```

## Security Validation

### Environment Validation Script
```javascript
// scripts/validate-security-env.js
const { validateSecurityConfig } = require('../server/config/security');

const config = require('../server/config/security').securityConfig;
const validation = validateSecurityConfig(config);

console.log('Security Configuration Validation:');
console.log('==================================');

if (validation.errors.length > 0) {
    console.error('❌ ERRORS:');
    validation.errors.forEach(error => console.error(`  - ${error}`));
    process.exit(1);
}

if (validation.warnings.length > 0) {
    console.warn('⚠️  WARNINGS:');
    validation.warnings.forEach(warning => console.warn(`  - ${warning}`));
}

console.log('✅ Security configuration is valid!');
```

### Run Validation
```bash
# Validate security configuration
node scripts/validate-security-env.js
```

## Security Checklist

### Pre-Deployment Checklist
- [ ] All security secrets are generated and set
- [ ] Environment variables are properly configured
- [ ] Security configuration validation passes
- [ ] Rate limiting is enabled and configured
- [ ] CORS is properly configured
- [ ] CSP is enabled and configured
- [ ] File upload restrictions are in place
- [ ] Security logging is enabled
- [ ] HTTPS is configured (production)
- [ ] Security headers are properly set

### Production Deployment Checklist
- [ ] JWT_SECRET is set and secure
- [ ] SESSION_SECRET is set and secure
- [ ] ENCRYPTION_KEY is set and secure
- [ ] FRONTEND_URL is set correctly
- [ ] CORS_ORIGINS includes only trusted domains
- [ ] RATE_LIMIT settings are appropriate for production
- [ ] CSP_REPORT_ONLY is set to false
- [ ] HSTS_ENABLED is set to true
- [ ] SESSION_COOKIE_SECURE is set to true
- [ ] LOG_LEVEL is set to warn or error

## Troubleshooting

### Common Issues

#### Missing Environment Variables
```bash
# Error: JWT_SECRET is not set
# Solution: Generate and set JWT_SECRET
JWT_SECRET=$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
```

#### CORS Issues
```bash
# Error: CORS policy blocked request
# Solution: Check CORS_ORIGINS configuration
CORS_ORIGINS=https://your-domain.com,https://www.your-domain.com
```

#### Rate Limiting Issues
```bash
# Error: Too many requests
# Solution: Adjust rate limits for development
RATE_LIMIT_GENERAL_MAX=1000
RATE_LIMIT_CHAT_MAX=100
```

#### CSP Violations
```bash
# Error: CSP violation
# Solution: Use CSP Report-Only mode for testing
CSP_REPORT_ONLY=true
```

## Security Best Practices

### 1. Secret Management
- Never commit secrets to version control
- Use different secrets for each environment
- Rotate secrets regularly
- Use secure secret management services in production

### 2. Environment Separation
- Use separate environment files for each environment
- Never use production secrets in development
- Validate environment configuration before deployment

### 3. Monitoring
- Monitor security logs regularly
- Set up alerts for security events
- Review rate limiting violations
- Monitor CSP violations

### 4. Regular Updates
- Keep security dependencies updated
- Review and update security configuration
- Conduct regular security audits
- Update secrets periodically

## Conclusion

Proper security environment configuration is essential for protecting the CCH Axcess Intelligence application. Follow this guide to ensure all security measures are properly configured for your deployment environment.

For additional security questions or concerns, please refer to the security team or consult the security documentation.
