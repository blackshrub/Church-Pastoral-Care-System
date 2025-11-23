/**
 * E2E Tests for Care Events
 *
 * Tests creating, completing, and managing pastoral care events
 */

const { test, expect } = require('@playwright/test');

// Helper function to login
async function login(page) {
  await page.goto('/');
  const email = process.env.TEST_USER_EMAIL || 'admin@test.com';
  const password = process.env.TEST_USER_PASSWORD || 'testpass123';

  await page.fill('input[type="email"]', email);
  await page.fill('input[type="password"]', password);
  await page.click('button[type="submit"]');
  await expect(page).toHaveURL(/\/(dashboard|home)/, { timeout: 10000 });
}

test.describe('Care Events', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test('should create a birthday event', async ({ page }) => {
    // Navigate to a member's detail page
    await page.click('text=/Members|Jemaat/i');
    await page.waitForLoadState('networkidle');

    const firstMember = page.locator('[data-testid*="member"], .member-card, .member-item').first();
    await firstMember.click();

    // Wait for member detail page
    await expect(page).toHaveURL(/\/members\/[^/]+/, { timeout: 5000 });

    // Click "Add Care Event" button
    await page.click('[data-testid="add-care-event-button"], button:has-text("Add Care Event")');

    // Wait for care event form
    await expect(page.locator('select[name="event_type"], input[name="event_type"]')).toBeVisible({ timeout: 5000 });

    // Select birthday event type
    await page.selectOption('select[name="event_type"]', 'birthday');

    // Fill in event details
    await page.fill('input[name="event_date"], input[type="date"]', '2024-12-25');

    const descriptionField = page.locator('textarea[name="description"], input[name="description"]');
    if (await descriptionField.isVisible({ timeout: 1000 }).catch(() => false)) {
      await descriptionField.fill('Send birthday wishes and gift');
    }

    // Submit form
    await page.click('button[type="submit"]:has-text("Save"), button[type="submit"]:has-text("Create")');

    // Wait for success message
    await expect(page.locator('text=/Success|created|Event added/i')).toBeVisible({ timeout: 10000 });

    // Verify event appears in timeline
    await expect(page.locator('[data-testid*="care-event"], .timeline-event').first()).toBeVisible({ timeout: 5000 });
  });

  test('should create a grief/loss event with auto-timeline', async ({ page }) => {
    // Navigate to member detail
    await page.click('text=/Members|Jemaat/i');
    await page.waitForLoadState('networkidle');
    await page.locator('[data-testid*="member"], .member-card').first().click();

    await expect(page).toHaveURL(/\/members\/[^/]+/, { timeout: 5000 });

    // Add care event
    await page.click('[data-testid="add-care-event-button"], button:has-text("Add Care Event")');

    // Select grief/loss event type
    await page.selectOption('select[name="event_type"]', 'grief_loss');

    // Fill details
    await page.fill('input[name="event_date"], input[type="date"]', '2024-01-15');

    const relationshipField = page.locator('select[name="grief_relationship"], input[name="grief_relationship"]');
    if (await relationshipField.isVisible({ timeout: 2000 }).catch(() => false)) {
      await relationshipField.selectOption('parent');
    }

    await page.click('button[type="submit"]:has-text("Save"), button[type="submit"]:has-text("Create")');

    // Wait for success
    await expect(page.locator('text=/Success|created/i')).toBeVisible({ timeout: 10000 });

    // Verify multiple grief support events were created (auto-timeline)
    // Should see: mourning service, 3-day, 7-day, 40-day, 100-day, 1-year
    const timelineEvents = page.locator('[data-testid*="care-event"], .timeline-event');
    const eventCount = await timelineEvents.count();

    // Should have at least 6 events created
    expect(eventCount).toBeGreaterThanOrEqual(6);
  });

  test('should complete a care event', async ({ page }) => {
    // Navigate to dashboard to see pending tasks
    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');

    // Find first incomplete task
    const incompleteTask = page.locator('[data-testid*="care-event"]:not(:has(.completed)), .care-event:not(.completed)').first();

    if (await incompleteTask.isVisible({ timeout: 5000 }).catch(() => false)) {
      // Click complete button
      await incompleteTask.locator('button:has-text("Complete"), button:has-text("Mark Complete")').click();

      // Confirm in dialog if needed
      const confirmButton = page.locator('button:has-text("Confirm"), button:has-text("Yes")');
      if (await confirmButton.isVisible({ timeout: 2000 }).catch(() => false)) {
        await confirmButton.click();
      }

      // Wait for success message
      await expect(page.locator('text=/completed|marked as complete/i')).toBeVisible({ timeout: 10000 });

      // Verify task is marked as completed
      await expect(incompleteTask.locator('text=/completed|✓/i')).toBeVisible({ timeout: 5000 });
    }
  });

  test('should ignore a care event', async ({ page }) => {
    // Navigate to dashboard
    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');

    // Find first incomplete task
    const incompleteTask = page.locator('[data-testid*="care-event"]:not(:has(.completed)), .care-event:not(.completed)').first();

    if (await incompleteTask.isVisible({ timeout: 5000 }).catch(() => false)) {
      // Open more options menu
      const moreButton = incompleteTask.locator('button:has-text("More"), button:has([data-testid="more-icon"])');
      if (await moreButton.isVisible({ timeout: 2000 }).catch(() => false)) {
        await moreButton.click();
      }

      // Click ignore button
      await page.click('button:has-text("Ignore"), button:has-text("Skip")');

      // Confirm if needed
      const confirmButton = page.locator('button:has-text("Confirm"), button:has-text("Yes")');
      if (await confirmButton.isVisible({ timeout: 2000 }).catch(() => false)) {
        await confirmButton.click();
      }

      // Wait for success
      await expect(page.locator('text=/ignored|skipped/i')).toBeVisible({ timeout: 10000 });
    }
  });

  test('should delete a care event', async ({ page }) => {
    // Navigate to member and create an event to delete
    await page.click('text=/Members|Jemaat/i');
    await page.waitForLoadState('networkidle');
    await page.locator('[data-testid*="member"], .member-card').first().click();

    // Create test event
    await page.click('[data-testid="add-care-event-button"], button:has-text("Add Care Event")');
    await page.selectOption('select[name="event_type"]', 'birthday');
    await page.fill('input[name="event_date"]', '2099-12-31');
    await page.click('button[type="submit"]:has-text("Save")');
    await page.waitForTimeout(2000);

    // Find the newly created event
    const testEvent = page.locator('[data-testid*="care-event"]').last();

    // Open more options
    const moreButton = testEvent.locator('button:has-text("More")');
    if (await moreButton.isVisible({ timeout: 2000 }).catch(() => false)) {
      await moreButton.click();
    }

    // Click delete
    await page.click('button:has-text("Delete")');

    // Confirm deletion
    await page.click('button:has-text("Confirm"), button:has-text("Delete"), button:has-text("Yes")');

    // Wait for success
    await expect(page.locator('text=/deleted|removed/i')).toBeVisible({ timeout: 10000 });
  });

  test('should display event type badges correctly', async ({ page }) => {
    // Navigate to member detail
    await page.click('text=/Members|Jemaat/i');
    await page.waitForLoadState('networkidle');
    await page.locator('[data-testid*="member"], .member-card').first().click();

    await expect(page).toHaveURL(/\/members\/[^/]+/, { timeout: 5000 });

    // Check if timeline has events
    const timelineEvents = page.locator('[data-testid*="care-event"], .timeline-event');

    if ((await timelineEvents.count()) > 0) {
      // Verify event type badges are visible
      await expect(timelineEvents.first().locator('[data-testid="event-type-badge"], .event-type-badge')).toBeVisible({ timeout: 5000 });
    }
  });

  test('should filter dashboard tasks by event type', async ({ page }) => {
    // Navigate to dashboard
    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');

    // Look for event type filter
    const filterTabs = page.locator('[role="tab"], .filter-tab');

    if ((await filterTabs.count()) > 0) {
      // Click on "Birthdays" tab/filter
      const birthdayTab = page.locator('text=/Birthdays|Ulang Tahun/i').first();
      if (await birthdayTab.isVisible({ timeout: 2000 }).catch(() => false)) {
        await birthdayTab.click();
        await page.waitForTimeout(500);

        // Verify only birthday events are shown
        const visibleEvents = page.locator('[data-testid*="care-event"]:visible, .care-event:visible');
        if ((await visibleEvents.count()) > 0) {
          await expect(visibleEvents.first()).toContainText(/birthday|ulang tahun/i);
        }
      }
    }
  });

  test('should create hospital visit event', async ({ page }) => {
    // Navigate to member
    await page.click('text=/Members|Jemaat/i');
    await page.waitForLoadState('networkidle');
    await page.locator('[data-testid*="member"], .member-card').first().click();

    // Add care event
    await page.click('[data-testid="add-care-event-button"], button:has-text("Add Care Event")');

    // Select hospital visit
    await page.selectOption('select[name="event_type"]', 'hospital_visit');

    // Fill details
    await page.fill('input[name="event_date"]', '2024-02-01');

    const hospitalNameField = page.locator('input[name="hospital_name"]');
    if (await hospitalNameField.isVisible({ timeout: 2000 }).catch(() => false)) {
      await hospitalNameField.fill('Jakarta General Hospital');
    }

    await page.click('button[type="submit"]:has-text("Save")');

    // Wait for success
    await expect(page.locator('text=/Success|created/i')).toBeVisible({ timeout: 10000 });

    // Verify hospital name is displayed
    await expect(page.locator('text=Jakarta General Hospital')).toBeVisible({ timeout: 5000 });
  });

  test('should create financial aid event', async ({ page }) => {
    // Navigate to member
    await page.click('text=/Members|Jemaat/i');
    await page.waitForLoadState('networkidle');
    await page.locator('[data-testid*="member"], .member-card').first().click();

    // Add care event
    await page.click('[data-testid="add-care-event-button"], button:has-text("Add Care Event")');

    // Select financial aid
    await page.selectOption('select[name="event_type"]', 'financial_aid');

    // Fill details
    await page.fill('input[name="event_date"]', '2024-02-15');

    const aidTypeField = page.locator('input[name="aid_type"], select[name="aid_type"]');
    if (await aidTypeField.isVisible({ timeout: 2000 }).catch(() => false)) {
      if ((await aidTypeField.getAttribute('type')) === 'text') {
        await aidTypeField.fill('Education Support');
      } else {
        await aidTypeField.selectOption('education');
      }
    }

    const aidAmountField = page.locator('input[name="aid_amount"]');
    if (await aidAmountField.isVisible({ timeout: 2000 }).catch(() => false)) {
      await aidAmountField.fill('1500000');
    }

    await page.click('button[type="submit"]:has-text("Save")');

    // Wait for success
    await expect(page.locator('text=/Success|created/i')).toBeVisible({ timeout: 10000 });

    // Verify aid details are displayed
    await expect(page.locator('text=/1.500.000|1,500,000/i')).toBeVisible({ timeout: 5000 });
  });
});
