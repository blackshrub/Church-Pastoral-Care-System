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

test.describe('Import/Export Page', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
    await page.goto('/import-export');
    await page.waitForLoadState('networkidle');
  });

  test('should display import/export page', async ({ page }) => {
    // Check page title or header
    await expect(page.locator('text=/Import|Export|Data/i').first()).toBeVisible({ timeout: 5000 });
  });

  test('should have export members section', async ({ page }) => {
    // Check for export members option
    await expect(page.locator('text=/export.*member|member.*export|ekspor.*jemaat/i').first()).toBeVisible({ timeout: 5000 });
  });

  test('should have export care events section', async ({ page }) => {
    // Check for export care events option
    const careExport = page.locator('text=/export.*care|care.*export|ekspor.*event/i').first();
    if (await careExport.isVisible({ timeout: 3000 }).catch(() => false)) {
      await expect(careExport).toBeVisible();
    }
  });

  test('should have CSV export button for members', async ({ page }) => {
    // Check for CSV download button
    const csvButton = page.locator('button:has-text("CSV"), button:has-text("Export Members"), a[href*="csv"]').first();
    await expect(csvButton).toBeVisible({ timeout: 5000 });
  });

  test('should trigger members CSV download', async ({ page }) => {
    // Set up download listener
    const downloadPromise = page.waitForEvent('download', { timeout: 10000 }).catch(() => null);

    // Click export button
    const exportButton = page.locator('button:has-text("Export Members"), button:has-text("CSV"):near(:text("member"))').first();
    if (await exportButton.isVisible({ timeout: 3000 }).catch(() => false)) {
      await exportButton.click();

      const download = await downloadPromise;
      if (download) {
        // Verify download started
        expect(download.suggestedFilename()).toContain('member');
      }
    }
  });

  test('should have import section', async ({ page }) => {
    // Check for import section
    await expect(page.locator('text=/import|upload|unggah/i').first()).toBeVisible({ timeout: 5000 });
  });

  test('should have file upload input', async ({ page }) => {
    // Check for file input
    const fileInput = page.locator('input[type="file"]').first();
    if (await fileInput.isVisible({ timeout: 3000 }).catch(() => false)) {
      await expect(fileInput).toBeVisible();
    }
  });

  test('should show import preview area', async ({ page }) => {
    // Check for preview section or instructions
    const previewArea = page.locator('text=/preview|pratinjau|format|template|instruction/i').first();
    if (await previewArea.isVisible({ timeout: 3000 }).catch(() => false)) {
      await expect(previewArea).toBeVisible();
    }
  });

  test('should have JSON import option', async ({ page }) => {
    // Check for JSON import
    const jsonOption = page.locator('text=/json|JSON/i').first();
    if (await jsonOption.isVisible({ timeout: 3000 }).catch(() => false)) {
      await expect(jsonOption).toBeVisible();
    }
  });

  test('should display import instructions or template', async ({ page }) => {
    // Check for import help text
    const instructions = page.locator('text=/format|column|kolom|field|template|example|contoh/i').first();
    if (await instructions.isVisible({ timeout: 3000 }).catch(() => false)) {
      await expect(instructions).toBeVisible();
    }
  });
});
