/**
 * Security Headers Configuration
 * Implements Content Security Policy (CSP) and other security headers
 */

export interface SecurityHeaders {
    'Content-Security-Policy': string;
    'Strict-Transport-Security': string;
    'X-Content-Type-Options': string;
    'X-Frame-Options': string;
    'X-XSS-Protection': string;
    'Referrer-Policy': string;
    'Permissions-Policy': string;
}

/**
 * Generate Content Security Policy based on environment
 */
export function generateCSP(isDevelopment: boolean = false): string {
    const baseCSP = {
        'default-src': ["'self'"],
        'script-src': [
            "'self'",
            "'unsafe-inline'", // Required for Vite HMR in development
            ...(isDevelopment ? ["'unsafe-eval'"] : []), // Only in development
        ],
        'style-src': [
            "'self'",
            "'unsafe-inline'", // Required for styled-components and CSS-in-JS
            'https://fonts.googleapis.com',
        ],
        'font-src': [
            "'self'",
            'https://fonts.gstatic.com',
            'data:', // For base64 encoded fonts
        ],
        'img-src': [
            "'self'",
            'data:', // For base64 images
            'blob:', // For generated images
            'https:', // Allow HTTPS images
        ],
        'connect-src': [
            "'self'",
            'https://api.anthropic.com',
            'https://api.openai.com',
            ...(isDevelopment ? ['ws://localhost:*', 'http://localhost:*'] : []),
        ],
        'object-src': ["'none'"],
        'base-uri': ["'self'"],
        'form-action': ["'self'"],
        'frame-ancestors': ["'none'"],
        'upgrade-insecure-requests': isDevelopment ? [] : [''],
    };

    return Object.entries(baseCSP)
        .filter(([_, values]) => values.length > 0)
        .map(([directive, values]) => `${directive} ${values.join(' ')}`)
        .join('; ');
}

/**
 * Get security headers for different environments
 */
export function getSecurityHeaders(isDevelopment: boolean = false): SecurityHeaders {
    return {
        'Content-Security-Policy': generateCSP(isDevelopment),
        'Strict-Transport-Security': isDevelopment
            ? ''
            : 'max-age=31536000; includeSubDomains; preload',
        'X-Content-Type-Options': 'nosniff',
        'X-Frame-Options': 'DENY',
        'X-XSS-Protection': '1; mode=block',
        'Referrer-Policy': 'strict-origin-when-cross-origin',
        'Permissions-Policy': [
            'camera=()',
            'microphone=()',
            'geolocation=()',
            'interest-cohort=()',
        ].join(', '),
    };
}

/**
 * Apply security headers to a Response object
 */
export function applySecurityHeaders(
    response: Response,
    isDevelopment: boolean = false
): Response {
    const headers = getSecurityHeaders(isDevelopment);

    Object.entries(headers).forEach(([key, value]) => {
        if (value) {
            response.headers.set(key, value);
        }
    });

    return response;
}

/**
 * Middleware function for Express.js servers
 */
export function securityHeadersMiddleware(isDevelopment: boolean = false) {
    const headers = getSecurityHeaders(isDevelopment);

    return (req: any, res: any, next: any) => {
        Object.entries(headers).forEach(([key, value]) => {
            if (value) {
                res.setHeader(key, value);
            }
        });
        next();
    };
}

/**
 * Validate CSP compliance for a given URL
 */
export function validateCSPCompliance(url: string, isDevelopment: boolean = false): boolean {
    try {
        const urlObj = new URL(url);
        const csp = generateCSP(isDevelopment);

        // Basic validation - in production, use a proper CSP parser
        if (urlObj.protocol === 'javascript:') {
            return false;
        }

        if (urlObj.protocol === 'data:' && !csp.includes("data:")) {
            return false;
        }

        return true;
    } catch {
        return false;
    }
}

export default {
    generateCSP,
    getSecurityHeaders,
    applySecurityHeaders,
    securityHeadersMiddleware,
    validateCSPCompliance,
};