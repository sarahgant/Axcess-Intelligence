/**
 * String Utilities Tests
 * Test all string utility functions
 */

import {
    capitalize,
    truncate,
    slugify,
    removeHtml,
    escapeHtml,
    generateId,
    formatBytes,
} from '@/shared/utils/string';

describe('String Utilities', () => {
    describe('capitalize', () => {
        it('capitalizes first letter of string', () => {
            expect(capitalize('hello')).toBe('Hello');
            expect(capitalize('world')).toBe('World');
        });

        it('handles already capitalized strings', () => {
            expect(capitalize('Hello')).toBe('Hello');
            expect(capitalize('HELLO')).toBe('Hello');
        });

        it('handles empty string', () => {
            expect(capitalize('')).toBe('');
        });

        it('handles single character', () => {
            expect(capitalize('a')).toBe('A');
            expect(capitalize('A')).toBe('A');
        });

        it('handles non-string input gracefully', () => {
            expect(capitalize(null as any)).toBe('');
            expect(capitalize(undefined as any)).toBe('');
            expect(capitalize(123 as any)).toBe('123');
        });
    });

    describe('truncate', () => {
        const longString = 'This is a very long string that should be truncated';

        it('truncates string to specified length', () => {
            expect(truncate(longString, 20)).toBe('This is a very long...');
            expect(truncate(longString, 10)).toBe('This is a...');
        });

        it('returns original string if shorter than limit', () => {
            expect(truncate('Short', 20)).toBe('Short');
            expect(truncate('', 10)).toBe('');
        });

        it('allows custom suffix', () => {
            expect(truncate(longString, 20, '---')).toBe('This is a very long---');
            expect(truncate(longString, 10, ' [...]')).toBe('This is a [...]');
        });

        it('handles edge cases', () => {
            expect(truncate('Test', 0)).toBe('...');
            expect(truncate('Test', 4)).toBe('Test');
            expect(truncate('Test', 3)).toBe('Tes...');
        });
    });

    describe('slugify', () => {
        it('converts string to URL-friendly slug', () => {
            expect(slugify('Hello World')).toBe('hello-world');
            expect(slugify('Tax Research 2024')).toBe('tax-research-2024');
        });

        it('handles special characters', () => {
            expect(slugify('Hello, World!')).toBe('hello-world');
            expect(slugify('Café & Restaurant')).toBe('cafe-restaurant');
            expect(slugify('100% Pure')).toBe('100-pure');
        });

        it('handles multiple spaces', () => {
            expect(slugify('  Multiple   Spaces  ')).toBe('multiple-spaces');
            expect(slugify('Tab\tCharacters')).toBe('tab-characters');
        });

        it('handles unicode characters', () => {
            expect(slugify('Héllo Wörld')).toBe('hello-world');
            expect(slugify('Niño José')).toBe('nino-jose');
        });

        it('handles empty and edge cases', () => {
            expect(slugify('')).toBe('');
            expect(slugify('   ')).toBe('');
            expect(slugify('123')).toBe('123');
        });
    });

    describe('removeHtml', () => {
        it('removes HTML tags', () => {
            expect(removeHtml('<p>Hello <strong>World</strong></p>')).toBe('Hello World');
            expect(removeHtml('<div><span>Nested</span></div>')).toBe('Nested');
        });

        it('removes script tags and content', () => {
            expect(removeHtml('<script>alert("xss")</script>Safe text')).toBe('Safe text');
            expect(removeHtml('Before<script>malicious()</script>After')).toBe('BeforeAfter');
        });

        it('handles nested tags', () => {
            const html = '<div><p>Nested <em>content</em> here</p></div>';
            expect(removeHtml(html)).toBe('Nested content here');
        });

        it('preserves text content', () => {
            expect(removeHtml('Plain text')).toBe('Plain text');
            expect(removeHtml('Text with <tags> removed')).toBe('Text with  removed');
        });

        it('handles malformed HTML', () => {
            expect(removeHtml('<p>Unclosed tag')).toBe('Unclosed tag');
            expect(removeHtml('Text <div> more text')).toBe('Text  more text');
        });
    });

    describe('escapeHtml', () => {
        it('escapes HTML special characters', () => {
            expect(escapeHtml('<script>alert("xss")</script>')).toBe(
                '&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;'
            );
        });

        it('escapes quotes and ampersands', () => {
            expect(escapeHtml('Tom & Jerry "cartoon"')).toBe(
                'Tom &amp; Jerry &quot;cartoon&quot;'
            );
        });

        it('leaves normal text unchanged', () => {
            expect(escapeHtml('Normal text')).toBe('Normal text');
            expect(escapeHtml('123 456')).toBe('123 456');
        });

        it('handles empty string', () => {
            expect(escapeHtml('')).toBe('');
        });
    });

    describe('generateId', () => {
        it('generates string of specified length', () => {
            expect(generateId(8)).toHaveLength(8);
            expect(generateId(16)).toHaveLength(16);
            expect(generateId(32)).toHaveLength(32);
        });

        it('generates unique IDs', () => {
            const id1 = generateId();
            const id2 = generateId();
            expect(id1).not.toBe(id2);
        });

        it('uses default length when not specified', () => {
            const id = generateId();
            expect(id).toHaveLength(12); // Assuming default is 12
        });

        it('generates IDs with only valid characters', () => {
            const id = generateId(100);
            expect(id).toMatch(/^[a-zA-Z0-9]+$/);
        });
    });

    describe('formatBytes', () => {
        it('formats bytes correctly', () => {
            expect(formatBytes(0)).toBe('0 Bytes');
            expect(formatBytes(1)).toBe('1 Bytes');
            expect(formatBytes(1024)).toBe('1 KB');
            expect(formatBytes(1048576)).toBe('1 MB');
            expect(formatBytes(1073741824)).toBe('1 GB');
        });

        it('handles decimal values', () => {
            expect(formatBytes(1536)).toBe('1.5 KB');
            expect(formatBytes(1572864)).toBe('1.5 MB');
            expect(formatBytes(1610612736)).toBe('1.5 GB');
        });

        it('handles large values', () => {
            expect(formatBytes(1099511627776)).toBe('1 TB');
            expect(formatBytes(1125899906842624)).toBe('1 PB');
        });

        it('allows custom decimal places', () => {
            expect(formatBytes(1536, 0)).toBe('2 KB');
            expect(formatBytes(1536, 2)).toBe('1.50 KB');
            expect(formatBytes(1536, 3)).toBe('1.500 KB');
        });

        it('handles negative values', () => {
            expect(formatBytes(-1024)).toBe('-1 KB');
        });

        it('handles edge cases', () => {
            expect(formatBytes(NaN)).toBe('0 Bytes');
            expect(formatBytes(Infinity)).toBe('∞ Bytes');
        });
    });
});