import { expect, test } from "playwright-test-coverage";
import { mockAuthRoute, login, registerUser } from "./util";

test.beforeEach(async ({ page }) => {
  await mockAuthRoute(page);
  await page.goto("/");
});

test("register", async ({ page }) => {
  await registerUser(page, "Test Diner", "testDiner@jwt.com", "testDiner");

  await expect(page.getByRole("link", { name: "TD" })).toBeVisible();
  await page.getByRole("link", { name: "Logout" }).click();
  await expect(page.getByRole("link", { name: "Logout" })).not.toBeVisible();
});

test("login and logout", async ({ page }) => {
  await login(page, "testAdmin@jwt.com", "testAdmin");

  await expect(page.getByRole("link", { name: "TA" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Order now" })).toBeVisible();
  await expect(page.locator("#navbar-dark")).not.toContainText("Login");

  await page.getByRole("link", { name: "Logout" }).click();
  await expect(page.locator("#navbar-dark")).toContainText("Login");
});

test("view user page after logging in", async ({ page }) => {
  await login(page, "testAdmin@jwt.com", "testAdmin");

  await page.getByRole("link", { name: "TA" }).click();

  await expect(page.getByRole("main")).toContainText("Test Admin");
  await expect(page.getByText("testAdmin@jwt.com")).toBeVisible();
  await expect(page.getByText("admin", { exact: true })).toBeVisible();
});
