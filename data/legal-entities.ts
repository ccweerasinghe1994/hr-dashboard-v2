import "server-only";

import { and, desc, eq } from "drizzle-orm";
import { legalEntities, legalEntityConfigurations } from "@/db/schema";
import { selectEffectivePeriod } from "@/lib/organization/effective-periods";
import {
  type LegalEntitySummaryDto,
  toLegalEntitySummary,
} from "@/lib/organization/legal-entity-boundaries";
import {
  changeLegalEntityStatusForTenant,
  correctLegalEntityConfigurationForTenant,
  createLegalEntityForTenant,
  type LegalEntityInput,
  legalEntityConfigurationSelection,
  listLegalEntitiesForTenant,
  scheduleLegalEntityChangeForTenant,
} from "@/lib/organization/legal-entity-persistence";
import { protectTaxIdentifier } from "@/lib/security/legal-identifiers";
import { NotFoundError } from "./errors";
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
  return withTenantContext(
    (tx, context) =>
      changeLegalEntityStatusForTenant(
        tx,
        context,
        legalEntityId,
        status,
        effectiveDate,
        reason,
      ),
    "owner",
  );
}
