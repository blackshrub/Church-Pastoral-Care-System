# E2E Testing Guide

This directory contains end-to-end tests for the FaithTracker application using Playwright.

## Setup

Playwright should be automatically installed when you run `yarn install` in the frontend directory.

To install Playwright browsers:

```bash
npx playwright install
```

## Running Tests

### Run all E2E tests
```bash
yarn test:e2e
```

### Run tests in UI mode (interactive)
```bash
yarn test:e2e:ui
```

### Run tests in headed mode (see browser)
```bash
yarn test:e2e:headed
```

### Run specific test file
```bash
yarn test:e2e auth.spec.js
```

### Debug tests
```bash
yarn test:e2e:debug
```

## Test Environment Setup

### Required Environment Variables

Create a `.env.test` file in the frontend directory:

```bash
TEST_USER_EMAIL=admin@test.com
TEST_USER_PASSWORD=testpass123
REACT_APP_BACKEND_URL=http://localhost:8001/api
```

### Backend Requirements

Before running E2E tests, ensure:
1. Backend API is running on port 8001
2. MongoDB is running
3. Test database is seeded with at least one admin user

## Test Structure

```
e2e/
├── auth.spec.js           # Authentication flows
├── member-crud.spec.js    # Member CRUD operations
├── care-events.spec.js    # Care event management
├── dashboard.spec.js      # Dashboard interactions
└── README.md             # This file
```

## Test Coverage

### auth.spec.js
- Login with valid/invalid credentials
- Logout
- Session persistence
- Protected route access
- Password visibility toggle

### member-crud.spec.js
- View members list
- Search members
- Create new member
- View member details
- Edit member information
- Delete member
- Filter by engagement status

### care-events.spec.js
- Create birthday event
- Create grief/loss event (with auto-timeline)
- Create hospital visit event
- Create financial aid event
- Complete care event
- Ignore care event
- Delete care event
- Filter by event type

### dashboard.spec.js
- Display statistics
- Display today's tasks
- Display birthday reminders
- Navigate to member detail
- Complete tasks from dashboard
- Filter tasks by status
- Search members
- Mobile responsive view

## Writing New Tests

### Test Structure Pattern

```javascript
const { test, expect } = require('@playwright/test');

test.describe('Feature Name', () => {
  test.beforeEach(async ({ page }) => {
    // Setup (e.g., login)
  });

  test('should do something', async ({ page }) => {
    // Arrange
    await page.goto('/page');

    // Act
    await page.click('button');

    // Assert
    await expect(page.locator('selector')).toBeVisible();
  });
});
```

### Best Practices

1. **Use data-testid attributes** for stable selectors
2. **Wait for network idle** before interacting with dynamic content
3. **Use fallback selectors** for text that may be in different languages
4. **Handle optional elements** with try-catch or isVisible checks
5. **Create helper functions** for common actions (login, create member)

### Example: Language-agnostic Selector

```javascript
// Good - works in English and Indonesian
await page.click('button:has-text("Delete"), button:has-text("Hapus")');

// Better - use data-testid
await page.click('[data-testid="delete-button"]');
```

## Debugging Failed Tests

### View test report
```bash
npx playwright show-report
```

### Run specific test with debug
```bash
npx playwright test auth.spec.js --debug
```

### Take screenshot on failure
Screenshots are automatically saved in `playwright-report/` when tests fail.

### View trace
```bash
npx playwright show-trace trace.zip
```

## CI/CD Integration

When adding CI/CD (e.g., GitHub Actions), use this workflow:

```yaml
- name: Install dependencies
  run: yarn install

- name: Install Playwright Browsers
  run: npx playwright install --with-deps

- name: Run E2E tests
  run: yarn test:e2e

- name: Upload test report
  uses: actions/upload-artifact@v3
  if: always()
  with:
    name: playwright-report
    path: playwright-report/
```

## Known Issues & Workarounds

### Issue: Tests fail on first run
**Solution**: Run `npx playwright install` to download browsers

### Issue: Timeout on login
**Solution**: Increase timeout in test or check if backend is running

### Issue: Element not found
**Solution**: Add explicit waits or use more flexible selectors

## Contributing

When adding new E2E tests:
1. Follow existing test structure
2. Add descriptive test names
3. Handle both English and Indonesian UI text
4. Add error handling for optional elements
5. Update this README if adding new test files
