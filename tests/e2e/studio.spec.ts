import { expect, test } from "@playwright/test";

test("studio overview route loads", async ({ page }) => {
  await page.goto("/studio");

  await expect(
    page.getByRole("heading", { name: "Studio Overview" })
  ).toBeVisible();
  await expect(
    page
      .getByLabel("Studio sections")
      .getByRole("link", { name: "Worlds", exact: true })
  ).toBeVisible();
  await expect(
    page
      .getByLabel("Studio sections")
      .getByRole("link", { name: "Planning", exact: true })
  ).toBeVisible();
});
