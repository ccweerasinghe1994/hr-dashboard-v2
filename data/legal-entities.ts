import "server-only";

import { and, asc, desc, eq, gt, isNull, lte, or, sql } from "drizzle-orm";
import {
  auditEvents,
  legalEntities,
  legalEntityConfigurations,
} from "@/db/schema";
import {
  maskTaxIdentifier,
  normalizeIdentifier,
  protectTaxIdentifier,
} from "@/lib/security/legal-identifiers";
import { ConflictError, NotFoundError } from "./errors";
import {
  type TenantContext,
  type TenantTransaction,
  withTenantContext,
} from "./tenant-context";

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

export type LegalEntitySummaryDto = Readonly<{
  id: string;
  legalName: string;
  displayName: string | null;
  countryCode: string;
  registrationNumber: string | null;
  maskedTaxIdentifier: string | null;
  currencyCode: string | null;
  status: "active" | "inactive";
  validFrom: string;
  validTo: string | null;
}>;

export type LegalEntityConfigurationDto = LegalEntitySummaryDto &
  Readonly<{
    configurationId: string;
    changeReason: string;
    recordedAt: Date;
    superseded: boolean;
  }>;

function todayUtc() {
  return new Date().toISOString().slice(0, 10);
}

function normalizedName(name: string) {
  return name.normalize("NFKC").trim().replace(/\s+/g, " ").toLocaleLowerCase();
}

function optional(value: string) {
  const trimmed = value.trim();
  return trimmed ? trimmed : null;
}

function safeSnapshot(configuration: {
  legalName: string;
  displayName: string | null;
  countryCode: string;
  registrationNumber: string | null;
  currencyCode: string | null;
  status: "active" | "inactive";
  validFrom: string;
  validTo: string | null;
  taxIdentifierLastFour: string | null;
}) {
  return {
    legalName: configuration.legalName,
    displayName: configuration.displayName,
    countryCode: configuration.countryCode,
    registrationNumber: configuration.registrationNumber,
    currencyCode: configuration.currencyCode,
    status: configuration.status,
    validFrom: configuration.validFrom,
    validTo: configuration.validTo,
    hasTaxIdentifier: Boolean(configuration.taxIdentifierLastFour),
  };
}

function toSummary(row: {
  legalEntityId: string;
  legalName: string;
  displayName: string | null;
  countryCode: string;
  registrationNumber: string | null;
  taxIdentifierLastFour: string | null;
  currencyCode: string | null;
  status: "active" | "inactive";
  validFrom: string;
  validTo: string | null;
}): LegalEntitySummaryDto {
  return {
    id: row.legalEntityId,
    legalName: row.legalName,
    displayName: row.displayName,
    countryCode: row.countryCode,
    registrationNumber: row.registrationNumber,
    maskedTaxIdentifier: maskTaxIdentifier(row.taxIdentifierLastFour),
    currencyCode: row.currencyCode,
    status: row.status,
    validFrom: row.validFrom,
    validTo: row.validTo,
  };
}

const selection = {
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

export async function listLegalEntities() {
  return withTenantContext(async (tx, context) => {
    const today = todayUtc();
    const rows = await tx
      .select(selection)
      .from(legalEntityConfigurations)
      .where(
        and(
          eq(legalEntityConfigurations.tenantId, context.tenantId),
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
        const current = configurations.find(
          (item) =>
            item.validFrom <= today &&
            (item.validTo === null || item.validTo > today),
        );
        return toSummary(current ?? configurations[0]);
      })
      .sort((left, right) => left.legalName.localeCompare(right.legalName));
  }, "owner");
}

export async function getLegalEntity(legalEntityId: string) {
  return withTenantContext(async (tx, context) => {
    const [entity] = await tx
      .select({ id: legalEntities.id })
      .from(legalEntities)
      .where(
        and(
          eq(legalEntities.tenantId, context.tenantId),
          eq(legalEntities.id, legalEntityId),
        ),
      )
      .limit(1);
    if (!entity) throw new NotFoundError("Legal entity not found.");

    const rows = await tx
      .select(selection)
      .from(legalEntityConfigurations)
      .where(
        and(
          eq(legalEntityConfigurations.tenantId, context.tenantId),
          eq(legalEntityConfigurations.legalEntityId, legalEntityId),
        ),
      )
      .orderBy(
        desc(legalEntityConfigurations.validFrom),
        desc(legalEntityConfigurations.recordedAt),
      );

    const configurations: LegalEntityConfigurationDto[] = rows.map((row) => ({
      ...toSummary(row),
      configurationId: row.configurationId,
      changeReason: row.changeReason,
      recordedAt: row.recordedAt,
      superseded: row.supersededAt !== null,
    }));
    const today = todayUtc();
    const current = configurations.find(
      (item) =>
        !item.superseded &&
        item.validFrom <= today &&
        (item.validTo === null || item.validTo > today),
    );
    return { id: legalEntityId, current: current ?? null, configurations };
  }, "owner");
}

function configurationValues(
  input: LegalEntityInput,
  context: TenantContext,
  legalEntityId: string,
  taxFallback?: {
    ciphertext: string | null;
    hash: string | null;
    lastFour: string | null;
  },
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

export async function createLegalEntity(input: LegalEntityInput) {
  return withTenantContext(async (tx, context) => {
    const [entity] = await tx
      .insert(legalEntities)
      .values({ tenantId: context.tenantId, createdBy: context.userId })
      .returning({ id: legalEntities.id });
    const [configuration] = await tx
      .insert(legalEntityConfigurations)
      .values(configurationValues(input, context, entity.id))
      .returning(selection);
    await tx.insert(auditEvents).values({
      tenantId: context.tenantId,
      actorUserId: context.userId,
      source: "ui",
      action: "legal_entity.created",
      objectType: "legal_entity",
      objectId: entity.id,
      effectiveDate: input.effectiveDate,
      reason: input.reason,
      after: safeSnapshot(configuration),
    });
    return entity;
  }, "owner");
}

async function lockEntity(
  tx: TenantTransaction,
  context: TenantContext,
  legalEntityId: string,
) {
  const result = await tx.execute(
    sql`select id from legal_entity where tenant_id = ${context.tenantId} and id = ${legalEntityId} for update`,
  );
  if (result.length === 0) throw new NotFoundError("Legal entity not found.");
}

async function containingConfiguration(
  tx: TenantTransaction,
  context: TenantContext,
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

export async function scheduleLegalEntityChange(
  legalEntityId: string,
  input: LegalEntityInput,
) {
  return withTenantContext(async (tx, context) => {
    await lockEntity(tx, context, legalEntityId);
    const prior = await containingConfiguration(
      tx,
      context,
      legalEntityId,
      input.effectiveDate,
    );
    if (!prior) {
      throw new ConflictError("No configuration covers that effective date.");
    }
    if (prior.validFrom === input.effectiveDate) {
      throw new ConflictError(
        "A configuration already starts on that date. Correct that record instead.",
      );
    }

    const recordedAt = new Date();
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
      validTo: input.effectiveDate,
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
        ...configurationValues(input, context, legalEntityId, {
          ciphertext: prior.taxIdentifierCiphertext,
          hash: prior.taxIdentifierHash,
          lastFour: prior.taxIdentifierLastFour,
        }),
        validTo: prior.validTo,
        status: prior.status,
      })
      .returning(selection);
    await tx.insert(auditEvents).values({
      tenantId: context.tenantId,
      actorUserId: context.userId,
      source: "ui",
      action: "legal_entity.configuration_changed",
      objectType: "legal_entity",
      objectId: legalEntityId,
      effectiveDate: input.effectiveDate,
      reason: input.reason,
      before: safeSnapshot(prior),
      after: safeSnapshot(after),
    });
  }, "owner");
}

export async function correctLegalEntityConfiguration(
  legalEntityId: string,
  configurationId: string,
  input: LegalEntityInput,
) {
  return withTenantContext(async (tx, context) => {
    await lockEntity(tx, context, legalEntityId);
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

    const recordedAt = new Date();
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
        ...configurationValues(input, context, legalEntityId, {
          ciphertext: prior.taxIdentifierCiphertext,
          hash: prior.taxIdentifierHash,
          lastFour: prior.taxIdentifierLastFour,
        }),
        validTo: prior.validTo,
        status: prior.status,
        supersedesId: prior.id,
        recordedAt,
      })
      .returning(selection);
    await tx.insert(auditEvents).values({
      tenantId: context.tenantId,
      actorUserId: context.userId,
      source: "ui",
      action: "legal_entity.configuration_corrected",
      objectType: "legal_entity",
      objectId: legalEntityId,
      effectiveDate: prior.validFrom,
      reason: input.reason,
      before: safeSnapshot(prior),
      after: safeSnapshot(after),
    });
  }, "owner");
}

export async function changeLegalEntityStatus(
  legalEntityId: string,
  status: "active" | "inactive",
  effectiveDate: string,
  reason: string,
) {
  return withTenantContext(async (tx, context) => {
    await lockEntity(tx, context, legalEntityId);
    const prior = await containingConfiguration(
      tx,
      context,
      legalEntityId,
      effectiveDate,
    );
    if (!prior) throw new ConflictError("No configuration covers that date.");
    if (prior.status === status) {
      throw new ConflictError(`The legal entity is already ${status}.`);
    }

    const recordedAt = new Date();
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

    if (prior.validFrom < effectiveDate) {
      await tx.insert(legalEntityConfigurations).values({
        ...prior,
        id: crypto.randomUUID(),
        validTo: effectiveDate,
        recordedAt,
        recordedBy: context.userId,
        supersedesId: prior.id,
        supersededAt: null,
        supersededBy: null,
        changeReason: `Interval closed: ${reason}`,
      });
    }

    const [after] = await tx
      .insert(legalEntityConfigurations)
      .values({
        ...prior,
        id: crypto.randomUUID(),
        status,
        validFrom: effectiveDate,
        recordedAt,
        recordedBy: context.userId,
        supersedesId: prior.id,
        supersededAt: null,
        supersededBy: null,
        changeReason: reason,
      })
      .returning(selection);
    await tx.insert(auditEvents).values({
      tenantId: context.tenantId,
      actorUserId: context.userId,
      source: "ui",
      action: `legal_entity.${status === "active" ? "reactivated" : "deactivated"}`,
      objectType: "legal_entity",
      objectId: legalEntityId,
      effectiveDate,
      reason,
      before: safeSnapshot(prior),
      after: safeSnapshot(after),
    });
  }, "owner");
}
