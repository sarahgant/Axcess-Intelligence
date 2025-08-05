/**
 * Mock Service Worker Server
 * API mocking for tests
 */

import { setupServer } from 'msw/node';
import { rest } from 'msw';

// Mock API handlers
export const handlers = [
  // Health check
  rest.get('/health', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        success: true,
        data: {
          status: 'healthy',
          timestamp: Date.now(),
          version: '1.0.0',
          environment: 'test',
          services: {
            anthropic: { status: 'connected', configured: true },
            openai: { status: 'connected', configured: true },
          },
        },
      })
    );
  }),

  // Chat endpoints
  rest.post('/api/chat/message', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        success: true,
        data: {
          id: 'msg-test-123',
          content: 'This is a test AI response from the mock server.',
          provider: 'anthropic',
          model: 'claude-3-sonnet-20240229',
          usage: {
            promptTokens: 50,
            completionTokens: 100,
            totalTokens: 150,
          },
          metadata: {
            processingTime: 1000,
            timestamp: Date.now(),
          },
        },
      })
    );
  }),

  rest.get('/api/chat/sessions', (req, res, ctx) => {
    const page = Number(req.url.searchParams.get('page')) || 1;
    const pageSize = Number(req.url.searchParams.get('pageSize')) || 20;

    return res(
      ctx.status(200),
      ctx.json({
        success: true,
        data: [
          {
            id: 'session-1',
            title: 'Test Chat Session',
            messageCount: 5,
            createdAt: Date.now() - 86400000,
            updatedAt: Date.now(),
            lastMessage: {
              content: 'Last message in session',
              timestamp: Date.now(),
            },
          },
        ],
        meta: {
          pagination: {
            page,
            pageSize,
            totalPages: 1,
            totalItems: 1,
            hasNext: false,
            hasPrevious: false,
          },
        },
      })
    );
  }),

  rest.get('/api/chat/sessions/:sessionId', (req, res, ctx) => {
    const { sessionId } = req.params;

    return res(
      ctx.status(200),
      ctx.json({
        success: true,
        data: {
          id: sessionId,
          title: 'Test Chat Session',
          createdAt: Date.now() - 86400000,
          updatedAt: Date.now(),
          messages: [
            {
              id: 'msg-1',
              content: 'Hello, this is a test message',
              type: 'user',
              timestamp: Date.now() - 60000,
              sender: 'user',
            },
            {
              id: 'msg-2',
              content: 'This is a test response from the AI',
              type: 'assistant',
              timestamp: Date.now() - 30000,
              sender: 'assistant',
              metadata: {
                provider: 'anthropic',
                model: 'claude-3-sonnet-20240229',
              },
            },
          ],
        },
      })
    );
  }),

  // Document endpoints
  rest.post('/api/documents/upload', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        success: true,
        data: {
          id: 'doc-test-123',
          name: 'test-document.pdf',
          size: 1048576,
          type: 'pdf',
          status: 'processing',
          uploadedAt: Date.now(),
          processingOptions: {
            extractText: true,
            generateSummary: true,
            detectEntities: true,
          },
        },
      })
    );
  }),

  rest.get('/api/documents', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        success: true,
        data: [
          {
            id: 'doc-1',
            name: 'test-document.pdf',
            size: 1048576,
            type: 'pdf',
            status: 'processed',
            uploadedAt: Date.now() - 86400000,
            processedAt: Date.now() - 86340000,
            summary: 'This is a test document summary',
            entities: [
              {
                type: 'amount',
                value: '$50,000',
                confidence: 0.95,
                position: { start: 100, end: 107 },
              },
            ],
          },
        ],
        meta: {
          pagination: {
            page: 1,
            pageSize: 20,
            totalPages: 1,
            totalItems: 1,
          },
        },
      })
    );
  }),

  rest.get('/api/documents/:documentId', (req, res, ctx) => {
    const { documentId } = req.params;

    return res(
      ctx.status(200),
      ctx.json({
        success: true,
        data: {
          id: documentId,
          name: 'test-document.pdf',
          size: 1048576,
          type: 'pdf',
          status: 'processed',
          uploadedAt: Date.now() - 86400000,
          processedAt: Date.now() - 86340000,
          content: 'This is the extracted text content from the document...',
          summary: 'Document summary generated by AI',
          entities: [
            {
              type: 'person',
              value: 'John Smith',
              confidence: 0.98,
              position: { start: 50, end: 60 },
            },
            {
              type: 'amount',
              value: '$50,000',
              confidence: 0.95,
              position: { start: 100, end: 107 },
            },
          ],
          metadata: {
            pages: 5,
            language: 'en',
            processingTime: 5000,
          },
        },
      })
    );
  }),

  // Research endpoints
  rest.post('/api/research/query', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        success: true,
        data: {
          queryId: 'query-test-123',
          query: 'Section 199A deduction eligibility',
          results: [
            {
              id: 'result-1',
              title: 'Section 199A - Qualified Business Income Deduction',
              content: 'Section 199A allows eligible taxpayers to deduct up to 20% of qualified business income...',
              type: 'statute',
              source: 'Internal Revenue Code',
              jurisdiction: 'federal',
              relevanceScore: 0.95,
              url: 'https://www.law.cornell.edu/uscode/text/26/199A',
              summary: 'AI-generated summary of Section 199A',
              keyPoints: [
                '20% deduction for qualified business income',
                'Income limitations apply',
                'Specified service trade limitations',
              ],
              citations: [
                {
                  title: 'IRC Section 199A',
                  type: 'primary',
                  url: 'https://www.law.cornell.edu/uscode/text/26/199A',
                },
              ],
              lastUpdated: Date.now() - 86400000,
            },
          ],
          aiSummary: 'Section 199A provides a deduction for qualified business income...',
          totalResults: 15,
          processingTime: 2500,
        },
      })
    );
  }),

  // Error handlers
  rest.post('/api/error-test', (req, res, ctx) => {
    return res(
      ctx.status(500),
      ctx.json({
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Test error for testing error handling',
        },
      })
    );
  }),

  rest.post('/api/rate-limit-test', (req, res, ctx) => {
    return res(
      ctx.status(429),
      ctx.json({
        success: false,
        error: {
          code: 'RATE_LIMITED',
          message: 'Too many requests',
        },
      })
    );
  }),
];

// Create and export the server
export const server = setupServer(...handlers);