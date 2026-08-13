import { afterAll, beforeAll, describe, expect, test } from "bun:test";
import { and, asc, eq, isNull, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { isConstraintConflict } from "@/data/database-errors";
import { ConflictError } from "@/data/errors";
import * as schema from "@/db/schema";
import {
  correctLegalEntityConfigurationForTenant,
  createLegalEntityForTenant,
  type LegalEntityInput,
  type LegalEntityPersistenceTransaction,
  scheduleLegalEntityChangeForTenant,
} from "@/lib/organization/legal-entity-persistence";
import { createLegalIdentifierProtector } from "@/lib/security/legal-identifiers-core";
import { testDatabaseEnvironment } from "../support/integration-environment";

const { adminUrl, runtimeUrl } = testDatabaseEnvironment;
const uniqueSuffix = crypto.randomUUID().slice(0, 8);
const fixture = {
  user: crypto.randomUUID(),
  tenantA: crypto.randomUUID(),
  tenantB: crypto.randomUUID(),
  userEmail: `history-owner-${uniqueSuffix}@example.test`,
};
const protector = createLegalIdentifierProtector(Buffer.alloc(32, 0x3b));

function legalEntityInput(
  label: string,
  overrides: Partial<LegalEntityInput> = {},
): LegalEntityInput {
  return {
    legalName: `${label} ${uniqueSuffix} Ltd`,
    displayName: `${label} ${uniqueSuffix}`,
    countryCode: "GB",
    registrationNumber: `REG-${label}-${uniqueSuffix}`,
    taxIdentifier: `TIN-${label}-${uniqueSuffix}`,
    currencyCode: "GBP",
    effectiveDate: "2025-01-01",
    reason: "Initial configuration",
    ...overrides,
  };
}

describe("legal-entity effective-dated history", () => {
  const admin = postgres(adminUrl, { max: 1, prepare: false });
  const runtimeClient = postgres(runtimeUrl, { max: 1, prepare: false });
  const runtime = drizzle({ client: runtimeClient, schema });

  async function withTenantContext<T>(
    tenantId: string,
    operation: (tx: LegalEntityPersistenceTransaction) => Promise<T>,
  ) {
    return runtime.transaction(async (tx) => {
      await tx.execute(
        sql`select set_config('app.current_user_id', ${fixture.user}, true)`,
      );
      await tx.execute(
        sql`select set_config('app.current_tenant_id', ${tenantId}, true)`,
      );
      return operation(tx);
    });
  }

  async function cleanFixture() {
    await admin.begin(async (sql) => {
      await sql`delete from audit_event where tenant_id in (${fixture.tenantA}, ${fixture.tenantB})`;
      await sql`delete from legal_entity_configuration where tenant_id in (${fixture.tenantA}, ${fixture.tenantB})`;
      await sql`delete from legal_entity where tenant_id in (${fixture.tenantA}, ${fixture.tenantB})`;
      await sql`delete from tenant_membership where tenant_id in (${fixture.tenantA}, ${fixture.tenantB})`;
      await sql`delete from tenant_status_period where tenant_id in (${fixture.tenantA}, ${fixture.tenantB})`;
      await sql`delete from tenant where id in (${fixture.tenantA}, ${fixture.tenantB})`;
      await sql`delete from "user" where id = ${fixture.user}`;
    });
  }

  beforeAll(async () => {
    await cleanFixture();
    await admin.begin(async (sql) => {
      await sql`insert into "user" (id, name, email, email_verified)
        values (${fixture.user}, ${`History Owner ${uniqueSuffix}`}, ${fixture.userEmail}, true)`;
      await sql`insert into tenant
        (id, name, slug, normalized_slug, default_locale, default_timezone)
        values
        (${fixture.tenantA}, ${`History Tenant A ${uniqueSuffix}`}, ${`history-a-${uniqueSuffix}`}, ${`history-a-${uniqueSuffix}`}, 'en-US', 'UTC'),
        (${fixture.tenantB}, ${`History Tenant B ${uniqueSuffix}`}, ${`history-b-${uniqueSuffix}`}, ${`history-b-${uniqueSuffix}`}, 'en-US', 'UTC')`;
      await sql`insert into tenant_status_period (tenant_id, status, valid_from)
        values (${fixture.tenantA}, 'active', '2025-01-01'), (${fixture.tenantB}, 'active', '2025-01-01')`;
      await sql`insert into tenant_membership (tenant_id, user_id, role)
        values (${fixture.tenantA}, ${fixture.user}, 'owner'), (${fixture.tenantB}, ${fixture.user}, 'owner')`;
    });
  });

  afterAll(async () => {
    try {
      await cleanFixture();
    } finally {
      await Promise.all([admin.end(), runtimeClient.end()]);
    }
  });

  test("creates the stable entity, initial configuration, and audit atomically", async () => {
    const input = legalEntityInput("Atomic");
    const creationRecordedAt = new Date("2025-01-02T10:00:00.000Z");

    await expect(
      withTenantContext(fixture.tenantA, async (tx) => {
        await createLegalEntityForTenant(
          tx,
          { tenantId: fixture.tenantA, userId: fixture.user },
          input,
          protector.protectTaxIdentifier,
          () => creationRecordedAt,
        );
        throw new Error("Force rollback after complete creation.");
      }),
    ).rejects.toThrow("Force rollback after complete creation.");

    const rolledBack = await admin<
      { entities: number; configurations: number; events: number }[]
    >`select
      (select count(*)::int from legal_entity where tenant_id = ${fixture.tenantA}) as entities,
      (select count(*)::int from legal_entity_configuration where tenant_id = ${fixture.tenantA}) as configurations,
      (select count(*)::int from audit_event where tenant_id = ${fixture.tenantA}) as events`;
    expect(rolledBack[0]).toEqual({
      entities: 0,
      configurations: 0,
      events: 0,
    });

    const entity = await withTenantContext(fixture.tenantA, (tx) =>
      createLegalEntityForTenant(
        tx,
        { tenantId: fixture.tenantA, userId: fixture.user },
        input,
        protector.protectTaxIdentifier,
        () => creationRecordedAt,
      ),
    );
    const persisted = await admin<
      {
        entityId: string;
        configurationEntityId: string;
        configurationRecordedAt: Date;
        eventObjectId: string;
        eventOccurredAt: Date;
      }[]
    >`select le.id as "entityId", lec.legal_entity_id as "configurationEntityId",
        lec.recorded_at as "configurationRecordedAt", ae.object_id as "eventObjectId",
        ae.occurred_at as "eventOccurredAt"
      from legal_entity le
      join legal_entity_configuration lec on lec.tenant_id = le.tenant_id and lec.legal_entity_id = le.id
      join audit_event ae on ae.tenant_id = le.tenant_id and ae.object_id = le.id
      where le.tenant_id = ${fixture.tenantA} and le.id = ${entity.id}`;
    expect(Array.from(persisted)).toEqual([
      {
        entityId: entity.id,
        configurationEntityId: entity.id,
        configurationRecordedAt: creationRecordedAt,
        eventObjectId: entity.id,
        eventOccurredAt: creationRecordedAt,
      },
    ]);
  });

  test("splits future and backdated periods and corrects transaction-time evidence", async () => {
    const initial = legalEntityInput("Timeline", {
      taxIdentifier: "TIN-PRESERVED-4242",
    });
    const context = { tenantId: fixture.tenantA, userId: fixture.user };
    const creationRecordedAt = new Date("2025-01-02T10:00:00.000Z");
    const futureChangeRecordedAt = new Date("2025-02-01T10:00:00.000Z");
    const backdatedChangeRecordedAt = new Date("2025-02-02T10:00:00.000Z");
    const correctionRecordedAt = new Date("2025-02-03T10:00:00.000Z");
    const entity = await withTenantContext(fixture.tenantA, (tx) =>
      createLegalEntityForTenant(
        tx,
        context,
        initial,
        protector.protectTaxIdentifier,
        () => creationRecordedAt,
      ),
    );
    await withTenantContext(fixture.tenantA, (tx) =>
      scheduleLegalEntityChangeForTenant(
        tx,
        context,
        entity.id,
        legalEntityInput("Future", {
          taxIdentifier: "",
          effectiveDate: "2025-07-01",
          reason: "Future legal-name change",
        }),
        protector.protectTaxIdentifier,
        () => futureChangeRecordedAt,
      ),
    );
    await withTenantContext(fixture.tenantA, (tx) =>
      scheduleLegalEntityChangeForTenant(
        tx,
        context,
        entity.id,
        legalEntityInput("Backdated", {
          taxIdentifier: "",
          effectiveDate: "2025-04-01",
          reason: "Backdated legal-name change",
        }),
        protector.protectTaxIdentifier,
        () => backdatedChangeRecordedAt,
      ),
    );

    const timeline = await withTenantContext(fixture.tenantA, (tx) =>
      tx
        .select({
          id: schema.legalEntityConfigurations.id,
          legalName: schema.legalEntityConfigurations.legalName,
          validFrom: schema.legalEntityConfigurations.validFrom,
          validTo: schema.legalEntityConfigurations.validTo,
          recordedAt: schema.legalEntityConfigurations.recordedAt,
          taxCiphertext:
            schema.legalEntityConfigurations.taxIdentifierCiphertext,
          taxHash: schema.legalEntityConfigurations.taxIdentifierHash,
        })
        .from(schema.legalEntityConfigurations)
        .where(
          and(
            eq(schema.legalEntityConfigurations.tenantId, fixture.tenantA),
            eq(schema.legalEntityConfigurations.legalEntityId, entity.id),
            isNull(schema.legalEntityConfigurations.supersededAt),
          ),
        )
        .orderBy(asc(schema.legalEntityConfigurations.validFrom)),
    );
    expect(
      timeline.map(({ legalName, validFrom, validTo }) => ({
        legalName,
        validFrom,
        validTo,
      })),
    ).toEqual([
      {
        legalName: initial.legalName,
        validFrom: "2025-01-01",
        validTo: "2025-04-01",
      },
      {
        legalName: legalEntityInput("Backdated").legalName,
        validFrom: "2025-04-01",
        validTo: "2025-07-01",
      },
      {
        legalName: legalEntityInput("Future").legalName,
        validFrom: "2025-07-01",
        validTo: null,
      },
    ]);
    expect(new Set(timeline.map((period) => period.taxCiphertext)).size).toBe(
      1,
    );
    expect(new Set(timeline.map((period) => period.taxHash)).size).toBe(1);
    expect(timeline[0].taxCiphertext).toStartWith("v1.");
    expect(timeline[0].taxHash).toHaveLength(64);
    expect(timeline.map((period) => period.recordedAt)).toEqual([
      backdatedChangeRecordedAt,
      backdatedChangeRecordedAt,
      futureChangeRecordedAt,
    ]);

    for (const [effectiveDate, expectedMessage] of [
      [
        "2025-07-01",
        "A configuration already starts on that date. Correct that record instead.",
      ],
      ["2024-12-31", "No configuration covers that effective date."],
    ] as const) {
      let conflict: unknown;
      try {
        await withTenantContext(fixture.tenantA, (tx) =>
          scheduleLegalEntityChangeForTenant(
            tx,
            context,
            entity.id,
            legalEntityInput("Rejected", { effectiveDate }),
            protector.protectTaxIdentifier,
          ),
        );
      } catch (error) {
        conflict = error;
      }
      expect(conflict).toBeInstanceOf(ConflictError);
      expect((conflict as ConflictError).message).toBe(expectedMessage);
    }

    const correctedPeriod = timeline[1];
    await withTenantContext(fixture.tenantA, (tx) =>
      correctLegalEntityConfigurationForTenant(
        tx,
        context,
        entity.id,
        correctedPeriod.id,
        legalEntityInput("Corrected", {
          taxIdentifier: "",
          effectiveDate: correctedPeriod.validFrom,
          reason: "Correct erroneous legal name",
        }),
        protector.protectTaxIdentifier,
        () => correctionRecordedAt,
      ),
    );

    const [superseded, correction] = await withTenantContext(
      fixture.tenantA,
      (tx) =>
        tx
          .select()
          .from(schema.legalEntityConfigurations)
          .where(
            and(
              eq(schema.legalEntityConfigurations.tenantId, fixture.tenantA),
              eq(schema.legalEntityConfigurations.legalEntityId, entity.id),
              sql`${schema.legalEntityConfigurations.id} = ${correctedPeriod.id} or ${schema.legalEntityConfigurations.supersedesId} = ${correctedPeriod.id}`,
            ),
          )
          .orderBy(asc(schema.legalEntityConfigurations.recordedAt)),
    );
    expect(superseded.supersededAt).not.toBeNull();
    if (!superseded.supersededAt) {
      throw new Error("Expected superseded transaction-time evidence.");
    }
    expect(correction).toMatchObject({
      legalName: legalEntityInput("Corrected").legalName,
      validFrom: correctedPeriod.validFrom,
      validTo: correctedPeriod.validTo,
      supersedesId: correctedPeriod.id,
      taxIdentifierCiphertext: correctedPeriod.taxCiphertext,
      taxIdentifierHash: correctedPeriod.taxHash,
    });
    expect(correction.recordedAt).toEqual(correctionRecordedAt);
    expect(superseded.supersededAt).toEqual(correctionRecordedAt);

    const events = await withTenantContext(fixture.tenantA, (tx) =>
      tx
        .select({
          action: schema.auditEvents.action,
          effectiveDate: schema.auditEvents.effectiveDate,
          occurredAt: schema.auditEvents.occurredAt,
        })
        .from(schema.auditEvents)
        .where(
          and(
            eq(schema.auditEvents.tenantId, fixture.tenantA),
            eq(schema.auditEvents.objectId, entity.id),
          ),
        )
        .orderBy(
          asc(schema.auditEvents.effectiveDate),
          asc(schema.auditEvents.action),
        ),
    );
    expect(events).toEqual([
      {
        action: "legal_entity.created",
        effectiveDate: "2025-01-01",
        occurredAt: creationRecordedAt,
      },
      {
        action: "legal_entity.configuration_changed",
        effectiveDate: "2025-04-01",
        occurredAt: backdatedChangeRecordedAt,
      },
      {
        action: "legal_entity.configuration_corrected",
        effectiveDate: "2025-04-01",
        occurredAt: correctionRecordedAt,
      },
      {
        action: "legal_entity.configuration_changed",
        effectiveDate: "2025-07-01",
        occurredAt: futureChangeRecordedAt,
      },
    ]);
  });

  test("applies tenant- and date-scoped name and identifier conflicts", async () => {
    const original = legalEntityInput("Conflicts");
    const contextA = { tenantId: fixture.tenantA, userId: fixture.user };
    const entity = await withTenantContext(fixture.tenantA, (tx) =>
      createLegalEntityForTenant(
        tx,
        contextA,
        original,
        protector.protectTaxIdentifier,
      ),
    );

    const conflictingInputs = [
      legalEntityInput("NameConflict", { legalName: original.legalName }),
      legalEntityInput("RegistrationConflict", {
        registrationNumber: original.registrationNumber,
      }),
      legalEntityInput("TaxConflict", {
        taxIdentifier: original.taxIdentifier,
      }),
    ];
    for (const input of conflictingInputs) {
      try {
        await withTenantContext(fixture.tenantA, (tx) =>
          createLegalEntityForTenant(
            tx,
            contextA,
            input,
            protector.protectTaxIdentifier,
          ),
        );
        throw new Error("Expected an effective-period conflict.");
      } catch (error) {
        expect(isConstraintConflict(error)).toBeTrue();
      }
    }

    await withTenantContext(fixture.tenantA, (tx) =>
      scheduleLegalEntityChangeForTenant(
        tx,
        contextA,
        entity.id,
        legalEntityInput("Released", {
          effectiveDate: "2025-07-01",
          reason: "Release prior identifiers",
        }),
        protector.protectTaxIdentifier,
      ),
    );
    const adjacent = await withTenantContext(fixture.tenantA, (tx) =>
      createLegalEntityForTenant(
        tx,
        contextA,
        { ...original, effectiveDate: "2025-07-01" },
        protector.protectTaxIdentifier,
      ),
    );
    const crossTenant = await withTenantContext(fixture.tenantB, (tx) =>
      createLegalEntityForTenant(
        tx,
        { tenantId: fixture.tenantB, userId: fixture.user },
        original,
        protector.protectTaxIdentifier,
      ),
    );
    expect(adjacent.id).not.toBe(entity.id);
    expect(crossTenant.id).not.toBe(entity.id);
  });
});
