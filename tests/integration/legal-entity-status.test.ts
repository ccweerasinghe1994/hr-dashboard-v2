import { afterAll, beforeAll, describe, expect, test } from "bun:test";
import { and, asc, eq, isNull, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { ConflictError } from "@/data/errors";
import * as schema from "@/db/schema";
import {
  changeLegalEntityStatusForTenant,
  createLegalEntityForTenant,
  type LegalEntityInput,
  type LegalEntityPersistenceTransaction,
  scheduleLegalEntityChangeForTenant,
} from "@/lib/organization/legal-entity-persistence";
import { createLegalIdentifierProtector } from "@/lib/security/legal-identifiers-core";
import { captureError } from "../support/capture-error";
import { forcedAuditFailure } from "../support/forced-audit-failure";
import { testDatabaseEnvironment } from "../support/integration-environment";

const { adminUrl, runtimeUrl } = testDatabaseEnvironment;
const uniqueSuffix = crypto.randomUUID().slice(0, 8);
const fixture = {
  userId: crypto.randomUUID(),
  tenantId: crypto.randomUUID(),
  userEmail: `status-owner-${uniqueSuffix}@example.test`,
};
const context = { tenantId: fixture.tenantId, userId: fixture.userId };
const protector = createLegalIdentifierProtector(Buffer.alloc(32, 0x5c));

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

describe("legal-entity status history", () => {
  const admin = postgres(adminUrl, { max: 1, prepare: false });
  const runtimeClient = postgres(runtimeUrl, { max: 2, prepare: false });
  const runtime = drizzle({ client: runtimeClient, schema });
  const auditFailure = forcedAuditFailure(
    admin,
    "issue_241_fail_status_audit_insert",
    "forced status audit failure",
  );

  async function withTenantContext<T>(
    operation: (tx: LegalEntityPersistenceTransaction) => Promise<T>,
  ) {
    return runtime.transaction(async (tx) => {
      await tx.execute(
        sql`select set_config('app.current_user_id', ${fixture.userId}, true)`,
      );
      await tx.execute(
        sql`select set_config('app.current_tenant_id', ${fixture.tenantId}, true)`,
      );
      return operation(tx);
    });
  }

  async function cleanFixture() {
    await admin.begin(async (sql) => {
      await sql`delete from audit_event where tenant_id = ${fixture.tenantId}`;
      await sql`delete from legal_entity_configuration where tenant_id = ${fixture.tenantId}`;
      await sql`delete from legal_entity where tenant_id = ${fixture.tenantId}`;
      await sql`delete from tenant_membership where tenant_id = ${fixture.tenantId}`;
      await sql`delete from tenant_status_period where tenant_id = ${fixture.tenantId}`;
      await sql`delete from tenant where id = ${fixture.tenantId}`;
      await sql`delete from "user" where id = ${fixture.userId}`;
    });
  }

  async function readStatusTimeline(legalEntityId: string) {
    return withTenantContext((tx) =>
      tx
        .select({
          status: schema.legalEntityConfigurations.status,
          validFrom: schema.legalEntityConfigurations.validFrom,
          validTo: schema.legalEntityConfigurations.validTo,
        })
        .from(schema.legalEntityConfigurations)
        .where(
          and(
            eq(schema.legalEntityConfigurations.tenantId, fixture.tenantId),
            eq(schema.legalEntityConfigurations.legalEntityId, legalEntityId),
            isNull(schema.legalEntityConfigurations.supersededAt),
          ),
        )
        .orderBy(asc(schema.legalEntityConfigurations.validFrom)),
    );
  }

  async function readDeactivationEvents(legalEntityId: string) {
    return withTenantContext((tx) =>
      tx
        .select({ action: schema.auditEvents.action })
        .from(schema.auditEvents)
        .where(
          and(
            eq(schema.auditEvents.tenantId, fixture.tenantId),
            eq(schema.auditEvents.objectId, legalEntityId),
            eq(schema.auditEvents.action, "legal_entity.deactivated"),
          ),
        ),
    );
  }

  beforeAll(async () => {
    await auditFailure.disable();
    await cleanFixture();
    await admin.begin(async (sql) => {
      await sql`insert into "user" (id, name, email, email_verified)
        values (${fixture.userId}, ${`Status Owner ${uniqueSuffix}`}, ${fixture.userEmail}, true)`;
      await sql`insert into tenant
        (id, name, slug, normalized_slug, default_locale, default_timezone)
        values (${fixture.tenantId}, ${`Status Tenant ${uniqueSuffix}`}, ${`status-${uniqueSuffix}`}, ${`status-${uniqueSuffix}`}, 'en-US', 'UTC')`;
      await sql`insert into tenant_status_period (tenant_id, status, valid_from)
        values (${fixture.tenantId}, 'active', '2025-01-01')`;
      await sql`insert into tenant_membership (tenant_id, user_id, role)
        values (${fixture.tenantId}, ${fixture.userId}, 'owner')`;
    });
  });

  afterAll(async () => {
    try {
      await auditFailure.disable();
      await cleanFixture();
    } finally {
      await Promise.all([admin.end(), runtimeClient.end()]);
    }
  });

  test("deactivation and later reactivation preserve status history and audit evidence", async () => {
    const input = legalEntityInput("Lifecycle");
    const deactivatedAt = new Date("2025-03-01T10:00:00.000Z");
    const reactivatedAt = new Date("2025-03-02T10:00:00.000Z");
    const entity = await withTenantContext((tx) =>
      createLegalEntityForTenant(
        tx,
        context,
        input,
        protector.protectTaxIdentifier,
      ),
    );

    await withTenantContext((tx) =>
      changeLegalEntityStatusForTenant(
        tx,
        context,
        entity.id,
        "inactive",
        "2025-04-01",
        "Operations suspended",
        () => deactivatedAt,
      ),
    );
    await withTenantContext((tx) =>
      changeLegalEntityStatusForTenant(
        tx,
        context,
        entity.id,
        "active",
        "2025-08-01",
        "Operations resumed",
        () => reactivatedAt,
      ),
    );

    const entityRows = await admin<{ id: string }[]>`
      select id from legal_entity
      where tenant_id = ${fixture.tenantId} and id = ${entity.id}`;
    expect(entityRows).toHaveLength(1);

    const timeline = await readStatusTimeline(entity.id);
    expect(timeline).toEqual([
      { status: "active", validFrom: "2025-01-01", validTo: "2025-04-01" },
      {
        status: "inactive",
        validFrom: "2025-04-01",
        validTo: "2025-08-01",
      },
      { status: "active", validFrom: "2025-08-01", validTo: null },
    ]);

    const events = await withTenantContext((tx) =>
      tx
        .select({
          actorUserId: schema.auditEvents.actorUserId,
          source: schema.auditEvents.source,
          action: schema.auditEvents.action,
          objectType: schema.auditEvents.objectType,
          objectId: schema.auditEvents.objectId,
          effectiveDate: schema.auditEvents.effectiveDate,
          reason: schema.auditEvents.reason,
          before: schema.auditEvents.before,
          after: schema.auditEvents.after,
          occurredAt: schema.auditEvents.occurredAt,
        })
        .from(schema.auditEvents)
        .where(
          and(
            eq(schema.auditEvents.tenantId, fixture.tenantId),
            eq(schema.auditEvents.objectId, entity.id),
            sql`${schema.auditEvents.action} in ('legal_entity.deactivated', 'legal_entity.reactivated')`,
          ),
        )
        .orderBy(asc(schema.auditEvents.effectiveDate)),
    );
    expect(events).toEqual([
      {
        actorUserId: fixture.userId,
        source: "ui",
        action: "legal_entity.deactivated",
        objectType: "legal_entity",
        objectId: entity.id,
        effectiveDate: "2025-04-01",
        reason: "Operations suspended",
        before: {
          legalName: input.legalName,
          displayName: input.displayName,
          countryCode: "GB",
          registrationNumber: input.registrationNumber,
          currencyCode: "GBP",
          status: "active",
          validFrom: "2025-01-01",
          validTo: null,
          hasTaxIdentifier: true,
        },
        after: {
          legalName: input.legalName,
          displayName: input.displayName,
          countryCode: "GB",
          registrationNumber: input.registrationNumber,
          currencyCode: "GBP",
          status: "inactive",
          validFrom: "2025-04-01",
          validTo: null,
          hasTaxIdentifier: true,
        },
        occurredAt: deactivatedAt,
      },
      {
        actorUserId: fixture.userId,
        source: "ui",
        action: "legal_entity.reactivated",
        objectType: "legal_entity",
        objectId: entity.id,
        effectiveDate: "2025-08-01",
        reason: "Operations resumed",
        before: {
          legalName: input.legalName,
          displayName: input.displayName,
          countryCode: "GB",
          registrationNumber: input.registrationNumber,
          currencyCode: "GBP",
          status: "inactive",
          validFrom: "2025-04-01",
          validTo: null,
          hasTaxIdentifier: true,
        },
        after: {
          legalName: input.legalName,
          displayName: input.displayName,
          countryCode: "GB",
          registrationNumber: input.registrationNumber,
          currencyCode: "GBP",
          status: "active",
          validFrom: "2025-08-01",
          validTo: null,
          hasTaxIdentifier: true,
        },
        occurredAt: reactivatedAt,
      },
    ]);
  });

  test("a repeated stale status submission returns a conflict without duplicating an interval", async () => {
    const entity = await withTenantContext((tx) =>
      createLegalEntityForTenant(
        tx,
        context,
        legalEntityInput("Stale"),
        protector.protectTaxIdentifier,
      ),
    );
    const deactivate = (tx: LegalEntityPersistenceTransaction) =>
      changeLegalEntityStatusForTenant(
        tx,
        context,
        entity.id,
        "inactive",
        "2025-04-01",
        "Operations suspended",
      );

    await withTenantContext(deactivate);
    const staleError = await captureError(() => withTenantContext(deactivate));

    expect(staleError).toBeInstanceOf(ConflictError);
    expect((staleError as ConflictError).message).toBe(
      "The legal entity is already inactive.",
    );

    const timeline = await readStatusTimeline(entity.id);
    expect(timeline).toEqual([
      { status: "active", validFrom: "2025-01-01", validTo: "2025-04-01" },
      { status: "inactive", validFrom: "2025-04-01", validTo: null },
    ]);

    const statusEvents = await readDeactivationEvents(entity.id);
    expect(statusEvents).toEqual([{ action: "legal_entity.deactivated" }]);
  });

  test("concurrent configuration and status mutations retain a non-overlapping timeline", async () => {
    const initial = legalEntityInput("Concurrent");
    const changed = legalEntityInput("Concurrent Changed", {
      taxIdentifier: "",
      effectiveDate: "2025-04-01",
      reason: "Registered name changed",
    });
    const entity = await withTenantContext((tx) =>
      createLegalEntityForTenant(
        tx,
        context,
        initial,
        protector.protectTaxIdentifier,
      ),
    );

    await Promise.all([
      withTenantContext((tx) =>
        scheduleLegalEntityChangeForTenant(
          tx,
          context,
          entity.id,
          changed,
          protector.protectTaxIdentifier,
        ),
      ),
      withTenantContext((tx) =>
        changeLegalEntityStatusForTenant(
          tx,
          context,
          entity.id,
          "inactive",
          "2025-07-01",
          "Operations suspended",
        ),
      ),
    ]);

    const timeline = await withTenantContext((tx) =>
      tx
        .select({
          legalName: schema.legalEntityConfigurations.legalName,
          status: schema.legalEntityConfigurations.status,
          validFrom: schema.legalEntityConfigurations.validFrom,
          validTo: schema.legalEntityConfigurations.validTo,
        })
        .from(schema.legalEntityConfigurations)
        .where(
          and(
            eq(schema.legalEntityConfigurations.tenantId, fixture.tenantId),
            eq(schema.legalEntityConfigurations.legalEntityId, entity.id),
            isNull(schema.legalEntityConfigurations.supersededAt),
          ),
        )
        .orderBy(asc(schema.legalEntityConfigurations.validFrom)),
    );
    expect(timeline).toEqual([
      {
        legalName: initial.legalName,
        status: "active",
        validFrom: "2025-01-01",
        validTo: "2025-04-01",
      },
      {
        legalName: changed.legalName,
        status: "active",
        validFrom: "2025-04-01",
        validTo: "2025-07-01",
      },
      {
        legalName: changed.legalName,
        status: "inactive",
        validFrom: "2025-07-01",
        validTo: null,
      },
    ]);

    const mutationEvents = await withTenantContext((tx) =>
      tx
        .select({
          actorUserId: schema.auditEvents.actorUserId,
          source: schema.auditEvents.source,
          action: schema.auditEvents.action,
          objectType: schema.auditEvents.objectType,
          objectId: schema.auditEvents.objectId,
          effectiveDate: schema.auditEvents.effectiveDate,
          reason: schema.auditEvents.reason,
          before: schema.auditEvents.before,
          after: schema.auditEvents.after,
        })
        .from(schema.auditEvents)
        .where(
          and(
            eq(schema.auditEvents.tenantId, fixture.tenantId),
            eq(schema.auditEvents.objectId, entity.id),
            sql`${schema.auditEvents.action} in ('legal_entity.configuration_changed', 'legal_entity.deactivated')`,
          ),
        )
        .orderBy(asc(schema.auditEvents.effectiveDate)),
    );
    expect(mutationEvents).toHaveLength(2);
    expect(mutationEvents[0]).toMatchObject({
      actorUserId: fixture.userId,
      source: "ui",
      action: "legal_entity.configuration_changed",
      objectType: "legal_entity",
      objectId: entity.id,
      effectiveDate: "2025-04-01",
      reason: "Registered name changed",
      before: { legalName: initial.legalName, status: "active" },
      after: { legalName: changed.legalName, status: "active" },
    });
    expect(mutationEvents[1]).toMatchObject({
      actorUserId: fixture.userId,
      source: "ui",
      action: "legal_entity.deactivated",
      objectType: "legal_entity",
      objectId: entity.id,
      effectiveDate: "2025-07-01",
      reason: "Operations suspended",
      before: { status: "active" },
      after: { status: "inactive" },
    });
  });

  test("concurrent matching status submissions produce one interval and one audit event", async () => {
    const entity = await withTenantContext((tx) =>
      createLegalEntityForTenant(
        tx,
        context,
        legalEntityInput("Concurrent Status"),
        protector.protectTaxIdentifier,
      ),
    );
    let readyCount = 0;
    let releaseConcurrentMutations: () => void = () => {};
    const bothTransactionsReady = new Promise<void>((resolve) => {
      releaseConcurrentMutations = resolve;
    });
    const concurrentDeactivation = () =>
      withTenantContext(async (tx) => {
        readyCount += 1;
        if (readyCount === 2) releaseConcurrentMutations();
        await bothTransactionsReady;
        return changeLegalEntityStatusForTenant(
          tx,
          context,
          entity.id,
          "inactive",
          "2025-04-01",
          "Operations suspended",
        );
      });

    const results = await Promise.allSettled([
      concurrentDeactivation(),
      concurrentDeactivation(),
    ]);
    expect(
      results.filter((result) => result.status === "fulfilled"),
    ).toHaveLength(1);
    const [rejected] = results.filter((result) => result.status === "rejected");
    expect(rejected?.reason).toBeInstanceOf(ConflictError);
    expect((rejected?.reason as ConflictError).message).toBe(
      "The legal entity is already inactive.",
    );
    expect(await readStatusTimeline(entity.id)).toEqual([
      { status: "active", validFrom: "2025-01-01", validTo: "2025-04-01" },
      { status: "inactive", validFrom: "2025-04-01", validTo: null },
    ]);

    const statusEvents = await readDeactivationEvents(entity.id);
    expect(statusEvents).toEqual([{ action: "legal_entity.deactivated" }]);
  });

  test("a failed status mutation rolls back business and audit state", async () => {
    const entity = await withTenantContext((tx) =>
      createLegalEntityForTenant(
        tx,
        context,
        legalEntityInput("Rollback"),
        protector.protectTaxIdentifier,
      ),
    );

    await auditFailure.enable();
    let mutationError: unknown;
    try {
      mutationError = await captureError(() =>
        withTenantContext((tx) =>
          changeLegalEntityStatusForTenant(
            tx,
            context,
            entity.id,
            "inactive",
            "2025-04-01",
            "Must roll back",
          ),
        ),
      );
    } finally {
      await auditFailure.disable();
    }

    expect(mutationError).toBeInstanceOf(Error);
    expect((mutationError as Error).message).toContain(
      'insert into "audit_event"',
    );
    const cause =
      mutationError instanceof Error && "cause" in mutationError
        ? mutationError.cause
        : null;
    expect(cause).toMatchObject({
      name: "PostgresError",
      message: "forced status audit failure",
    });

    const configurations = await admin<
      {
        status: "active" | "inactive";
        validFrom: string;
        validTo: string | null;
        supersededAt: Date | null;
      }[]
    >`select status, valid_from::text as "validFrom", valid_to::text as "validTo",
        superseded_at as "supersededAt"
      from legal_entity_configuration
      where tenant_id = ${fixture.tenantId} and legal_entity_id = ${entity.id}`;
    expect(Array.from(configurations)).toEqual([
      {
        status: "active",
        validFrom: "2025-01-01",
        validTo: null,
        supersededAt: null,
      },
    ]);

    const statusEvents = await admin<{ count: number }[]>`
      select count(*)::int as count from audit_event
      where tenant_id = ${fixture.tenantId}
        and object_id = ${entity.id}
        and action in ('legal_entity.deactivated', 'legal_entity.reactivated')`;
    expect(statusEvents[0]?.count).toBe(0);
  });
});
