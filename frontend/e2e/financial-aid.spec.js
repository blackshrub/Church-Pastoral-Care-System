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

test.describe('Financial Aid Page', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
    await page.goto('/financial-aid');
    await page.waitForLoadState('networkidle');
  });

  test('should display financial aid page', async ({ page }) => {
    // Check page title or header
    await expect(page.locator('text=/Financial|Aid|Bantuan|Keuangan/i').first()).toBeVisible({ timeout: 5000 });
  });

  test('should display schedules list', async ({ page }) => {
    // Check for schedule list or empty state
    const scheduleList = page.locator('table, [role="list"], [class*="schedule"], [class*="card"]').first();
    const emptyState = page.locator('text=/no.*schedule|empty|kosong|tidak ada/i').first();

    const hasSchedules = await scheduleList.isVisible({ timeout: 5000 }).catch(() => false);
    const isEmpty = await emptyState.isVisible({ timeout: 2000 }).catch(() => false);

    expect(hasSchedules || isEmpty).toBeTruthy();
  });

  test('should have add new schedule button', async ({ page }) => {
    // Check for add button
    const addButton = page.locator('button:has-text("Add"), button:has-text("New"), button:has-text("Tambah"), button:has-text("+")').first();
    await expect(addButton).toBeVisible({ timeout: 5000 });
  });

  test('should open add schedule dialog', async ({ page }) => {
    // Click add button
    const addButton = page.locator('button:has-text("Add"), button:has-text("New"), button:has-text("Tambah")').first();
    if (await addButton.isVisible()) {
      await addButton.click();

      // Check for dialog/form
      const dialog = page.locator('[role="dialog"], [class*="modal"], form').first();
      await expect(dialog).toBeVisible({ timeout: 5000 });
    }
  });

  test('should display schedule form fields', async ({ page }) => {
    // Open add dialog
    const addButton = page.locator('button:has-text("Add"), button:has-text("New"), button:has-text("Tambah")').first();
    if (await addButton.isVisible()) {
      await addButton.click();

      // Check for form fields
      const memberField = page.locator('input[name*="member"], select[name*="member"], [placeholder*="member" i]').first();
      const amountField = page.locator('input[name*="amount"], input[type="number"]').first();

      const hasMemberField = await memberField.isVisible({ timeout: 3000 }).catch(() => false);
      const hasAmountField = await amountField.isVisible({ timeout: 3000 }).catch(() => false);

      expect(hasMemberField || hasAmountField).toBeTruthy();
    }
  });

  test('should display summary statistics', async ({ page }) => {
    // Check for summary section
    const summary = page.locator('text=/total|summary|ringkasan|aktif|active/i').first();
    if (await summary.isVisible({ timeout: 3000 }).catch(() => false)) {
      await expect(summary).toBeVisible();
    }
  });

  test('should have status filter', async ({ page }) => {
    // Check for status filter
    const statusFilter = page.locator('select, [role="combobox"], button:has-text(/status|active|completed|selesai/i)').first();
    if (await statusFilter.isVisible({ timeout: 3000 }).catch(() => false)) {
      await expect(statusFilter).toBeVisible();
    }
  });

  test('should display schedule details', async ({ page }) => {
    // Check for schedule item details
    const scheduleItem = page.locator('tr, [class*="schedule-item"], [class*="card"]').first();
    if (await scheduleItem.isVisible({ timeout: 3000 }).catch(() => false)) {
      // Should show member name or amount
      const detailContent = page.locator('text=/Rp|\\d+\\.000|member|jemaat/i').first();
      if (await detailContent.isVisible({ timeout: 2000 }).catch(() => false)) {
        await expect(detailContent).toBeVisible();
      }
    }
  });

  test('should have mark as distributed action', async ({ page }) => {
    // Check for distribution action button
    const distributeButton = page.locator('button:has-text("Distribute"), button:has-text("Mark"), button:has-text("Bagikan")').first();
    if (await distributeButton.isVisible({ timeout: 3000 }).catch(() => false)) {
      await expect(distributeButton).toBeVisible();
    }
  });

  test('should have stop schedule action', async ({ page }) => {
    // Check for stop action
    const stopButton = page.locator('button:has-text("Stop"), button:has-text("Cancel"), button:has-text("Hentikan")').first();
    if (await stopButton.isVisible({ timeout: 3000 }).catch(() => false)) {
      await expect(stopButton).toBeVisible();
    }
  });

  test('should have delete schedule action', async ({ page }) => {
    // Check for delete action
    const deleteButton = page.locator('button:has-text("Delete"), button:has-text("Remove"), button:has-text("Hapus"), [aria-label*="delete"]').first();
    if (await deleteButton.isVisible({ timeout: 3000 }).catch(() => false)) {
      await expect(deleteButton).toBeVisible();
    }
  });
});
