import { describe, expect, test } from "bun:test";
import {
  decideEffectivePeriodTransition,
  effectivePeriodContains,
  selectEffectivePeriod,
} from "@/lib/organization/effective-periods";

const timeline = [
  {
    name: "original",
    validFrom: "2025-01-01",
    validTo: "2025-07-01",
  },
  {
    name: "scheduled",
    validFrom: "2025-07-01",
    validTo: null,
  },
] as const;

describe("effective-period policy", () => {
  test("treats starts as inclusive and ends as exclusive", () => {
    expect(effectivePeriodContains(timeline[0], "2025-01-01")).toBeTrue();
    expect(effectivePeriodContains(timeline[0], "2025-06-30")).toBeTrue();
    expect(effectivePeriodContains(timeline[0], "2025-07-01")).toBeFalse();
    expect(selectEffectivePeriod(timeline, "2025-07-01")?.name).toBe(
      "scheduled",
    );
  });

  test("describes a future split of an open-ended period", () => {
    expect(
      decideEffectivePeriodTransition(
        [{ name: "original", validFrom: "2025-01-01", validTo: null }],
        "2025-07-01",
      ),
    ).toEqual({
      kind: "split",
      containing: {
        name: "original",
        validFrom: "2025-01-01",
        validTo: null,
      },
      precedingPeriod: {
        validFrom: "2025-01-01",
        validTo: "2025-07-01",
      },
      followingPeriod: {
        validFrom: "2025-07-01",
        validTo: null,
      },
    });
  });

  test("describes a backdated split inside a bounded period", () => {
    expect(decideEffectivePeriodTransition(timeline, "2025-04-01")).toEqual({
      kind: "split",
      containing: timeline[0],
      precedingPeriod: {
        validFrom: "2025-01-01",
        validTo: "2025-04-01",
      },
      followingPeriod: {
        validFrom: "2025-04-01",
        validTo: "2025-07-01",
      },
    });
  });

  test("rejects a transition on an existing start date", () => {
    expect(decideEffectivePeriodTransition(timeline, "2025-07-01")).toEqual({
      kind: "conflict",
      reason: "existing-start",
    });
  });

  test("rejects a transition before the first period", () => {
    expect(decideEffectivePeriodTransition(timeline, "2024-12-31")).toEqual({
      kind: "conflict",
      reason: "no-containing-period",
    });
  });
});
