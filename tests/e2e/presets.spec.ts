import { test, expect } from "@playwright/test";

test.describe("Presets page", () => {
  test("presets page shows marketplace and content", async ({ page }) => {
    await page.goto("/presets");

    await expect(
      page.getByRole("heading", { name: /preset marketplace/i })
    ).toBeVisible();

    const emptyState = page.getByText("No presets published yet");
    const viewLink = page.getByRole("link", { name: "View" }).first();

    await expect(emptyState.or(viewLink)).toBeVisible();
  });
});
