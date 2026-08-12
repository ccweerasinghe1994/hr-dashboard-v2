import { describe, expect, test } from "bun:test";
import {
  ConflictError,
  NotFoundError,
  TenantUnavailableError,
} from "@/data/errors";
import {
  bootstrapErrorMessage,
  legalEntityMutationErrorMessage,
} from "@/data/expected-errors";

describe("expected setup errors", () => {
  test("preserves a friendly domain conflict", () => {
    expect(
      bootstrapErrorMessage(new ConflictError("Setup is already complete.")),
    ).toBe("Setup is already complete.");
  });

  test("translates a PostgreSQL conflict", () => {
    expect(bootstrapErrorMessage({ cause: { code: "23505" } })).toBe(
      "That email address or organization slug is already in use.",
    );
  });

  test("leaves unexpected failures unhandled", () => {
    expect(bootstrapErrorMessage(new Error("connection lost"))).toBeNull();
  });
});

describe("expected legal-entity mutation errors", () => {
  test.each([
    [
      "conflict",
      new ConflictError("A configuration already starts on that date."),
    ],
    ["not-found", new NotFoundError("Legal entity not found.")],
    ["tenant-unavailable", new TenantUnavailableError()],
  ])("preserves %s errors", (_name, error) => {
    expect(legalEntityMutationErrorMessage(error)).toBe(error.message);
  });

  test("translates a PostgreSQL conflict", () => {
    expect(legalEntityMutationErrorMessage({ code: "23P01" })).toBe(
      "That legal name or identifier conflicts with another effective record in this organization.",
    );
  });

  test("leaves unexpected failures unhandled", () => {
    expect(
      legalEntityMutationErrorMessage(new Error("connection lost")),
    ).toBeNull();
  });
});
