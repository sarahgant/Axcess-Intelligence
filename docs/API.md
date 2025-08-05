# API Documentation

This document describes the REST API endpoints for CCH Axcess Intelligence Vibed.

## Base URL

```
Development: http://localhost:3001
Production: https://api.cch-intelligence.com
```

## Authentication

All API requests require authentication using JWT tokens in the Authorization header:

```http
Authorization: Bearer <your-jwt-token>
```

## Response Format

All API responses follow this standard format:

```typescript
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  meta?: {
    timestamp: number;
    requestId: string;
    version: string;
    pagination?: {
      page: number;
      pageSize: number;
      totalPages: number;
      totalItems: number;
    };
  };
}
```

## Endpoints

### Health Check

#### GET /health

Check API health and status.

**Response:**
```json
{
  "success": true,
  "data": {
    "status": "healthy",
    "timestamp": 1672531200000,
    "version": "1.0.0",
    "uptime": 3600,
    "environment": "development",
    "services": {
      "anthropic": {
        "status": "connected",
        "configured": true
      },
      "openai": {
        "status": "connected", 
        "configured": true
      }
    }
  }
}
```

### Authentication

#### POST /api/auth/login

Authenticate user and receive JWT token.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "securepassword"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "user-123",
      "email": "user@example.com",
      "name": "John Doe",
      "role": "user"
    },
    "expiresAt": 1672617600000
  }
}
```

#### POST /api/auth/refresh

Refresh an expired JWT token.

**Request:**
```json
{
  "refreshToken": "refresh-token-here"
}
```

#### POST /api/auth/logout

Logout user and invalidate token.

**Request:**
```json
{
  "token": "jwt-token-here"
}
```

### Chat

#### POST /api/chat/message

Send a message to AI chat.

**Request:**
```json
{
  "message": "What is the corporate tax rate?",
  "provider": "anthropic",
  "model": "claude-3-sonnet-20240229",
  "options": {
    "temperature": 0.7,
    "maxTokens": 1000,
    "stream": false
  },
  "context": {
    "sessionId": "session-123",
    "documentIds": ["doc-456", "doc-789"]
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "msg-123",
    "content": "The corporate tax rate in the United States...",
    "provider": "anthropic",
    "model": "claude-3-sonnet-20240229",
    "usage": {
      "promptTokens": 50,
      "completionTokens": 200,
      "totalTokens": 250
    },
    "metadata": {
      "processingTime": 1500,
      "timestamp": 1672531200000
    }
  }
}
```

#### POST /api/chat/stream

Send a streaming message to AI chat.

**Request:**
Same as `/api/chat/message` with `stream: true`

**Response:**
Server-Sent Events (SSE) stream:

```
data: {"type":"start","id":"msg-123"}

data: {"type":"content","delta":"The corporate"}

data: {"type":"content","delta":" tax rate"}

data: {"type":"end","usage":{"totalTokens":250}}
```

#### GET /api/chat/sessions

Get user's chat sessions.

**Query Parameters:**
- `page` (number, default: 1)
- `pageSize` (number, default: 20)
- `sortBy` (string, default: "updatedAt")
- `sortOrder` (string, default: "desc")

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "session-123",
      "title": "Tax Research Session",
      "messageCount": 15,
      "createdAt": 1672531200000,
      "updatedAt": 1672531800000,
      "lastMessage": {
        "content": "Thank you for the clarification...",
        "timestamp": 1672531800000
      }
    }
  ],
  "meta": {
    "pagination": {
      "page": 1,
      "pageSize": 20,
      "totalPages": 1,
      "totalItems": 5
    }
  }
}
```

#### GET /api/chat/sessions/:sessionId

Get specific chat session with messages.

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "session-123",
    "title": "Tax Research Session",
    "createdAt": 1672531200000,
    "updatedAt": 1672531800000,
    "messages": [
      {
        "id": "msg-1",
        "content": "What is the corporate tax rate?",
        "type": "user",
        "timestamp": 1672531200000
      },
      {
        "id": "msg-2", 
        "content": "The corporate tax rate...",
        "type": "assistant",
        "timestamp": 1672531220000,
        "metadata": {
          "provider": "anthropic",
          "model": "claude-3-sonnet-20240229"
        }
      }
    ]
  }
}
```

#### DELETE /api/chat/sessions/:sessionId

Delete a chat session.

**Response:**
```json
{
  "success": true,
  "data": {
    "deleted": true,
    "sessionId": "session-123"
  }
}
```

### Documents

#### POST /api/documents/upload

Upload a document for processing.

**Request:**
```http
POST /api/documents/upload
Content-Type: multipart/form-data

file: [binary file data]
options: {
  "extractText": true,
  "generateSummary": true,
  "detectEntities": true
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "doc-123",
    "name": "tax-document.pdf",
    "size": 1048576,
    "type": "pdf",
    "status": "processing",
    "uploadedAt": 1672531200000,
    "processingOptions": {
      "extractText": true,
      "generateSummary": true,
      "detectEntities": true
    }
  }
}
```

#### GET /api/documents

Get user's documents.

**Query Parameters:**
- `page` (number, default: 1)
- `pageSize` (number, default: 20)
- `type` (string, optional: "pdf", "docx", "txt", etc.)
- `status` (string, optional: "uploaded", "processing", "processed", "error")
- `search` (string, optional: search in document names/content)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "doc-123",
      "name": "tax-document.pdf",
      "size": 1048576,
      "type": "pdf",
      "status": "processed",
      "uploadedAt": 1672531200000,
      "processedAt": 1672531260000,
      "summary": "This document contains tax information...",
      "entities": [
        {
          "type": "amount",
          "value": "$50,000",
          "confidence": 0.95,
          "position": { "start": 100, "end": 107 }
        }
      ]
    }
  ],
  "meta": {
    "pagination": {
      "page": 1,
      "pageSize": 20,
      "totalPages": 3,
      "totalItems": 45
    }
  }
}
```

#### GET /api/documents/:documentId

Get specific document details.

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "doc-123",
    "name": "tax-document.pdf",
    "size": 1048576,
    "type": "pdf",
    "status": "processed",
    "uploadedAt": 1672531200000,
    "processedAt": 1672531260000,
    "content": "Full extracted text content...",
    "summary": "Document summary...",
    "entities": [
      {
        "type": "person",
        "value": "John Smith",
        "confidence": 0.98,
        "position": { "start": 50, "end": 60 }
      }
    ],
    "metadata": {
      "pages": 5,
      "language": "en",
      "processingTime": 5000
    }
  }
}
```

#### DELETE /api/documents/:documentId

Delete a document.

**Response:**
```json
{
  "success": true,
  "data": {
    "deleted": true,
    "documentId": "doc-123"
  }
}
```

#### POST /api/documents/:documentId/analyze

Analyze document with AI.

**Request:**
```json
{
  "analysisType": "tax_compliance",
  "questions": [
    "What tax forms are referenced?",
    "Are there any compliance issues?"
  ],
  "provider": "anthropic"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "analysisId": "analysis-123",
    "documentId": "doc-123",
    "type": "tax_compliance",
    "results": {
      "summary": "Analysis summary...",
      "answers": [
        {
          "question": "What tax forms are referenced?",
          "answer": "Form 1040 and Schedule C are referenced...",
          "confidence": 0.92,
          "citations": [
            {
              "text": "Form 1040",
              "position": { "start": 150, "end": 159 }
            }
          ]
        }
      ],
      "compliance": {
        "score": 0.85,
        "issues": [
          {
            "severity": "medium",
            "description": "Missing signature date",
            "recommendation": "Ensure all forms are properly dated"
          }
        ]
      }
    },
    "createdAt": 1672531200000
  }
}
```

### Research

#### POST /api/research/query

Perform tax research query.

**Request:**
```json
{
  "query": "Section 199A deduction eligibility",
  "filters": {
    "jurisdiction": ["federal", "california"],
    "documentTypes": ["statute", "regulation", "ruling"],
    "dateRange": {
      "start": 1609459200000,
      "end": 1672531200000
    }
  },
  "options": {
    "maxResults": 10,
    "includeAISummary": true,
    "relevanceThreshold": 0.7
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "queryId": "query-123",
    "query": "Section 199A deduction eligibility",
    "results": [
      {
        "id": "result-1",
        "title": "Section 199A - Qualified Business Income Deduction",
        "content": "Section 199A allows eligible taxpayers...",
        "type": "statute",
        "source": "Internal Revenue Code",
        "jurisdiction": "federal",
        "relevanceScore": 0.95,
        "url": "https://www.law.cornell.edu/uscode/text/26/199A",
        "summary": "AI-generated summary of the section...",
        "keyPoints": [
          "20% deduction for qualified business income",
          "Income limitations apply",
          "Specified service trade limitations"
        ],
        "citations": [
          {
            "title": "IRC Section 199A",
            "type": "primary",
            "url": "https://..."
          }
        ],
        "lastUpdated": 1672531200000
      }
    ],
    "aiSummary": "Section 199A provides a deduction...",
    "totalResults": 15,
    "processingTime": 2500
  }
}
```

#### GET /api/research/history

Get research query history.

**Query Parameters:**
- `page` (number, default: 1)
- `pageSize` (number, default: 20)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "query-123",
      "query": "Section 199A deduction eligibility",
      "resultCount": 15,
      "createdAt": 1672531200000,
      "filters": {
        "jurisdiction": ["federal"]
      }
    }
  ]
}
```

## Error Handling

### Error Response Format

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid request parameters",
    "details": {
      "field": "message",
      "reason": "Message cannot be empty"
    }
  },
  "meta": {
    "timestamp": 1672531200000,
    "requestId": "req-123"
  }
}
```

### Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `VALIDATION_ERROR` | 400 | Request validation failed |
| `UNAUTHORIZED` | 401 | Invalid or missing authentication |
| `FORBIDDEN` | 403 | Insufficient permissions |
| `NOT_FOUND` | 404 | Resource not found |
| `RATE_LIMITED` | 429 | Too many requests |
| `INTERNAL_ERROR` | 500 | Server error |
| `SERVICE_UNAVAILABLE` | 503 | External service unavailable |
| `PROVIDER_ERROR` | 502 | AI provider error |
| `DOCUMENT_TOO_LARGE` | 413 | Document exceeds size limit |
| `UNSUPPORTED_FORMAT` | 415 | Unsupported document format |

## Rate Limiting

### Limits

| Endpoint | Limit | Window |
|----------|-------|--------|
| `/api/chat/*` | 20 requests | 1 minute |
| `/api/documents/upload` | 5 requests | 1 minute |
| `/api/research/*` | 10 requests | 1 minute |
| Global | 100 requests | 15 minutes |

### Headers

Rate limit information is included in response headers:

```http
X-RateLimit-Limit: 20
X-RateLimit-Remaining: 15
X-RateLimit-Reset: 1672531260
```

## Webhooks

### Document Processing Complete

When document processing completes, a webhook is sent:

```http
POST https://your-webhook-url.com/webhook
Content-Type: application/json
X-Webhook-Signature: sha256=...

{
  "event": "document.processed",
  "data": {
    "documentId": "doc-123",
    "status": "processed",
    "processingTime": 5000,
    "extractedText": "Document content...",
    "summary": "AI-generated summary...",
    "entities": [...]
  },
  "timestamp": 1672531200000
}
```

### Webhook Signature Verification

Verify webhook authenticity using HMAC-SHA256:

```javascript
const crypto = require('crypto');

function verifyWebhook(payload, signature, secret) {
  const hash = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex');
  
  return signature === `sha256=${hash}`;
}
```

## SDK Examples

### JavaScript/TypeScript

```typescript
import { CCHIntelligenceAPI } from 'cch-intelligence-sdk';

const client = new CCHIntelligenceAPI({
  apiKey: 'your-api-key',
  baseURL: 'https://api.cch-intelligence.com'
});

// Send chat message
const response = await client.chat.sendMessage({
  message: 'What is the corporate tax rate?',
  provider: 'anthropic'
});

// Upload document
const document = await client.documents.upload(file, {
  extractText: true,
  generateSummary: true
});

// Research query
const results = await client.research.query({
  query: 'Section 199A eligibility',
  filters: { jurisdiction: ['federal'] }
});
```

### Python

```python
from cch_intelligence import CCHIntelligenceClient

client = CCHIntelligenceClient(
    api_key='your-api-key',
    base_url='https://api.cch-intelligence.com'
)

# Send chat message
response = client.chat.send_message(
    message='What is the corporate tax rate?',
    provider='anthropic'
)

# Upload document
document = client.documents.upload(
    file_path='./tax-document.pdf',
    options={'extract_text': True}
)

# Research query
results = client.research.query(
    query='Section 199A eligibility',
    filters={'jurisdiction': ['federal']}
)
```

### cURL Examples

```bash
# Send chat message
curl -X POST https://api.cch-intelligence.com/api/chat/message \
  -H "Authorization: Bearer your-jwt-token" \
  -H "Content-Type: application/json" \
  -d '{
    "message": "What is the corporate tax rate?",
    "provider": "anthropic"
  }'

# Upload document
curl -X POST https://api.cch-intelligence.com/api/documents/upload \
  -H "Authorization: Bearer your-jwt-token" \
  -F "file=@tax-document.pdf" \
  -F 'options={"extractText":true}'

# Research query
curl -X POST https://api.cch-intelligence.com/api/research/query \
  -H "Authorization: Bearer your-jwt-token" \
  -H "Content-Type: application/json" \
  -d '{
    "query": "Section 199A eligibility",
    "filters": {"jurisdiction": ["federal"]}
  }'
```

## Postman Collection

A Postman collection with all endpoints is available at:
```
https://api.cch-intelligence.com/postman/collection.json
```

Import this collection to test the API with pre-configured requests and environment variables.

---

For additional support, contact our API team at api-support@cch-intelligence.com