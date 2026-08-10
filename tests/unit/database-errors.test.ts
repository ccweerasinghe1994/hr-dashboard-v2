import { describe, expect, test } from "bun:test";
import { isConstraintConflict } from "../../data/database-errors";

describe("database conflict classification", () => {
  test("recognizes direct PostgreSQL constraint codes", () => {
    expect(isConstraintConflict({ code: "23505" })).toBe(true);
    expect(isConstraintConflict({ code: "23P01" })).toBe(true);
  });

  test("recognizes codes wrapped by a query error", () => {
    expect(
      isConstraintConflict({
        message: "Failed query",
        cause: { code: "23505" },
      }),
    ).toBe(true);
  });

  test("does not classify unrelated failures as conflicts", () => {
    expect(isConstraintConflict({ cause: { code: "42501" } })).toBe(false);
    expect(isConstraintConflict(new Error("network failure"))).toBe(false);
  });
});
