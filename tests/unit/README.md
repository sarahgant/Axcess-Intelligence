# Unit Tests

This directory contains unit tests for individual components, functions, and modules.

## Structure
- Test files should be named `ComponentName.test.tsx` or `functionName.test.ts`
- Each component should have comprehensive unit tests covering:
  - Rendering behavior
  - Props handling
  - Event handlers
  - Edge cases
  - Error conditions

## Testing Framework
- **Jest**: Test runner and assertion library
- **React Testing Library**: Component testing utilities
- **@testing-library/user-event**: User interaction simulation

## Example Test Structure
```typescript
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ComponentName } from './ComponentName';

describe('ComponentName', () => {
  it('should render correctly', () => {
    render(<ComponentName />);
    expect(screen.getByText('Expected Text')).toBeInTheDocument();
  });

  it('should handle user interactions', async () => {
    const user = userEvent.setup();
    const mockHandler = jest.fn();
    
    render(<ComponentName onClick={mockHandler} />);
    
    await user.click(screen.getByRole('button'));
    expect(mockHandler).toHaveBeenCalled();
  });
});
```

## Running Tests
```bash
npm run test:unit
npm run test:unit:watch
npm run test:unit:coverage
```