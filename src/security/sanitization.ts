/**
 * Input Sanitization and Validation
 * Prevents XSS, injection attacks, and validates user input
 */

import { z } from 'zod';

/**
 * HTML sanitization configuration
 */
const ALLOWED_HTML_TAGS = [
    'p', 'br', 'strong', 'em', 'u', 'ul', 'ol', 'li',
    'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    'blockquote', 'code', 'pre'
];

const ALLOWED_HTML_ATTRIBUTES = ['class', 'id'];

/**
 * Remove potentially dangerous characters and scripts
 */
export function sanitizeHTML(input: string): string {
    if (!input || typeof input !== 'string') {
        return '';
    }

    // Remove script tags and their content
    let sanitized = input.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');

    // Remove dangerous event handlers
    sanitized = sanitized.replace(/\s*on\w+\s*=\s*["'][^"']*["']/gi, '');

    // Remove javascript: URLs
    sanitized = sanitized.replace(/javascript:/gi, '');

    // Remove data: URLs (except for safe image formats)
    sanitized = sanitized.replace(/data:(?!image\/(png|jpg|jpeg|gif|webp|svg\+xml))[^;]*/gi, '');

    // Remove dangerous attributes
    sanitized = sanitized.replace(/\s*(onerror|onload|onclick|onmouseover|onfocus|onblur)\s*=\s*["'][^"']*["']/gi, '');

    return sanitized.trim();
}

/**
 * Sanitize text input (remove HTML tags completely)
 */
export function sanitizeText(input: string): string {
    if (!input || typeof input !== 'string') {
        return '';
    }

    // Remove all HTML tags
    const sanitized = input.replace(/<[^>]*>/g, '');

    // Decode HTML entities
    const textarea = document.createElement('textarea');
    textarea.innerHTML = sanitized;

    return textarea.value.trim();
}

/**
 * Sanitize file names
 */
export function sanitizeFileName(fileName: string): string {
    if (!fileName || typeof fileName !== 'string') {
        return 'untitled';
    }

    // Remove directory traversal attempts
    let sanitized = fileName.replace(/[\/\\:*?"<>|]/g, '_');

    // Remove leading dots and spaces
    sanitized = sanitized.replace(/^[\.\s]+/, '');

    // Limit length
    if (sanitized.length > 255) {
        const extension = sanitized.split('.').pop();
        const nameWithoutExt = sanitized.substring(0, 255 - (extension?.length || 0) - 1);
        sanitized = extension ? `${nameWithoutExt}.${extension}` : nameWithoutExt;
    }

    return sanitized || 'untitled';
}

/**
 * Validate and sanitize URLs
 */
export function sanitizeURL(url: string): string | null {
    if (!url || typeof url !== 'string') {
        return null;
    }

    try {
        const urlObj = new URL(url);

        // Only allow HTTP and HTTPS protocols
        if (!['http:', 'https:'].includes(urlObj.protocol)) {
            return null;
        }

        // Remove dangerous parameters
        urlObj.searchParams.delete('javascript');
        urlObj.searchParams.delete('vbscript');

        return urlObj.toString();
    } catch {
        return null;
    }
}

/**
 * Validation schemas using Zod
 */
export const validationSchemas = {
    // Chat message validation
    chatMessage: z.object({
        content: z.string()
            .min(1, 'Message cannot be empty')
            .max(10000, 'Message too long')
            .transform(sanitizeHTML),
        type: z.enum(['user', 'assistant', 'system']),
        timestamp: z.number().optional(),
    }),

    // File upload validation
    fileUpload: z.object({
        name: z.string()
            .min(1, 'Filename required')
            .max(255, 'Filename too long')
            .transform(sanitizeFileName),
        size: z.number()
            .min(1, 'File cannot be empty')
            .max(50 * 1024 * 1024, 'File too large (max 50MB)'),
        type: z.string()
            .regex(/^(application|text|image)\//i, 'Invalid file type'),
    }),

    // API endpoint validation
    apiRequest: z.object({
        query: z.string()
            .min(1, 'Query required')
            .max(5000, 'Query too long')
            .transform(sanitizeText),
        model: z.enum(['claude-3-sonnet-20240229', 'gpt-4', 'gpt-3.5-turbo']),
        maxTokens: z.number()
            .min(1)
            .max(4000)
            .optional(),
    }),

    // Environment variable validation
    envVar: z.object({
        name: z.string()
            .regex(/^[A-Z_][A-Z0-9_]*$/, 'Invalid environment variable name'),
        value: z.string()
            .min(1, 'Value cannot be empty')
            .max(1000, 'Value too long'),
    }),
};

/**
 * Rate limiting validation
 */
export function validateRateLimit(
    identifier: string,
    limit: number = 100,
    windowMs: number = 15 * 60 * 1000 // 15 minutes
): boolean {
    const key = `rate_limit_${identifier}`;
    const now = Date.now();

    try {
        const stored = localStorage.getItem(key);
        const data = stored ? JSON.parse(stored) : { count: 0, resetTime: now + windowMs };

        // Reset counter if window expired
        if (now > data.resetTime) {
            data.count = 0;
            data.resetTime = now + windowMs;
        }

        // Check if limit exceeded
        if (data.count >= limit) {
            return false;
        }

        // Increment counter
        data.count++;
        localStorage.setItem(key, JSON.stringify(data));

        return true;
    } catch {
        // If localStorage fails, allow the request
        return true;
    }
}

/**
 * Validate input against common injection patterns
 */
export function validateAgainstInjection(input: string): boolean {
    if (!input || typeof input !== 'string') {
        return true;
    }

    const injectionPatterns = [
        /<script\b/i,
        /javascript:/i,
        /vbscript:/i,
        /onload\s*=/i,
        /onerror\s*=/i,
        /onclick\s*=/i,
        /style\s*=.*expression\s*\(/i,
        /import\s+/i,
        /eval\s*\(/i,
        /document\.cookie/i,
        /document\.write/i,
    ];

    return !injectionPatterns.some(pattern => pattern.test(input));
}

/**
 * Comprehensive input sanitization
 */
export function sanitizeInput(input: unknown, type: 'html' | 'text' | 'url' | 'filename' = 'text'): string {
    if (input === null || input === undefined) {
        return '';
    }

    const stringInput = String(input);

    switch (type) {
        case 'html':
            return sanitizeHTML(stringInput);
        case 'url':
            return sanitizeURL(stringInput) || '';
        case 'filename':
            return sanitizeFileName(stringInput);
        case 'text':
        default:
            return sanitizeText(stringInput);
    }
}

export default {
    sanitizeHTML,
    sanitizeText,
    sanitizeFileName,
    sanitizeURL,
    sanitizeInput,
    validationSchemas,
    validateRateLimit,
    validateAgainstInjection,
};