import { test, expect } from '@playwright/test';

test('homepage loads and has CTA', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByText('Fast, Fair Garage Door Service')).toBeVisible();
  await expect(page.getByRole('link', { name: 'Get an instant estimate' })).toBeVisible();
});

test('pricing page calculates', async ({ page }) => {
  await page.goto('/pricing');
  await page.getByLabel('ZIP Code').fill('90210');
  await page.getByRole('button', { name: 'Calculate' }).click();
  await expect(page.getByText('Good')).toBeVisible();
});

