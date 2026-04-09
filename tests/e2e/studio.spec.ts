import { expect, test } from "@playwright/test";

test("studio overview route loads", async ({ page }) => {
  await page.goto("/studio");

  await expect(
    page.getByRole("heading", { name: "Studio Overview" })
  ).toBeVisible();
  await expect(page.getByRole("link", { name: "Worlds" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Planning" })).toBeVisible();
});
