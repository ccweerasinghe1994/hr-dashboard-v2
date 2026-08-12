import { describe, expect, test } from "bun:test";
import {
  bootstrapSchema,
  legalEntityIdSchema,
  legalEntitySchema,
  localeSchema,
  signInSchema,
  tenantSlugSchema,
  timezoneSchema,
  updateTenantSchema,
} from "@/lib/validation/organization";

const validSetup = {
  bootstrapSecret: "setup-secret",
  ownerName: "Ada Lovelace",
  email: "ada@example.com",
  password: "a".repeat(12),
  tenantName: "Analytical Engines",
  tenantSlug: "analytical-engines",
  locale: "en-US",
  timezone: "Europe/London",
};

describe("setup validation", () => {
  test("trims and normalizes accepted setup values", () => {
    const result = bootstrapSchema.safeParse({
      ...validSetup,
      ownerName: "  Ada Lovelace  ",
      email: "  ADA@EXAMPLE.COM  ",
      tenantName: "  Analytical Engines  ",
      tenantSlug: "  Analytical-Engines  ",
      locale: "  en-US  ",
      timezone: "  Europe/London  ",
    });

    expect(result.success).toBe(true);
    if (!result.success) return;
    expect(result.data).toMatchObject({
      ownerName: "Ada Lovelace",
      email: "ada@example.com",
      tenantName: "Analytical Engines",
      tenantSlug: "analytical-engines",
      locale: "en-US",
      timezone: "Europe/London",
    });
  });

  for (const field of Object.keys(validSetup) as (keyof typeof validSetup)[]) {
    test(`requires ${field}`, () => {
      expect(
        bootstrapSchema.safeParse({ ...validSetup, [field]: "" }).success,
      ).toBe(false);
    });
  }

  test.each([
    ["owner@example.com", true],
    ["owner+payroll@example.co.uk", true],
    ["owner-at-example.com", false],
    ["owner@example", false],
  ])("classifies email %s", (email, accepted) => {
    expect(bootstrapSchema.safeParse({ ...validSetup, email }).success).toBe(
      accepted,
    );
  });

  test.each([
    [11, false],
    [12, true],
    [128, true],
    [129, false],
  ])("classifies a %i-character password", (length, accepted) => {
    expect(
      bootstrapSchema.safeParse({
        ...validSetup,
        password: "a".repeat(length),
      }).success,
    ).toBe(accepted);
  });

  test("normalizes a tenant slug", () => {
    expect(tenantSlugSchema.parse("  ACME-Holdings  ")).toBe("acme-holdings");
  });

  test.each([
    "ab",
    "a".repeat(49),
    "-acme",
    "acme--holdings",
    "acme_holdings",
  ])("rejects tenant slug %s", (slug) => {
    expect(tenantSlugSchema.safeParse(slug).success).toBe(false);
  });

  test.each([
    ["en-US", true],
    ["si-LK", true],
    ["en-us", false],
    ["not_a_locale", false],
  ])("classifies canonical locale %s", (locale, accepted) => {
    expect(localeSchema.safeParse(locale).success).toBe(accepted);
  });

  test.each([
    ["UTC", true],
    ["Asia/Colombo", true],
    ["Europe/London", true],
    ["Mars/Olympus", false],
  ])("classifies IANA timezone %s", (timezone, accepted) => {
    expect(timezoneSchema.safeParse(timezone).success).toBe(accepted);
  });
});

describe("sign-in validation", () => {
  test("trims and lowercases the email without changing the password", () => {
    expect(
      signInSchema.parse({
        email: "  ADA@EXAMPLE.COM  ",
        password: " pass phrase ",
      }),
    ).toEqual({
      email: "ada@example.com",
      password: " pass phrase ",
    });
  });

  test.each(["email", "password"])("requires %s", (field) => {
    expect(
      signInSchema.safeParse({
        email: "ada@example.com",
        password: "password",
        [field]: "",
      }).success,
    ).toBe(false);
  });

  test.each([
    128, 129,
  ])("accepts an existing password at %i characters", (length) => {
    expect(
      signInSchema.safeParse({
        email: "ada@example.com",
        password: "a".repeat(length),
      }).success,
    ).toBe(true);
  });
});

describe("tenant-settings validation", () => {
  const validSettings = {
    name: "Analytical Engines",
    locale: "en-US",
    timezone: "Europe/London",
  };

  test("trims accepted settings", () => {
    expect(
      updateTenantSchema.parse({
        name: "  Analytical Engines  ",
        locale: "  en-US  ",
        timezone: "  Europe/London  ",
      }),
    ).toEqual(validSettings);
  });

  test.each(["name", "locale", "timezone"])("requires %s", (field) => {
    expect(
      updateTenantSchema.safeParse({ ...validSettings, [field]: "" }).success,
    ).toBe(false);
  });

  test.each([
    [120, true],
    [121, false],
  ])("classifies a %i-character organization name", (length, accepted) => {
    expect(
      updateTenantSchema.safeParse({
        ...validSettings,
        name: "a".repeat(length),
      }).success,
    ).toBe(accepted);
  });
});

describe("legal-entity validation", () => {
  const validLegalEntity = {
    legalName: "Analytical Engines Ltd",
    countryCode: "GB",
    currencyCode: "GBP",
    effectiveDate: "2026-08-12",
    reason: "Initial configuration",
  };

  test("normalizes required values and defaults omitted optional values", () => {
    expect(
      legalEntitySchema.parse({
        ...validLegalEntity,
        legalName: "  Analytical Engines Ltd  ",
        countryCode: "  gb  ",
        currencyCode: "",
        reason: "  Initial configuration  ",
      }),
    ).toEqual({
      legalName: "Analytical Engines Ltd",
      displayName: "",
      countryCode: "GB",
      registrationNumber: "",
      taxIdentifier: "",
      currencyCode: "",
      effectiveDate: "2026-08-12",
      reason: "Initial configuration",
    });
  });

  test.each([
    "legalName",
    "countryCode",
    "effectiveDate",
    "reason",
  ])("requires %s", (field) => {
    expect(
      legalEntitySchema.safeParse({ ...validLegalEntity, [field]: "" }).success,
    ).toBe(false);
  });

  test.each([
    ["legalName", 180, true],
    ["legalName", 181, false],
    ["displayName", 120, true],
    ["displayName", 121, false],
  ] as const)("classifies %s at %i characters", (field, length, accepted) => {
    expect(
      legalEntitySchema.safeParse({
        ...validLegalEntity,
        [field]: "a".repeat(length),
      }).success,
    ).toBe(accepted);
  });

  test.each([
    ["  lk  ", true, "LK"],
    ["ZZ", true, "ZZ"],
    ["L", false, undefined],
    ["LKA", false, undefined],
    ["1K", false, undefined],
  ] as const)("classifies country code %s", (countryCode, accepted, output) => {
    const result = legalEntitySchema.safeParse({
      ...validLegalEntity,
      countryCode,
    });
    expect(result.success).toBe(accepted);
    if (output !== undefined) {
      expect(result.success).toBe(true);
      if (result.success) expect(result.data.countryCode).toBe(output);
    }
  });

  test.each([
    ["  lkr  ", true, "LKR"],
    ["", true, ""],
    ["LK", false, undefined],
    ["LKRK", false, undefined],
    ["1KR", false, undefined],
  ] as const)("classifies currency code %s", (currencyCode, accepted, output) => {
    const result = legalEntitySchema.safeParse({
      ...validLegalEntity,
      currencyCode,
    });
    expect(result.success).toBe(accepted);
    if (output !== undefined) {
      expect(result.success).toBe(true);
      if (result.success) expect(result.data.currencyCode).toBe(output);
    }
  });

  test.each([
    ["2026-02-28", true],
    ["2026-02-29", false],
    ["2026-13-01", false],
    ["2026-08-12T00:00:00Z", false],
  ])("classifies effective date %s", (effectiveDate, accepted) => {
    expect(
      legalEntitySchema.safeParse({ ...validLegalEntity, effectiveDate })
        .success,
    ).toBe(accepted);
  });

  test.each([
    [0, false],
    [300, true],
    [301, false],
  ])("classifies a %i-character reason", (length, accepted) => {
    expect(
      legalEntitySchema.safeParse({
        ...validLegalEntity,
        reason: "a".repeat(length),
      }).success,
    ).toBe(accepted);
  });

  test.each([
    ["123e4567-e89b-42d3-a456-426614174000", true],
    ["123e4567-e89b-42d3-c456-426614174000", false],
    ["not-a-uuid", false],
  ])("classifies legal-entity identifier %s", (identifier, accepted) => {
    expect(legalEntityIdSchema.safeParse(identifier).success).toBe(accepted);
  });
});
