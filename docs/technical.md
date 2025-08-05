# CCH Axcess Intelligence Vibed - Technical Documentation

## Project Overview
CCH Axcess Intelligence Vibed is a React-based web application designed to provide AI-powered document intelligence and tax research capabilities. The application serves as an interface for CCH Axcess users to conduct tax research, extract document insights, and navigate various tax-related workflows.

## Technology Stack

### Core Technologies
- **React 18.2.0**: Frontend framework with functional components and hooks
- **TypeScript**: Type-safe JavaScript development
- **Vite 6.0.4**: Modern build tool and development server
- **React Router DOM 6.8.1**: Client-side routing
- **Tailwind CSS 3.4.16**: Utility-first CSS framework

### UI Component Library
- **Radix UI**: Headless, accessible UI primitives
  - Accordion, Dialog, ScrollArea, Select, Separator, Tabs
- **Lucide React**: Modern icon library
- **Tailwind Merge**: Utility for merging Tailwind classes
- **Class Variance Authority**: For component variants

### Development Tools
- **ESBuild**: Fast JavaScript bundler
- **WK Design System Integration**: Complete icon system with comprehensive mappings
- **Zod**: Runtime type validation and schema definition
- **Configuration Management**: Type-safe environment variable handling

## Architecture Patterns

### Component Structure
The application follows a **feature-based architecture** with the following patterns:

1. **Screen-Based Organization**: Each major application view is a "screen"
2. **Section-Based Composition**: Screens are composed of logical sections
3. **Reusable UI Components**: Shared components in `src/components/ui/`
4. **Centralized Routing**: All routes defined in `src/App.tsx`

### File Organization
```
src/
├── components/ui/          # Reusable UI components (Radix + custom)
├── screens/               # Feature-based screen components
│   ├── {ScreenName}/      # Each screen in its own directory
│   │   ├── sections/      # Screen-specific sections
│   │   └── index.ts       # Barrel exports
├── config/                # Configuration management system
│   ├── index.ts           # Main configuration exports
│   ├── loader.ts          # ConfigLoader class
│   ├── schema.ts          # Zod validation schemas
│   ├── defaults.ts        # Default configuration values
│   └── env-helper.ts      # Environment utilities
├── prompts/               # Prompt template management
│   ├── index.ts           # Main prompt exports
│   ├── registry.ts        # PromptRegistry class
│   ├── builder.ts         # PromptBuilder and utilities
│   ├── types.ts           # Type definitions
│   └── templates/         # Organized prompt templates
│       ├── system/        # System prompts
│       ├── rag/           # RAG search prompts
│       └── document/      # Document analysis prompts
├── core/                  # Core application services
│   └── providers/         # AI provider implementations
├── lib/                   # Utilities and helpers
└── App.tsx               # Main router and app entry
```

### Component Design Principles

#### 1. Functional Components with TypeScript
```typescript
export const ComponentName = (): JSX.Element => {
  // Component logic
  return <div>...</div>;
};
```

#### 2. Section-Based Screen Composition
```typescript
export const ScreenName = (): JSX.Element => {
  return (
    <div className="screen-container">
      <NavigationSection />
      <MainContentSection />
    </div>
  );
};
```

#### 3. Props Interface Definition
```typescript
interface ComponentProps {
  title: string;
  items: Array<{id: string; name: string;}>;
  onSelect?: (id: string) => void;
}
```

## Routing Configuration

### Current Routes
- `/` and `/*`: Default Document screen
- `/document-intelligenceu58-home-screen`: Document intelligence home
- `/extracting-document-insights-2`: Document extraction workflow
- `/conducting-tax-research`: Tax research interface
- `/extracting-document-insights-3b`: Advanced document insights

### Routing Patterns
- Uses React Router's `createBrowserRouter`
- Catch-all route (`/*`) defaults to Document screen
- Descriptive route paths matching user workflows

## Styling and Design System

### Tailwind CSS Configuration
- Custom design tokens and utilities
- Responsive design with mobile-first approach
- Dark mode support (configurable)
- Animation utilities via `tailwindcss-animate`
- WK Design System icons replacing external dependencies

### Component Styling Patterns
```typescript
// Using clsx and tailwind-merge for conditional styles
const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)
```

## Screen Functionality Overview

### 1. Document Screen (`/`)
**Purpose**: Main dashboard and document intelligence hub
- Search interface for document queries
- Suggestion cards for common tasks
- Recent activity tracking
- Navigation to specialized workflows

### 2. ExtractingDocument (`/extracting-document-insights-2`)
**Purpose**: Document upload and initial analysis
- File upload interface
- Document processing status
- Preview and validation tools

### 3. ExtractingDocumentScreen (`/extracting-document-insights-3b`)
**Purpose**: Advanced document insights and analysis
- Contextual information display
- Document library management
- AI-powered insights extraction

### 4. ConductingTax (`/conducting-tax-research`)
**Purpose**: Tax research and AI assistance
- AI content generation for tax research
- Integration with CCH AnswerConnect
- Research history and bookmarking

## Configuration Management

### Centralized Configuration System
The application uses a robust, type-safe configuration system that manages:
- **AI Provider Settings**: API keys, models, and endpoints for Anthropic and OpenAI
- **Feature Flags**: Enable/disable functionality across the application
- **Security Settings**: Encryption keys, CORS configuration, rate limiting
- **Performance Options**: Caching, concurrent requests, timeouts

### Configuration Loading Strategy
```typescript
// Initialize configuration on app startup
import { initializeConfig, getConfig } from './src/config';

const config = await initializeConfig();
```

**Loading Priority**:
1. Environment variables (highest priority)
2. Local config.json file
3. Default configuration values

### Configuration Schema Validation
All configuration is validated using Zod schemas:
```typescript
export const AppConfigSchema = z.object({
  providers: ProviderConfigSchema,
  features: FeatureConfigSchema,
  security: SecurityConfigSchema,
  performance: PerformanceConfigSchema,
  environment: z.enum(['development', 'staging', 'production']),
  logLevel: z.enum(['debug', 'info', 'warn', 'error'])
});
```

## Prompt Management System

### Centralized Prompt Templates
The application includes a comprehensive prompt management system:
- **Template Registry**: Centralized storage for all prompt templates
- **Variable Interpolation**: Type-safe variable substitution
- **Model-Specific Variants**: Different prompts for Anthropic vs OpenAI
- **Compilation Caching**: Performance optimization for repeated use
- **Usage Analytics**: Track prompt performance and usage patterns

### Prompt Template Structure
```typescript
interface PromptTemplate {
  id: string;
  name: string;
  category: 'system' | 'user' | 'rag' | 'document' | 'chat';
  template: string;
  variables: string[];
  modelSpecific?: {
    anthropic?: string;
    openai?: string;
  };
  validation?: PromptValidation;
  examples?: PromptExample[];
}
```

### Example Usage
```typescript
// Register a prompt
registry.register(
  PromptBuilder.create()
    .id('tax.research.basic')
    .name('Basic Tax Research')
    .category('rag')
    .template('Research {{query}} using context: {{context}}')
    .required('query', 'context')
    .build()
);

// Compile and use
const compiled = registry.compile('tax.research.basic', {
  query: 'business meal deductions',
  context: 'IRS Publication 463'
});
```

## State Management Strategy

### Current Approach
- **Component-level state**: Using React's `useState` and `useEffect`
- **Props drilling**: For simple parent-child communication
- **Configuration state**: Managed through centralized config system
- **No global state manager**: Application complexity doesn't currently require Redux/Zustand

### Recommended Patterns for Future
1. **Context API**: For app-wide settings (theme, user preferences)
2. **Custom Hooks**: For reusable stateful logic
3. **Reducer Pattern**: For complex state transitions

## Performance Considerations

### Current Optimizations
- **Vite's fast HMR**: Near-instant development updates
- **Tree Shaking**: Automatic dead code elimination
- **Code Splitting**: Router-based lazy loading potential

### Recommended Improvements
1. **React.memo**: For expensive re-renders
2. **useMemo/useCallback**: For expensive calculations
3. **Lazy Loading**: Route-based code splitting
4. **Image Optimization**: For document thumbnails and assets

## Development Standards

### TypeScript Configuration
- Strict mode enabled
- Path mapping for clean imports
- Consistent interface naming (PascalCase)

### Code Style Guidelines
1. **Functional Components**: Prefer over class components
2. **Named Exports**: Use named exports for components
3. **Interface Over Type**: Use `interface` for object shapes
4. **Consistent Naming**:
   - Components: PascalCase
   - Files: PascalCase for components, camelCase for utilities
   - Props: camelCase with descriptive names

### Testing Strategy (Recommended)
1. **Unit Tests**: Component logic and utilities
2. **Integration Tests**: Screen-level workflows
3. **E2E Tests**: Critical user journeys
4. **Accessibility Tests**: WCAG compliance

## Build and Deployment

### Development
```bash
npm run dev  # Start development server with HMR
```

### Production
```bash
npm run build  # Build optimized production bundle
```

### Build Outputs
- **Static Assets**: Optimized and fingerprinted
- **Bundle Splitting**: Automatic vendor chunking
- **Modern JS**: ES modules for modern browsers

## Integration Points

### CCH Axcess Integration
- **Authentication**: Integration with CCH user system (planned)
- **Document APIs**: CCH document processing services
- **Tax Research**: CCH AnswerConnect integration

### External Services
- **AI Processing**: Document analysis and content generation
- **File Storage**: Document upload and management
- **Analytics**: User interaction tracking (planned)

## Security Considerations

### Current Implementation
- **CSP Headers**: Content Security Policy (configure in deployment)
- **HTTPS**: Enforce secure connections
- **Input Validation**: Client-side validation (server validation required)

### Recommended Additions
1. **Authentication**: JWT or session-based auth
2. **Authorization**: Role-based access control
3. **Data Encryption**: Sensitive document protection
4. **Audit Logging**: User action tracking

## Accessibility Standards

### Current Implementation
- **Radix UI**: Inherently accessible components
- **Semantic HTML**: Proper element usage
- **Keyboard Navigation**: Tab order and focus management

### WCAG 2.1 Compliance Goals
- **AA Level**: Minimum compliance target
- **Color Contrast**: 4.5:1 minimum ratio
- **Screen Reader**: Full compatibility
- **Keyboard Only**: Complete navigation support

## Future Architecture Considerations

### Scalability Improvements
1. **Micro-Frontend**: Split into domain-specific apps
2. **API Layer**: GraphQL or REST API abstraction
3. **State Management**: Redux Toolkit or Zustand for complex state
4. **Real-time Features**: WebSocket integration for live updates

### Performance Enhancements
1. **Service Workers**: Offline capability and caching
2. **Progressive Web App**: Native app-like experience
3. **CDN Integration**: Global content delivery
4. **Bundle Optimization**: Advanced chunking strategies

### Monitoring and Observability
1. **Error Tracking**: Sentry or similar service
2. **Performance Monitoring**: Web Vitals tracking
3. **User Analytics**: Behavioral insights
4. **Health Checks**: Application monitoring