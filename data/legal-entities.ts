import "server-only";

import { and, desc, eq, isNull } from "drizzle-orm";
import {
  auditEvents,
  legalEntities,
  legalEntityConfigurations,
} from "@/db/schema";
import { selectEffectivePeriod } from "@/lib/organization/effective-periods";
import {
  type LegalEntitySummaryDto,
  toLegalEntityAuditSnapshot,
  toLegalEntitySummary,
} from "@/lib/organization/legal-entity-boundaries";
import {
  correctLegalEntityConfigurationForTenant,
  createLegalEntityForTenant,
  findContainingLegalEntityConfiguration,
  type LegalEntityInput,
  legalEntityConfigurationSelection,
  listLegalEntitiesForTenant,
  lockLegalEntityForTenant,
  scheduleLegalEntityChangeForTenant,
} from "@/lib/organization/legal-entity-persistence";
import { protectTaxIdentifier } from "@/lib/security/legal-identifiers";
import { ConflictError, NotFoundError } from "./errors";
import { withTenantContext } from "./tenant-context";

export type { LegalEntitySummaryDto } from "@/lib/organization/legal-entity-boundaries";
export type { LegalEntityInput } from "@/lib/organization/legal-entity-persistence";

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

const selection = legalEntityConfigurationSelection;

export async function listLegalEntities() {
  return withTenantContext(
    (tx, context) =>
      listLegalEntitiesForTenant(tx, context.tenantId, todayUtc()),
    "owner",
  );
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
      ...toLegalEntitySummary(row),
      configurationId: row.configurationId,
      changeReason: row.changeReason,
      recordedAt: row.recordedAt,
      superseded: row.supersededAt !== null,
    }));
    const today = todayUtc();
    const current = selectEffectivePeriod(
      configurations.filter((item) => !item.superseded),
      today,
    );
    return { id: legalEntityId, current: current ?? null, configurations };
  }, "owner");
}

export async function createLegalEntity(input: LegalEntityInput) {
  return withTenantContext(
    (tx, context) =>
      createLegalEntityForTenant(tx, context, input, protectTaxIdentifier),
    "owner",
  );
}

export async function scheduleLegalEntityChange(
  legalEntityId: string,
  input: LegalEntityInput,
) {
  return withTenantContext(
    (tx, context) =>
      scheduleLegalEntityChangeForTenant(
        tx,
        context,
        legalEntityId,
        input,
        protectTaxIdentifier,
      ),
    "owner",
  );
}

export async function correctLegalEntityConfiguration(
  legalEntityId: string,
  configurationId: string,
  input: LegalEntityInput,
) {
  return withTenantContext(
    (tx, context) =>
      correctLegalEntityConfigurationForTenant(
        tx,
        context,
        legalEntityId,
        configurationId,
        input,
        protectTaxIdentifier,
      ),
    "owner",
  );
}

export async function changeLegalEntityStatus(
  legalEntityId: string,
  status: "active" | "inactive",
  effectiveDate: string,
  reason: string,
) {
  return withTenantContext(async (tx, context) => {
    await lockLegalEntityForTenant(tx, context, legalEntityId);
    const prior = await findContainingLegalEntityConfiguration(
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
      before: toLegalEntityAuditSnapshot(prior),
      after: toLegalEntityAuditSnapshot(after),
    });
  }, "owner");
}
