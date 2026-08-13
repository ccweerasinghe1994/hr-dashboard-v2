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
import { ConflictError } from "@/data/errors";
import * as schema from "@/db/schema";
import { provisionFirstTenantInDatabase } from "@/lib/organization/bootstrap-persistence";
import { captureError } from "../support/capture-error";
import { testDatabaseEnvironment } from "../support/integration-environment";

const { adminUrl, runtimeUrl } = testDatabaseEnvironment;
const fixturePrefix = `issue-239-${crypto.randomUUID().slice(0, 8)}`;
const effectiveDate = "2026-08-13";

function bootstrapInput(label: string, secret = "valid-bootstrap-secret") {
  return {
    bootstrapSecret: secret,
    ownerName: `Bootstrap Owner ${label}`,
    email: `${fixturePrefix}-${label}@example.test`,
    password: "Valid-test-password-123!",
    tenantName: `Bootstrap Tenant ${label}`,
    tenantSlug: `${fixturePrefix}-${label}`,
    locale: "en-US",
    timezone: "UTC",
  };
}

describe("bootstrap and tenant settings transaction boundaries", () => {
  const admin = postgres(adminUrl, {
    max: 1,
    prepare: false,
    onnotice: () => undefined,
  });
  const runtimeClient = postgres(runtimeUrl, {
    max: 10,
    prepare: false,
    onnotice: () => undefined,
  });
  const runtime = drizzle({ client: runtimeClient, schema });

  async function cleanBootstrapFixtures() {
    await admin.begin(async (sql) => {
      await sql`delete from session where user_id in (
        select id from "user" where email like ${`${fixturePrefix}-%`}
      )`;
      await sql`delete from account where user_id in (
        select id from "user" where email like ${`${fixturePrefix}-%`}
      )`;
      await sql`delete from audit_event where tenant_id in (
        select id from tenant where slug like ${`${fixturePrefix}-%`}
      )`;
      await sql`delete from tenant_membership where tenant_id in (
        select id from tenant where slug like ${`${fixturePrefix}-%`}
      )`;
      await sql`delete from tenant_status_period where tenant_id in (
        select id from tenant where slug like ${`${fixturePrefix}-%`}
      )`;
      await sql`delete from tenant where slug like ${`${fixturePrefix}-%`}`;
      await sql`delete from "user" where email like ${`${fixturePrefix}-%`}`;
      await sql`update system_state set bootstrap_completed = false where id = 1`;
    });
  }

  async function disableForcedBootstrapAuditFailure() {
    await admin`drop trigger if exists issue_239_fail_bootstrap_audit_insert on audit_event`;
    await admin`drop function if exists issue_239_fail_bootstrap_audit_insert()`;
  }

  async function enableForcedBootstrapAuditFailure() {
    await disableForcedBootstrapAuditFailure();
    await admin`create function issue_239_fail_bootstrap_audit_insert()
      returns trigger language plpgsql as $$
      begin
        raise exception 'forced bootstrap audit failure';
      end
      $$`;
    await admin`create trigger issue_239_fail_bootstrap_audit_insert
      before insert on audit_event
      for each row execute function issue_239_fail_bootstrap_audit_insert()`;
  }

  async function bootstrapState(input: ReturnType<typeof bootstrapInput>) {
    const [state] = await admin<
      {
        users: number;
        accounts: number;
        tenants: number;
        statusPeriods: number;
        memberships: number;
        sessions: number;
        auditEvents: number;
        bootstrapCompleted: boolean;
      }[]
    >`select
      (select count(*)::int from "user" where email = ${input.email}) as users,
      (select count(*)::int from account where user_id in (
        select id from "user" where email = ${input.email}
      )) as accounts,
      (select count(*)::int from tenant where slug = ${input.tenantSlug}) as tenants,
      (select count(*)::int from tenant_status_period where tenant_id in (
        select id from tenant where slug = ${input.tenantSlug}
      )) as "statusPeriods",
      (select count(*)::int from tenant_membership where tenant_id in (
        select id from tenant where slug = ${input.tenantSlug}
      )) as memberships,
      (select count(*)::int from session where user_id in (
        select id from "user" where email = ${input.email}
      )) as sessions,
      (select count(*)::int from audit_event where tenant_id in (
        select id from tenant where slug = ${input.tenantSlug}
      )) as "auditEvents",
      (select bootstrap_completed from system_state where id = 1) as "bootstrapCompleted"`;
    return state;
  }

  async function bootstrapFoundation(userId: string, tenantId: string) {
    const [foundation] = await admin<
      {
        userId: string;
        ownerName: string;
        email: string;
        accountUserId: string;
        accountProvider: string;
        passwordHash: string;
        tenantId: string;
        tenantName: string;
        tenantSlug: string;
        locale: string;
        timezone: string;
        tenantStatus: string;
        membershipRole: string;
        membershipStatus: string;
        auditActor: string;
        auditSource: string;
        auditAction: string;
        auditObjectType: string;
        auditObjectId: string;
        auditAfter: Record<string, unknown>;
      }[]
    >`select
      u.id as "userId",
      u.name as "ownerName",
      u.email,
      a.user_id as "accountUserId",
      a.provider_id as "accountProvider",
      a.password as "passwordHash",
      t.id as "tenantId",
      t.name as "tenantName",
      t.slug as "tenantSlug",
      t.default_locale as locale,
      t.default_timezone as timezone,
      tsp.status as "tenantStatus",
      tm.role as "membershipRole",
      tm.status as "membershipStatus",
      ae.actor_user_id as "auditActor",
      ae.source as "auditSource",
      ae.action as "auditAction",
      ae.object_type as "auditObjectType",
      ae.object_id as "auditObjectId",
      ae.after as "auditAfter"
    from "user" u
    join account a on a.user_id = u.id
    join tenant_membership tm on tm.user_id = u.id
    join tenant t on t.id = tm.tenant_id
    join tenant_status_period tsp on tsp.tenant_id = t.id
    join audit_event ae on ae.tenant_id = t.id
    where u.id = ${userId} and t.id = ${tenantId}`;
    return foundation;
  }

  beforeAll(async () => {
    await disableForcedBootstrapAuditFailure();
    await cleanBootstrapFixtures();
  });
  beforeEach(async () => {
    await disableForcedBootstrapAuditFailure();
    await cleanBootstrapFixtures();
  });

  afterAll(async () => {
    try {
      await disableForcedBootstrapAuditFailure();
      await cleanBootstrapFixtures();
    } finally {
      await Promise.all([admin.end(), runtimeClient.end()]);
    }
  });

  test("an invalid bootstrap secret creates no provisioning state", async () => {
    const input = bootstrapInput("invalid-secret", "wrong-secret");

    await expect(
      provisionFirstTenantInDatabase(
        runtime,
        input,
        "valid-bootstrap-secret",
        effectiveDate,
      ),
    ).rejects.toBeInstanceOf(ConflictError);

    expect(await bootstrapState(input)).toEqual({
      users: 0,
      accounts: 0,
      tenants: 0,
      statusPeriods: 0,
      memberships: 0,
      sessions: 0,
      auditEvents: 0,
      bootstrapCompleted: false,
    });
  });

  test("a valid first bootstrap creates the complete tenant-owner foundation", async () => {
    const input = bootstrapInput("complete");

    const result = await provisionFirstTenantInDatabase(
      runtime,
      input,
      "valid-bootstrap-secret",
      effectiveDate,
    );

    expect({
      state: await bootstrapState(input),
      foundation: await bootstrapFoundation(result.userId, result.tenantId),
    }).toEqual({
      state: {
        users: 1,
        accounts: 1,
        tenants: 1,
        statusPeriods: 1,
        memberships: 1,
        sessions: 0,
        auditEvents: 1,
        bootstrapCompleted: true,
      },
      foundation: {
        userId: result.userId,
        ownerName: input.ownerName,
        email: input.email,
        accountUserId: result.userId,
        accountProvider: "credential",
        passwordHash: expect.stringMatching(/^[a-f0-9]{32}:[a-f0-9]{128}$/),
        tenantId: result.tenantId,
        tenantName: input.tenantName,
        tenantSlug: input.tenantSlug,
        locale: input.locale,
        timezone: input.timezone,
        tenantStatus: "active",
        membershipRole: "owner",
        membershipStatus: "active",
        auditActor: result.userId,
        auditSource: "bootstrap",
        auditAction: "tenant.provisioned",
        auditObjectType: "tenant",
        auditObjectId: result.tenantId,
        auditAfter: {
          name: input.tenantName,
          slug: input.tenantSlug,
          defaultLocale: input.locale,
          defaultTimezone: input.timezone,
          status: "active",
        },
      },
    });
  });

  test("a repeated bootstrap attempt leaves the first foundation unchanged", async () => {
    const input = bootstrapInput("repeated");
    const first = await provisionFirstTenantInDatabase(
      runtime,
      input,
      "valid-bootstrap-secret",
      effectiveDate,
    );

    let repeatedError: unknown;
    try {
      await provisionFirstTenantInDatabase(
        runtime,
        input,
        "valid-bootstrap-secret",
        effectiveDate,
      );
    } catch (error) {
      repeatedError = error;
    }
    expect({
      repeatedError,
      state: await bootstrapState(input),
      foundation: await bootstrapFoundation(first.userId, first.tenantId),
    }).toEqual({
      repeatedError: expect.objectContaining({
        name: "ConflictError",
        message: "TeamHub setup has already been completed.",
      }),
      state: {
        users: 1,
        accounts: 1,
        tenants: 1,
        statusPeriods: 1,
        memberships: 1,
        sessions: 0,
        auditEvents: 1,
        bootstrapCompleted: true,
      },
      foundation: expect.objectContaining({
        userId: first.userId,
        tenantId: first.tenantId,
        email: input.email,
        tenantSlug: input.tenantSlug,
        auditAction: "tenant.provisioned",
      }),
    });
  });

  test("concurrent bootstrap attempts create exactly one first tenant", async () => {
    const input = bootstrapInput("concurrent");

    const outcomes = await Promise.allSettled(
      Array.from({ length: 4 }, () =>
        provisionFirstTenantInDatabase(
          runtime,
          input,
          "valid-bootstrap-secret",
          effectiveDate,
        ),
      ),
    );
    const success = outcomes.find((outcome) => outcome.status === "fulfilled");
    if (!success || success.status !== "fulfilled") {
      throw new Error("Expected one successful bootstrap attempt.");
    }

    expect({
      statuses: outcomes.map((outcome) => outcome.status).sort(),
      failures: outcomes
        .filter((outcome) => outcome.status === "rejected")
        .map((outcome) => ({
          name: (outcome.reason as Error).name,
          message: (outcome.reason as Error).message,
        })),
      state: await bootstrapState(input),
      foundation: await bootstrapFoundation(
        success.value.userId,
        success.value.tenantId,
      ),
    }).toEqual({
      statuses: (
        ["fulfilled", "rejected", "rejected", "rejected"] as Array<
          "fulfilled" | "rejected"
        >
      ).sort(),
      failures: Array.from({ length: 3 }, () => ({
        name: "ConflictError",
        message: "TeamHub setup has already been completed.",
      })),
      state: {
        users: 1,
        accounts: 1,
        tenants: 1,
        statusPeriods: 1,
        memberships: 1,
        sessions: 0,
        auditEvents: 1,
        bootstrapCompleted: true,
      },
      foundation: expect.objectContaining({
        userId: success.value.userId,
        tenantId: success.value.tenantId,
        email: input.email,
        tenantSlug: input.tenantSlug,
        auditAction: "tenant.provisioned",
      }),
    });
  });

  test("bootstrap rolls back when its audit event cannot commit", async () => {
    const input = bootstrapInput("audit-rollback");
    await enableForcedBootstrapAuditFailure();

    let mutationError: unknown;
    try {
      mutationError = await captureError(() =>
        provisionFirstTenantInDatabase(
          runtime,
          input,
          "valid-bootstrap-secret",
          effectiveDate,
        ),
      );
    } finally {
      await disableForcedBootstrapAuditFailure();
    }
    const cause =
      mutationError instanceof Error && "cause" in mutationError
        ? mutationError.cause
        : null;

    expect({
      mutationFailed:
        mutationError instanceof Error &&
        mutationError.message.includes('insert into "audit_event"'),
      cause:
        cause instanceof Error
          ? { name: cause.name, message: cause.message }
          : cause,
      state: await bootstrapState(input),
    }).toEqual({
      mutationFailed: true,
      cause: {
        name: "PostgresError",
        message: "forced bootstrap audit failure",
      },
      state: {
        users: 0,
        accounts: 0,
        tenants: 0,
        statusPeriods: 0,
        memberships: 0,
        sessions: 0,
        auditEvents: 0,
        bootstrapCompleted: false,
      },
    });
  });
});
