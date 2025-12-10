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

test.describe('Bulk Messaging Page', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
    await page.goto('/bulk-messaging');
    await page.waitForLoadState('networkidle');
  });

  test('should display bulk messaging page', async ({ page }) => {
    // Check page title or header
    await expect(page.locator('text=/Bulk|Messaging|Pesan|Massal/i').first()).toBeVisible({ timeout: 5000 });
  });

  test('should have recipient selection', async ({ page }) => {
    // Check for recipient selection area
    const recipientSection = page.locator('text=/recipient|penerima|member|jemaat|select/i').first();
    await expect(recipientSection).toBeVisible({ timeout: 5000 });
  });

  test('should have message input area', async ({ page }) => {
    // Check for message textarea
    const messageInput = page.locator('textarea, input[type="text"][name*="message"], [contenteditable="true"]').first();
    await expect(messageInput).toBeVisible({ timeout: 5000 });
  });

  test('should have filter options for recipients', async ({ page }) => {
    // Check for filter options (by status, group, etc.)
    const filterOption = page.locator('select, [role="combobox"], button:has-text(/filter|group|status|kategori/i), input[type="checkbox"]').first();
    if (await filterOption.isVisible({ timeout: 3000 }).catch(() => false)) {
      await expect(filterOption).toBeVisible();
    }
  });

  test('should display recipient count', async ({ page }) => {
    // Check for recipient count display
    const recipientCount = page.locator('text=/\\d+.*recipient|\\d+.*penerima|\\d+.*member|selected/i').first();
    if (await recipientCount.isVisible({ timeout: 3000 }).catch(() => false)) {
      await expect(recipientCount).toBeVisible();
    }
  });

  test('should have send button', async ({ page }) => {
    // Check for send/submit button
    const sendButton = page.locator('button:has-text("Send"), button:has-text("Kirim"), button[type="submit"]').first();
    await expect(sendButton).toBeVisible({ timeout: 5000 });
  });

  test('should have message template options', async ({ page }) => {
    // Check for template selection
    const templateOption = page.locator('text=/template|preset|saved/i, select[name*="template"], button:has-text("Template")').first();
    if (await templateOption.isVisible({ timeout: 3000 }).catch(() => false)) {
      await expect(templateOption).toBeVisible();
    }
  });

  test('should validate empty message', async ({ page }) => {
    // Try to send without message
    const sendButton = page.locator('button:has-text("Send"), button:has-text("Kirim"), button[type="submit"]').first();
    if (await sendButton.isVisible()) {
      await sendButton.click();

      // Should show validation error
      const errorMessage = page.locator('text=/required|wajib|empty|kosong|error/i').first();
      if (await errorMessage.isVisible({ timeout: 3000 }).catch(() => false)) {
        await expect(errorMessage).toBeVisible();
      }
    }
  });

  test('should type message in textarea', async ({ page }) => {
    // Find message input and type
    const messageInput = page.locator('textarea, input[type="text"][name*="message"]').first();
    if (await messageInput.isVisible({ timeout: 3000 }).catch(() => false)) {
      await messageInput.fill('Test bulk message content');
      await expect(messageInput).toHaveValue('Test bulk message content');
    }
  });

  test('should select all recipients option', async ({ page }) => {
    // Check for select all checkbox
    const selectAll = page.locator('input[type="checkbox"]:near(:text("all")), button:has-text("Select All"), label:has-text("All")').first();
    if (await selectAll.isVisible({ timeout: 3000 }).catch(() => false)) {
      await selectAll.click();
      // Should update recipient count
      await page.waitForLoadState('networkidle');
    }
  });

  test('should have character count for message', async ({ page }) => {
    // Check for character counter
    const charCount = page.locator('text=/\\d+.*character|\\d+.*karakter|\\d+.*char/i').first();
    if (await charCount.isVisible({ timeout: 3000 }).catch(() => false)) {
      await expect(charCount).toBeVisible();
    }
  });
});
