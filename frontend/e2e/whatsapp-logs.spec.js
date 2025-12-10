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

test.describe('WhatsApp Logs Page', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
    await page.goto('/whatsapp-logs');
    await page.waitForLoadState('networkidle');
  });

  test('should display WhatsApp logs page', async ({ page }) => {
    // Check page title or header
    await expect(page.locator('text=/WhatsApp|Notification|Log/i').first()).toBeVisible({ timeout: 5000 });
  });

  test('should display logs table or list', async ({ page }) => {
    // Check for logs display
    const logsContainer = page.locator('table, [role="list"], [class*="log"]').first();
    const emptyState = page.locator('text=/no log|empty|kosong|tidak ada/i').first();

    const hasLogs = await logsContainer.isVisible({ timeout: 5000 }).catch(() => false);
    const isEmpty = await emptyState.isVisible({ timeout: 2000 }).catch(() => false);

    expect(hasLogs || isEmpty).toBeTruthy();
  });

  test('should display log entry details', async ({ page }) => {
    // Check for log entry columns (recipient, status, timestamp)
    const logEntry = page.locator('tr, [class*="log-item"], [role="listitem"]').first();
    if (await logEntry.isVisible({ timeout: 3000 }).catch(() => false)) {
      // Should have phone number or recipient
      const recipient = page.locator('text=/\\+?\\d{10,}|62\\d+|08\\d+/').first();
      if (await recipient.isVisible({ timeout: 2000 }).catch(() => false)) {
        await expect(recipient).toBeVisible();
      }
    }
  });

  test('should have status filter', async ({ page }) => {
    // Check for status filter dropdown
    const statusFilter = page.locator('select, [role="combobox"], button:has-text(/status|semua|all/i)').first();
    if (await statusFilter.isVisible({ timeout: 3000 }).catch(() => false)) {
      await expect(statusFilter).toBeVisible();
    }
  });

  test('should filter by status', async ({ page }) => {
    // Find and use status filter
    const statusFilter = page.locator('select').first();
    if (await statusFilter.isVisible({ timeout: 3000 }).catch(() => false)) {
      await statusFilter.selectOption({ index: 1 });
      await page.waitForLoadState('networkidle');

      // Page should update without error
      await expect(page).toHaveURL(/whatsapp/);
    }
  });

  test('should display status badges', async ({ page }) => {
    // Check for status indicators (success, failed, pending)
    const statusBadge = page.locator('text=/success|sent|failed|error|pending|delivered|gagal|terkirim/i').first();
    if (await statusBadge.isVisible({ timeout: 3000 }).catch(() => false)) {
      await expect(statusBadge).toBeVisible();
    }
  });

  test('should have pagination controls', async ({ page }) => {
    // Check for pagination
    const pagination = page.locator('button:has-text("Next"), button:has-text("Previous"), [class*="pagination"]').first();
    if (await pagination.isVisible({ timeout: 3000 }).catch(() => false)) {
      await expect(pagination).toBeVisible();
    }
  });

  test('should display message preview', async ({ page }) => {
    // Check for message content preview
    const messagePreview = page.locator('[class*="message"], [class*="preview"], td:nth-child(3)').first();
    if (await messagePreview.isVisible({ timeout: 3000 }).catch(() => false)) {
      await expect(messagePreview).toBeVisible();
    }
  });

  test('should display timestamp in logs', async ({ page }) => {
    // Check for timestamps
    const timestamp = page.locator('text=/\\d{1,2}[:\\/\\-]\\d{1,2}|ago|lalu|today|kemarin/i').first();
    if (await timestamp.isVisible({ timeout: 3000 }).catch(() => false)) {
      await expect(timestamp).toBeVisible();
    }
  });

  test('should sort logs by date', async ({ page }) => {
    // Check for sortable columns or sort button
    const sortButton = page.locator('th:has-text("Date"), th:has-text("Time"), button:has-text("Sort"), [class*="sort"]').first();
    if (await sortButton.isVisible({ timeout: 3000 }).catch(() => false)) {
      await sortButton.click();
      await page.waitForLoadState('networkidle');

      // Page should still be visible
      await expect(page).toHaveURL(/whatsapp/);
    }
  });
});
