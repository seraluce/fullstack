import { test, expect } from "@playwright/test";

test.describe("home page", () => {
  test("redirects to /en and shows the hero", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveURL(/\/(en|zh)/);
    await expect(
      page.getByRole("heading", { name: /next\.js full-stack template/i }),
    ).toBeVisible();
  });

  test("locale switcher changes language", async ({ page }) => {
    await page.goto("/en");
    // Click the locale switcher trigger and pick 中文.
    await page.getByRole("button", { name: /^en$/i }).click();
    await page.getByRole("option", { name: /中文/ }).click();
    await expect(page).toHaveURL(/\/zh/);
  });
});

test.describe("auth flow", () => {
  test("logs in with demo credentials and reaches the dashboard", async ({
    page,
  }) => {
    await page.goto("/en/login");
    await page.getByLabel(/email/i).fill("demo@example.com");
    await page.getByLabel(/password/i).fill("demo1234");
    await page.getByRole("button", { name: /sign in/i }).click();

    await expect(page).toHaveURL(/\/en\/dashboard/);
    await expect(
      page.getByRole("heading", { name: /dashboard/i }),
    ).toBeVisible();
  });
});
