import { expect, test } from '@playwright/test';

test('shows validation for empty prompt', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Send request' }).click();
  await expect(page.getByText('Enter a prompt before sending.')).toBeVisible();
});

test('shows Gemini success response and writes it to history', async ({ page }) => {
  await page.goto('/');
  await page.getByLabel('Prompt').fill('Explain AI failover in one sentence.');
  await page.getByRole('button', { name: 'Send request' }).click();

  await expect(page.getByText('Mock Gemini primary response.')).toBeVisible();
  await expect(page.getByText('Gemini', { exact: true }).first()).toBeVisible();
  await expect(page.getByRole('cell', { name: 'success' }).first()).toBeVisible();
  await expect(page.getByRole('cell', { name: 'off' }).first()).toBeVisible();
});

test('shows Claude fallback response and writes it to history', async ({ page }) => {
  await page.goto('/');
  await page.getByLabel('Prompt').fill('Explain AI failover in one sentence.');
  await page.getByLabel('Debug failover').check();
  await page.getByRole('button', { name: 'Send request' }).click();

  await expect(page.getByText('Mock Claude fallback response.')).toBeVisible();
  await expect(page.getByText('Claude', { exact: true }).first()).toBeVisible();
  await expect(page.getByRole('cell', { name: 'fallback_success' }).first()).toBeVisible();
  await expect(page.getByRole('cell', { name: 'on' }).first()).toBeVisible();
});
