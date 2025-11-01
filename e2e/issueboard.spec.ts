import { test, expect } from '@playwright/test';

test.describe('IssueBoard E2E User Journeys', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Wait until table is rendered
    await expect(page.getByRole('table', { name: /Issue list/i })).toBeVisible();
  });

  test('loads issue dashboard with full issue table', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'IssueBoard', level: 1 })).toBeVisible();
    await expect(page.getByText('Fix race condition in OAuth2 token refresh workflow').first()).toBeVisible();
    await expect(page.getByRole('table', { name: /Issue list/i })).toBeVisible();
  });

  test('searches and filters issues dynamically', async ({ page }) => {
    const searchInput = page.getByRole('textbox', { name: 'Search issues' });
    await searchInput.fill('OAuth2');

    await expect(page.getByText('Fix race condition in OAuth2 token refresh workflow').first()).toBeVisible();
    await expect(page.getByText('Implement dark mode theme persistence across browser sessions')).not.toBeVisible();

    // Clear search
    await page.getByRole('button', { name: /Clear search text/i }).click();
    await expect(page.getByText('Implement dark mode theme persistence across browser sessions').first()).toBeVisible();
  });

  test('performs bulk status change', async ({ page }) => {
    // Select first issue
    const checkbox = page.getByRole('checkbox', { name: /Select issue ISSUE-101/i }).first();
    await checkbox.check();

    // Verify bulk toolbar
    await expect(page.getByRole('region', { name: /Bulk actions for selected issues/i })).toBeVisible();
    await expect(page.getByText(/1 issue selected/i)).toBeVisible();

    // Change status
    const bulkStatusSelect = page.getByRole('combobox', { name: /Change status for selected issues/i });
    await bulkStatusSelect.selectOption('done');

    // Deselect
    await page.getByRole('button', { name: /Deselect/i }).click();
    await expect(page.getByRole('region', { name: /Bulk actions for selected issues/i })).not.toBeVisible();
  });

  test('opens issue details modal, edits attributes, and closes with Escape', async ({ page }) => {
    const issueRow = page.getByText('Fix race condition in OAuth2 token refresh workflow').first();
    await issueRow.click();

    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Activity History' })).toBeVisible();

    // Change priority
    const prioritySelect = page.getByRole('combobox', { name: /Change issue priority/i });
    await prioritySelect.selectOption('urgent');

    // Press Escape to dismiss
    await page.keyboard.press('Escape');
    await expect(dialog).not.toBeVisible();
  });

  test('toggles theme between dark and light modes', async ({ page }) => {
    const themeBtn = page.getByRole('button', { name: /Switch to (dark|light) mode/i });
    await themeBtn.click();

    const html = page.locator('html');
    const themeAttr = await html.getAttribute('data-theme');
    expect(['dark', 'light']).toContain(themeAttr);
  });

  test('focuses search input on pressing slash (/) key', async ({ page }) => {
    const searchInput = page.getByRole('textbox', { name: 'Search issues' });
    await page.locator('.brand-title').click();
    await page.keyboard.press('Slash');
    await expect(searchInput).toBeFocused();
  });
});
