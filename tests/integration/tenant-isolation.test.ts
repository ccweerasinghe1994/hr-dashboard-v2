import { afterAll, beforeAll, describe, expect, test } from "bun:test";
import postgres from "postgres";
import { testDatabaseEnvironment } from "../support/integration-environment";

const { adminUrl, runtimeUrl } = testDatabaseEnvironment;

const fixtureRunId = crypto.randomUUID();
const fixture = {
  userA: crypto.randomUUID(),
  userB: crypto.randomUUID(),
  tenantA: crypto.randomUUID(),
  tenantB: crypto.randomUUID(),
  entityA: crypto.randomUUID(),
  entityB: crypto.randomUUID(),
  membershipA: crypto.randomUUID(),
  membershipB: crypto.randomUUID(),
  statusPeriodA: crypto.randomUUID(),
  statusPeriodB: crypto.randomUUID(),
  configurationA: crypto.randomUUID(),
  configurationB: crypto.randomUUID(),
  auditEventA: crypto.randomUUID(),
  auditEventB: crypto.randomUUID(),
  userNameA: `Isolation A ${fixtureRunId}`,
  userNameB: `Isolation B ${fixtureRunId}`,
  userEmailA: `isolation-a-${fixtureRunId}@example.test`,
  userEmailB: `isolation-b-${fixtureRunId}@example.test`,
  tenantNameA: `Isolation A ${fixtureRunId}`,
  tenantNameB: `Isolation B ${fixtureRunId}`,
  tenantSlugA: `isolation-a-${fixtureRunId}`,
  tenantSlugB: `isolation-b-${fixtureRunId}`,
  equivalentLegalName: `Equivalent Legal Name ${fixtureRunId}`,
  equivalentNormalizedLegalName: `equivalent legal name ${fixtureRunId}`,
  equivalentRegistrationNumber: `REG-${fixtureRunId}`,
  equivalentNormalizedRegistrationNumber: `REG${fixtureRunId.replaceAll("-", "")}`,
};

const tenantOwnedRows = [
  { table: "tenant", id: fixture.tenantA },
  { table: "tenant_membership", id: fixture.membershipA },
  { table: "tenant_status_period", id: fixture.statusPeriodA },
  { table: "legal_entity", id: fixture.entityA },
  {
    table: "legal_entity_configuration",
    id: fixture.configurationA,
  },
  { table: "audit_event", id: fixture.auditEventA },
] as const;

describe("forced tenant row-level security", () => {
  const admin = postgres(adminUrl, { max: 1, prepare: false });
  const runtime = postgres(runtimeUrl, { max: 1, prepare: false });

  const cleanupFixtures = () =>
    admin.begin(async (sql) => {
      await sql`delete from audit_event where tenant_id in (${fixture.tenantA}, ${fixture.tenantB})`;
      await sql`delete from legal_entity_configuration where tenant_id in (${fixture.tenantA}, ${fixture.tenantB})`;
      await sql`delete from legal_entity where tenant_id in (${fixture.tenantA}, ${fixture.tenantB})`;
      await sql`delete from tenant_membership where tenant_id in (${fixture.tenantA}, ${fixture.tenantB})`;
      await sql`delete from tenant_status_period where tenant_id in (${fixture.tenantA}, ${fixture.tenantB})`;
      await sql`delete from tenant where id in (${fixture.tenantA}, ${fixture.tenantB})`;
      await sql`delete from "user" where id in (${fixture.userA}, ${fixture.userB})`;
    });

  beforeAll(async () => {
    await cleanupFixtures();
    await admin.begin(async (sql) => {
      await sql`insert into "user" (id, name, email, email_verified) values
        (${fixture.userA}, ${fixture.userNameA}, ${fixture.userEmailA}, true),
        (${fixture.userB}, ${fixture.userNameB}, ${fixture.userEmailB}, true)`;
      await sql`insert into tenant (id, name, slug, normalized_slug, default_locale, default_timezone) values
        (${fixture.tenantA}, ${fixture.tenantNameA}, ${fixture.tenantSlugA}, ${fixture.tenantSlugA}, 'en-US', 'UTC'),
        (${fixture.tenantB}, ${fixture.tenantNameB}, ${fixture.tenantSlugB}, ${fixture.tenantSlugB}, 'en-US', 'UTC')`;
      await sql`insert into tenant_status_period (id, tenant_id, status, valid_from) values
        (${fixture.statusPeriodA}, ${fixture.tenantA}, 'active', current_date),
        (${fixture.statusPeriodB}, ${fixture.tenantB}, 'active', current_date)`;
      await sql`insert into tenant_membership (id, tenant_id, user_id, role) values
        (${fixture.membershipA}, ${fixture.tenantA}, ${fixture.userA}, 'owner'),
        (${fixture.membershipB}, ${fixture.tenantB}, ${fixture.userB}, 'owner')`;
      await sql`insert into legal_entity (id, tenant_id, created_by) values
        (${fixture.entityA}, ${fixture.tenantA}, ${fixture.userA}),
        (${fixture.entityB}, ${fixture.tenantB}, ${fixture.userB})`;
      await sql`insert into legal_entity_configuration
        (id, tenant_id, legal_entity_id, legal_name, normalized_legal_name,
         country_code, registration_number, normalized_registration_number,
         valid_from, change_reason, recorded_by)
        values
        (${fixture.configurationA}, ${fixture.tenantA}, ${fixture.entityA},
         ${fixture.equivalentLegalName}, ${fixture.equivalentNormalizedLegalName}, 'US', ${fixture.equivalentRegistrationNumber},
         ${fixture.equivalentNormalizedRegistrationNumber}, current_date, 'isolation fixture', ${fixture.userA}),
        (${fixture.configurationB}, ${fixture.tenantB}, ${fixture.entityB},
         ${fixture.equivalentLegalName}, ${fixture.equivalentNormalizedLegalName}, 'US', ${fixture.equivalentRegistrationNumber},
         ${fixture.equivalentNormalizedRegistrationNumber}, current_date, 'isolation fixture', ${fixture.userB})`;
      await sql`insert into audit_event
        (id, tenant_id, actor_user_id, source, action, object_type, object_id)
        values
        (${fixture.auditEventA}, ${fixture.tenantA}, ${fixture.userA}, 'ui',
         'fixture.created', 'legal_entity', ${fixture.entityA}),
        (${fixture.auditEventB}, ${fixture.tenantB}, ${fixture.userB}, 'ui',
         'fixture.created', 'legal_entity', ${fixture.entityB})`;
    });
  });

  afterAll(async () => {
    await cleanupFixtures();
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

  test("restricted membership resolver returns only the authenticated identity's memberships", async () => {
    const memberships = await runtime.begin(async (sql) => {
      await sql`select set_config('app.current_user_id', ${fixture.userA}, true)`;
      return sql<
        {
          tenantId: string;
          role: string;
          membershipStatus: string;
          tenantStatus: string;
        }[]
      >`
        select
          tenant_id as "tenantId",
          role,
          membership_status as "membershipStatus",
          tenant_status as "tenantStatus"
        from resolve_current_user_tenant_memberships(current_date)
      `;
    });

    expect(memberships.map((membership) => ({ ...membership }))).toEqual([
      {
        tenantId: fixture.tenantA,
        role: "owner",
        membershipStatus: "active",
        tenantStatus: "active",
      },
    ]);
  });

  test("missing tenant context exposes no tenant-owned rows", async () => {
    const visibleIds = await runtime.begin(async (sql) => {
      await sql`select set_config('app.current_user_id', ${fixture.userA}, true)`;
      const ids: Array<string | null> = [];
      for (const row of tenantOwnedRows) {
        const [visible] = await sql<{ id: string }[]>`
          select id from ${sql(row.table)} where id = ${row.id}
        `;
        ids.push(visible?.id ?? null);
      }
      return ids;
    });

    expect(visibleIds).toEqual(tenantOwnedRows.map(() => null));
  });

  test("wrong tenant context exposes no tenant-owned rows", async () => {
    const visibleIds = await runtime.begin(async (sql) => {
      await sql`select set_config('app.current_user_id', ${fixture.userA}, true)`;
      await sql`select set_config('app.current_tenant_id', ${fixture.tenantB}, true)`;

      const ids: Array<string | null> = [];
      for (const row of tenantOwnedRows) {
        const [visible] = await sql<{ id: string }[]>`
          select id from ${sql(row.table)} where id = ${row.id}
        `;
        ids.push(visible?.id ?? null);
      }
      return ids;
    });

    expect(visibleIds).toEqual(tenantOwnedRows.map(() => null));
  });

  test("coverage includes every forced-RLS tenant table", async () => {
    const tables = await admin<{ table: string; forced: boolean }[]>`
      select relname as table, relforcerowsecurity as forced
      from pg_class
      join pg_namespace on pg_namespace.oid = pg_class.relnamespace
      where pg_namespace.nspname = 'public' and relrowsecurity
      order by relname
    `;
    const coveredTables = tenantOwnedRows
      .map(({ table }) => ({ table, forced: true }))
      .sort((left, right) => left.table.localeCompare(right.table));

    expect(tables.map(({ table, forced }) => ({ table, forced }))).toEqual(
      coveredTables,
    );
  });

  test("runtime role has no superuser or RLS bypass capability", async () => {
    const [role] = await runtime<
      { role: string; superuser: boolean; bypassRls: boolean }[]
    >`
      select rolname as role, rolsuper as superuser,
        rolbypassrls as "bypassRls"
      from pg_roles
      where rolname = current_user
    `;

    expect(role).toEqual({
      role: "hr_app",
      superuser: false,
      bypassRls: false,
    });
  });

  test("runtime role cannot disable row-level security", async () => {
    const attempt = runtime.begin(async (sql) => {
      await sql`set local row_security = off`;
      await sql`select id from tenant`;
    });

    await expect(attempt).rejects.toMatchObject({ code: "42501" });
  });

  test.each(
    tenantOwnedRows.map(({ table, id }) => [table, id] as const),
  )("runtime role cannot delete protected %s records", async (table, id) => {
    const attempt = runtime.begin(async (sql) => {
      await sql`select set_config('app.current_user_id', ${fixture.userA}, true)`;
      await sql`select set_config('app.current_tenant_id', ${fixture.tenantA}, true)`;
      await sql`delete from ${sql(table)} where id = ${id}`;
    });

    await expect(attempt).rejects.toMatchObject({ code: "42501" });
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

  test("equivalent configuration values remain valid in separate tenants", async () => {
    const configurations = [];
    for (const [userId, tenantId, configurationId] of [
      [fixture.userA, fixture.tenantA, fixture.configurationA],
      [fixture.userB, fixture.tenantB, fixture.configurationB],
    ] as const) {
      const [configuration] = await runtime.begin(async (sql) => {
        await sql`select set_config('app.current_user_id', ${userId}, true)`;
        await sql`select set_config('app.current_tenant_id', ${tenantId}, true)`;
        return sql<{ legalName: string; registrationNumber: string | null }[]>`
          select legal_name as "legalName",
            registration_number as "registrationNumber"
          from legal_entity_configuration
          where id = ${configurationId}
        `;
      });
      configurations.push(configuration);
    }

    expect(configurations).toEqual([
      {
        legalName: fixture.equivalentLegalName,
        registrationNumber: fixture.equivalentRegistrationNumber,
      },
      {
        legalName: fixture.equivalentLegalName,
        registrationNumber: fixture.equivalentRegistrationNumber,
      },
    ]);
  });
});
