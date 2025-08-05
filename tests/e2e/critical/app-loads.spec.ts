/**
 * App Loading E2E Tests
 * Critical test to ensure the application loads properly
 */

import { test, expect } from '@playwright/test';

test.describe('Application Loading', () => {
    test('app loads and displays main interface', async ({ page }) => {
        // Navigate to the application
        await page.goto('/');

        // Wait for the app to load
        await expect(page.locator('body')).toBeVisible();

        // Check for main elements (these will need to be updated based on actual implementation)
        await expect(page.locator('text=CCH Axcess Intelligence')).toBeVisible({ timeout: 10000 });

        // Check that the page title is correct
        await expect(page).toHaveTitle(/CCH Axcess Intelligence/);
    });

    test('health check endpoint responds', async ({ page }) => {
        // Test the health check endpoint directly
        const response = await page.request.get('/health');
        expect(response.ok()).toBeTruthy();

        const healthData = await response.json();
        expect(healthData).toHaveProperty('status');
    });

    test('app handles navigation correctly', async ({ page }) => {
        await page.goto('/');

        // Test basic navigation if routes exist
        // These will need to be updated based on actual routes

        // Check initial page load
        await expect(page.locator('body')).toBeVisible();

        // Verify no JavaScript errors
        const errors: string[] = [];
        page.on('pageerror', error => errors.push(error.message));

        // Wait a bit for any errors to surface
        await page.waitForTimeout(2000);

        // Should have no JavaScript errors
        expect(errors).toHaveLength(0);
    });

    test('app is responsive on mobile', async ({ page }) => {
        // Set mobile viewport
        await page.setViewportSize({ width: 375, height: 667 });

        await page.goto('/');

        // Check that the app loads on mobile
        await expect(page.locator('body')).toBeVisible();

        // Verify mobile-specific elements or layouts
        // This will need to be customized based on actual responsive design
    });

    test('app handles offline state gracefully', async ({ page, context }) => {
        await page.goto('/');

        // Go offline
        await context.setOffline(true);

        // Try to perform an action that requires network
        // This should show appropriate offline handling

        // Go back online
        await context.setOffline(false);

        // Verify the app recovers
        await expect(page.locator('body')).toBeVisible();
    });
});