import { hashPassword } from "better-auth/crypto";
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import {
  accounts,
  auditEvents,
  legalEntities,
  legalEntityConfigurations,
  systemState,
  tenantMemberships,
  tenantStatusPeriods,
  tenants,
  users,
} from "../../db/schema";

const databaseUrl =
  process.env.MIGRATION_DATABASE_URL ?? process.env.DATABASE_URL;
if (!databaseUrl) throw new Error("A migration database URL is required.");

const password = process.env.SEED_OWNER_PASSWORD ?? "ChangeMe1234!";
if (process.env.NODE_ENV === "production" && !process.env.SEED_OWNER_PASSWORD) {
  throw new Error("SEED_OWNER_PASSWORD is required in production.");
}

const client = postgres(databaseUrl, { max: 1, prepare: false });
const seedDb = drizzle(client);
const today = new Date().toISOString().slice(0, 10);
const passwordHash = await hashPassword(password);

const fixtures = [
  {
    userId: "10000000-0000-4000-8000-000000000001",
    tenantId: "20000000-0000-4000-8000-000000000001",
    entityId: "30000000-0000-4000-8000-000000000001",
    email: "owner@northwind.test",
    tenantName: "Northwind People",
    slug: "northwind-people",
    legalName: "Northwind People (Pvt) Ltd",
    countryCode: "LK",
    currencyCode: "LKR",
  },
  {
    userId: "10000000-0000-4000-8000-000000000002",
    tenantId: "20000000-0000-4000-8000-000000000002",
    entityId: "30000000-0000-4000-8000-000000000002",
    email: "owner@contoso.test",
    tenantName: "Contoso HR",
    slug: "contoso-hr",
    legalName: "Contoso HR Limited",
    countryCode: "GB",
    currencyCode: "GBP",
  },
] as const;

try {
  await seedDb.transaction(async (tx) => {
    for (const fixture of fixtures) {
      const [existingTenant] = await tx
        .select({ id: tenants.id })
        .from(tenants)
        .where(eq(tenants.id, fixture.tenantId))
        .limit(1);
      if (existingTenant) continue;

      await tx
        .insert(users)
        .values({
          id: fixture.userId,
          name: `${fixture.tenantName} Owner`,
          email: fixture.email,
          emailVerified: true,
        })
        .onConflictDoNothing();
      await tx
        .insert(accounts)
        .values({
          id: crypto.randomUUID(),
          accountId: fixture.userId,
          providerId: "credential",
          userId: fixture.userId,
          password: passwordHash,
        })
        .onConflictDoNothing();
      await tx
        .insert(tenants)
        .values({
          id: fixture.tenantId,
          name: fixture.tenantName,
          slug: fixture.slug,
          normalizedSlug: fixture.slug,
          defaultLocale: "en-US",
          defaultTimezone: "UTC",
        })
        .onConflictDoNothing();
      await tx
        .insert(tenantStatusPeriods)
        .values({
          tenantId: fixture.tenantId,
          status: "active",
          validFrom: today,
          recordedBy: fixture.userId,
        })
        .onConflictDoNothing();
      await tx
        .insert(tenantMemberships)
        .values({
          tenantId: fixture.tenantId,
          userId: fixture.userId,
          role: "owner",
        })
        .onConflictDoNothing();
      await tx
        .insert(legalEntities)
        .values({
          id: fixture.entityId,
          tenantId: fixture.tenantId,
          createdBy: fixture.userId,
        })
        .onConflictDoNothing();
      await tx
        .insert(legalEntityConfigurations)
        .values({
          tenantId: fixture.tenantId,
          legalEntityId: fixture.entityId,
          legalName: fixture.legalName,
          normalizedLegalName: fixture.legalName.toLowerCase(),
          countryCode: fixture.countryCode,
          currencyCode: fixture.currencyCode,
          validFrom: today,
          changeReason: "Development seed",
          recordedBy: fixture.userId,
        })
        .onConflictDoNothing();
      await tx
        .insert(auditEvents)
        .values({
          tenantId: fixture.tenantId,
          actorUserId: fixture.userId,
          source: "seed",
          action: "tenant.seeded",
          objectType: "tenant",
          objectId: fixture.tenantId,
          effectiveDate: today,
          reason: "Development seed",
          after: { name: fixture.tenantName, status: "active" },
        })
        .onConflictDoNothing();
    }
    await tx
      .update(systemState)
      .set({ bootstrapCompleted: true })
      .where(eq(systemState.id, 1));
  });
  console.info("Seeded two isolated development organizations.");
} finally {
  await client.end();
}
