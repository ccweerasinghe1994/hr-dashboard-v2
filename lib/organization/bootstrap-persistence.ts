import { createHash, timingSafeEqual } from "node:crypto";
import { hashPassword } from "better-auth/crypto";
import { eq, sql } from "drizzle-orm";
import { ConflictError } from "@/data/errors";
import type { Database } from "@/db/client";
import {
  accounts,
  auditEvents,
  systemState,
  tenantMemberships,
  tenantStatusPeriods,
  tenants,
  users,
} from "@/db/schema";

export type BootstrapInput = {
  bootstrapSecret: string;
  ownerName: string;
  email: string;
  password: string;
  tenantName: string;
  tenantSlug: string;
  locale: string;
  timezone: string;
};

function secretsMatch(presented: string, expected: string) {
  const presentedDigest = createHash("sha256").update(presented).digest();
  const expectedDigest = createHash("sha256").update(expected).digest();
  return timingSafeEqual(presentedDigest, expectedDigest);
}

function todayUtc() {
  return new Date().toISOString().slice(0, 10);
}

export async function provisionFirstTenantInDatabase(
  database: Database,
  input: BootstrapInput,
  expectedBootstrapSecret: string,
) {
  if (!secretsMatch(input.bootstrapSecret, expectedBootstrapSecret)) {
    throw new ConflictError("The bootstrap secret is invalid.");
  }

  const userId = crypto.randomUUID();
  const tenantId = crypto.randomUUID();
  const passwordHash = await hashPassword(input.password);

  await database.transaction(async (tx) => {
    const stateResult = await tx.execute(
      sql`select bootstrap_completed from system_state where id = 1 for update`,
    );
    const state = stateResult[0] as
      | { bootstrap_completed: boolean }
      | undefined;
    if (!state || state.bootstrap_completed) {
      throw new ConflictError("TeamHub setup has already been completed.");
    }

    await tx.execute(
      sql`select set_config('app.current_user_id', ${userId}, true)`,
    );
    await tx.execute(
      sql`select set_config('app.current_tenant_id', ${tenantId}, true)`,
    );

    await tx.insert(users).values({
      id: userId,
      name: input.ownerName,
      email: input.email,
      emailVerified: true,
    });
    await tx.insert(accounts).values({
      id: crypto.randomUUID(),
      accountId: userId,
      providerId: "credential",
      userId,
      password: passwordHash,
    });
    await tx.insert(tenants).values({
      id: tenantId,
      name: input.tenantName,
      slug: input.tenantSlug,
      normalizedSlug: input.tenantSlug.toLowerCase(),
      defaultLocale: input.locale,
      defaultTimezone: input.timezone,
      dataRegion: null,
    });
    await tx.insert(tenantStatusPeriods).values({
      tenantId,
      status: "active",
      validFrom: todayUtc(),
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
      source: "bootstrap",
      action: "tenant.provisioned",
      objectType: "tenant",
      objectId: tenantId,
      effectiveDate: todayUtc(),
      reason: "Initial system bootstrap",
      after: {
        name: input.tenantName,
        slug: input.tenantSlug,
        defaultLocale: input.locale,
        defaultTimezone: input.timezone,
        status: "active",
      },
    });
    await tx
      .update(systemState)
      .set({ bootstrapCompleted: true })
      .where(eq(systemState.id, 1));
  });

  return { userId, tenantId };
}
