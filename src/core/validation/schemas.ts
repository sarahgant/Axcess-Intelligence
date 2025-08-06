import { z } from 'zod';

// Message validation
export const messageSchema = z.object({
  content: z.string().min(1, 'Content cannot be empty').max(10000, 'Content too long'),
  role: z.enum(['user', 'assistant', 'system']),
  timestamp: z.date().optional(),
  metadata: z.record(z.any()).optional()
});

// File upload validation
export const fileUploadSchema = z.object({
  name: z.string().min(1, 'Filename cannot be empty').max(255, 'Filename too long'),
  size: z.number().max(20 * 1024 * 1024, 'File size must be less than 20MB'),
  type: z.enum([
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'text/plain',
    'image/png',
    'image/jpeg'
  ]),
  content: z.instanceof(File)
});

// API request validation
export const apiRequestSchema = z.object({
  messages: z.array(messageSchema).min(1, 'At least one message is required'),
  model: z.string().optional(),
  temperature: z.number().min(0).max(2).optional(),
  maxTokens: z.number().min(1).max(100000).optional()
});

// Sanitization helper
export function sanitizeInput(input: string): string {
  return input
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, '') // Remove event handlers
    .trim();
}
