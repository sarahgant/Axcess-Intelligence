# Development Guide

This guide covers the development setup, workflow, and best practices for contributing to CCH Axcess Intelligence Vibed.

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** 18+ ([Download](https://nodejs.org/))
- **npm** 9+ (comes with Node.js)
- **Git** ([Download](https://git-scm.com/))
- **VS Code** (recommended, [Download](https://code.visualstudio.com/))

### IDE Setup

#### VS Code Extensions

Install these recommended extensions:

```json
{
  "recommendations": [
    "bradlc.vscode-tailwindcss",
    "esbenp.prettier-vscode",
    "dbaeumer.vscode-eslint",
    "ms-vscode.vscode-typescript-next",
    "ms-playwright.playwright",
    "bradlc.vscode-tailwindcss",
    "formulahendry.auto-rename-tag",
    "christian-kohler.path-intellisense"
  ]
}
```

#### VS Code Settings

```json
{
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true,
    "source.organizeImports": true
  },
  "typescript.preferences.importModuleSpecifier": "relative",
  "emmet.includeLanguages": {
    "typescript": "html",
    "typescriptreact": "html"
  }
}
```

## 🏗️ Project Setup

### 1. Clone and Install

```bash
# Clone the repository
git clone https://github.com/your-org/cch-axcess-intelligence.git
cd cch-axcess-intelligence

# Install dependencies
npm install

# Copy environment template
cp .env.example .env
```

### 2. Environment Configuration

Edit `.env` with your development settings:

```bash
# Development Environment
NODE_ENV=development
PORT=5173
VITE_API_URL=http://localhost:3001

# AI Provider Keys (get from respective platforms)
ANTHROPIC_API_KEY=your_anthropic_key_here
OPENAI_API_KEY=your_openai_key_here

# Development Security (generate secure values)
ENCRYPTION_KEY=your_32_character_dev_encryption_key
JWT_SECRET=your_development_jwt_secret

# Development Features
VITE_ENABLE_DEBUG_MODE=true
VITE_ENABLE_STREAMING=true
VITE_ENABLE_DOCUMENT_ANALYSIS=true
```

### 3. Start Development

```bash
# Start both frontend and backend
npm start

# Or start individually
npm run client  # Frontend only (port 5173)
npm run server  # Backend only (port 3001)
```

## 🔧 Development Workflow

### Branch Strategy

We use **Git Flow** with these branch types:

- `main` - Production ready code
- `develop` - Integration branch for features
- `feature/*` - New features
- `hotfix/*` - Critical production fixes
- `release/*` - Release preparation

```bash
# Create a feature branch
git checkout develop
git checkout -b feature/your-feature-name

# Work on your feature...
git add .
git commit -m "feat: add amazing new feature"

# Push and create PR
git push origin feature/your-feature-name
```

### Commit Convention

We follow [Conventional Commits](https://www.conventionalcommits.org/):

```bash
feat: add new chat feature
fix: resolve document upload issue
docs: update API documentation
style: format code with prettier
refactor: restructure user service
test: add unit tests for chat service
chore: update dependencies
```

### Development Commands

```bash
# Development
npm start                    # Clean startup (recommended)
npm run dev                 # Alternative startup
npm run dev:frontend        # Frontend only
npm run dev:backend         # Backend only

# Code Quality
npm run lint                # Run ESLint
npm run lint:fix            # Fix ESLint issues
npm run type-check          # TypeScript validation
npm run format              # Format with Prettier

# Testing
npm test                    # Run all tests
npm run test:watch          # Watch mode
npm run test:coverage       # Coverage report
npm run test:e2e            # End-to-end tests

# Building
npm run build               # Production build
npm run preview             # Preview build
npm run analyze             # Bundle analysis

# Maintenance
npm run clean               # Clean ports
npm run fresh               # Fresh install
npm run doctor              # Health check
npm run security:audit      # Security scan
```

## 🏗️ Architecture Guidelines

### Feature-Based Structure

```
src/
├── features/              # Business features
│   ├── chat/             # Chat functionality
│   ├── documents/        # Document management
│   ├── research/         # Tax research
│   └── auth/            # Authentication
├── shared/               # Shared resources
│   ├── components/       # Reusable UI components
│   ├── hooks/           # Custom React hooks
│   ├── services/        # Common services
│   ├── types/           # Shared TypeScript types
│   └── utils/           # Utility functions
├── core/                # Core business logic
│   ├── providers/       # AI service providers
│   ├── config/          # Configuration
│   └── constants/       # App constants
└── infrastructure/      # Technical infrastructure
    ├── api/            # HTTP client
    ├── auth/           # Authentication
    └── monitoring/     # Logging & monitoring
```

### Dependency Rules

**Critical**: Features cannot import from other features!

```typescript
// ✅ ALLOWED
import { Button } from '@/shared/components';
import { ProviderFactory } from '@/core/providers';
import { ApiClient } from '@/infrastructure/api';

// ❌ FORBIDDEN
import { DocumentService } from '@/features/documents';
```

### Component Guidelines

#### 1. Component Structure

```typescript
// components/ExampleComponent.tsx
import React, { memo } from 'react';
import { clsx } from 'clsx';

interface ExampleComponentProps {
  title: string;
  variant?: 'primary' | 'secondary';
  onClick?: () => void;
  className?: string;
}

export const ExampleComponent = memo<ExampleComponentProps>(({
  title,
  variant = 'primary',
  onClick,
  className
}) => {
  return (
    <div 
      className={clsx(
        'base-styles',
        variant === 'primary' && 'primary-styles',
        variant === 'secondary' && 'secondary-styles',
        className
      )}
      onClick={onClick}
    >
      {title}
    </div>
  );
});

ExampleComponent.displayName = 'ExampleComponent';
```

#### 2. Custom Hooks

```typescript
// hooks/useExample.ts
import { useState, useCallback, useEffect } from 'react';

interface UseExampleOptions {
  initialValue?: string;
  autoSave?: boolean;
}

export function useExample(options: UseExampleOptions = {}) {
  const [value, setValue] = useState(options.initialValue || '');
  const [isLoading, setIsLoading] = useState(false);

  const updateValue = useCallback(async (newValue: string) => {
    setIsLoading(true);
    try {
      // Business logic here
      setValue(newValue);
      
      if (options.autoSave) {
        // Auto-save logic
      }
    } finally {
      setIsLoading(false);
    }
  }, [options.autoSave]);

  return {
    value,
    updateValue,
    isLoading
  };
}
```

#### 3. Service Classes

```typescript
// services/ExampleService.ts
import { ApiClient } from '@/infrastructure/api';
import { Logger } from '@/infrastructure/monitoring';

export class ExampleService {
  constructor(
    private apiClient: ApiClient,
    private logger: Logger
  ) {}

  async performAction(data: ActionData): Promise<ActionResult> {
    this.logger.info('Performing action', { data });

    try {
      const result = await this.apiClient.post('/action', data);
      
      this.logger.info('Action completed', { result });
      return result;
    } catch (error) {
      this.logger.error('Action failed', { error, data });
      throw error;
    }
  }
}
```

## 🧪 Testing Strategy

### Test Structure

```
tests/
├── unit/                 # Unit tests
│   ├── components/
│   ├── hooks/
│   ├── services/
│   └── utils/
├── integration/          # Integration tests
│   ├── features/
│   └── api/
├── e2e/                 # End-to-end tests
│   ├── workflows/
│   └── smoke/
└── fixtures/            # Test data
```

### Unit Testing

```typescript
// __tests__/ExampleComponent.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { ExampleComponent } from '../ExampleComponent';

describe('ExampleComponent', () => {
  it('renders with title', () => {
    render(<ExampleComponent title="Test Title" />);
    expect(screen.getByText('Test Title')).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const handleClick = jest.fn();
    render(<ExampleComponent title="Test" onClick={handleClick} />);
    
    fireEvent.click(screen.getByText('Test'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('applies variant styles correctly', () => {
    const { rerender } = render(
      <ExampleComponent title="Test" variant="primary" />
    );
    expect(screen.getByText('Test')).toHaveClass('primary-styles');

    rerender(<ExampleComponent title="Test" variant="secondary" />);
    expect(screen.getByText('Test')).toHaveClass('secondary-styles');
  });
});
```

### Integration Testing

```typescript
// __tests__/ChatIntegration.test.tsx
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ChatInterface } from '@/features/chat';
import { TestWrapper } from '@/shared/testing';

describe('Chat Integration', () => {
  it('sends message and displays response', async () => {
    const user = userEvent.setup();
    
    render(
      <TestWrapper>
        <ChatInterface />
      </TestWrapper>
    );

    const input = screen.getByRole('textbox');
    const sendButton = screen.getByRole('button', { name: /send/i });

    await user.type(input, 'Hello, AI!');
    await user.click(sendButton);

    await waitFor(() => {
      expect(screen.getByText('Hello, AI!')).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getByText(/AI response/)).toBeInTheDocument();
    }, { timeout: 5000 });
  });
});
```

### E2E Testing

```typescript
// e2e/chat-workflow.spec.ts
import { test, expect } from '@playwright/test';

test('complete chat workflow', async ({ page }) => {
  await page.goto('/');

  // Wait for app to load
  await expect(page.locator('[data-testid="chat-interface"]')).toBeVisible();

  // Send a message
  await page.fill('[data-testid="message-input"]', 'What is the tax rate for corporations?');
  await page.click('[data-testid="send-button"]');

  // Wait for response
  await expect(page.locator('[data-testid="assistant-message"]')).toBeVisible({
    timeout: 10000
  });

  // Verify response content
  const response = await page.locator('[data-testid="assistant-message"]').textContent();
  expect(response).toContain('corporate tax');
});
```

## 🎨 Styling Guidelines

### Tailwind CSS

We use Tailwind CSS with the WK design system:

```typescript
// ✅ GOOD - Utility classes
<div className="flex items-center space-x-4 p-4 bg-white rounded-lg shadow-md">
  <Button variant="primary" size="md">
    Submit
  </Button>
</div>

// ✅ GOOD - Component variants
<Button 
  variant="primary" 
  size="lg"
  className="mt-4" // Additional spacing
>
  Large Primary Button
</Button>

// ❌ AVOID - Inline styles
<div style={{ display: 'flex', padding: '16px' }}>
```

### Design Tokens

Use WK design tokens for consistency:

```typescript
// colors
bg-wk-primary
text-wk-secondary
border-wk-neutral-200

// spacing
p-wk-4
m-wk-2
space-x-wk-3

// typography
text-wk-body
font-wk-heading
text-wk-lg
```

### Responsive Design

Mobile-first approach:

```typescript
<div className="
  flex flex-col space-y-4
  md:flex-row md:space-y-0 md:space-x-4
  lg:space-x-6
">
  {/* Content */}
</div>
```

## 🔒 Security Best Practices

### Input Validation

```typescript
import { sanitizeInput, validationSchemas } from '@/security/sanitization';

// Validate and sanitize user input
const handleSubmit = (data: FormData) => {
  try {
    const validated = validationSchemas.chatMessage.parse(data);
    const sanitized = sanitizeInput(validated.content, 'html');
    
    // Process sanitized input
    processSafeInput(sanitized);
  } catch (error) {
    // Handle validation error
    handleValidationError(error);
  }
};
```

### API Security

```typescript
import { ApiClient } from '@/infrastructure/api';

// API client automatically handles:
// - Authentication headers
// - CSRF protection
// - Rate limiting
// - Request/response sanitization

const apiClient = new ApiClient({
  baseURL: process.env.VITE_API_URL,
  timeout: 10000,
  retries: 3
});
```

### Environment Variables

```typescript
// ✅ GOOD - Use validation
import { getConfig } from '@/core/config';

const config = getConfig();
const apiKey = config.providers.anthropic.apiKey;

// ❌ BAD - Direct access
const apiKey = process.env.ANTHROPIC_API_KEY;
```

## 📊 Performance Guidelines

### Code Splitting

```typescript
// ✅ GOOD - Lazy load features
const ChatFeature = lazy(() => import('@/features/chat'));
const DocumentsFeature = lazy(() => import('@/features/documents'));

// Route-based splitting
<Routes>
  <Route path="/chat" element={
    <Suspense fallback={<Loading />}>
      <ChatFeature />
    </Suspense>
  } />
</Routes>
```

### Memoization

```typescript
// ✅ GOOD - Memoize expensive computations
const expensiveValue = useMemo(() => {
  return computeExpensiveValue(data);
}, [data]);

// ✅ GOOD - Memoize callbacks
const handleClick = useCallback(() => {
  onItemClick(item.id);
}, [item.id, onItemClick]);

// ✅ GOOD - Memoize components
const MessageItem = memo(({ message }) => {
  return <div>{message.content}</div>;
});
```

### Bundle Optimization

```typescript
// ✅ GOOD - Import only what you need
import { debounce } from 'lodash-es/debounce';

// ❌ BAD - Import entire library
import _ from 'lodash';
```

## 🚀 Deployment

### Environment Builds

```bash
# Development build
npm run build:dev

# Staging build  
npm run build:staging

# Production build
npm run build:prod
```

### Build Validation

```bash
# Run all checks before deployment
npm run validate

# Individual checks
npm run lint
npm run type-check
npm test
npm run security:audit
npm run build
```

### Docker Support

```bash
# Build Docker image
docker build -t cch-intelligence .

# Run with environment
docker run -p 5173:5173 --env-file .env cch-intelligence
```

## 🐛 Debugging

### Development Tools

#### Browser DevTools
- **React DevTools** - Component inspection
- **Redux DevTools** - State debugging
- **Network Tab** - API request monitoring
- **Performance Tab** - Performance profiling

#### VS Code Debugging

```json
// .vscode/launch.json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Debug Server",
      "program": "${workspaceFolder}/server/server.js",
      "env": {
        "NODE_ENV": "development"
      }
    }
  ]
}
```

### Logging

```typescript
import { Logger } from '@/infrastructure/monitoring';

const logger = Logger.getLogger('ComponentName');

// Structured logging
logger.info('User action', {
  userId: user.id,
  action: 'document_upload',
  metadata: { fileName, fileSize }
});

logger.error('API request failed', {
  url: '/api/chat',
  status: 500,
  error: error.message
});
```

### Error Boundaries

```typescript
// Wrap components with error boundaries
<ErrorBoundary fallback={<ErrorFallback />}>
  <FeatureComponent />
</ErrorBoundary>

// Custom error boundary
class FeatureErrorBoundary extends Component {
  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    Logger.error('Feature error', { error, errorInfo });
    ErrorReporter.captureException(error, errorInfo);
  }
}
```

## 📋 Code Review Checklist

### Before Submitting PR

- [ ] Code follows style guidelines
- [ ] All tests pass
- [ ] No console.log statements
- [ ] TypeScript errors resolved
- [ ] Security considerations addressed
- [ ] Performance impact assessed
- [ ] Documentation updated
- [ ] Accessibility tested

### Review Criteria

- [ ] **Functionality** - Does it work as expected?
- [ ] **Architecture** - Follows dependency rules?
- [ ] **Security** - No vulnerabilities introduced?
- [ ] **Performance** - No significant impact?
- [ ] **Testing** - Adequate test coverage?
- [ ] **Documentation** - Clear and up-to-date?

## 🆘 Troubleshooting

### Common Issues

#### Port Conflicts
```bash
npm run clean  # Kill processes on development ports
npm run doctor # Check system health
```

#### Module Resolution
```bash
npm run fresh  # Fresh install
rm -rf node_modules package-lock.json
npm install
```

#### TypeScript Errors
```bash
npm run type-check  # Validate types
npx tsc --noEmit     # Check without build
```

#### Build Issues
```bash
npm run analyze      # Bundle analysis
npm run build:dev    # Development build
```

### Getting Help

- 📖 Check [documentation](./docs/)
- 🐛 Search [existing issues](https://github.com/your-org/cch-axcess-intelligence/issues)
- 💬 Ask in [team chat](https://your-team-chat.com)
- 📧 Contact [maintainers](mailto:maintainers@yourcompany.com)

---

Happy coding! 🚀