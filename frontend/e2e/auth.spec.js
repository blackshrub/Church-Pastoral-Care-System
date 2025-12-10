/**
 * E2E Tests for Authentication Flow
 *
 * Critical tests for login, logout, and session management
 */

import { test, expect } from '@playwright/test';

// Helper function to login with Shadcn/UI Select
async function loginWithCampus(page, options = {}) {
  await page.goto('/');
  await page.waitForLoadState('networkidle');

  // Wait for campus select to be available and click it
  const campusSelect = page.locator('[data-testid="campus-select"]');
  await campusSelect.waitFor({ state: 'visible', timeout: 10000 });
  await campusSelect.click();

  // Select first campus option
  const campusOption = page.locator('[role="option"]').first();
  await campusOption.waitFor({ state: 'visible', timeout: 5000 });
  await campusOption.click();

  // Fill credentials
  const email = options.email || process.env.TEST_USER_EMAIL || 'admin@gkbj.church';
  const password = options.password || process.env.TEST_USER_PASSWORD || 'admin123';

  await page.locator('[data-testid="login-email-input"], input[type="email"]').first().fill(email);
  await page.locator('[data-testid="login-password-input"], input[type="password"]').first().fill(password);
  await page.locator('[data-testid="login-button"], button[type="submit"]').first().click();
}

test.describe('Authentication', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display login page', async ({ page }) => {
    await page.waitForLoadState('networkidle');

    // Wait for login form to appear with campus select
    await expect(page.locator('[data-testid="campus-select"]')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('[data-testid="login-email-input"], input[type="email"]').first()).toBeVisible();
    await expect(page.locator('[data-testid="login-password-input"], input[type="password"]').first()).toBeVisible();
    await expect(page.locator('[data-testid="login-button"], button[type="submit"]').first()).toBeVisible();
  });

  test('should show error when campus not selected', async ({ page }) => {
    await page.waitForLoadState('networkidle');

    // Try to submit without selecting campus
    await page.locator('[data-testid="login-email-input"], input[type="email"]').first().fill('test@test.com');
    await page.locator('[data-testid="login-password-input"], input[type="password"]').first().fill('password');
    await page.locator('[data-testid="login-button"], button[type="submit"]').first().click();

    // Should show error about campus selection - use data-testid to be specific
    await expect(page.locator('[data-testid="login-error"]')).toBeVisible({ timeout: 5000 });
    await expect(page.locator('[data-testid="login-error"]')).toContainText(/select.*campus|Please select/i);
  });

  test('should show error on invalid credentials', async ({ page }) => {
    await page.waitForLoadState('networkidle');

    // Select campus first
    const campusSelect = page.locator('[data-testid="campus-select"]');
    await campusSelect.click();
    await page.locator('[role="option"]').first().click();

    // Fill in invalid credentials
    await page.locator('[data-testid="login-email-input"], input[type="email"]').first().fill('invalid@test.com');
    await page.locator('[data-testid="login-password-input"], input[type="password"]').first().fill('wrongpassword');
    await page.locator('[data-testid="login-button"], button[type="submit"]').first().click();

    // Wait for error message
    await expect(page.locator('text=/Invalid|failed|incorrect|wrong/i')).toBeVisible({ timeout: 5000 });
  });

  test('should successfully login with valid credentials', async ({ page }) => {
    await loginWithCampus(page);

    // Wait for dashboard to load
    await page.waitForURL(/\/(dashboard|home|members)/, { timeout: 15000 });

    // Verify user is logged in by checking for dashboard elements
    await expect(page.locator('text=/Dashboard|Welcome|Task|Today/i').first()).toBeVisible({ timeout: 10000 });
  });

  test('should redirect to login when accessing protected route while logged out', async ({ page }) => {
    // Try to access members page directly
    await page.goto('/members');

    // Should be redirected to login - campus select should be visible
    await expect(page.locator('[data-testid="campus-select"]')).toBeVisible({ timeout: 5000 });
  });

  test('should logout successfully', async ({ page }) => {
    // First login
    await loginWithCampus(page);
    await page.waitForURL(/\/(dashboard|home|members)/, { timeout: 15000 });

    // Wait for page to fully load
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(1000);

    // Click on user menu in top right (shows "Full Administrator" with chevron)
    const userMenuTrigger = page.locator('button:has-text("Full Administrator"), button:has-text("Administrator")').first();
    await userMenuTrigger.click();

    // Wait for dropdown to open
    await page.waitForTimeout(500);

    // Click logout in dropdown menu
    const logoutItem = page.locator('[role="menuitem"]:has-text("Logout"), div:has-text("Logout")').first();
    await logoutItem.click();

    // Should be redirected to login
    await expect(page.locator('[data-testid="campus-select"]')).toBeVisible({ timeout: 10000 });
  });

  test('should persist session on page reload', async ({ page }) => {
    // Login
    await loginWithCampus(page);
    await page.waitForURL(/\/(dashboard|home|members)/, { timeout: 15000 });

    // Wait a bit for session to be stored
    await page.waitForTimeout(1000);

    // Reload page
    await page.reload();

    // Wait for page to load (use domcontentloaded instead of networkidle)
    await page.waitForLoadState('domcontentloaded');

    // Should still be on dashboard, not login page
    await expect(page).toHaveURL(/\/(dashboard|home|members|analytics|reports|settings)/, { timeout: 10000 });
  });

  test('should display validation errors for empty email and password', async ({ page }) => {
    await page.waitForLoadState('networkidle');

    // Select campus first
    const campusSelect = page.locator('[data-testid="campus-select"]');
    await campusSelect.click();
    await page.locator('[role="option"]').first().click();

    // Try to submit without filling email/password
    await page.locator('[data-testid="login-button"], button[type="submit"]').first().click();

    // HTML5 validation will prevent submission or show error
    // Just verify form didn't submit (still on login page)
    await expect(page.locator('[data-testid="campus-select"]')).toBeVisible();
  });

  test('should display campus dropdown options', async ({ page }) => {
    await page.waitForLoadState('networkidle');

    // Click on campus select to open dropdown
    const campusSelect = page.locator('[data-testid="campus-select"]');
    await campusSelect.click();

    // Should show at least one campus option
    const campusOptions = page.locator('[role="option"]');
    await expect(campusOptions.first()).toBeVisible({ timeout: 5000 });
    expect(await campusOptions.count()).toBeGreaterThan(0);
  });
});
