export type EffectivePeriod = Readonly<{
  validFrom: string;
  validTo: string | null;
}>;

export function effectivePeriodContains(
  period: EffectivePeriod,
  effectiveDate: string,
) {
  return (
    period.validFrom <= effectiveDate &&
    (period.validTo === null || effectiveDate < period.validTo)
  );
}

export function selectEffectivePeriod<T extends EffectivePeriod>(
  timeline: readonly T[],
  effectiveDate: string,
) {
  return timeline.find((period) =>
    effectivePeriodContains(period, effectiveDate),
  );
}

export type EffectivePeriodTransition<T extends EffectivePeriod> =
  | Readonly<{
      kind: "split";
      containing: T;
      precedingPeriod: EffectivePeriod;
      followingPeriod: EffectivePeriod;
    }>
  | Readonly<{
      kind: "conflict";
      reason: "existing-start" | "no-containing-period";
    }>;

export function decideEffectivePeriodTransition<T extends EffectivePeriod>(
  timeline: readonly T[],
  effectiveDate: string,
): EffectivePeriodTransition<T> {
  if (timeline.some((period) => period.validFrom === effectiveDate)) {
    return { kind: "conflict", reason: "existing-start" };
  }

  const containing = selectEffectivePeriod(timeline, effectiveDate);
  if (!containing) {
    return { kind: "conflict", reason: "no-containing-period" };
  }

  return {
    kind: "split",
    containing,
    precedingPeriod: {
      validFrom: containing.validFrom,
      validTo: effectiveDate,
    },
    followingPeriod: {
      validFrom: effectiveDate,
      validTo: containing.validTo,
    },
  };
}
