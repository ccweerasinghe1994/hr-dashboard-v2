import "server-only";

import { and, eq, gt, isNull, lte, or, sql } from "drizzle-orm";
import { headers } from "next/headers";
import { cache } from "react";
import { db } from "@/db/client";
import { sessions, tenantMemberships, tenantStatusPeriods } from "@/db/schema";
import { auth } from "@/lib/auth";
import {
  type MembershipRole,
  type TenantContext,
  type TenantTransaction,
  withTenantContextForSession,
} from "@/lib/tenancy/tenant-context-persistence";
import {
  AuthenticationRequiredError,
  AuthorizationError,
  TenantUnavailableError,
} from "./errors";

export type { MembershipRole, TenantContext, TenantTransaction };

const getRequestSession = cache(async () =>
  auth.api.getSession({ headers: await headers() }),
);

function todayUtc() {
  return new Date().toISOString().slice(0, 10);
}

export async function getAuthenticatedSession() {
  const session = await getRequestSession();
  if (!session) throw new AuthenticationRequiredError();
  return session;
}

export async function withTenantContext<T>(
  operation: (tx: TenantTransaction, context: TenantContext) => Promise<T>,
  requiredRole?: MembershipRole,
) {
  const requestSession = await getAuthenticatedSession();
  return withTenantContextForSession(
    db,
    requestSession,
    todayUtc(),
    operation,
    requiredRole,
  );
}

export async function switchCurrentTenant(tenantId: string) {
  const requestSession = await getAuthenticatedSession();

  return db.transaction(async (tx) => {
    await tx.execute(
      sql`select set_config('app.current_user_id', ${requestSession.user.id}, true)`,
    );
    const [membership] = await tx
      .select({ tenantId: tenantMemberships.tenantId })
      .from(tenantMemberships)
      .where(
        and(
          eq(tenantMemberships.tenantId, tenantId),
          eq(tenantMemberships.userId, requestSession.user.id),
          eq(tenantMemberships.status, "active"),
        ),
      )
      .limit(1);
    if (!membership) throw new AuthorizationError();

    await tx.execute(
      sql`select set_config('app.current_tenant_id', ${tenantId}, true)`,
    );
    const today = todayUtc();
    const [period] = await tx
      .select({ status: tenantStatusPeriods.status })
      .from(tenantStatusPeriods)
      .where(
        and(
          eq(tenantStatusPeriods.tenantId, tenantId),
          isNull(tenantStatusPeriods.supersededAt),
          lte(tenantStatusPeriods.validFrom, today),
          or(
            isNull(tenantStatusPeriods.validTo),
            gt(tenantStatusPeriods.validTo, today),
          ),
        ),
      )
      .limit(1);
    if (period?.status !== "active") {
      throw new TenantUnavailableError("This organization is inactive.");
    }

    await tx
      .update(sessions)
      .set({ currentTenantId: tenantId })
      .where(eq(sessions.id, requestSession.session.id));
  });
}
