import { hashPassword } from "better-auth/crypto";
import { eq, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { z } from "zod";
import {
  accounts,
  auditEvents,
  systemState,
  tenantMemberships,
  tenantStatusPeriods,
  tenants,
  users,
} from "../../db/schema";
import {
  localeSchema,
  tenantSlugSchema,
  timezoneSchema,
} from "../../lib/validation/organization";

const inputSchema = z.object({
  ownerName: z.string().trim().min(1).max(100),
  ownerEmail: z.email(),
  ownerPassword: z.string().min(12).max(128),
  tenantName: z.string().trim().min(1).max(120),
  tenantSlug: tenantSlugSchema,
  locale: localeSchema,
  timezone: timezoneSchema,
  dataRegion: z.string().trim().min(1).max(40).optional(),
  reason: z.string().trim().min(1).max(300),
});

const parsed = inputSchema.safeParse({
  ownerName: process.env.PROVISION_OWNER_NAME,
  ownerEmail: process.env.PROVISION_OWNER_EMAIL,
  ownerPassword: process.env.PROVISION_OWNER_PASSWORD,
  tenantName: process.env.PROVISION_TENANT_NAME,
  tenantSlug: process.env.PROVISION_TENANT_SLUG,
  locale: process.env.PROVISION_LOCALE,
  timezone: process.env.PROVISION_TIMEZONE,
  dataRegion: process.env.PROVISION_DATA_REGION || undefined,
  reason: process.env.PROVISION_REASON,
});
if (!parsed.success) {
  console.error(z.prettifyError(parsed.error));
  process.exit(1);
}

const databaseUrl = process.env.MIGRATION_DATABASE_URL;
if (!databaseUrl) throw new Error("MIGRATION_DATABASE_URL is required.");

const client = postgres(databaseUrl, { max: 1, prepare: false });
const systemDb = drizzle(client);
const userId = crypto.randomUUID();
const tenantId = crypto.randomUUID();
const today = new Date().toISOString().slice(0, 10);

try {
  const passwordHash = await hashPassword(parsed.data.ownerPassword);
  await systemDb.transaction(async (tx) => {
    const [state] = await tx
      .select({ completed: systemState.bootstrapCompleted })
      .from(systemState)
      .where(eq(systemState.id, 1))
      .limit(1);
    if (!state?.completed) {
      throw new Error(
        "Complete one-time system bootstrap before adding tenants.",
      );
    }

    await tx.execute(
      sql`select set_config('app.current_user_id', ${userId}, true)`,
    );
    await tx.execute(
      sql`select set_config('app.current_tenant_id', ${tenantId}, true)`,
    );
    await tx.insert(users).values({
      id: userId,
      name: parsed.data.ownerName,
      email: parsed.data.ownerEmail.toLowerCase(),
      emailVerified: true,
    });
    await tx.insert(accounts).values({
      accountId: userId,
      providerId: "credential",
      userId,
      password: passwordHash,
    });
    await tx.insert(tenants).values({
      id: tenantId,
      name: parsed.data.tenantName,
      slug: parsed.data.tenantSlug,
      normalizedSlug: parsed.data.tenantSlug,
      defaultLocale: parsed.data.locale,
      defaultTimezone: parsed.data.timezone,
      dataRegion: parsed.data.dataRegion ?? null,
    });
    await tx.insert(tenantStatusPeriods).values({
      tenantId,
      status: "active",
      validFrom: today,
      recordedBy: userId,
    });
    await tx.insert(tenantMemberships).values({
      tenantId,
      userId,
      role: "owner",
      status: "active",
    });
    await tx.insert(auditEvents).values({
      tenantId,
      actorUserId: userId,
      source: "system",
      action: "tenant.provisioned",
      objectType: "tenant",
      objectId: tenantId,
      effectiveDate: today,
      reason: parsed.data.reason,
      after: {
        name: parsed.data.tenantName,
        slug: parsed.data.tenantSlug,
        defaultLocale: parsed.data.locale,
        defaultTimezone: parsed.data.timezone,
        dataRegion: parsed.data.dataRegion ?? null,
        status: "active",
      },
    });
  });
  console.info(`Provisioned tenant ${tenantId} for ${parsed.data.ownerEmail}.`);
} finally {
  await client.end();
}
