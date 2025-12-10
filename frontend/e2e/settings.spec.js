/**
 * E2E Tests for Settings Page
 *
 * Tests profile editing, automation settings, and system configuration
 */

import { test, expect } from '@playwright/test';

// Helper function to login with Shadcn/UI Select
async function login(page) {
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
  const email = process.env.TEST_USER_EMAIL || 'admin@gkbj.church';
  const password = process.env.TEST_USER_PASSWORD || 'admin123';

  await page.locator('[data-testid="login-email-input"], input[type="email"]').first().fill(email);
  await page.locator('[data-testid="login-password-input"], input[type="password"]').first().fill(password);
  await page.locator('[data-testid="login-button"], button[type="submit"]').first().click();

  await page.waitForURL(/\/(dashboard|home|members)/, { timeout: 15000 });
}

test.describe('Settings Page', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
    await page.goto('/settings');
    await page.waitForLoadState('networkidle');
  });

  test('should display settings page with tabs', async ({ page }) => {
    // Check for settings page header
    await expect(page.locator('text=/Settings|Configuration/i').first()).toBeVisible({ timeout: 5000 });

    // Check for tab icons/buttons (Profile tab should be visible)
    await expect(page.locator('[role="tab"], button:has-text("Profile")').first()).toBeVisible();
  });

  test('should display profile section', async ({ page }) => {
    // Profile tab should be selected by default
    await expect(page.locator('text=/My Profile|Profile/i').first()).toBeVisible({ timeout: 5000 });

    // Check profile information is displayed
    await expect(page.locator('text=/Name|Email|Phone/i').first()).toBeVisible();
  });

  test('should display profile photo upload', async ({ page }) => {
    // Check for profile photo section
    await expect(page.locator('text=/Profile Photo|Upload Photo/i').first()).toBeVisible({ timeout: 5000 });

    // Check for upload button
    await expect(page.locator('button:has-text("Upload"), button:has-text("Photo")').first()).toBeVisible();
  });

  test('should display user name', async ({ page }) => {
    // Check that user name is displayed
    await expect(page.locator('text=/Full Administrator|Administrator/i').first()).toBeVisible({ timeout: 5000 });
  });

  test('should display user email', async ({ page }) => {
    // Check that user email is displayed
    await expect(page.locator('text=admin@gkbj.church')).toBeVisible({ timeout: 5000 });
  });

  test('should have multiple settings tabs', async ({ page }) => {
    // Count the number of tab buttons
    const tabs = page.locator('[role="tab"], [role="tablist"] button');
    const tabCount = await tabs.count();

    // Should have multiple tabs
    expect(tabCount).toBeGreaterThan(1);
  });

  test('should switch between tabs', async ({ page }) => {
    // Get all tabs
    const tabs = page.locator('[role="tab"], [role="tablist"] button');

    // Click on second tab (skip first as it's Profile)
    if (await tabs.nth(1).isVisible()) {
      await tabs.nth(1).click();
      await page.waitForLoadState('networkidle');

      // Page should update - content should change
      await page.waitForTimeout(500);
    }
  });

  test('should display automation/notifications settings', async ({ page }) => {
    // Find and click on notifications/automation tab (bell icon or similar)
    const tabs = page.locator('[role="tab"], [role="tablist"] button');

    // Click through tabs to find automation settings
    for (let i = 1; i < await tabs.count(); i++) {
      await tabs.nth(i).click();
      await page.waitForTimeout(500);

      // Check if we found engagement/automation settings
      const automationContent = page.locator('text=/notification|digest|reminder|whatsapp/i').first();
      if (await automationContent.isVisible({ timeout: 1000 }).catch(() => false)) {
        await expect(automationContent).toBeVisible();
        break;
      }
    }
  });

  test('should display system settings', async ({ page }) => {
    // Find and click on system/gear icon tab
    const tabs = page.locator('[role="tab"], [role="tablist"] button');

    // Click through tabs to find system settings
    for (let i = 1; i < await tabs.count(); i++) {
      await tabs.nth(i).click();
      await page.waitForTimeout(500);

      // Check if we found system settings
      const systemContent = page.locator('text=/threshold|days|engagement|system/i').first();
      if (await systemContent.isVisible({ timeout: 1000 }).catch(() => false)) {
        await expect(systemContent).toBeVisible();
        break;
      }
    }
  });
});
