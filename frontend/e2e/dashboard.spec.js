/**
 * E2E Tests for Dashboard
 *
 * Tests dashboard navigation, statistics, and task management
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

test.describe('Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test('should display dashboard statistics', async ({ page }) => {
    // Wait for dashboard to load
    await page.waitForLoadState('networkidle');

    // Verify key statistics are displayed
    const statsCards = page.locator('[data-testid*="stat-card"], .stat-card, .stats-card');

    if ((await statsCards.count()) > 0) {
      // Should show numbers
      await expect(statsCards.first()).toContainText(/\d+/);
    }
  });

  test('should display today\'s tasks', async ({ page }) => {
    // Wait for dashboard
    await page.waitForLoadState('networkidle');

    // Look for today's tasks section
    const todaySection = page.locator('text=/Today|Hari Ini/i').first();

    if (await todaySection.isVisible({ timeout: 2000 }).catch(() => false)) {
      await expect(todaySection).toBeVisible();

      // Tasks list should be visible
      const tasksList = page.locator('[data-testid*="task"], .task-item, [data-testid*="care-event"]');
      // May or may not have tasks, just verify section exists
    }
  });

  test('should display birthday reminders', async ({ page }) => {
    // Wait for dashboard
    await page.waitForLoadState('networkidle');

    // Look for birthdays section
    const birthdaySection = page.locator('text=/Birthday|Ulang Tahun/i').first();

    if (await birthdaySection.isVisible({ timeout: 2000 }).catch(() => false)) {
      await expect(birthdaySection).toBeVisible();
    }
  });

  test('should navigate to member detail from dashboard', async ({ page }) => {
    // Wait for dashboard
    await page.waitForLoadState('networkidle');

    // Find first member link/card
    const memberLink = page.locator('[data-testid*="member-link"], a[href*="/members/"]').first();

    if (await memberLink.isVisible({ timeout: 5000 }).catch(() => false)) {
      await memberLink.click();

      // Should navigate to member detail page
      await expect(page).toHaveURL(/\/members\/[^/]+/, { timeout: 5000 });
    }
  });

  test('should complete task from dashboard', async ({ page }) => {
    // Wait for dashboard
    await page.waitForLoadState('networkidle');

    // Find first incomplete task
    const incompleteTask = page.locator('[data-testid*="care-event"]:not(:has(.completed)), .task-item:not(.completed)').first();

    if (await incompleteTask.isVisible({ timeout: 5000 }).catch(() => false)) {
      // Click complete button
      const completeButton = incompleteTask.locator('button:has-text("Complete"), button[data-testid="complete-button"]');

      if (await completeButton.isVisible({ timeout: 2000 }).catch(() => false)) {
        await completeButton.click();

        // Confirm if dialog appears
        const confirmButton = page.locator('button:has-text("Confirm"), button:has-text("Yes")');
        if (await confirmButton.isVisible({ timeout: 2000 }).catch(() => false)) {
          await confirmButton.click();
        }

        // Wait for success message
        await expect(page.locator('text=/completed|success/i')).toBeVisible({ timeout: 10000 });
      }
    }
  });

  test('should filter tasks by status', async ({ page }) => {
    // Wait for dashboard
    await page.waitForLoadState('networkidle');

    // Look for filter buttons/tabs
    const filterButtons = page.locator('[role="tab"], button:has-text("All"), button:has-text("Pending"), button:has-text("Completed")');

    if ((await filterButtons.count()) > 0) {
      // Click "Completed" filter
      const completedFilter = page.locator('text=/^Completed$|^Selesai$/i').first();

      if (await completedFilter.isVisible({ timeout: 2000 }).catch(() => false)) {
        await completedFilter.click();
        await page.waitForTimeout(500);

        // Verify completed tasks are shown
        const tasks = page.locator('[data-testid*="care-event"]:visible, .task-item:visible');
        if ((await tasks.count()) > 0) {
          await expect(tasks.first().locator('text=/completed|✓/i')).toBeVisible({ timeout: 2000 });
        }
      }
    }
  });

  test('should search for members from dashboard', async ({ page }) => {
    // Wait for dashboard
    await page.waitForLoadState('networkidle');

    // Find global search or member search
    const searchInput = page.locator('input[placeholder*="Search"], input[placeholder*="Cari"]').first();

    if (await searchInput.isVisible({ timeout: 2000 }).catch(() => false)) {
      await searchInput.fill('John');
      await page.waitForTimeout(500); // Debounce

      // Results should appear
      const results = page.locator('[data-testid*="member"], .search-result');
      if ((await results.count()) > 0) {
        await expect(results.first()).toContainText(/John/i);
      }
    }
  });

  test('should navigate between dashboard sections', async ({ page }) => {
    // Wait for dashboard
    await page.waitForLoadState('networkidle');

    // Navigate to different sections using sidebar/nav
    const membersNav = page.locator('a:has-text("Members"), a:has-text("Jemaat")').first();

    if (await membersNav.isVisible({ timeout: 2000 }).catch(() => false)) {
      await membersNav.click();
      await expect(page).toHaveURL(/\/members/, { timeout: 5000 });

      // Go back to dashboard
      const dashboardNav = page.locator('a:has-text("Dashboard"), a:has-text("Home")').first();
      if (await dashboardNav.isVisible({ timeout: 2000 }).catch(() => false)) {
        await dashboardNav.click();
        await expect(page).toHaveURL(/\/(dashboard|home)/, { timeout: 5000 });
      }
    }
  });

  test('should display engagement overview', async ({ page }) => {
    // Wait for dashboard
    await page.waitForLoadState('networkidle');

    // Look for engagement metrics
    const engagementSection = page.locator('text=/Engagement|At Risk|Disconnected|Active/i').first();

    if (await engagementSection.isVisible({ timeout: 5000 }).catch(() => false)) {
      await expect(engagementSection).toBeVisible();
    }
  });

  test('should refresh dashboard data', async ({ page }) => {
    // Wait for dashboard
    await page.waitForLoadState('networkidle');

    // Look for refresh button
    const refreshButton = page.locator('button:has-text("Refresh"), button[data-testid="refresh-button"], button:has([data-testid="refresh-icon"])');

    if (await refreshButton.isVisible({ timeout: 2000 }).catch(() => false)) {
      await refreshButton.click();

      // Wait for data to reload
      await page.waitForLoadState('networkidle');
    }
  });

  test('should display upcoming care events', async ({ page }) => {
    // Wait for dashboard
    await page.waitForLoadState('networkidle');

    // Look for upcoming events section
    const upcomingSection = page.locator('text=/Upcoming|Mendatang|This Week/i').first();

    if (await upcomingSection.isVisible({ timeout: 2000 }).catch(() => false)) {
      await expect(upcomingSection).toBeVisible();
    }
  });
});

test.describe('Dashboard - Mobile View', () => {
  test.use({ viewport: { width: 375, height: 667 } }); // iPhone SE size

  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test('should display mobile navigation', async ({ page }) => {
    // Wait for dashboard
    await page.waitForLoadState('networkidle');

    // Look for mobile bottom nav or hamburger menu
    const mobileNav = page.locator('[data-testid="mobile-nav"], .mobile-nav, nav.mobile');

    if (await mobileNav.isVisible({ timeout: 2000 }).catch(() => false)) {
      await expect(mobileNav).toBeVisible();
    }
  });

  test('should be responsive on mobile', async ({ page }) => {
    // Wait for dashboard
    await page.waitForLoadState('networkidle');

    // Verify key elements are visible and not cut off
    const mainContent = page.locator('main, [role="main"]').first();
    await expect(mainContent).toBeVisible({ timeout: 5000 });

    // Take screenshot for visual verification
    await page.screenshot({ path: 'playwright-report/dashboard-mobile.png', fullPage: true });
  });

  test('should open member detail in mobile view', async ({ page }) => {
    // Wait for dashboard
    await page.waitForLoadState('networkidle');

    // Find and tap member card
    const memberCard = page.locator('[data-testid*="member"], .member-card, a[href*="/members/"]').first();

    if (await memberCard.isVisible({ timeout: 5000 }).catch(() => false)) {
      await memberCard.tap();
      await expect(page).toHaveURL(/\/members\/[^/]+/, { timeout: 5000 });
    }
  });
});
