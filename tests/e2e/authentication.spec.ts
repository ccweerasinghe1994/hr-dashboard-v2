import { expect, test } from "@playwright/test";
import { readE2eFixture } from "../support/e2e-fixture";

const fixture = readE2eFixture();

test.describe
  .serial("first setup and authentication", () => {
    test("first setup creates the tenant owner and signs them in", async ({
      page,
    }) => {
      await page.goto("/setup");

      await expect(
        page.getByRole("heading", { name: "Set up TeamHub" }),
      ).toBeVisible();
      await page.getByLabel("Bootstrap secret").fill(fixture.bootstrapSecret);
      await page.getByLabel("Full name").fill(fixture.ownerName);
      await page.getByLabel("Email address").fill(fixture.ownerEmail);
      await page.getByLabel("Password").fill(fixture.ownerPassword);
      await page.getByLabel("Organization name").fill(fixture.tenantName);
      await page.getByLabel("Permanent slug").fill(fixture.tenantSlug);
      await page.getByRole("button", { name: "Create organization" }).click();

      await expect(page).toHaveURL(/\/settings\/organization$/);
      await expect(
        page.getByRole("heading", { level: 1, name: fixture.tenantName }),
      ).toBeVisible();
    });

    test("setup closes after the first successful provisioning", async ({
      page,
    }) => {
      await page.goto("/setup");

      await expect(page).toHaveURL(/\/sign-in$/);
      await expect(
        page.getByRole("heading", { name: "Welcome back" }),
      ).toBeVisible();
    });

    test("owner can sign out, reject invalid credentials, and restore a session", async ({
      context,
      page,
    }) => {
      await page.goto("/sign-in");
      await page.getByLabel("Email address").fill(fixture.ownerEmail);
      await page.getByLabel("Password").fill(fixture.ownerPassword);
      await page.getByRole("button", { name: "Sign in" }).click();
      await expect(page).toHaveURL(/\/settings\/organization$/);

      await page.getByRole("button", { name: "Sign out" }).click();
      await expect(page).toHaveURL(/\/sign-in$/);

      await page.getByLabel("Email address").fill(fixture.ownerEmail);
      await page.getByLabel("Password").fill("not-the-owner-password");
      await page.getByRole("button", { name: "Sign in" }).click();
      await expect(
        page.getByRole("alert").filter({
          hasText: "The email address or password is incorrect.",
        }),
      ).toBeVisible();

      await page.getByLabel("Email address").fill(fixture.ownerEmail);
      await page.getByLabel("Password").fill(fixture.ownerPassword);
      await page.getByRole("button", { name: "Sign in" }).click();
      await expect(page).toHaveURL(/\/settings\/organization$/);

      const persistedSessionPage = await context.newPage();
      await persistedSessionPage.goto("/settings/organization");
      await expect(
        persistedSessionPage.getByRole("heading", {
          level: 1,
          name: fixture.tenantName,
        }),
      ).toBeVisible();
    });
  });
