import { expect, test } from "@playwright/test";

import { DEMO_CHRONICLE_ID } from "./demo-fixture";

test("admin chronicle inspection route loads", async ({ page }) => {
  await page.goto(`/admin/chronicles/${DEMO_CHRONICLE_ID}`);

  await expect(
    page.getByRole("heading", { name: "Chronicle inspector hub" })
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: DEMO_CHRONICLE_ID })
  ).toBeVisible();
  await expect(page.getByText("Book version")).toBeVisible();
});
