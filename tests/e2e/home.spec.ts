import { test, expect } from '@playwright/test';

test('should load the homepage and display club options', async ({ page }) => {
    await page.goto('/');

    // Check for the main title
    await expect(page.getByRole('heading', { name: 'Retro Hockey Manager' })).toBeVisible();

    // Check for a specific club button to verify list rendering
    await expect(page.getByRole('button', { name: /Frisk Asker\/NTG/i })).toBeVisible();
});
