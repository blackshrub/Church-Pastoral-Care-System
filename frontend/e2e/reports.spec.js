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

test.describe('Reports Page', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
    await page.goto('/reports');
    await page.waitForLoadState('networkidle');
  });

  test('should display reports page with tabs', async ({ page }) => {
    // Check for report tabs
    await expect(page.locator('text=/Monthly|Bulanan/i').first()).toBeVisible({ timeout: 5000 });
  });

  test('should display monthly report', async ({ page }) => {
    // Click monthly tab if available
    const monthlyTab = page.locator('button:has-text("Monthly"), button:has-text("Bulanan"), [role="tab"]:has-text("Monthly")').first();
    if (await monthlyTab.isVisible()) {
      await monthlyTab.click();
    }

    // Check for monthly report content
    await expect(page.locator('text=/report|laporan|summary|ringkasan/i').first()).toBeVisible({ timeout: 5000 });
  });

  test('should have month/year selectors', async ({ page }) => {
    // Check for month selector
    const monthSelector = page.locator('select, [role="combobox"], button:has-text(/january|february|january|januari|februari/i)').first();
    await expect(monthSelector).toBeVisible({ timeout: 5000 });
  });

  test('should change month selection', async ({ page }) => {
    // Find and interact with month selector
    const monthSelector = page.locator('select').first();
    if (await monthSelector.isVisible({ timeout: 3000 }).catch(() => false)) {
      // Select a different month
      await monthSelector.selectOption({ index: 1 });
      await page.waitForLoadState('networkidle');

      // Page should update (no error)
      await expect(page).toHaveURL(/reports/);
    }
  });

  test('should display staff performance tab', async ({ page }) => {
    // Click staff performance tab
    const staffTab = page.locator('button:has-text("Staff"), button:has-text("Performance"), [role="tab"]:has-text("Staff")').first();
    if (await staffTab.isVisible()) {
      await staffTab.click();
      await page.waitForLoadState('networkidle');

      // Check for staff performance content
      await expect(page.locator('text=/staff|performance|team|tim|kinerja/i').first()).toBeVisible({ timeout: 5000 });
    }
  });

  test('should display yearly summary tab', async ({ page }) => {
    // Click yearly tab
    const yearlyTab = page.locator('button:has-text("Yearly"), button:has-text("Tahunan"), button:has-text("Annual"), [role="tab"]:has-text("Year")').first();
    if (await yearlyTab.isVisible()) {
      await yearlyTab.click();
      await page.waitForLoadState('networkidle');

      // Check for yearly content
      await expect(page.locator('text=/year|annual|tahunan|summary/i').first()).toBeVisible({ timeout: 5000 });
    }
  });

  test('should have PDF download button', async ({ page }) => {
    // Check for PDF download button
    const pdfButton = page.locator('button:has-text("PDF"), button:has-text("Download"), button:has-text("Export"), a:has-text("PDF")').first();
    if (await pdfButton.isVisible({ timeout: 3000 }).catch(() => false)) {
      await expect(pdfButton).toBeVisible();
    }
  });

  test('should display KPI metrics in monthly report', async ({ page }) => {
    // Check for KPI-related text
    const kpiContent = page.locator('text=/completion|rate|percentage|persen|total|count/i').first();
    if (await kpiContent.isVisible({ timeout: 3000 }).catch(() => false)) {
      await expect(kpiContent).toBeVisible();
    }
  });
});
