import { test, expect } from "@playwright/test";

test("card generation", async ({ page }) => {
  await page.goto("http://localhost:8788/");
  await expect(page.getByTestId("card")).toBeVisible();
  await expect(page.getByTestId("card-image-placeholder")).toBeVisible();
  await page.getByTestId("card-title-input").click();
  await page.getByTestId("card-title-input").fill("Test Title");
  await page.getByTestId("card-description-input").click();
  await page.getByTestId("card-description-input").fill("Test Description");
  await page.getByTestId("card-generate-btn").click();
  await expect(page.getByTestId("card-image")).toBeVisible();
  await expect(page.getByTestId("card-title")).toBeVisible();
  await expect(page.getByTestId("card-title")).toContainText("Test Title");
  await expect(page.getByTestId("card-description")).toBeVisible();
  await expect(page.getByTestId("card-description")).toContainText(
    "Test Description"
  );
});

test("card loading indicator", async ({ page }) => {
  await page.goto("http://localhost:8788/");
  await expect(page.getByTestId("card-loading-indicator")).not.toBeVisible();
  await page.getByTestId("card-title-input").fill("Test Title");
  await page.getByTestId("card-description-input").fill("Test Description");
  await page.getByTestId("card-generate-btn").click();
  await expect(page.getByTestId("card-loading-indicator")).toBeVisible();
  await expect(page.getByTestId("card-loading-indicator")).not.toBeVisible();
});
