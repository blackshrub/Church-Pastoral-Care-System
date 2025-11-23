/**
 * E2E Tests for Authentication Flow
 *
 * Critical tests for login, logout, and session management
 */

const { test, expect } = require('@playwright/test');

test.describe('Authentication', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the app
    await page.goto('/');
  });

  test('should display login page', async ({ page }) => {
    // Wait for login form to appear
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });

  test('should show error on invalid credentials', async ({ page }) => {
    // Fill in invalid credentials
    await page.fill('input[type="email"]', 'invalid@test.com');
    await page.fill('input[type="password"]', 'wrongpassword');

    // Submit login form
    await page.click('button[type="submit"]');

    // Wait for error message
    await expect(page.locator('text=/Invalid credentials|Login failed/i')).toBeVisible({ timeout: 5000 });
  });

  test('should successfully login with valid credentials', async ({ page }) => {
    // Note: These credentials should match your test environment
    // You may need to adjust these or use environment variables
    const email = process.env.TEST_USER_EMAIL || 'admin@test.com';
    const password = process.env.TEST_USER_PASSWORD || 'testpass123';

    // Fill in credentials
    await page.fill('input[type="email"]', email);
    await page.fill('input[type="password"]', password);

    // Submit login form
    await page.click('button[type="submit"]');

    // Wait for dashboard to load
    await expect(page).toHaveURL(/\/(dashboard|home)/, { timeout: 10000 });

    // Verify user is logged in by checking for dashboard elements
    await expect(page.locator('text=/Dashboard|Welcome/i')).toBeVisible({ timeout: 10000 });
  });

  test('should redirect to login when accessing protected route while logged out', async ({ page }) => {
    // Try to access members page directly
    await page.goto('/members');

    // Should be redirected to login
    await expect(page).toHaveURL(/\/(login|auth)/, { timeout: 5000 });
  });

  test('should logout successfully', async ({ page }) => {
    // First login
    const email = process.env.TEST_USER_EMAIL || 'admin@test.com';
    const password = process.env.TEST_USER_PASSWORD || 'testpass123';

    await page.fill('input[type="email"]', email);
    await page.fill('input[type="password"]', password);
    await page.click('button[type="submit"]');

    // Wait for dashboard
    await expect(page).toHaveURL(/\/(dashboard|home)/, { timeout: 10000 });

    // Find and click logout button (may be in a dropdown or menu)
    // This selector may need adjustment based on your actual UI
    const logoutButton = page.locator('button:has-text("Logout"), button:has-text("Sign Out")').first();

    if (await logoutButton.isVisible({ timeout: 2000 }).catch(() => false)) {
      await logoutButton.click();
    } else {
      // If not visible, try opening user menu first
      const userMenu = page.locator('[data-testid="user-menu"], button:has([data-testid="user-avatar"])').first();
      await userMenu.click();
      await page.locator('button:has-text("Logout"), button:has-text("Sign Out")').click();
    }

    // Should be redirected to login
    await expect(page).toHaveURL(/\/(login|auth|)$/, { timeout: 5000 });
  });

  test('should persist session on page reload', async ({ page }) => {
    // Login
    const email = process.env.TEST_USER_EMAIL || 'admin@test.com';
    const password = process.env.TEST_USER_PASSWORD || 'testpass123';

    await page.fill('input[type="email"]', email);
    await page.fill('input[type="password"]', password);
    await page.click('button[type="submit"]');

    // Wait for dashboard
    await expect(page).toHaveURL(/\/(dashboard|home)/, { timeout: 10000 });

    // Reload page
    await page.reload();

    // Should still be logged in
    await expect(page).toHaveURL(/\/(dashboard|home)/, { timeout: 5000 });
    await expect(page.locator('text=/Dashboard|Welcome/i')).toBeVisible();
  });

  test('should display validation errors for empty fields', async ({ page }) => {
    // Try to submit without filling fields
    await page.click('button[type="submit"]');

    // Should show validation errors
    // The exact error message depends on your validation implementation
    await expect(page.locator('text=/required|cannot be empty/i')).toBeVisible({ timeout: 2000 });
  });

  test('should toggle password visibility', async ({ page }) => {
    const passwordInput = page.locator('input[type="password"]');
    const toggleButton = page.locator('button[aria-label*="password"], button:has([data-testid="toggle-password"])');

    // Password should initially be hidden
    await expect(passwordInput).toHaveAttribute('type', 'password');

    // Click toggle button if it exists
    if (await toggleButton.isVisible({ timeout: 1000 }).catch(() => false)) {
      await toggleButton.click();

      // Password should now be visible
      await expect(page.locator('input[type="text"]').first()).toBeVisible();
    }
  });
});
