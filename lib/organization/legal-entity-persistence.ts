import { and, asc, eq, isNull } from "drizzle-orm";
import type { TenantTransaction } from "@/data/tenant-context";
import {
  auditEvents,
  legalEntities,
  legalEntityConfigurations,
} from "@/db/schema";
import { normalizeIdentifier } from "../security/legal-identifiers-core";
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

type LegalEntityTenantContext = Readonly<{
  tenantId: string;
  userId: string;
}>;

type ProtectedTaxIdentifier = Readonly<{
  ciphertext: string;
  hash: string;
  lastFour: string;
}>;

type ProtectTaxIdentifier = (value: string) => ProtectedTaxIdentifier;

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
) {
  const [entity] = await tx
    .insert(legalEntities)
    .values({ tenantId: context.tenantId, createdBy: context.userId })
    .returning({ id: legalEntities.id });
  const [configuration] = await tx
    .insert(legalEntityConfigurations)
    .values(
      buildLegalEntityConfigurationValues(
        input,
        context,
        entity.id,
        protectTaxIdentifier,
      ),
    )
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
      const current = configurations.find(
        (item) =>
          item.validFrom <= asOfDate &&
          (item.validTo === null || item.validTo > asOfDate),
      );
      return toLegalEntitySummary(current ?? configurations[0]);
    })
    .sort((left, right) => left.legalName.localeCompare(right.legalName));
}
