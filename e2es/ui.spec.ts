import { test, expect } from "@playwright/test";

test("card generation", async ({ page }) => {
  await page.goto("http://localhost:8788/");
  await expect(page.locator("div").first()).toBeVisible();
  await expect(page.locator("div").nth(1)).toBeVisible();
  await page.getByPlaceholder("title").click();
  await page.getByPlaceholder("title").fill("Test Title");
  await page.getByPlaceholder("description...").click();
  await page.getByPlaceholder("description...").fill("Test Description");
  await page.getByRole("button", { name: "Generate" }).click();
  await expect(
    page.getByRole("img", { name: "card illustration" })
  ).toBeVisible();
  await expect(page.getByText("Test Title")).toBeVisible();
  await expect(page.getByText("Test Description")).toBeVisible();
});
