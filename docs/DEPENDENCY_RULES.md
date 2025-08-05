# Dependency Rules

This document defines the strict dependency rules that must be followed in the CCH Axcess Intelligence Vibed codebase to maintain a clean, scalable architecture.

## Overview

Our architecture enforces a hierarchical dependency structure that prevents circular dependencies and ensures proper separation of concerns. Each layer can only depend on layers below it in the hierarchy.

## Dependency Hierarchy

```
┌─────────────┐
│   Features  │ ← Application features (business logic)
└─────────────┘
       │
       ▼
┌─────────────┐
│   Shared    │ ← Reusable components, hooks, utilities
└─────────────┘
       │
       ▼
┌─────────────┐
│    Core     │ ← Core business logic, domain models
└─────────────┘
       │
       ▼
┌─────────────┐
│Infrastructure│ ← Technical infrastructure, external APIs
└─────────────┘
       │
       ▼
┌─────────────┐
│  External   │ ← Third-party libraries, APIs
└─────────────┘
```

## Layer Definitions

### 1. Features Layer

**Purpose**: Contains feature-specific business logic and UI components.

**Can Import From**:
- ✅ Shared layer
- ✅ Core layer  
- ✅ Infrastructure layer
- ✅ External libraries

**Cannot Import From**:
- ❌ Other features

**Examples**:
```typescript
// ✅ ALLOWED
import { Button } from '@/shared/components';
import { ProviderFactory } from '@/core/providers';
import { ApiClient } from '@/infrastructure/api';
import { z } from 'zod';

// ❌ FORBIDDEN
import { DocumentService } from '@/features/documents';
```

### 2. Shared Layer

**Purpose**: Contains reusable components, hooks, and utilities used across features.

**Can Import From**:
- ✅ Core layer
- ✅ Infrastructure layer
- ✅ External libraries

**Cannot Import From**:
- ❌ Features layer
- ❌ Other shared modules (with exceptions for utilities)

**Examples**:
```typescript
// ✅ ALLOWED
import { ConfigService } from '@/core/config';
import { Logger } from '@/infrastructure/monitoring';
import { clsx } from 'clsx';

// ❌ FORBIDDEN
import { ChatService } from '@/features/chat';
```

### 3. Core Layer

**Purpose**: Contains core business logic, domain models, and configuration.

**Can Import From**:
- ✅ Infrastructure layer
- ✅ External libraries

**Cannot Import From**:
- ❌ Features layer
- ❌ Shared layer

**Examples**:
```typescript
// ✅ ALLOWED
import { ApiClient } from '@/infrastructure/api';
import { zod } from 'zod';

// ❌ FORBIDDEN
import { Button } from '@/shared/components';
import { ChatInterface } from '@/features/chat';
```

### 4. Infrastructure Layer

**Purpose**: Contains technical infrastructure, API clients, and external service integrations.

**Can Import From**:
- ✅ External libraries only

**Cannot Import From**:
- ❌ Features layer
- ❌ Shared layer
- ❌ Core layer

**Examples**:
```typescript
// ✅ ALLOWED
import axios from 'axios';
import { createLogger } from 'winston';

// ❌ FORBIDDEN
import { ConfigService } from '@/core/config';
import { Button } from '@/shared/components';
```

## Feature Isolation Rules

### No Cross-Feature Dependencies

Features are completely isolated from each other:

```typescript
// ❌ FORBIDDEN - Direct feature imports
import { DocumentUpload } from '@/features/documents';
import { ResearchQuery } from '@/features/research';

// ✅ ALLOWED - Communication through shared services
import { EventBus } from '@/shared/services';

// Feature A
EventBus.emit('document:uploaded', documentData);

// Feature B
EventBus.on('document:uploaded', handleDocumentUpload);
```

### Feature Communication Patterns

#### 1. Event Bus Pattern

```typescript
// shared/services/EventBus.ts
class EventBus {
  emit(event: string, data: any): void;
  on(event: string, handler: (data: any) => void): void;
  off(event: string, handler: (data: any) => void): void;
}

// Feature communication
import { EventBus } from '@/shared/services';

// In documents feature
EventBus.emit('document:processed', { id, content });

// In chat feature  
EventBus.on('document:processed', (data) => {
  addDocumentContext(data.content);
});
```

#### 2. Shared State

```typescript
// shared/stores/globalStore.ts
interface GlobalState {
  currentUser: User | null;
  documents: Document[];
  notifications: Notification[];
}

// Features access shared state, not each other
import { useGlobalStore } from '@/shared/stores';

const documents = useGlobalStore(state => state.documents);
```

#### 3. URL/Routing

```typescript
// Features navigate to each other via routing
import { useNavigate } from 'react-router-dom';

const navigate = useNavigate();
navigate('/documents/upload', { 
  state: { context: 'from-chat' } 
});
```

## Barrel Export Rules

### Feature Public APIs

Each feature must expose a clean public API:

```typescript
// features/chat/index.ts - GOOD
export { ChatInterface } from './components/ChatInterface';
export { useChat } from './hooks/useChat';
export { ChatService } from './services/ChatService';
export type { ChatMessage, ChatSession } from './types';

// features/chat/index.ts - BAD
export * from './components'; // Too broad
export { InternalChatHelper } from './utils/internal'; // Internal detail
```

### Shared Module APIs

Shared modules should export specific, well-defined APIs:

```typescript
// shared/components/index.ts - GOOD
export { Button } from './ui/Button';
export { Modal } from './ui/Modal';
export { Form } from './forms/Form';

// shared/components/index.ts - BAD  
export * from './ui'; // Unclear what's being exported
export { ButtonInternals } from './ui/Button/internals'; // Internal detail
```

## Import Path Rules

### Use Absolute Imports

```typescript
// ✅ CORRECT
import { Button } from '@/shared/components';
import { ChatService } from '@/features/chat';
import { ApiClient } from '@/infrastructure/api';

// ❌ INCORRECT
import { Button } from '../../../shared/components';
import { ChatService } from '../../features/chat';
```

### Consistent Path Aliases

Configure TypeScript path mapping:

```json
// tsconfig.json
{
  "compilerOptions": {
    "paths": {
      "@/features/*": ["src/features/*"],
      "@/shared/*": ["src/shared/*"], 
      "@/core/*": ["src/core/*"],
      "@/infrastructure/*": ["src/infrastructure/*"]
    }
  }
}
```

## Enforcement Strategies

### 1. ESLint Rules

```javascript
// .eslintrc.js
module.exports = {
  rules: {
    'import/no-restricted-paths': [
      'error',
      {
        zones: [
          // Features cannot import from other features
          {
            target: './src/features/**/*',
            from: './src/features/**/*',
            except: ['./src/features/*/index.ts'] // Only public APIs
          },
          // Shared cannot import from features
          {
            target: './src/shared/**/*',
            from: './src/features/**/*'
          },
          // Core cannot import from features or shared
          {
            target: './src/core/**/*',
            from: ['./src/features/**/*', './src/shared/**/*']
          },
          // Infrastructure cannot import from application layers
          {
            target: './src/infrastructure/**/*',
            from: [
              './src/features/**/*',
              './src/shared/**/*', 
              './src/core/**/*'
            ]
          }
        ]
      }
    ]
  }
};
```

### 2. Custom Dependency Checker

```typescript
// scripts/check-dependencies.ts
import { checkDependencyRules } from './dependency-checker';

const rules = {
  features: {
    canImportFrom: ['shared', 'core', 'infrastructure', 'external'],
    cannotImportFrom: ['features']
  },
  shared: {
    canImportFrom: ['core', 'infrastructure', 'external'],
    cannotImportFrom: ['features']
  },
  core: {
    canImportFrom: ['infrastructure', 'external'],
    cannotImportFrom: ['features', 'shared']
  },
  infrastructure: {
    canImportFrom: ['external'],
    cannotImportFrom: ['features', 'shared', 'core']
  }
};

checkDependencyRules(rules);
```

### 3. Build-Time Validation

```typescript
// vite.config.ts
export default defineConfig({
  plugins: [
    dependencyValidator({
      rules: dependencyRules,
      onViolation: 'error' // Fail the build
    })
  ]
});
```

## Testing Dependencies

### Test File Organization

Tests should mirror the source structure:

```
src/
├── features/
│   └── chat/
│       ├── components/
│       │   └── ChatInterface.tsx
│       └── __tests__/
│           └── ChatInterface.test.tsx
tests/
├── unit/
│   └── features/
│       └── chat/
├── integration/
│   └── features/
└── e2e/
    └── workflows/
```

### Test Import Rules

Tests can import from their own layer and below:

```typescript
// features/chat/__tests__/ChatInterface.test.tsx
// ✅ ALLOWED
import { ChatInterface } from '../components/ChatInterface';
import { render } from '@/shared/testing';
import { mockApiClient } from '@/infrastructure/api/__mocks__';

// ❌ FORBIDDEN
import { DocumentUpload } from '@/features/documents';
```

## Migration Guidelines

### Gradual Enforcement

When migrating existing code:

1. **Start with infrastructure**: Move external API clients first
2. **Move shared utilities**: Extract common functions and components
3. **Create feature boundaries**: Define public APIs for existing features
4. **Enforce rules gradually**: Add ESLint rules one layer at a time

### Legacy Code Handling

```typescript
// Temporary bridge during migration
// legacy/bridge.ts
export { OldChatComponent as ChatInterface } from '@/legacy/chat';

// features/chat/index.ts
export { ChatInterface } from '../legacy/bridge';
// TODO: Replace with new implementation
```

## Common Violations and Fixes

### 1. Feature Cross-Dependencies

**Problem**:
```typescript
// features/chat/services/ChatService.ts
import { DocumentService } from '@/features/documents'; // ❌
```

**Solution**:
```typescript
// features/chat/services/ChatService.ts
import { EventBus } from '@/shared/services';

// Communicate via events instead
EventBus.emit('chat:needsDocument', { documentId });
```

### 2. Circular Dependencies

**Problem**:
```typescript
// shared/components/Button.tsx
import { ChatTheme } from '@/features/chat'; // ❌

// features/chat/components/ChatInterface.tsx  
import { Button } from '@/shared/components'; // ❌ Creates cycle
```

**Solution**:
```typescript
// shared/types/theme.ts
export interface Theme {
  primary: string;
  secondary: string;
}

// shared/components/Button.tsx
import { Theme } from '@/shared/types';

// features/chat/components/ChatInterface.tsx
import { Button } from '@/shared/components';
```

### 3. Infrastructure Importing Business Logic

**Problem**:
```typescript
// infrastructure/api/ApiClient.ts
import { UserService } from '@/core/services'; // ❌
```

**Solution**:
```typescript
// infrastructure/api/ApiClient.ts
// Keep infrastructure focused on technical concerns only
class ApiClient {
  constructor(private config: ApiConfig) {}
  
  async request(config: RequestConfig) {
    // Pure HTTP functionality
  }
}

// core/services/UserService.ts
import { ApiClient } from '@/infrastructure/api';

class UserService {
  constructor(private apiClient: ApiClient) {}
  
  async getUser(id: string) {
    // Business logic using infrastructure
  }
}
```

## Summary

Following these dependency rules ensures:

- **Maintainability**: Clear boundaries make code easier to understand and modify
- **Testability**: Isolated layers can be tested independently  
- **Scalability**: New features can be added without affecting existing code
- **Team Collaboration**: Multiple developers can work on different features simultaneously
- **Code Reuse**: Shared modules prevent duplication across features

Remember: **Dependencies flow down, never up or sideways.**