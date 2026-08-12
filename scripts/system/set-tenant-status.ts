import { and, eq, gt, isNull, lte, or, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { z } from "zod";
import { auditEvents, sessions, tenantStatusPeriods } from "../../db/schema";

const inputSchema = z.object({
  tenantId: z.uuid(),
  targetStatus: z.enum(["active", "inactive"]),
  effectiveDate: z.iso.date(),
  reason: z.string().trim().min(1).max(300),
  actorUserId: z.uuid().optional(),
});
const parsed = inputSchema.safeParse({
  tenantId: process.env.TENANT_STATUS_TENANT_ID,
  targetStatus: process.env.TENANT_STATUS_TARGET,
  effectiveDate: process.env.TENANT_STATUS_EFFECTIVE_DATE,
  reason: process.env.TENANT_STATUS_REASON,
  actorUserId: process.env.TENANT_STATUS_ACTOR_USER_ID || undefined,
});
if (!parsed.success) {
  console.error(z.prettifyError(parsed.error));
  process.exit(1);
}

const databaseUrl = process.env.MIGRATION_DATABASE_URL;
if (!databaseUrl) throw new Error("MIGRATION_DATABASE_URL is required.");
const client = postgres(databaseUrl, { max: 1, prepare: false });
const systemDb = drizzle(client);

try {
  await systemDb.transaction(async (tx) => {
    await tx.execute(
      sql`select set_config('app.current_tenant_id', ${parsed.data.tenantId}, true)`,
    );
    if (parsed.data.actorUserId) {
      await tx.execute(
        sql`select set_config('app.current_user_id', ${parsed.data.actorUserId}, true)`,
      );
    }
    const locked = await tx.execute(
      sql`select id from tenant where id = ${parsed.data.tenantId} for update`,
    );
    if (locked.length === 0) throw new Error("Tenant not found.");

    const [prior] = await tx
      .select()
      .from(tenantStatusPeriods)
      .where(
        and(
          eq(tenantStatusPeriods.tenantId, parsed.data.tenantId),
          isNull(tenantStatusPeriods.supersededAt),
          lte(tenantStatusPeriods.validFrom, parsed.data.effectiveDate),
          or(
            isNull(tenantStatusPeriods.validTo),
            gt(tenantStatusPeriods.validTo, parsed.data.effectiveDate),
          ),
        ),
      )
      .limit(1);
    if (!prior) throw new Error("No status period covers that effective date.");
    if (prior.status === parsed.data.targetStatus) {
      throw new Error(
        `Tenant is already ${parsed.data.targetStatus} on that date.`,
      );
    }

    const recordedAt = new Date();
    await tx
      .update(tenantStatusPeriods)
      .set({
        supersededAt: recordedAt,
        supersededBy: parsed.data.actorUserId ?? null,
      })
      .where(
        and(
          eq(tenantStatusPeriods.id, prior.id),
          eq(tenantStatusPeriods.tenantId, parsed.data.tenantId),
          isNull(tenantStatusPeriods.supersededAt),
        ),
      );
    if (prior.validFrom < parsed.data.effectiveDate) {
      await tx.insert(tenantStatusPeriods).values({
        ...prior,
        id: crypto.randomUUID(),
        validTo: parsed.data.effectiveDate,
        recordedAt,
        recordedBy: parsed.data.actorUserId ?? null,
        supersedesId: prior.id,
        supersededAt: null,
        supersededBy: null,
      });
    }
    const [after] = await tx
      .insert(tenantStatusPeriods)
      .values({
        ...prior,
        id: crypto.randomUUID(),
        status: parsed.data.targetStatus,
        validFrom: parsed.data.effectiveDate,
        recordedAt,
        recordedBy: parsed.data.actorUserId ?? null,
        supersedesId: prior.id,
        supersededAt: null,
        supersededBy: null,
      })
      .returning({
        status: tenantStatusPeriods.status,
        validFrom: tenantStatusPeriods.validFrom,
        validTo: tenantStatusPeriods.validTo,
      });
    await tx.insert(auditEvents).values({
      tenantId: parsed.data.tenantId,
      actorUserId: parsed.data.actorUserId ?? null,
      source: "system",
      action: `tenant.${parsed.data.targetStatus === "active" ? "reactivated" : "deactivated"}`,
      objectType: "tenant",
      objectId: parsed.data.tenantId,
      effectiveDate: parsed.data.effectiveDate,
      reason: parsed.data.reason,
      before: {
        status: prior.status,
        validFrom: prior.validFrom,
        validTo: prior.validTo,
      },
      after,
    });

    if (parsed.data.targetStatus === "inactive") {
      await tx
        .update(sessions)
        .set({ currentTenantId: null })
        .where(eq(sessions.currentTenantId, parsed.data.tenantId));
    }
  });
  console.info(
    `Tenant ${parsed.data.tenantId} is ${parsed.data.targetStatus} from ${parsed.data.effectiveDate}.`,
  );
} finally {
  await client.end();
}
