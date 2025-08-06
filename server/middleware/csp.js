/**
 * CCH Axcess Intelligence - Content Security Policy Middleware
 * Comprehensive CSP implementation for production security
 */

const crypto = require('crypto');

/**
 * Generate nonce for inline scripts
 * @returns {string} Random nonce
 */
const generateNonce = () => {
    return crypto.randomBytes(16).toString('base64');
};

/**
 * CSP Directives Configuration
 * Comprehensive security policies for different environments
 */
const cspDirectives = {
    development: {
        defaultSrc: ["'self'"],
        styleSrc: [
            "'self'",
            "'unsafe-inline'", // Required for Vite HMR
            "https://fonts.googleapis.com",
            "https://cdn.jsdelivr.net"
        ],
        scriptSrc: [
            "'self'",
            "'unsafe-inline'", // Required for Vite HMR
            "'unsafe-eval'",   // Required for Vite in development
            "https://cdn.jsdelivr.net"
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
            "ws://localhost:*",
            "http://localhost:*",
            "http://127.0.0.1:*"
        ],
        objectSrc: ["'none'"],
        baseUri: ["'self'"],
        formAction: ["'self'"],
        frameAncestors: ["'none'"],
        workerSrc: ["'self'", "blob:"],
        childSrc: ["'self'"],
        manifestSrc: ["'self'"],
        mediaSrc: ["'self'"],
        prefetchSrc: ["'self'"],
        navigateTo: ["'self'"]
    },
    
    production: {
        defaultSrc: ["'self'"],
        styleSrc: [
            "'self'",
            "'unsafe-inline'", // Required for dynamic styles
            "https://fonts.googleapis.com",
            "https://cdn.jsdelivr.net"
        ],
        scriptSrc: [
            "'self'",
            "'unsafe-inline'", // Required for inline scripts
            "https://cdn.jsdelivr.net"
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
            "https://api.cch.com"
        ],
        objectSrc: ["'none'"],
        baseUri: ["'self'"],
        formAction: ["'self'"],
        frameAncestors: ["'none'"],
        upgradeInsecureRequests: [],
        workerSrc: ["'self'", "blob:"],
        childSrc: ["'self'"],
        manifestSrc: ["'self'"],
        mediaSrc: ["'self'"],
        prefetchSrc: ["'self'"],
        navigateTo: ["'self'"]
    }
};

/**
 * Generate CSP header value
 * @param {string} environment - Environment (development/production)
 * @param {string} nonce - Nonce for inline scripts
 * @returns {string} CSP header value
 */
const generateCSPHeader = (environment = 'production', nonce = null) => {
    const directives = cspDirectives[environment] || cspDirectives.production;
    const cspParts = [];
    
    for (const [directive, sources] of Object.entries(directives)) {
        if (sources && sources.length > 0) {
            // Add nonce to script-src if provided
            if (directive === 'scriptSrc' && nonce) {
                sources.push(`'nonce-${nonce}'`);
            }
            cspParts.push(`${directive} ${sources.join(' ')}`);
        }
    }
    
    return cspParts.join('; ');
};

/**
 * CSP Middleware
 * Applies Content Security Policy headers
 */
const cspMiddleware = (req, res, next) => {
    const environment = process.env.NODE_ENV || 'production';
    const nonce = generateNonce();
    
    // Store nonce in request for use in templates
    req.cspNonce = nonce;
    
    // Generate CSP header
    const cspHeader = generateCSPHeader(environment, nonce);
    
    // Set CSP header
    res.setHeader('Content-Security-Policy', cspHeader);
    
    // Set additional security headers
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    
    // Set Permissions Policy (Feature Policy)
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
    
    // Set Cross-Origin headers
    res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp');
    res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
    res.setHeader('Cross-Origin-Resource-Policy', 'same-origin');
    
    next();
};

/**
 * CSP Report-Only Middleware
 * For testing CSP policies without blocking content
 */
const cspReportOnlyMiddleware = (req, res, next) => {
    const environment = process.env.NODE_ENV || 'production';
    const nonce = generateNonce();
    
    req.cspNonce = nonce;
    
    const cspHeader = generateCSPHeader(environment, nonce);
    
    // Set CSP Report-Only header
    res.setHeader('Content-Security-Policy-Report-Only', cspHeader);
    
    next();
};

/**
 * CSP Violation Handler
 * Handles CSP violation reports
 */
const cspViolationHandler = (req, res) => {
    if (req.body) {
        const violation = req.body['csp-report'];
        
        if (violation) {
            // Log CSP violation
            console.error('CSP Violation:', {
                timestamp: new Date().toISOString(),
                documentUri: violation['document-uri'],
                violatedDirective: violation['violated-directive'],
                originalPolicy: violation['original-policy'],
                blockedUri: violation['blocked-uri'],
                sourceFile: violation['source-file'],
                lineNumber: violation['line-number'],
                columnNumber: violation['column-number'],
                userAgent: req.get('User-Agent'),
                ip: req.ip
            });
        }
    }
    
    res.status(204).end();
};

/**
 * Generate CSP meta tag for HTML
 * @param {string} environment - Environment
 * @param {string} nonce - Nonce for inline scripts
 * @returns {string} CSP meta tag HTML
 */
const generateCSPMetaTag = (environment = 'production', nonce = null) => {
    const cspHeader = generateCSPHeader(environment, nonce);
    return `<meta http-equiv="Content-Security-Policy" content="${cspHeader}">`;
};

/**
 * Generate nonce attribute for script tags
 * @param {string} nonce - Nonce value
 * @returns {string} Nonce attribute
 */
const generateNonceAttribute = (nonce) => {
    return nonce ? `nonce="${nonce}"` : '';
};

/**
 * CSP Configuration for different routes
 */
const cspConfig = {
    // Stricter CSP for admin routes
    admin: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        fontSrc: ["'self'", "data:"],
        imgSrc: ["'self'", "data:"],
        connectSrc: ["'self'"],
        objectSrc: ["'none'"],
        baseUri: ["'self'"],
        formAction: ["'self'"],
        frameAncestors: ["'none'"]
    },
    
    // Relaxed CSP for API routes
    api: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'"],
        scriptSrc: ["'self'"],
        fontSrc: ["'self'"],
        imgSrc: ["'self'"],
        connectSrc: ["'self'", "https://api.anthropic.com", "https://api.openai.com"],
        objectSrc: ["'none'"],
        baseUri: ["'self'"],
        formAction: ["'self'"],
        frameAncestors: ["'none'"]
    }
};

/**
 * Route-specific CSP middleware
 * @param {string} routeType - Route type (admin/api/default)
 */
const routeSpecificCSP = (routeType = 'default') => {
    return (req, res, next) => {
        const environment = process.env.NODE_ENV || 'production';
        const nonce = generateNonce();
        
        req.cspNonce = nonce;
        
        let cspHeader;
        
        if (routeType === 'admin' && cspConfig.admin) {
            cspHeader = generateCSPHeader(environment, nonce, cspConfig.admin);
        } else if (routeType === 'api' && cspConfig.api) {
            cspHeader = generateCSPHeader(environment, nonce, cspConfig.api);
        } else {
            cspHeader = generateCSPHeader(environment, nonce);
        }
        
        res.setHeader('Content-Security-Policy', cspHeader);
        next();
    };
};

/**
 * CSP Testing Utilities
 */
const cspUtils = {
    /**
     * Test CSP policy
     * @param {string} policy - CSP policy to test
     * @returns {Object} Test results
     */
    testPolicy: (policy) => {
        const results = {
            isValid: true,
            errors: [],
            warnings: []
        };
        
        try {
            const directives = policy.split(';').map(d => d.trim());
            
            for (const directive of directives) {
                if (!directive) continue;
                
                const [name, ...sources] = directive.split(' ');
                
                if (!name) {
                    results.errors.push('Empty directive name');
                    results.isValid = false;
                }
                
                if (sources.length === 0) {
                    results.warnings.push(`Directive '${name}' has no sources`);
                }
            }
        } catch (error) {
            results.isValid = false;
            results.errors.push(error.message);
        }
        
        return results;
    },
    
    /**
     * Validate CSP sources
     * @param {Array} sources - CSP sources to validate
     * @returns {Object} Validation results
     */
    validateSources: (sources) => {
        const results = {
            valid: [],
            invalid: [],
            warnings: []
        };
        
        for (const source of sources) {
            if (source.startsWith("'") && source.endsWith("'")) {
                // Quoted keyword
                const keyword = source.slice(1, -1);
                if (['self', 'none', 'unsafe-inline', 'unsafe-eval'].includes(keyword)) {
                    results.valid.push(source);
                } else {
                    results.invalid.push(source);
                }
            } else if (source.startsWith('http://') || source.startsWith('https://')) {
                // URL
                try {
                    new URL(source);
                    results.valid.push(source);
                } catch {
                    results.invalid.push(source);
                }
            } else if (source.startsWith('data:') || source.startsWith('blob:')) {
                // Data/blob URL
                results.valid.push(source);
            } else {
                results.warnings.push(`Unknown source format: ${source}`);
            }
        }
        
        return results;
    }
};

module.exports = {
    // Main middleware
    cspMiddleware,
    cspReportOnlyMiddleware,
    cspViolationHandler,
    routeSpecificCSP,
    
    // Utilities
    generateNonce,
    generateCSPHeader,
    generateCSPMetaTag,
    generateNonceAttribute,
    cspUtils,
    
    // Configuration
    cspDirectives,
    cspConfig
};
