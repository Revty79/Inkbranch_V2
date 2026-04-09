import { expect, test } from "@playwright/test";

import { DEMO_CHRONICLE_ID } from "./demo-fixture";

test("reader demo flow navigates chronicles -> summary -> scene", async ({
  page
}) => {
  await page.goto("/reader/chronicles");

  await expect(page.getByRole("heading", { name: "Chronicles" })).toBeVisible();
  await expect(page.getByText(DEMO_CHRONICLE_ID)).toBeVisible();
  await page.getByRole("link", { name: "Open summary" }).first().click();

  await expect(
    page.getByRole("heading", { name: "Chronicle Summary" })
  ).toBeVisible();
  await page.getByRole("link", { name: "Open current scene" }).click();

  await expect(
    page.getByRole("heading", { name: "Current Scene" })
  ).toBeVisible();
});
