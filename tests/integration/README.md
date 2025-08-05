# Integration Tests

This directory contains integration tests that verify the interaction between multiple components, screens, or system parts.

## Structure
- Test files should be named `FeatureName.integration.test.tsx`
- Focus on testing workflows and component interactions
- Test data flow between components
- Verify screen-to-screen navigation
- Test API integration points (when backend is available)

## Testing Scope
- Screen-level component integration
- React Router navigation flows
- Context providers and state management
- Form submission workflows
- Error handling across components

## Testing Framework
- **Jest**: Test runner and assertion library
- **React Testing Library**: Component testing utilities
- **MSW (Mock Service Worker)**: API mocking for integration tests
- **React Router Testing**: Navigation testing utilities

## Example Test Structure
```typescript
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { App } from '../../src/App';

const renderWithRouter = (initialRoute = '/') => {
  window.history.pushState({}, 'Test page', initialRoute);
  return render(
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
};

describe('Document Workflow Integration', () => {
  it('should navigate from document screen to extraction screen', async () => {
    const user = userEvent.setup();
    
    renderWithRouter('/');
    
    // Interact with document screen
    await user.click(screen.getByText('Extract Document Insights'));
    
    // Verify navigation to extraction screen
    expect(screen.getByText('Document Analysis')).toBeInTheDocument();
  });
});
```

## Running Tests
```bash
npm run test:integration
npm run test:integration:watch
```