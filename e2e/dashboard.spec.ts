import { test, expect } from '@playwright/test';

test.describe('Dashboard App', () => {
  test('renders instruments and filters by symbol', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();

    await expect(page.getByRole('gridcell', { name: 'GOOG' }).first()).toBeVisible();

    const searchInput = page.getByPlaceholder('Search by symbol...');
    await searchInput.fill('AMZN');

    await expect(page.getByRole('gridcell', { name: 'AMZN' }).first()).toBeVisible();
    await expect(page.getByRole('gridcell', { name: 'GOOG' })).toHaveCount(0);
  });
});
