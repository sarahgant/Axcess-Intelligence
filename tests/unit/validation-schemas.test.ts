import { describe, it, expect } from '@jest/globals';
import { 
  messageSchema, 
  fileUploadSchema, 
  apiRequestSchema, 
  sanitizeInput 
} from '../../src/core/validation/schemas';

describe('Validation Schemas', () => {
  describe('messageSchema', () => {
    it('should validate a valid message', () => {
      const validMessage = {
        content: 'Hello, world!',
        role: 'user' as const,
        timestamp: new Date(),
        metadata: { sessionId: '123' }
      };

      const result = messageSchema.safeParse(validMessage);
      expect(result.success).toBe(true);
    });

    it('should validate a minimal message', () => {
      const minimalMessage = {
        content: 'Test',
        role: 'assistant' as const
      };

      const result = messageSchema.safeParse(minimalMessage);
      expect(result.success).toBe(true);
    });

    it('should reject empty content', () => {
      const invalidMessage = {
        content: '',
        role: 'user' as const
      };

      const result = messageSchema.safeParse(invalidMessage);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toContain('content');
      }
    });

    it('should reject content that is too long', () => {
      const invalidMessage = {
        content: 'a'.repeat(10001),
        role: 'user' as const
      };

      const result = messageSchema.safeParse(invalidMessage);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toContain('content');
      }
    });

    it('should reject invalid role', () => {
      const invalidMessage = {
        content: 'Test',
        role: 'invalid' as any
      };

      const result = messageSchema.safeParse(invalidMessage);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toContain('role');
      }
    });
  });

  describe('fileUploadSchema', () => {
    it('should validate a valid file upload', () => {
      const mockFile = new File(['test content'], 'test.pdf', { type: 'application/pdf' });
      const validUpload = {
        name: 'test.pdf',
        size: 1024,
        type: 'application/pdf' as const,
        content: mockFile
      };

      const result = fileUploadSchema.safeParse(validUpload);
      expect(result.success).toBe(true);
    });

    it('should reject file with empty name', () => {
      const mockFile = new File(['test content'], 'test.pdf', { type: 'application/pdf' });
      const invalidUpload = {
        name: '',
        size: 1024,
        type: 'application/pdf' as const,
        content: mockFile
      };

      const result = fileUploadSchema.safeParse(invalidUpload);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toContain('name');
      }
    });

    it('should reject file with name too long', () => {
      const mockFile = new File(['test content'], 'test.pdf', { type: 'application/pdf' });
      const invalidUpload = {
        name: 'a'.repeat(256),
        size: 1024,
        type: 'application/pdf' as const,
        content: mockFile
      };

      const result = fileUploadSchema.safeParse(invalidUpload);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toContain('name');
      }
    });

    it('should reject file that is too large', () => {
      const mockFile = new File(['test content'], 'test.pdf', { type: 'application/pdf' });
      const invalidUpload = {
        name: 'test.pdf',
        size: 21 * 1024 * 1024, // 21MB
        type: 'application/pdf' as const,
        content: mockFile
      };

      const result = fileUploadSchema.safeParse(invalidUpload);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toContain('size');
      }
    });

    it('should reject unsupported file type', () => {
      const mockFile = new File(['test content'], 'test.exe', { type: 'application/x-executable' });
      const invalidUpload = {
        name: 'test.exe',
        size: 1024,
        type: 'application/x-executable' as any,
        content: mockFile
      };

      const result = fileUploadSchema.safeParse(invalidUpload);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toContain('type');
      }
    });

    it('should accept all supported file types', () => {
      const supportedTypes = [
        'application/pdf',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'text/plain',
        'image/png',
        'image/jpeg'
      ];

      supportedTypes.forEach(type => {
        const mockFile = new File(['test content'], 'test.file', { type });
        const validUpload = {
          name: 'test.file',
          size: 1024,
          type: type as any,
          content: mockFile
        };

        const result = fileUploadSchema.safeParse(validUpload);
        expect(result.success).toBe(true);
      });
    });
  });

  describe('apiRequestSchema', () => {
    it('should validate a valid API request', () => {
      const validRequest = {
        messages: [
          {
            content: 'Hello',
            role: 'user' as const
          },
          {
            content: 'Hi there!',
            role: 'assistant' as const
          }
        ],
        model: 'gpt-4',
        temperature: 0.7,
        maxTokens: 1000
      };

      const result = apiRequestSchema.safeParse(validRequest);
      expect(result.success).toBe(true);
    });

    it('should validate minimal API request', () => {
      const minimalRequest = {
        messages: [
          {
            content: 'Hello',
            role: 'user' as const
          }
        ]
      };

      const result = apiRequestSchema.safeParse(minimalRequest);
      expect(result.success).toBe(true);
    });

    it('should reject empty messages array', () => {
      const invalidRequest = {
        messages: []
      };

      const result = apiRequestSchema.safeParse(invalidRequest);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toContain('messages');
      }
    });

    it('should reject invalid temperature', () => {
      const invalidRequest = {
        messages: [
          {
            content: 'Hello',
            role: 'user' as const
          }
        ],
        temperature: 3.0 // Too high
      };

      const result = apiRequestSchema.safeParse(invalidRequest);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toContain('temperature');
      }
    });

    it('should reject negative temperature', () => {
      const invalidRequest = {
        messages: [
          {
            content: 'Hello',
            role: 'user' as const
          }
        ],
        temperature: -0.1
      };

      const result = apiRequestSchema.safeParse(invalidRequest);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toContain('temperature');
      }
    });

    it('should reject invalid maxTokens', () => {
      const invalidRequest = {
        messages: [
          {
            content: 'Hello',
            role: 'user' as const
          }
        ],
        maxTokens: 0 // Too low
      };

      const result = apiRequestSchema.safeParse(invalidRequest);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toContain('maxTokens');
      }
    });

    it('should reject maxTokens that is too high', () => {
      const invalidRequest = {
        messages: [
          {
            content: 'Hello',
            role: 'user' as const
          }
        ],
        maxTokens: 100001 // Too high
      };

      const result = apiRequestSchema.safeParse(invalidRequest);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toContain('maxTokens');
      }
    });
  });

  describe('sanitizeInput', () => {
    it('should remove HTML tags', () => {
      const input = '<script>alert("xss")</script>Hello world';
      const result = sanitizeInput(input);
      expect(result).toBe('scriptalert("xss")/scriptHello world');
    });

    it('should remove javascript protocol', () => {
      const input = 'javascript:alert("xss")';
      const result = sanitizeInput(input);
      expect(result).toBe('alert("xss")');
    });

    it('should remove event handlers', () => {
      const input = 'onclick=alert("xss") onload=alert("xss")';
      const result = sanitizeInput(input);
      expect(result).toBe('alert("xss") alert("xss")');
    });

    it('should trim whitespace', () => {
      const input = '  Hello world  ';
      const result = sanitizeInput(input);
      expect(result).toBe('Hello world');
    });

    it('should handle empty string', () => {
      const input = '';
      const result = sanitizeInput(input);
      expect(result).toBe('');
    });

    it('should handle string with only whitespace', () => {
      const input = '   \n\t  ';
      const result = sanitizeInput(input);
      expect(result).toBe('');
    });

    it('should preserve normal text', () => {
      const input = 'This is normal text with numbers 123 and symbols @#$%';
      const result = sanitizeInput(input);
      expect(result).toBe('This is normal text with numbers 123 and symbols @#$%');
    });

    it('should handle complex XSS attempts', () => {
      const input = '<img src="x" onerror="alert(\'xss\')">javascript:alert("xss")<script>alert("xss")</script>';
      const result = sanitizeInput(input);
      expect(result).toBe('img src="x" "alert(\'xss\')"alert("xss")scriptalert("xss")/script');
    });
  });
});
