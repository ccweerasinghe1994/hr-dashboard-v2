import { describe, expect, test } from "bun:test";
import { createTenantDateTimeFormatter } from "@/lib/date-time";

describe("tenant date-time formatting", () => {
  const recordedAt = new Date("2026-08-12T18:30:00.000Z");

  test("renders the same instant in the tenant timezone", () => {
    const utc = createTenantDateTimeFormatter({
      locale: "en-US",
      timezone: "UTC",
    }).format(recordedAt);
    const colombo = createTenantDateTimeFormatter({
      locale: "en-US",
      timezone: "Asia/Colombo",
    }).format(recordedAt);

    expect(utc).toContain("Aug 12, 2026");
    expect(colombo).toContain("Aug 13, 2026");
    expect(colombo).not.toBe(utc);
  });

  test("uses the tenant locale for the rendered value", () => {
    const us = createTenantDateTimeFormatter({
      locale: "en-US",
      timezone: "UTC",
    }).format(recordedAt);
    const gb = createTenantDateTimeFormatter({
      locale: "en-GB",
      timezone: "UTC",
    }).format(recordedAt);

    expect(us).toContain("Aug 12, 2026");
    expect(gb).toContain("12 Aug 2026");
  });
});
