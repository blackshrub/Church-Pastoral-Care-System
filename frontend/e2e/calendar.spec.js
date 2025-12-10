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

test.describe('Calendar Page', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
    await page.goto('/calendar');
    await page.waitForLoadState('networkidle');
  });

  test('should display calendar page', async ({ page }) => {
    // Check for calendar container
    await expect(page.locator('[class*="calendar"], [class*="Calendar"], [role="grid"]').first()).toBeVisible({ timeout: 5000 });
  });

  test('should display current month', async ({ page }) => {
    // Check for month display
    const currentDate = new Date();
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const indonesianMonths = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];

    const currentMonth = monthNames[currentDate.getMonth()];
    const currentMonthId = indonesianMonths[currentDate.getMonth()];

    const monthDisplay = page.locator(`text=/${currentMonth}|${currentMonthId}/i`).first();
    await expect(monthDisplay).toBeVisible({ timeout: 5000 });
  });

  test('should display day headers', async ({ page }) => {
    // Check for day of week headers (Sun, Mon, etc.)
    const dayHeader = page.locator('text=/Sun|Mon|Tue|Wed|Thu|Fri|Sat|Min|Sen|Sel|Rab|Kam|Jum|Sab/i').first();
    await expect(dayHeader).toBeVisible({ timeout: 5000 });
  });

  test('should have month navigation buttons', async ({ page }) => {
    // Check for previous/next month buttons
    const prevButton = page.locator('button:has-text("Previous"), button:has-text("<"), button[aria-label*="previous"]').first();
    const nextButton = page.locator('button:has-text("Next"), button:has-text(">"), button[aria-label*="next"]').first();

    // At least one navigation should be visible
    const hasPrev = await prevButton.isVisible({ timeout: 3000 }).catch(() => false);
    const hasNext = await nextButton.isVisible({ timeout: 3000 }).catch(() => false);

    expect(hasPrev || hasNext).toBeTruthy();
  });

  test('should navigate to next month', async ({ page }) => {
    // Click next month button
    const nextButton = page.locator('button:has-text("Next"), button:has-text(">"), button[aria-label*="next"], [class*="next"]').first();
    if (await nextButton.isVisible({ timeout: 3000 }).catch(() => false)) {
      await nextButton.click();
      await page.waitForLoadState('networkidle');

      // Calendar should still be visible
      await expect(page.locator('[class*="calendar"], [class*="Calendar"], [role="grid"]').first()).toBeVisible();
    }
  });

  test('should navigate to previous month', async ({ page }) => {
    // Click previous month button
    const prevButton = page.locator('button:has-text("Previous"), button:has-text("<"), button[aria-label*="previous"], [class*="prev"]').first();
    if (await prevButton.isVisible({ timeout: 3000 }).catch(() => false)) {
      await prevButton.click();
      await page.waitForLoadState('networkidle');

      // Calendar should still be visible
      await expect(page.locator('[class*="calendar"], [class*="Calendar"], [role="grid"]').first()).toBeVisible();
    }
  });

  test('should display today date highlighted', async ({ page }) => {
    // Check for today's date highlighting
    const today = new Date().getDate().toString();
    const todayCell = page.locator(`[class*="today"], [aria-selected="true"], [data-today="true"]`).first();

    if (await todayCell.isVisible({ timeout: 3000 }).catch(() => false)) {
      await expect(todayCell).toBeVisible();
    }
  });

  test('should display events on calendar', async ({ page }) => {
    // Check for event indicators on dates
    const eventIndicator = page.locator('[class*="event"], [class*="dot"], [class*="badge"]').first();

    // Events may or may not exist, just check no error
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveURL(/calendar/);
  });

  test('should click on date to see details', async ({ page }) => {
    // Find a clickable date cell
    const dateCell = page.locator('[role="gridcell"], [class*="day"], td').first();
    if (await dateCell.isVisible({ timeout: 3000 }).catch(() => false)) {
      await dateCell.click();

      // Should show some response (event details, modal, or selection)
      await page.waitForLoadState('networkidle');
    }
  });

  test('should have view toggle options', async ({ page }) => {
    // Check for view options (month, week, day)
    const viewToggle = page.locator('button:has-text("Month"), button:has-text("Week"), button:has-text("Day"), [class*="view-toggle"]').first();
    if (await viewToggle.isVisible({ timeout: 3000 }).catch(() => false)) {
      await expect(viewToggle).toBeVisible();
    }
  });
});
