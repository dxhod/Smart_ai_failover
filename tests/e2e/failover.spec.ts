import { expect, test } from '@playwright/test';

test('shows validation for empty prompt', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Send request' }).click();
  await expect(page.getByText('Enter a prompt before sending.')).toBeVisible();
});
