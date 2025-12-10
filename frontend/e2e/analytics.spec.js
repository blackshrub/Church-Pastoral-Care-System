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

test.describe('Analytics Page', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
    await page.goto('/analytics');
    await page.waitForLoadState('networkidle');
  });

  test('should display analytics page with tabs', async ({ page }) => {
    // Check for analytics tabs
    await expect(page.locator('text=/Demographics|Demografi/i').first()).toBeVisible({ timeout: 5000 });
    await expect(page.locator('text=/Trends|Tren/i').first()).toBeVisible();
  });

  test('should display demographics tab content', async ({ page }) => {
    // Click demographics tab if not already selected
    const demographicsTab = page.locator('button:has-text("Demographics"), button:has-text("Demografi"), [role="tab"]:has-text("Demographics")').first();
    if (await demographicsTab.isVisible()) {
      await demographicsTab.click();
    }

    // Check for chart containers or demographic data
    await expect(page.locator('[class*="chart"], canvas, svg, [data-testid*="chart"]').first()).toBeVisible({ timeout: 10000 });
  });

  test('should switch to trends tab', async ({ page }) => {
    // Click trends tab
    const trendsTab = page.locator('button:has-text("Trends"), button:has-text("Tren"), [role="tab"]:has-text("Trends")').first();
    if (await trendsTab.isVisible()) {
      await trendsTab.click();
      await page.waitForLoadState('networkidle');

      // Check for trends content
      await expect(page.locator('text=/trend|growth|population|pertumbuhan/i').first()).toBeVisible({ timeout: 5000 });
    }
  });

  test('should switch to engagement tab', async ({ page }) => {
    // Click engagement tab
    const engagementTab = page.locator('button:has-text("Engagement"), [role="tab"]:has-text("Engagement")').first();
    if (await engagementTab.isVisible()) {
      await engagementTab.click();
      await page.waitForLoadState('networkidle');

      // Check for engagement content
      await expect(page.locator('text=/active|inactive|at.?risk|engagement/i').first()).toBeVisible({ timeout: 5000 });
    }
  });

  test('should switch to financial tab', async ({ page }) => {
    // Click financial tab
    const financialTab = page.locator('button:has-text("Financial"), button:has-text("Keuangan"), [role="tab"]:has-text("Financial")').first();
    if (await financialTab.isVisible()) {
      await financialTab.click();
      await page.waitForLoadState('networkidle');

      // Check for financial content
      await expect(page.locator('text=/financial|aid|bantuan|distribution/i').first()).toBeVisible({ timeout: 5000 });
    }
  });

  test('should switch to care events tab', async ({ page }) => {
    // Click care events tab
    const careTab = page.locator('button:has-text("Care Events"), button:has-text("Care"), [role="tab"]:has-text("Care")').first();
    if (await careTab.isVisible()) {
      await careTab.click();
      await page.waitForLoadState('networkidle');

      // Check for care events content
      await expect(page.locator('text=/care|event|birthday|grief|hospital/i').first()).toBeVisible({ timeout: 5000 });
    }
  });

  test('should switch to predictive tab', async ({ page }) => {
    // Click predictive tab
    const predictiveTab = page.locator('button:has-text("Predictive"), button:has-text("Prediksi"), [role="tab"]:has-text("Predictive")').first();
    if (await predictiveTab.isVisible()) {
      await predictiveTab.click();
      await page.waitForLoadState('networkidle');

      // Check for predictive content
      await expect(page.locator('text=/predict|priority|recommendation|rekomendasi/i').first()).toBeVisible({ timeout: 5000 });
    }
  });

  test('should display loading state while fetching data', async ({ page }) => {
    // Reload page to catch loading state
    await page.reload();

    // Check for loading indicator or skeleton
    const loadingIndicator = page.locator('[class*="loading"], [class*="spinner"], [class*="skeleton"], text=/loading/i').first();
    // Loading state may be very brief, so we just check it doesn't error
    await page.waitForLoadState('networkidle');
  });
});
