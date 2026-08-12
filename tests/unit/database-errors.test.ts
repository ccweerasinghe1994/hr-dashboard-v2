import { describe, expect, test } from "bun:test";
import { isConstraintConflict } from "../../data/database-errors";

function wrapInCauses(error: unknown, count: number) {
  let wrapped = error;
  for (let index = 0; index < count; index += 1) {
    wrapped = { cause: wrapped };
  }
  return wrapped;
}

describe("database conflict classification", () => {
  test("recognizes direct PostgreSQL constraint codes", () => {
    expect(isConstraintConflict({ code: "23505" })).toBe(true);
    expect(isConstraintConflict({ code: "23P01" })).toBe(true);
    expect(isConstraintConflict({ code: 23505 })).toBe(true);
  });

  test.each([
    0, 1, 2, 3,
  ])("recognizes a conflict through %i nested causes", (causeCount) => {
    expect(
      isConstraintConflict(wrapInCauses({ code: "23505" }, causeCount)),
    ).toBe(true);
  });

  test("stops inspecting causes at the documented bound", () => {
    expect(isConstraintConflict(wrapInCauses({ code: "23505" }, 4))).toBe(
      false,
    );
  });

  test("does not classify unrelated failures as conflicts", () => {
    expect(isConstraintConflict({ cause: { code: "42501" } })).toBe(false);
    expect(isConstraintConflict(new Error("network failure"))).toBe(false);
  });

  test("does not throw for malformed errors", () => {
    const circular: { cause?: unknown } = {};
    circular.cause = circular;

    expect(isConstraintConflict(null)).toBe(false);
    expect(isConstraintConflict("23505")).toBe(false);
    expect(isConstraintConflict(circular)).toBe(false);
  });
});
