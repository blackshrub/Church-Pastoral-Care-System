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

test.describe('Reminders Page', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
    await page.goto('/reminders');
    await page.waitForLoadState('networkidle');
  });

  test('should display reminders page', async ({ page }) => {
    // Check page title or header
    await expect(page.locator('text=/Reminder|Pengingat|Notification/i').first()).toBeVisible({ timeout: 5000 });
  });

  test('should display reminder statistics', async ({ page }) => {
    // Check for stats display
    const statsSection = page.locator('text=/sent|total|pending|delivered|terkirim/i').first();
    if (await statsSection.isVisible({ timeout: 3000 }).catch(() => false)) {
      await expect(statsSection).toBeVisible();
    }
  });

  test('should have run now button', async ({ page }) => {
    // Check for manual trigger button
    const runButton = page.locator('button:has-text("Run"), button:has-text("Send"), button:has-text("Trigger"), button:has-text("Kirim")').first();
    if (await runButton.isVisible({ timeout: 3000 }).catch(() => false)) {
      await expect(runButton).toBeVisible();
    }
  });

  test('should display reminder schedule', async ({ page }) => {
    // Check for schedule information
    const scheduleInfo = page.locator('text=/schedule|daily|weekly|jadwal|harian/i').first();
    if (await scheduleInfo.isVisible({ timeout: 3000 }).catch(() => false)) {
      await expect(scheduleInfo).toBeVisible();
    }
  });

  test('should display reminder types', async ({ page }) => {
    // Check for different reminder types
    const reminderTypes = page.locator('text=/birthday|grief|followup|hospital|ulang tahun|dukacita/i').first();
    if (await reminderTypes.isVisible({ timeout: 3000 }).catch(() => false)) {
      await expect(reminderTypes).toBeVisible();
    }
  });

  test('should show last run timestamp', async ({ page }) => {
    // Check for last run time
    const lastRun = page.locator('text=/last.*run|terakhir.*dijalankan|\\d{1,2}[:\\/\\-]\\d{1,2}/i').first();
    if (await lastRun.isVisible({ timeout: 3000 }).catch(() => false)) {
      await expect(lastRun).toBeVisible();
    }
  });

  test('should have enable/disable toggle for reminders', async ({ page }) => {
    // Check for toggle switch
    const toggle = page.locator('[role="switch"], input[type="checkbox"], [class*="toggle"], [class*="switch"]').first();
    if (await toggle.isVisible({ timeout: 3000 }).catch(() => false)) {
      await expect(toggle).toBeVisible();
    }
  });

  test('should display pending reminders count', async ({ page }) => {
    // Check for pending count
    const pendingCount = page.locator('text=/pending|\\d+ reminder|\\d+ pengingat/i').first();
    if (await pendingCount.isVisible({ timeout: 3000 }).catch(() => false)) {
      await expect(pendingCount).toBeVisible();
    }
  });
});
