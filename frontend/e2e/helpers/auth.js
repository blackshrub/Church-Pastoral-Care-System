/**
 * Authentication Helper Functions for E2E Tests
 *
 * Handles login with Shadcn/UI Select component for campus selection
 */

/**
 * Login to the application
 * @param {import('@playwright/test').Page} page - Playwright page object
 * @param {Object} options - Login options
 * @param {string} options.email - User email (default: admin@gkbj.church)
 * @param {string} options.password - User password (default: admin123)
 */
export async function login(page, options = {}) {
  const email = options.email || process.env.TEST_USER_EMAIL || 'admin@gkbj.church';
  const password = options.password || process.env.TEST_USER_PASSWORD || 'admin123';

  await page.goto('/');

  // Wait for page to load
  await page.waitForLoadState('networkidle');

  // Wait for campus select to be available
  const campusSelect = page.locator('[data-testid="campus-select"]');
  await campusSelect.waitFor({ state: 'visible', timeout: 10000 });

  // Click on campus select to open dropdown
  await campusSelect.click();

  // Wait for dropdown content to appear and select first campus
  const campusOption = page.locator('[role="option"]').first();
  await campusOption.waitFor({ state: 'visible', timeout: 5000 });
  await campusOption.click();

  // Fill in email
  const emailInput = page.locator('[data-testid="login-email-input"], input[type="email"]').first();
  await emailInput.fill(email);

  // Fill in password
  const passwordInput = page.locator('[data-testid="login-password-input"], input[type="password"]').first();
  await passwordInput.fill(password);

  // Click login button
  const loginButton = page.locator('[data-testid="login-button"], button[type="submit"]').first();
  await loginButton.click();

  // Wait for navigation to dashboard
  await page.waitForURL(/\/(dashboard|home|members)/, { timeout: 15000 });
}

/**
 * Logout from the application
 * @param {import('@playwright/test').Page} page - Playwright page object
 */
export async function logout(page) {
  // Try direct logout button first
  const logoutButton = page.locator('button:has-text("Logout"), button:has-text("Sign Out"), button:has-text("Keluar")').first();

  if (await logoutButton.isVisible({ timeout: 2000 }).catch(() => false)) {
    await logoutButton.click();
  } else {
    // Try opening user menu dropdown first
    const userMenu = page.locator('[data-testid="user-menu"], [aria-label*="user"], [aria-label*="profile"]').first();
    if (await userMenu.isVisible({ timeout: 2000 }).catch(() => false)) {
      await userMenu.click();
      await page.locator('button:has-text("Logout"), button:has-text("Sign Out"), button:has-text("Keluar")').first().click();
    }
  }

  // Wait for redirect to login
  await page.waitForURL(/\/(login|)$/, { timeout: 5000 });
}
