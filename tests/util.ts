import { expect, test } from "playwright-test-coverage";
import type { Page, Route } from "@playwright/test";

export const mockAuthRoute = async (page: Page) => {
  await page.route("*/**/api/auth", async (route: Route) => {
    if (route.request().method() === "POST") {
      const req = {
        name: "Test Diner",
        email: "testDiner@jwt.com",
        password: "testDiner",
      };
      const res = {
        user: {
          name: "Test Diner",
          email: "testDiner@jwt.com",
          roles: [{ role: "diner" }],
          id: 1,
        },
        token: "testDiner",
      };
      expect(route.request().postDataJSON()).toMatchObject(req);
      return route.fulfill({ json: res });
    }

    if (route.request().method() === "PUT") {
      const req = { email: "testAdmin@jwt.com", password: "testAdmin" };
      const res = {
        user: {
          id: 2,
          name: "Test Admin",
          email: "testAdmin@jwt.com",
          roles: [{ role: "admin" }],
        },
        token: "testAdmin",
      };
      expect(route.request().postDataJSON()).toMatchObject(req);
      return route.fulfill({ json: res });
    }

    if (route.request().method() === "DELETE") {
      return route.fulfill({ json: { message: "logout successful" } });
    }

    test.fail(); // fail test otherwise
  });
};

export const mockFranchiseRoute = async (page: Page) => {
  await page.route("*/**/api/franchise", async (route: Route) => {
    if (route.request().method() === "GET") {
      const res = [
        {
          id: 1,
          name: "Franchise 1",
          stores: [],
        },
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
    } else if (route.request().method() === "POST") {
      const req = {
        stores: [],
        id: "",
        name: "Franchise 2",
        admins: [
          {
            email: "testFranchise@jwt.com",
          },
        ],
      };
      const res = {
        stores: [],
        id: 2,
        name: "Franchise 2",
        admins: [
          {
            email: "testFranchise@jwt.com",
            id: 1,
            name: "Test Owner",
          },
        ],
      };
      expect(route.request().postDataJSON()).toMatchObject(req);
      await route.fulfill({ json: res });
    } else {
      test.fail();
    }
  });
};

export async function registerUser(
  page: Page,
  fullName: string,
  email: string,
  password: string
) {
  await page.getByRole("link", { name: "Register" }).click();
  await expect(page.getByRole("heading")).toContainText("Welcome to the party");

  await page.getByRole("main").getByText("Login").click();
  await expect(page.getByRole("heading")).toContainText("Welcome back");
  await page.getByRole("main").getByText("Register").click();

  await page.getByRole("textbox", { name: "Full name" }).fill(fullName);
  await page.getByRole("textbox", { name: "Email address" }).fill(email);
  await page.getByRole("textbox", { name: "Password" }).fill(password);

  await page.getByRole("button", { name: "Register" }).click();
}

export async function login(page: Page, email: string, password: string) {
  await page.getByRole("link", { name: "Login", exact: true }).click();
  await page.getByRole("textbox", { name: "Email address" }).fill(email);
  await page.getByRole("textbox", { name: "Password" }).fill(password);
  await page.getByRole("button", { name: "Login" }).click();
}

export async function createFranchise(page: Page, name: string, email: string) {
  await page.getByRole("link", { name: "Admin" }).click();
  await page.getByRole("button", { name: "Add Franchise" }).click();
  await page.getByRole("textbox", { name: "franchise name" }).fill(name);
  await page
    .getByRole("textbox", { name: "franchisee admin email" })
    .fill(email);
  await page.getByRole("button", { name: "Create" }).click();
  await expect(page.getByRole("cell", { name })).toBeVisible();
}

export async function deleteFranchise(page: Page, name: string) {
  await page.getByRole("cell", { name: "Test Owner" }).click();
  await page
    .getByRole("row", { name: `${name} Test Owner` })
    .getByRole("button")
    .click();
  await expect(page.getByText("Sorry to see you go")).toBeVisible();
  await expect(page.getByText(name)).toBeVisible();
  await page.getByRole("button", { name: "Close" }).click();
}

export async function createStore(page: Page, name: string) {
  await page.getByRole("button", { name: "Create store" }).click();
  await page.getByRole("textbox", { name: "store name" }).fill(name);
  await page.getByRole("button", { name: "Create" }).click();
  await expect(page.getByRole("cell", { name })).toBeVisible();
}

export async function deleteStore(
  page: Page,
  franchiseName: string,
  storeName: string
) {
  await page.getByRole("button", { name: "Close" }).click();
  await expect(page.getByRole("main")).toContainText(
    `Sorry to see you goAre you sure you want to close the ${franchiseName} store ${storeName} ? This cannot be restored. All outstanding revenue will not be refunded.CloseCancel`
  );
  await page.getByRole("button", { name: "Close" }).click();
  await expect(page.getByRole("main")).toContainText(
    "Everything you need to run an JWT Pizza franchise."
  );
}
