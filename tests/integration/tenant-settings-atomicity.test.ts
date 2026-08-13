import {
  afterAll,
  beforeAll,
  beforeEach,
  describe,
  expect,
  test,
} from "bun:test";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "@/db/schema";
import {
  getTenantSettingsForTenant,
  updateTenantSettingsForTenant,
} from "@/lib/organization/tenant-settings-persistence";
import { withTenantContextForSession } from "@/lib/tenancy/tenant-context-persistence";
import { captureError } from "../support/capture-error";
import { forcedAuditFailure } from "../support/forced-audit-failure";
import { testDatabaseEnvironment } from "../support/integration-environment";

const { adminUrl, runtimeUrl } = testDatabaseEnvironment;
const suffix = crypto.randomUUID().slice(0, 8);
const asOfDate = "2026-08-13";
const fixture = {
  ownerUserId: crypto.randomUUID(),
  ownerSessionId: crypto.randomUUID(),
  ownerTenantId: crypto.randomUUID(),
  memberUserId: crypto.randomUUID(),
  memberSessionId: crypto.randomUUID(),
  memberTenantId: crypto.randomUUID(),
  inactiveOwnerUserId: crypto.randomUUID(),
  inactiveOwnerSessionId: crypto.randomUUID(),
  inactiveTenantId: crypto.randomUUID(),
};

function requestSession(userId: string, sessionId: string, tenantId: string) {
  return {
    user: { id: userId },
    session: { id: sessionId, currentTenantId: tenantId },
  };
}

describe("tenant settings authorization and transaction boundaries", () => {
  const admin = postgres(adminUrl, {
    max: 1,
    prepare: false,
    onnotice: () => undefined,
  });
  const runtimeClient = postgres(runtimeUrl, {
    max: 5,
    prepare: false,
    onnotice: () => undefined,
  });
  const runtime = drizzle({ client: runtimeClient, schema });
  const auditFailure = forcedAuditFailure(
    admin,
    "issue_239_fail_settings_audit_insert",
    "forced audit failure",
  );

  async function cleanFixture() {
    const tenantIds = [
      fixture.ownerTenantId,
      fixture.memberTenantId,
      fixture.inactiveTenantId,
    ];
    const userIds = [
      fixture.ownerUserId,
      fixture.memberUserId,
      fixture.inactiveOwnerUserId,
    ];
    await admin.begin(async (sql) => {
      await sql`delete from audit_event where tenant_id in ${sql(tenantIds)}`;
      await sql`delete from session where user_id in ${sql(userIds)}`;
      await sql`delete from tenant_membership where tenant_id in ${sql(tenantIds)}`;
      await sql`delete from tenant_status_period where tenant_id in ${sql(tenantIds)}`;
      await sql`delete from tenant where id in ${sql(tenantIds)}`;
      await sql`delete from "user" where id in ${sql(userIds)}`;
    });
  }

  beforeAll(async () => {
    await cleanFixture();
    await admin.begin(async (sql) => {
      await sql`insert into "user" (id, name, email, email_verified) values
        (${fixture.ownerUserId}, 'Settings Owner', ${`settings-owner-${suffix}@example.test`}, true),
        (${fixture.memberUserId}, 'Settings Member', ${`settings-member-${suffix}@example.test`}, true),
        (${fixture.inactiveOwnerUserId}, 'Inactive Owner', ${`inactive-owner-${suffix}@example.test`}, true)`;
      await sql`insert into tenant
        (id, name, slug, normalized_slug, default_locale, default_timezone) values
        (${fixture.ownerTenantId}, 'Owner Tenant', ${`owner-${suffix}`}, ${`owner-${suffix}`}, 'en-US', 'UTC'),
        (${fixture.memberTenantId}, 'Member Tenant', ${`member-${suffix}`}, ${`member-${suffix}`}, 'en-US', 'UTC'),
        (${fixture.inactiveTenantId}, 'Inactive Tenant', ${`inactive-${suffix}`}, ${`inactive-${suffix}`}, 'en-US', 'UTC')`;
      await sql`insert into tenant_status_period
        (tenant_id, status, valid_from, recorded_by) values
        (${fixture.ownerTenantId}, 'active', ${asOfDate}, ${fixture.ownerUserId}),
        (${fixture.memberTenantId}, 'active', ${asOfDate}, ${fixture.memberUserId}),
        (${fixture.inactiveTenantId}, 'inactive', ${asOfDate}, ${fixture.inactiveOwnerUserId})`;
      await sql`insert into tenant_membership
        (tenant_id, user_id, role, status) values
        (${fixture.ownerTenantId}, ${fixture.ownerUserId}, 'owner', 'active'),
        (${fixture.memberTenantId}, ${fixture.memberUserId}, 'member', 'active'),
        (${fixture.inactiveTenantId}, ${fixture.inactiveOwnerUserId}, 'owner', 'active')`;
      await sql`insert into session
        (id, expires_at, token, user_id, current_tenant_id) values
        (${fixture.ownerSessionId}, now() + interval '1 day', ${`owner-token-${suffix}`}, ${fixture.ownerUserId}, ${fixture.ownerTenantId}),
        (${fixture.memberSessionId}, now() + interval '1 day', ${`member-token-${suffix}`}, ${fixture.memberUserId}, ${fixture.memberTenantId}),
        (${fixture.inactiveOwnerSessionId}, now() + interval '1 day', ${`inactive-token-${suffix}`}, ${fixture.inactiveOwnerUserId}, ${fixture.inactiveTenantId})`;
    });
  });

  beforeEach(async () => {
    await auditFailure.disable();
    await admin.begin(async (sql) => {
      await sql`delete from audit_event where tenant_id = ${fixture.ownerTenantId}`;
      await sql`update tenant set
        name = 'Owner Tenant',
        default_locale = 'en-US',
        default_timezone = 'UTC'
      where id = ${fixture.ownerTenantId}`;
      await sql`update tenant_membership set role = 'member', status = 'active'
      where tenant_id = ${fixture.memberTenantId}
        and user_id = ${fixture.memberUserId}`;
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

  test("tenant settings reject an active non-owner", async () => {
    const session = requestSession(
      fixture.memberUserId,
      fixture.memberSessionId,
      fixture.memberTenantId,
    );

    const readError = await captureError(() =>
      withTenantContextForSession(
        runtime,
        session,
        asOfDate,
        getTenantSettingsForTenant,
        "owner",
      ),
    );
    const writeError = await captureError(() =>
      withTenantContextForSession(
        runtime,
        session,
        asOfDate,
        (tx, context) =>
          updateTenantSettingsForTenant(tx, context, {
            name: "Unauthorized change",
            locale: "en-GB",
            timezone: "Europe/London",
          }),
        "owner",
      ),
    );

    const [state] = await admin<
      { name: string; locale: string; timezone: string; auditEvents: number }[]
    >`select
      t.name,
      t.default_locale as locale,
      t.default_timezone as timezone,
      (select count(*)::int from audit_event where tenant_id = t.id) as "auditEvents"
    from tenant t where t.id = ${fixture.memberTenantId}`;
    expect({ readError, writeError, state }).toEqual({
      readError: expect.objectContaining({ name: "AuthorizationError" }),
      writeError: expect.objectContaining({ name: "AuthorizationError" }),
      state: {
        name: "Member Tenant",
        locale: "en-US",
        timezone: "UTC",
        auditEvents: 0,
      },
    });
  });

  test("tenant settings reject an owner with an inactive membership", async () => {
    await admin`update tenant_membership set role = 'owner', status = 'inactive'
    where tenant_id = ${fixture.memberTenantId}
      and user_id = ${fixture.memberUserId}`;
    const session = requestSession(
      fixture.memberUserId,
      fixture.memberSessionId,
      fixture.memberTenantId,
    );

    const readError = await captureError(() =>
      withTenantContextForSession(
        runtime,
        session,
        asOfDate,
        getTenantSettingsForTenant,
        "owner",
      ),
    );
    const writeError = await captureError(() =>
      withTenantContextForSession(
        runtime,
        session,
        asOfDate,
        (tx, context) =>
          updateTenantSettingsForTenant(tx, context, {
            name: "Inactive membership change",
            locale: "en-GB",
            timezone: "Europe/London",
          }),
        "owner",
      ),
    );

    const [state] = await admin<
      { name: string; locale: string; timezone: string; auditEvents: number }[]
    >`select
      t.name,
      t.default_locale as locale,
      t.default_timezone as timezone,
      (select count(*)::int from audit_event where tenant_id = t.id) as "auditEvents"
    from tenant t where t.id = ${fixture.memberTenantId}`;
    expect({ readError, writeError, state }).toEqual({
      readError: expect.objectContaining({ name: "TenantUnavailableError" }),
      writeError: expect.objectContaining({ name: "TenantUnavailableError" }),
      state: {
        name: "Member Tenant",
        locale: "en-US",
        timezone: "UTC",
        auditEvents: 0,
      },
    });
  });

  test("an inactive tenant cannot use interactive settings reads or writes", async () => {
    const session = requestSession(
      fixture.inactiveOwnerUserId,
      fixture.inactiveOwnerSessionId,
      fixture.inactiveTenantId,
    );

    const readError = await captureError(() =>
      withTenantContextForSession(
        runtime,
        session,
        asOfDate,
        getTenantSettingsForTenant,
        "owner",
      ),
    );
    const writeError = await captureError(() =>
      withTenantContextForSession(
        runtime,
        session,
        asOfDate,
        (tx, context) =>
          updateTenantSettingsForTenant(tx, context, {
            name: "Inactive change",
            locale: "en-GB",
            timezone: "Europe/London",
          }),
        "owner",
      ),
    );

    const [state] = await admin<
      { name: string; locale: string; timezone: string; auditEvents: number }[]
    >`select
      t.name,
      t.default_locale as locale,
      t.default_timezone as timezone,
      (select count(*)::int from audit_event where tenant_id = t.id) as "auditEvents"
    from tenant t where t.id = ${fixture.inactiveTenantId}`;
    expect({ readError, writeError, state }).toEqual({
      readError: expect.objectContaining({ name: "TenantUnavailableError" }),
      writeError: expect.objectContaining({ name: "TenantUnavailableError" }),
      state: {
        name: "Inactive Tenant",
        locale: "en-US",
        timezone: "UTC",
        auditEvents: 0,
      },
    });
  });

  test("tenant settings commit with safe before and after audit state", async () => {
    const session = requestSession(
      fixture.ownerUserId,
      fixture.ownerSessionId,
      fixture.ownerTenantId,
    );

    const result = await withTenantContextForSession(
      runtime,
      session,
      asOfDate,
      (tx, context) =>
        updateTenantSettingsForTenant(tx, context, {
          name: "Updated Owner Tenant",
          locale: "en-GB",
          timezone: "Europe/London",
        }),
      "owner",
    );

    const [state] = await admin<
      {
        name: string;
        slug: string;
        locale: string;
        timezone: string;
        actorUserId: string;
        source: string;
        action: string;
        objectType: string;
        objectId: string;
        reason: string;
        before: Record<string, unknown>;
        after: Record<string, unknown>;
      }[]
    >`select
      t.name,
      t.slug,
      t.default_locale as locale,
      t.default_timezone as timezone,
      ae.actor_user_id as "actorUserId",
      ae.source,
      ae.action,
      ae.object_type as "objectType",
      ae.object_id as "objectId",
      ae.reason,
      ae.before,
      ae.after
    from tenant t
    join audit_event ae on ae.tenant_id = t.id
    where t.id = ${fixture.ownerTenantId}`;
    expect({ result, state }).toEqual({
      result: {
        id: fixture.ownerTenantId,
        name: "Updated Owner Tenant",
        locale: "en-GB",
        timezone: "Europe/London",
      },
      state: {
        name: "Updated Owner Tenant",
        slug: `owner-${suffix}`,
        locale: "en-GB",
        timezone: "Europe/London",
        actorUserId: fixture.ownerUserId,
        source: "ui",
        action: "tenant.settings_updated",
        objectType: "tenant",
        objectId: fixture.ownerTenantId,
        reason: "Organization settings updated",
        before: {
          id: fixture.ownerTenantId,
          name: "Owner Tenant",
          locale: "en-US",
          timezone: "UTC",
        },
        after: {
          id: fixture.ownerTenantId,
          name: "Updated Owner Tenant",
          locale: "en-GB",
          timezone: "Europe/London",
        },
      },
    });
  });

  test("tenant settings roll back when their audit event cannot commit", async () => {
    const session = requestSession(
      fixture.ownerUserId,
      fixture.ownerSessionId,
      fixture.ownerTenantId,
    );
    await auditFailure.enable();

    let mutationError: unknown;
    try {
      mutationError = await captureError(() =>
        withTenantContextForSession(
          runtime,
          session,
          asOfDate,
          (tx, context) =>
            updateTenantSettingsForTenant(tx, context, {
              name: "Must roll back",
              locale: "fr-FR",
              timezone: "Europe/Paris",
            }),
          "owner",
        ),
      );
    } finally {
      await auditFailure.disable();
    }
    const cause =
      mutationError instanceof Error && "cause" in mutationError
        ? mutationError.cause
        : null;

    const [state] = await admin<
      { name: string; locale: string; timezone: string; auditEvents: number }[]
    >`select
      t.name,
      t.default_locale as locale,
      t.default_timezone as timezone,
      (select count(*)::int from audit_event where tenant_id = t.id) as "auditEvents"
    from tenant t where t.id = ${fixture.ownerTenantId}`;
    expect({
      mutationFailed:
        mutationError instanceof Error &&
        mutationError.message.includes('insert into "audit_event"'),
      cause:
        cause instanceof Error
          ? { name: cause.name, message: cause.message }
          : cause,
      state,
    }).toEqual({
      mutationFailed: true,
      cause: {
        name: "PostgresError",
        message: "forced audit failure",
      },
      state: {
        name: "Owner Tenant",
        locale: "en-US",
        timezone: "UTC",
        auditEvents: 0,
      },
    });
  });
});
