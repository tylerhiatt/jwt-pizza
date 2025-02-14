import { expect, test } from "playwright-test-coverage";
import {
  mockAuthRoute,
  mockFranchiseRoute,
  login,
  createFranchise,
  deleteFranchise,
  createStore,
  deleteStore,
} from "./util";
import type { Route } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await mockAuthRoute(page);
  await mockFranchiseRoute(page);
});

test("create and delete franchise", async ({ page }) => {
  await page.goto("/");
  await login(page, "testAdmin@jwt.com", "testAdmin");
  await createFranchise(page, "Franchise 2", "testFranchise@jwt.com");
  await deleteFranchise(page, "Franchise 2");
});

test("create and delete store fr", async ({ page }) => {
  await mockAuthRoute(page);
  await mockFranchiseRoute(page);
  await page.route("*/**/api/franchise/*", async (route: Route) => {
    if (route.request().method() === "GET") {
      const res = [
        {
          id: 2,
          name: "Franchise 2",
          admins: [
            {
              id: 1,
              name: "Test Owner",
              email: "testFranchise@jwt.com",
            },
          ],
          stores: [
            {
              id: 1,
              name: "Test Store",
            },
          ],
        },
      ];
      await route.fulfill({ json: res });
    } else {
      test.fail();
    }
  });
  await page.route("*/**/api/franchise/*/store", async (route: Route) => {
    if (route.request().method() === "POST") {
      const req = {
        id: "",
        name: "Test Store",
      };
      const res = {
        id: 1,
        franchiseId: 2,
        name: "Test Store",
      };
      expect(route.request().postDataJSON()).toMatchObject(req);
      await route.fulfill({ json: res });
    } else {
      test.fail();
    }
  });
  await page.route("*/**/api/franchise/*/store/*", async (route: Route) => {
    if (route.request().method() === "DELETE") {
      const res = {
        message: "store deleted",
      };
      await route.fulfill({ json: res });
    } else {
      test.fail();
    }
  });

  await page.goto("/");
  await page
    .getByLabel("Global")
    .getByRole("link", { name: "Franchise" })
    .click();
  await page.getByRole("link", { name: "login", exact: true }).click();
  await page
    .getByRole("textbox", { name: "Email address" })
    .fill("testAdmin@jwt.com");
  await page.getByRole("textbox", { name: "Password" }).click();
  await page.getByRole("textbox", { name: "Password" }).fill("testAdmin");
  await page.getByRole("button", { name: "Login" }).click();
  await expect(page.getByText("Franchise 2")).toBeVisible();

  await createStore(page, "Test Store");
  await deleteStore(page, "Franchise 2", "Test Store");

  await page.getByRole("link", { name: "Logout" }).click();
  await page
    .getByRole("contentinfo")
    .getByRole("link", { name: "Franchise" })
    .click();
  await expect(page.getByRole("main")).toContainText(
    "So you want a piece of the pie?"
  );
});
