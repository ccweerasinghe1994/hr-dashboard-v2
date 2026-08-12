import { afterAll, beforeAll, describe, expect, test } from "bun:test";
import { and, eq, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "@/db/schema";
import {
  createLegalEntityForTenant,
  type LegalEntityPersistenceTransaction,
  listLegalEntitiesForTenant,
} from "@/lib/organization/legal-entity-persistence";
import { createLegalIdentifierProtector } from "@/lib/security/legal-identifiers-core";
import { testDatabaseEnvironment } from "../support/integration-environment";

const { adminUrl, runtimeUrl } = testDatabaseEnvironment;

const uniqueSuffix = crypto.randomUUID().slice(0, 8);
const fixture = {
  user: crypto.randomUUID(),
  tenant: crypto.randomUUID(),
  userName: `Legal Identifier Owner ${uniqueSuffix}`,
  userEmail: `legal-identifier-owner-${uniqueSuffix}@example.test`,
  tenantName: `Legal Identifier Tenant ${uniqueSuffix}`,
  tenantSlug: `legal-identifier-tenant-${uniqueSuffix}`,
  legalName: `Identifier Holdings ${uniqueSuffix} Ltd`,
  displayName: `Identifier Holdings ${uniqueSuffix}`,
  registrationNumber: `REG-${uniqueSuffix}`,
};
const plaintextTaxIdentifier = "TIN-SECRET-987654";
const protector = createLegalIdentifierProtector(Buffer.alloc(32, 0x2a));
const effectiveDate = new Date().toISOString().slice(0, 10);

describe("persisted legal identifier boundaries", () => {
  const admin = postgres(adminUrl, { max: 1, prepare: false });
  const runtimeClient = postgres(runtimeUrl, { max: 1, prepare: false });
  const runtime = drizzle({ client: runtimeClient, schema });
  let legalEntityId = "";
  let persistedIdentifierSecrets = { ciphertext: "", hash: "" };

  async function withFixtureTenantContext<T>(
    operation: (tx: LegalEntityPersistenceTransaction) => Promise<T>,
  ) {
    return runtime.transaction(async (tx) => {
      await tx.execute(
        sql`select set_config('app.current_user_id', ${fixture.user}, true)`,
      );
      await tx.execute(
        sql`select set_config('app.current_tenant_id', ${fixture.tenant}, true)`,
      );
      return operation(tx);
    });
  }

  async function cleanFixture() {
    await admin.begin(async (sql) => {
      await sql`delete from audit_event where tenant_id = ${fixture.tenant}`;
      await sql`delete from legal_entity_configuration where tenant_id = ${fixture.tenant}`;
      await sql`delete from legal_entity where tenant_id = ${fixture.tenant}`;
      await sql`delete from tenant_membership where tenant_id = ${fixture.tenant}`;
      await sql`delete from tenant_status_period where tenant_id = ${fixture.tenant}`;
      await sql`delete from tenant where id = ${fixture.tenant}`;
      await sql`delete from "user" where id = ${fixture.user}`;
    });
  }

  beforeAll(async () => {
    await cleanFixture();
    await admin.begin(async (sql) => {
      await sql`insert into "user" (id, name, email, email_verified)
        values (${fixture.user}, ${fixture.userName}, ${fixture.userEmail}, true)`;
      await sql`insert into tenant
        (id, name, slug, normalized_slug, default_locale, default_timezone)
        values (${fixture.tenant}, ${fixture.tenantName}, ${fixture.tenantSlug}, ${fixture.tenantSlug}, 'en-US', 'UTC')`;
      await sql`insert into tenant_status_period (tenant_id, status, valid_from)
        values (${fixture.tenant}, 'active', current_date)`;
      await sql`insert into tenant_membership (tenant_id, user_id, role)
        values (${fixture.tenant}, ${fixture.user}, 'owner')`;
    });

    await withFixtureTenantContext(async (tx) => {
      const entity = await createLegalEntityForTenant(
        tx,
        { tenantId: fixture.tenant, userId: fixture.user },
        {
          legalName: fixture.legalName,
          displayName: fixture.displayName,
          countryCode: "GB",
          registrationNumber: fixture.registrationNumber,
          taxIdentifier: plaintextTaxIdentifier,
          currencyCode: "GBP",
          effectiveDate,
          reason: "Initial configuration",
        },
        protector.protectTaxIdentifier,
      );
      legalEntityId = entity.id;
    });
    const [persisted] = await withFixtureTenantContext((tx) =>
      tx
        .select({
          ciphertext: schema.legalEntityConfigurations.taxIdentifierCiphertext,
          hash: schema.legalEntityConfigurations.taxIdentifierHash,
        })
        .from(schema.legalEntityConfigurations)
        .where(
          and(
            eq(schema.legalEntityConfigurations.tenantId, fixture.tenant),
            eq(schema.legalEntityConfigurations.legalEntityId, legalEntityId),
          ),
        ),
    );
    if (!persisted.ciphertext || !persisted.hash) {
      throw new Error("Expected persisted legal identifier protection.");
    }
    persistedIdentifierSecrets = {
      ciphertext: persisted.ciphertext,
      hash: persisted.hash,
    };
  });

  afterAll(async () => {
    try {
      await cleanFixture();
    } finally {
      await Promise.all([admin.end(), runtimeClient.end()]);
    }
  });

  test("returns a masked DTO from the persisted production seam", async () => {
    const summaries = await withFixtureTenantContext(async (tx) => {
      return listLegalEntitiesForTenant(tx, fixture.tenant, effectiveDate);
    });

    expect(summaries).toEqual([
      {
        id: legalEntityId,
        legalName: fixture.legalName,
        displayName: fixture.displayName,
        countryCode: "GB",
        registrationNumber: fixture.registrationNumber,
        maskedTaxIdentifier: "\u2022\u2022\u2022\u20227654",
        currencyCode: "GBP",
        status: "active",
        validFrom: expect.any(String),
        validTo: null,
      },
    ]);
  });

  test("persists audit evidence without legal identifier secret material", async () => {
    const [event] = await withFixtureTenantContext((tx) =>
      tx
        .select({ after: schema.auditEvents.after })
        .from(schema.auditEvents)
        .where(
          and(
            eq(schema.auditEvents.tenantId, fixture.tenant),
            eq(schema.auditEvents.objectId, legalEntityId),
          ),
        ),
    );
    const serializedAudit = JSON.stringify(event.after);

    expect([
      serializedAudit.includes(plaintextTaxIdentifier),
      serializedAudit.includes(persistedIdentifierSecrets.ciphertext),
      serializedAudit.includes(persistedIdentifierSecrets.hash),
    ]).toEqual([false, false, false]);
  });
});
