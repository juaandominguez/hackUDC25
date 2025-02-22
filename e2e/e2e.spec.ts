import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
  await page.goto('http://localhost:3000/');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/ZaraMatch/);
});

test("Login page", async ({ page }) => {
  await page.goto("http://localhost:3000/tindress");
  await expect(page).toHaveURL("http://localhost:3000/sign-in");

  await page.goto("http://localhost:3000/search");

  await expect(page).toHaveTitle(/ZaraMatch/);
});
