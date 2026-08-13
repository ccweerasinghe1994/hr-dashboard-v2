import { and, asc, eq, gt, isNull, lte, or, sql } from "drizzle-orm";
import { ConflictError, NotFoundError } from "@/data/errors";
import type { TenantTransaction } from "@/data/tenant-context";
import {
  auditEvents,
  legalEntities,
  legalEntityConfigurations,
} from "@/db/schema";
import { normalizeIdentifier } from "../security/legal-identifiers-core";
import {
  decideEffectivePeriodTransition,
  selectEffectivePeriod,
} from "./effective-periods";
import {
  toLegalEntityAuditSnapshot,
  toLegalEntitySummary,
} from "./legal-entity-boundaries";

export type LegalEntityPersistenceTransaction = TenantTransaction;

export type LegalEntityInput = {
  legalName: string;
  displayName: string;
  countryCode: string;
  registrationNumber: string;
  taxIdentifier: string;
  currencyCode: string;
  effectiveDate: string;
  reason: string;
};

export type LegalEntityTenantContext = Readonly<{
  tenantId: string;
  userId: string;
}>;

type ProtectedTaxIdentifier = Readonly<{
  ciphertext: string;
  hash: string;
  lastFour: string;
}>;

type ProtectTaxIdentifier = (value: string) => ProtectedTaxIdentifier;

type TransactionClock = () => Date;

type ProtectedTaxIdentifierFallback = Readonly<{
  ciphertext: string | null;
  hash: string | null;
  lastFour: string | null;
}>;

function normalizedName(name: string) {
  return name.normalize("NFKC").trim().replace(/\s+/g, " ").toLocaleLowerCase();
}

function optional(value: string) {
  const trimmed = value.trim();
  return trimmed ? trimmed : null;
}

export const legalEntityConfigurationSelection = {
  configurationId: legalEntityConfigurations.id,
  legalEntityId: legalEntityConfigurations.legalEntityId,
  legalName: legalEntityConfigurations.legalName,
  displayName: legalEntityConfigurations.displayName,
  countryCode: legalEntityConfigurations.countryCode,
  registrationNumber: legalEntityConfigurations.registrationNumber,
  taxIdentifierLastFour: legalEntityConfigurations.taxIdentifierLastFour,
  currencyCode: legalEntityConfigurations.currencyCode,
  status: legalEntityConfigurations.status,
  validFrom: legalEntityConfigurations.validFrom,
  validTo: legalEntityConfigurations.validTo,
  changeReason: legalEntityConfigurations.changeReason,
  recordedAt: legalEntityConfigurations.recordedAt,
  supersededAt: legalEntityConfigurations.supersededAt,
};

export function buildLegalEntityConfigurationValues(
  input: LegalEntityInput,
  context: LegalEntityTenantContext,
  legalEntityId: string,
  protectTaxIdentifier: ProtectTaxIdentifier,
  taxFallback?: ProtectedTaxIdentifierFallback,
) {
  const protectedTax = input.taxIdentifier
    ? protectTaxIdentifier(input.taxIdentifier)
    : taxFallback;
  const registrationNumber = optional(input.registrationNumber);
  return {
    tenantId: context.tenantId,
    legalEntityId,
    legalName: input.legalName,
    normalizedLegalName: normalizedName(input.legalName),
    displayName: optional(input.displayName),
    countryCode: input.countryCode,
    registrationNumber,
    normalizedRegistrationNumber: registrationNumber
      ? normalizeIdentifier(registrationNumber)
      : null,
    taxIdentifierCiphertext: protectedTax?.ciphertext ?? null,
    taxIdentifierHash: protectedTax?.hash ?? null,
    taxIdentifierLastFour: protectedTax?.lastFour ?? null,
    currencyCode: optional(input.currencyCode),
    validFrom: input.effectiveDate,
    changeReason: input.reason,
    recordedBy: context.userId,
  };
}

export async function createLegalEntityForTenant(
  tx: LegalEntityPersistenceTransaction,
  context: LegalEntityTenantContext,
  input: LegalEntityInput,
  protectTaxIdentifier: ProtectTaxIdentifier,
  transactionClock: TransactionClock = () => new Date(),
) {
  const [entity] = await tx
    .insert(legalEntities)
    .values({ tenantId: context.tenantId, createdBy: context.userId })
    .returning({ id: legalEntities.id });
  const recordedAt = transactionClock();
  const [configuration] = await tx
    .insert(legalEntityConfigurations)
    .values({
      ...buildLegalEntityConfigurationValues(
        input,
        context,
        entity.id,
        protectTaxIdentifier,
      ),
      recordedAt,
    })
    .returning(legalEntityConfigurationSelection);
  await tx.insert(auditEvents).values({
    tenantId: context.tenantId,
    actorUserId: context.userId,
    source: "ui",
    action: "legal_entity.created",
    objectType: "legal_entity",
    objectId: entity.id,
    effectiveDate: input.effectiveDate,
    reason: input.reason,
    after: toLegalEntityAuditSnapshot(configuration),
    occurredAt: recordedAt,
  });
  return entity;
}

export async function listLegalEntitiesForTenant(
  tx: LegalEntityPersistenceTransaction,
  tenantId: string,
  asOfDate: string,
) {
  const rows = await tx
    .select(legalEntityConfigurationSelection)
    .from(legalEntityConfigurations)
    .where(
      and(
        eq(legalEntityConfigurations.tenantId, tenantId),
        isNull(legalEntityConfigurations.supersededAt),
      ),
    )
    .orderBy(
      asc(legalEntityConfigurations.legalEntityId),
      asc(legalEntityConfigurations.validFrom),
    );
  const byEntity = Map.groupBy(rows, (row) => row.legalEntityId);
  return Array.from(byEntity.values())
    .map((configurations) => {
      const current = selectEffectivePeriod(configurations, asOfDate);
      return toLegalEntitySummary(current ?? configurations[0]);
    })
    .sort((left, right) => left.legalName.localeCompare(right.legalName));
}

export async function lockLegalEntityForTenant(
  tx: LegalEntityPersistenceTransaction,
  context: LegalEntityTenantContext,
  legalEntityId: string,
) {
  const result = await tx.execute(
    sql`select id from legal_entity where tenant_id = ${context.tenantId} and id = ${legalEntityId} for update`,
  );
  if (result.length === 0) throw new NotFoundError("Legal entity not found.");
}

export async function findContainingLegalEntityConfiguration(
  tx: LegalEntityPersistenceTransaction,
  context: LegalEntityTenantContext,
  legalEntityId: string,
  effectiveDate: string,
) {
  const [configuration] = await tx
    .select()
    .from(legalEntityConfigurations)
    .where(
      and(
        eq(legalEntityConfigurations.tenantId, context.tenantId),
        eq(legalEntityConfigurations.legalEntityId, legalEntityId),
        isNull(legalEntityConfigurations.supersededAt),
        lte(legalEntityConfigurations.validFrom, effectiveDate),
        or(
          isNull(legalEntityConfigurations.validTo),
          gt(legalEntityConfigurations.validTo, effectiveDate),
        ),
      ),
    )
    .limit(1);
  return configuration;
}

export async function scheduleLegalEntityChangeForTenant(
  tx: LegalEntityPersistenceTransaction,
  context: LegalEntityTenantContext,
  legalEntityId: string,
  input: LegalEntityInput,
  protectTaxIdentifier: ProtectTaxIdentifier,
  transactionClock: TransactionClock = () => new Date(),
) {
  await lockLegalEntityForTenant(tx, context, legalEntityId);
  const prior = await findContainingLegalEntityConfiguration(
    tx,
    context,
    legalEntityId,
    input.effectiveDate,
  );
  const transition = decideEffectivePeriodTransition(
    prior ? [prior] : [],
    input.effectiveDate,
  );
  if (transition.kind === "conflict") {
    if (transition.reason === "existing-start") {
      throw new ConflictError(
        "A configuration already starts on that date. Correct that record instead.",
      );
    }
    throw new ConflictError("No configuration covers that effective date.");
  }

  const recordedAt = transactionClock();
  await tx
    .update(legalEntityConfigurations)
    .set({ supersededAt: recordedAt, supersededBy: context.userId })
    .where(
      and(
        eq(legalEntityConfigurations.tenantId, context.tenantId),
        eq(legalEntityConfigurations.id, prior.id),
        isNull(legalEntityConfigurations.supersededAt),
      ),
    );
  await tx.insert(legalEntityConfigurations).values({
    ...prior,
    id: crypto.randomUUID(),
    validTo: transition.precedingPeriod.validTo,
    recordedAt,
    recordedBy: context.userId,
    supersedesId: prior.id,
    supersededAt: null,
    supersededBy: null,
    changeReason: `Interval closed: ${input.reason}`,
  });
  const [after] = await tx
    .insert(legalEntityConfigurations)
    .values({
      ...buildLegalEntityConfigurationValues(
        input,
        context,
        legalEntityId,
        protectTaxIdentifier,
        {
          ciphertext: prior.taxIdentifierCiphertext,
          hash: prior.taxIdentifierHash,
          lastFour: prior.taxIdentifierLastFour,
        },
      ),
      validTo: transition.followingPeriod.validTo,
      status: prior.status,
      recordedAt,
    })
    .returning(legalEntityConfigurationSelection);
  await tx.insert(auditEvents).values({
    tenantId: context.tenantId,
    actorUserId: context.userId,
    source: "ui",
    action: "legal_entity.configuration_changed",
    objectType: "legal_entity",
    objectId: legalEntityId,
    effectiveDate: input.effectiveDate,
    reason: input.reason,
    before: toLegalEntityAuditSnapshot(prior),
    after: toLegalEntityAuditSnapshot(after),
    occurredAt: recordedAt,
  });
}

export async function correctLegalEntityConfigurationForTenant(
  tx: LegalEntityPersistenceTransaction,
  context: LegalEntityTenantContext,
  legalEntityId: string,
  configurationId: string,
  input: LegalEntityInput,
  protectTaxIdentifier: ProtectTaxIdentifier,
  transactionClock: TransactionClock = () => new Date(),
) {
  await lockLegalEntityForTenant(tx, context, legalEntityId);
  const [prior] = await tx
    .select()
    .from(legalEntityConfigurations)
    .where(
      and(
        eq(legalEntityConfigurations.tenantId, context.tenantId),
        eq(legalEntityConfigurations.legalEntityId, legalEntityId),
        eq(legalEntityConfigurations.id, configurationId),
        isNull(legalEntityConfigurations.supersededAt),
      ),
    )
    .limit(1);
  if (!prior) throw new NotFoundError("Configuration not found.");
  if (input.effectiveDate !== prior.validFrom) {
    throw new ConflictError("A correction cannot change the effective date.");
  }

  const recordedAt = transactionClock();
  await tx
    .update(legalEntityConfigurations)
    .set({ supersededAt: recordedAt, supersededBy: context.userId })
    .where(
      and(
        eq(legalEntityConfigurations.tenantId, context.tenantId),
        eq(legalEntityConfigurations.id, configurationId),
        isNull(legalEntityConfigurations.supersededAt),
      ),
    );
  const [after] = await tx
    .insert(legalEntityConfigurations)
    .values({
      ...buildLegalEntityConfigurationValues(
        input,
        context,
        legalEntityId,
        protectTaxIdentifier,
        {
          ciphertext: prior.taxIdentifierCiphertext,
          hash: prior.taxIdentifierHash,
          lastFour: prior.taxIdentifierLastFour,
        },
      ),
      validTo: prior.validTo,
      status: prior.status,
      supersedesId: prior.id,
      recordedAt,
    })
    .returning(legalEntityConfigurationSelection);
  await tx.insert(auditEvents).values({
    tenantId: context.tenantId,
    actorUserId: context.userId,
    source: "ui",
    action: "legal_entity.configuration_corrected",
    objectType: "legal_entity",
    objectId: legalEntityId,
    effectiveDate: prior.validFrom,
    reason: input.reason,
    before: toLegalEntityAuditSnapshot(prior),
    after: toLegalEntityAuditSnapshot(after),
    occurredAt: recordedAt,
  });
}
