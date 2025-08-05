# End-to-End Tests

This directory contains end-to-end tests that verify complete user workflows from the browser perspective.

## Structure
- Test files should be named `workflow-name.e2e.test.ts`
- Test complete user journeys and business workflows
- Verify cross-browser compatibility
- Test real user scenarios and edge cases

## Testing Scope
- Complete user workflows (login to task completion)
- Cross-browser testing
- Performance and accessibility testing
- Real API interactions (when backend is available)
- Mobile and responsive behavior

## Testing Framework
- **Playwright** or **Cypress**: Browser automation framework
- **@playwright/test**: Test runner and assertions
- **axe-core**: Accessibility testing

## Example Test Structure

### Playwright Example
```typescript
import { test, expect } from '@playwright/test';

test.describe('Document Intelligence Workflow', () => {
  test('should complete document analysis workflow', async ({ page }) => {
    // Navigate to application
    await page.goto('/');
    
    // Verify main dashboard loads
    await expect(page.getByText('CCH Axcess Intelligence')).toBeVisible();
    
    // Navigate to document extraction
    await page.getByText('Extracting Document Insights').click();
    
    // Verify extraction screen loads
    await expect(page.getByText('Document Analysis')).toBeVisible();
    
    // Upload document (when file upload is implemented)
    // await page.setInputFiles('input[type="file"]', 'test-document.pdf');
    
    // Verify analysis results
    // await expect(page.getByText('Analysis Complete')).toBeVisible();
  });

  test('should be accessible', async ({ page }) => {
    await page.goto('/');
    
    // Run accessibility scan
    const accessibilityScanResults = await page.accessibility.snapshot();
    expect(accessibilityScanResults).toBeTruthy();
    
    // Test keyboard navigation
    await page.keyboard.press('Tab');
    await expect(page.locator(':focus')).toBeVisible();
  });
});
```

### Cypress Example
```typescript
describe('Document Intelligence Workflow', () => {
  it('should complete document analysis workflow', () => {
    cy.visit('/');
    
    // Verify main dashboard
    cy.contains('CCH Axcess Intelligence').should('be.visible');
    
    // Navigate to extraction
    cy.contains('Extracting Document Insights').click();
    
    // Verify extraction screen
    cy.contains('Document Analysis').should('be.visible');
    
    // Test workflow completion
    // cy.get('[data-testid="upload-button"]').click();
    // cy.get('input[type="file"]').attachFile('test-document.pdf');
    // cy.contains('Analysis Complete').should('be.visible');
  });
});
```

## Configuration Files
- `playwright.config.ts` - Playwright configuration
- `cypress.config.ts` - Cypress configuration
- Test data and fixtures in `fixtures/` directory

## Running Tests
```bash
# Playwright
npm run test:e2e
npm run test:e2e:headed
npm run test:e2e:debug

# Cypress
npm run cypress:open
npm run cypress:run
npm run cypress:run:chrome
```

## Browser Support
- **Chromium**: Primary testing browser
- **Firefox**: Cross-browser compatibility
- **Safari/WebKit**: macOS compatibility
- **Mobile**: iOS Safari, Android Chrome

## Test Data Management
- Use test fixtures for consistent data
- Mock external APIs for reliable testing
- Clean up test data after each test run
- Use unique test identifiers to avoid conflicts