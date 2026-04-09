import { expect, test } from "@playwright/test";

import { DEMO_CHRONICLE_ID } from "./demo-fixture";

test("reader loads demo chronicle scene", async ({ page }) => {
  await page.goto(`/reader/chronicles/${DEMO_CHRONICLE_ID}/scene`);

  await expect(
    page.getByRole("heading", { name: "Current Scene" })
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Available Choices" })
  ).toBeVisible();
  await expect(page.getByText("Kind:")).toBeVisible();
});
