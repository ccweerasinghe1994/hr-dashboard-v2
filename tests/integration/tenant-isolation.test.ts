import { afterAll, beforeAll, describe, expect, test } from "bun:test";
import postgres from "postgres";
import { testDatabaseEnvironment } from "../support/integration-environment";

const { adminUrl, runtimeUrl } = testDatabaseEnvironment;

const fixture = {
  userA: "91000000-0000-4000-8000-000000000001",
  userB: "91000000-0000-4000-8000-000000000002",
  tenantA: "92000000-0000-4000-8000-000000000001",
  tenantB: "92000000-0000-4000-8000-000000000002",
  entityA: "93000000-0000-4000-8000-000000000001",
  entityB: "93000000-0000-4000-8000-000000000002",
};

describe("forced tenant row-level security", () => {
  const admin = postgres(adminUrl, { max: 1, prepare: false });
  const runtime = postgres(runtimeUrl, { max: 1, prepare: false });

  beforeAll(async () => {
    await admin.begin(async (sql) => {
      await sql`insert into "user" (id, name, email, email_verified) values
        (${fixture.userA}, 'Isolation A', 'isolation-a@example.test', true),
        (${fixture.userB}, 'Isolation B', 'isolation-b@example.test', true)`;
      await sql`insert into tenant (id, name, slug, normalized_slug, default_locale, default_timezone) values
        (${fixture.tenantA}, 'Isolation A', 'isolation-a', 'isolation-a', 'en-US', 'UTC'),
        (${fixture.tenantB}, 'Isolation B', 'isolation-b', 'isolation-b', 'en-US', 'UTC')`;
      await sql`insert into tenant_status_period (tenant_id, status, valid_from) values
        (${fixture.tenantA}, 'active', current_date),
        (${fixture.tenantB}, 'active', current_date)`;
      await sql`insert into tenant_membership (tenant_id, user_id, role) values
        (${fixture.tenantA}, ${fixture.userA}, 'owner'),
        (${fixture.tenantB}, ${fixture.userB}, 'owner')`;
      await sql`insert into legal_entity (id, tenant_id, created_by) values
        (${fixture.entityA}, ${fixture.tenantA}, ${fixture.userA}),
        (${fixture.entityB}, ${fixture.tenantB}, ${fixture.userB})`;
    });
  });

  afterAll(async () => {
    await admin.begin(async (sql) => {
      await sql`delete from audit_event where tenant_id in (${fixture.tenantA}, ${fixture.tenantB})`;
      await sql`delete from legal_entity_configuration where tenant_id in (${fixture.tenantA}, ${fixture.tenantB})`;
      await sql`delete from legal_entity where tenant_id in (${fixture.tenantA}, ${fixture.tenantB})`;
      await sql`delete from tenant_membership where tenant_id in (${fixture.tenantA}, ${fixture.tenantB})`;
      await sql`delete from tenant_status_period where tenant_id in (${fixture.tenantA}, ${fixture.tenantB})`;
      await sql`delete from tenant where id in (${fixture.tenantA}, ${fixture.tenantB})`;
      await sql`delete from "user" where id in (${fixture.userA}, ${fixture.userB})`;
    });
    await Promise.all([admin.end(), runtime.end()]);
  });

  test("a tenant context can read only its own records", async () => {
    const rows = await runtime.begin(async (sql) => {
      await sql`select set_config('app.current_user_id', ${fixture.userA}, true)`;
      await sql`select set_config('app.current_tenant_id', ${fixture.tenantA}, true)`;
      return sql<{ id: string }[]>`select id from legal_entity order by id`;
    });
    expect(rows.map((row) => row.id)).toEqual([fixture.entityA]);
  });

  test("a tenant context cannot write a row for another tenant", async () => {
    const attempt = runtime.begin(async (sql) => {
      await sql`select set_config('app.current_user_id', ${fixture.userA}, true)`;
      await sql`select set_config('app.current_tenant_id', ${fixture.tenantA}, true)`;
      await sql`insert into legal_entity (tenant_id, created_by) values (${fixture.tenantB}, ${fixture.userA})`;
    });
    await expect(attempt).rejects.toMatchObject({ code: "42501" });
  });

  test("composite ownership rejects a cross-tenant configuration", async () => {
    const attempt = runtime.begin(async (sql) => {
      await sql`select set_config('app.current_user_id', ${fixture.userA}, true)`;
      await sql`select set_config('app.current_tenant_id', ${fixture.tenantA}, true)`;
      await sql`insert into legal_entity_configuration
        (tenant_id, legal_entity_id, legal_name, normalized_legal_name, country_code, valid_from, change_reason, recorded_by)
        values (${fixture.tenantA}, ${fixture.entityB}, 'Cross tenant', 'cross tenant', 'US', current_date, 'test', ${fixture.userA})`;
    });
    await expect(attempt).rejects.toMatchObject({ code: "23503" });
  });
});
