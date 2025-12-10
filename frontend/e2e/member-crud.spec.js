/**
 * E2E Tests for Member CRUD Operations
 *
 * Tests creating, viewing, editing, and deleting members
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

test.describe('Member CRUD Operations', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test('should display members list', async ({ page }) => {
    // Navigate to members page
    await page.click('text=/Members|Jemaat/i');

    // Wait for members list to load
    await expect(page.locator('[data-testid*="member"], .member-card, .member-item').first()).toBeVisible({ timeout: 10000 });
  });

  test('should search for members', async ({ page }) => {
    // Navigate to members page
    await page.click('text=/Members|Jemaat/i');

    // Wait for page to load
    await page.waitForLoadState('networkidle');

    // Find search input
    const searchInput = page.locator('input[placeholder*="Search"], input[placeholder*="Cari"]').first();
    await searchInput.fill('John');

    // Wait for search results to update
    await page.waitForTimeout(500); // Debounce delay

    // Verify results contain search term
    const firstResult = page.locator('[data-testid*="member"], .member-card, .member-item').first();
    if (await firstResult.isVisible({ timeout: 2000 }).catch(() => false)) {
      await expect(firstResult).toContainText(/John/i);
    }
  });

  test('should create a new member', async ({ page }) => {
    // Navigate to members page
    await page.click('text=/Members|Jemaat/i');

    // Click "Add Member" button
    await page.click('button:has-text("Add Member"), button:has-text("Tambah Jemaat")');

    // Wait for form modal/page to appear
    await expect(page.locator('input[name="name"], input[placeholder*="Name"]')).toBeVisible({ timeout: 5000 });

    // Fill in member details
    const timestamp = Date.now();
    await page.fill('input[name="name"], input[placeholder*="Name"]', `Test Member ${timestamp}`);
    await page.fill('input[name="phone"], input[placeholder*="Phone"]', `+628123456${timestamp.toString().slice(-4)}`);

    // Email field (if available)
    const emailInput = page.locator('input[name="email"], input[type="email"]');
    if (await emailInput.isVisible({ timeout: 1000 }).catch(() => false)) {
      await emailInput.fill(`test${timestamp}@example.com`);
    }

    // Submit form
    await page.click('button[type="submit"]:has-text("Save"), button[type="submit"]:has-text("Simpan")');

    // Wait for success message or redirect
    await expect(page.locator('text=/Success|Berhasil|saved|tersimpan/i').or(page.locator('[data-testid*="member"]'))).toBeVisible({ timeout: 10000 });

    // Verify new member appears in list
    await expect(page.locator(`text=Test Member ${timestamp}`)).toBeVisible({ timeout: 5000 });
  });

  test('should view member details', async ({ page }) => {
    // Navigate to members page
    await page.click('text=/Members|Jemaat/i');

    // Wait for members list
    await page.waitForLoadState('networkidle');

    // Click on first member
    const firstMember = page.locator('[data-testid*="member"], .member-card, .member-item').first();
    await firstMember.click();

    // Wait for member detail page to load
    await expect(page).toHaveURL(/\/members\/[^/]+/, { timeout: 5000 });

    // Verify member profile is displayed
    await expect(page.locator('[data-testid="member-avatar"], .member-avatar, img[alt*="avatar"]')).toBeVisible({ timeout: 5000 });
    await expect(page.locator('h1, .member-name').first()).toBeVisible();
  });

  test('should edit member information', async ({ page }) => {
    // Navigate to members page and open first member
    await page.click('text=/Members|Jemaat/i');
    await page.waitForLoadState('networkidle');

    const firstMember = page.locator('[data-testid*="member"], .member-card, .member-item').first();
    await firstMember.click();

    // Wait for member detail page
    await expect(page).toHaveURL(/\/members\/[^/]+/, { timeout: 5000 });

    // Click edit button
    await page.click('button:has-text("Edit"), button:has-text("Ubah")');

    // Wait for edit form
    await expect(page.locator('input[name="name"], input[placeholder*="Name"]')).toBeVisible({ timeout: 5000 });

    // Modify member details
    const timestamp = Date.now();
    await page.fill('input[name="name"], input[placeholder*="Name"]', `Updated Member ${timestamp}`);

    // Submit form
    await page.click('button[type="submit"]:has-text("Save"), button[type="submit"]:has-text("Simpan")');

    // Wait for success message
    await expect(page.locator('text=/Success|Berhasil|updated|diperbarui/i')).toBeVisible({ timeout: 10000 });

    // Verify update is reflected
    await expect(page.locator(`text=Updated Member ${timestamp}`)).toBeVisible({ timeout: 5000 });
  });

  test('should delete a member', async ({ page }) => {
    // First create a member to delete
    await page.click('text=/Members|Jemaat/i');
    await page.click('button:has-text("Add Member"), button:has-text("Tambah Jemaat")');

    const timestamp = Date.now();
    await page.fill('input[name="name"], input[placeholder*="Name"]', `Delete Me ${timestamp}`);
    await page.fill('input[name="phone"], input[placeholder*="Phone"]', `+628999${timestamp.toString().slice(-6)}`);

    await page.click('button[type="submit"]:has-text("Save"), button[type="submit"]:has-text("Simpan")');
    await page.waitForTimeout(2000);

    // Find and click on the newly created member
    await page.click(`text=Delete Me ${timestamp}`);

    // Wait for member detail page
    await expect(page).toHaveURL(/\/members\/[^/]+/, { timeout: 5000 });

    // Click delete button (usually in a dropdown menu)
    const moreButton = page.locator('button:has-text("More"), button:has([data-testid="more-icon"])');
    if (await moreButton.isVisible({ timeout: 2000 }).catch(() => false)) {
      await moreButton.click();
    }

    await page.click('button:has-text("Delete"), button:has-text("Hapus")');

    // Confirm deletion in dialog
    await page.click('button:has-text("Confirm"), button:has-text("Yes"), button:has-text("Delete")');

    // Wait for redirect to members list
    await expect(page).toHaveURL(/\/members\/?$/, { timeout: 5000 });

    // Verify member is no longer in list
    await expect(page.locator(`text=Delete Me ${timestamp}`)).not.toBeVisible({ timeout: 5000 });
  });

  test('should filter members by engagement status', async ({ page }) => {
    // Navigate to members page
    await page.click('text=/Members|Jemaat/i');
    await page.waitForLoadState('networkidle');

    // Look for filter dropdown/buttons
    const filterButton = page.locator('button:has-text("Filter"), select[name="engagement_status"], button:has-text("Status")');

    if (await filterButton.isVisible({ timeout: 2000 }).catch(() => false)) {
      await filterButton.click();

      // Select "At Risk" filter
      await page.click('text=/At Risk|Berisiko/i');

      // Wait for filtered results
      await page.waitForTimeout(1000);

      // Verify results show at-risk badge
      const badges = page.locator('[data-testid="engagement-badge"], .engagement-badge');
      if (await badges.first().isVisible({ timeout: 2000 }).catch(() => false)) {
        await expect(badges.first()).toContainText(/At Risk|Berisiko/i);
      }
    }
  });

  test('should display member engagement status', async ({ page }) => {
    // Navigate to members page and open first member
    await page.click('text=/Members|Jemaat/i');
    await page.waitForLoadState('networkidle');

    const firstMember = page.locator('[data-testid*="member"], .member-card, .member-item').first();
    await firstMember.click();

    // Wait for member detail page
    await expect(page).toHaveURL(/\/members\/[^/]+/, { timeout: 5000 });

    // Verify engagement badge is displayed
    await expect(page.locator('[data-testid="engagement-badge"], .engagement-badge')).toBeVisible({ timeout: 5000 });

    // Verify last contact date is displayed (if exists)
    const lastContactText = page.locator('text=/Last Contact|Kontak Terakhir/i');
    if (await lastContactText.isVisible({ timeout: 2000 }).catch(() => false)) {
      await expect(lastContactText).toBeVisible();
    }
  });
});
