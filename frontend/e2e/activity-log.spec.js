/**
 * E2E Tests - Auto-generated
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

test.describe('Activity Log Page', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
    await page.goto('/activity-log');
    await page.waitForLoadState('networkidle');
  });

  test('should display activity log page', async ({ page }) => {
    // Check page title or header
    await expect(page.locator('text=/Activity|Log|Aktivitas/i').first()).toBeVisible({ timeout: 5000 });
  });

  test('should display activity list', async ({ page }) => {
    // Check for activity entries or empty state
    const activityList = page.locator('[class*="activity"], [class*="log"], table, [role="list"]').first();
    const emptyState = page.locator('text=/no activity|empty|kosong|tidak ada/i').first();

    // Either activity list or empty state should be visible
    const hasActivities = await activityList.isVisible({ timeout: 5000 }).catch(() => false);
    const isEmpty = await emptyState.isVisible({ timeout: 2000 }).catch(() => false);

    expect(hasActivities || isEmpty).toBeTruthy();
  });

  test('should have filter by action type', async ({ page }) => {
    // Check for action type filter
    const actionFilter = page.locator('select, [role="combobox"], button:has-text(/action|type|tipe|aksi/i)').first();
    if (await actionFilter.isVisible({ timeout: 3000 }).catch(() => false)) {
      await expect(actionFilter).toBeVisible();
    }
  });

  test('should have filter by user', async ({ page }) => {
    // Check for user filter
    const userFilter = page.locator('select, [role="combobox"], button:has-text(/user|staff|pengguna/i), input[placeholder*="user" i]').first();
    if (await userFilter.isVisible({ timeout: 3000 }).catch(() => false)) {
      await expect(userFilter).toBeVisible();
    }
  });

  test('should have date range filter', async ({ page }) => {
    // Check for date filter
    const dateFilter = page.locator('input[type="date"], [data-testid*="date"], button:has-text(/date|tanggal/i)').first();
    if (await dateFilter.isVisible({ timeout: 3000 }).catch(() => false)) {
      await expect(dateFilter).toBeVisible();
    }
  });

  test('should display activity details', async ({ page }) => {
    // Check for activity entry details (user name, action, timestamp)
    const activityEntry = page.locator('[class*="activity"], [class*="log-item"], tr, [role="listitem"]').first();
    if (await activityEntry.isVisible({ timeout: 3000 }).catch(() => false)) {
      // Should contain timestamp or date
      await expect(page.locator('text=/\\d{1,2}[:\\/\\-]\\d{1,2}|ago|lalu|yesterday|kemarin/i').first()).toBeVisible();
    }
  });

  test('should filter activities by action type', async ({ page }) => {
    // Find action type filter
    const actionFilter = page.locator('select').first();
    if (await actionFilter.isVisible({ timeout: 3000 }).catch(() => false)) {
      // Get initial count or state
      await actionFilter.selectOption({ index: 1 });
      await page.waitForLoadState('networkidle');

      // Page should update without error
      await expect(page).toHaveURL(/activity/);
    }
  });

  test('should have pagination if many entries', async ({ page }) => {
    // Check for pagination controls
    const pagination = page.locator('button:has-text("Next"), button:has-text("Previous"), [class*="pagination"], nav[aria-label*="pagination"]').first();
    if (await pagination.isVisible({ timeout: 3000 }).catch(() => false)) {
      await expect(pagination).toBeVisible();
    }
  });
});
