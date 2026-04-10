import { expect, test } from "@playwright/test";

import { DEMO_CHRONICLE_LABEL } from "./demo-fixture";

test("reader demo flow navigates chronicles -> summary -> scene", async ({
  page
}) => {
  await page.goto("/reader/chronicles");

  await expect(page.getByRole("heading", { name: "Chronicles" })).toBeVisible();
  await expect(
    page.getByRole("heading", { name: DEMO_CHRONICLE_LABEL })
  ).toBeVisible();
  await page.getByRole("link", { name: "Story so far" }).first().click();

  await expect(page.getByRole("heading", { name: "Story So Far" })).toBeVisible();
  await page.getByRole("link", { name: "Continue reading" }).click();

  await expect(
    page.getByRole("heading", { name: "Current Scene" })
  ).toBeVisible();
});
