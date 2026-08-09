import "server-only";

import { and, eq, gt, isNull, lte, or, sql } from "drizzle-orm";
import { headers } from "next/headers";
import { cache } from "react";
import { db } from "@/db/client";
import { sessions, tenantMemberships, tenantStatusPeriods } from "@/db/schema";
import { auth } from "@/lib/auth";
import {
  AuthenticationRequiredError,
  AuthorizationError,
  TenantUnavailableError,
} from "./errors";

export type MembershipRole = "owner" | "member";

export type TenantContext = Readonly<{
  tenantId: string;
  userId: string;
  sessionId: string;
  role: MembershipRole;
}>;

export type TenantTransaction = Parameters<
  Parameters<typeof db.transaction>[0]
>[0];

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

  return db.transaction(async (tx) => {
    await tx.execute(
      sql`select set_config('app.current_user_id', ${requestSession.user.id}, true)`,
    );

    const memberships = await tx
      .select({
        tenantId: tenantMemberships.tenantId,
        role: tenantMemberships.role,
      })
      .from(tenantMemberships)
      .where(
        and(
          eq(tenantMemberships.userId, requestSession.user.id),
          eq(tenantMemberships.status, "active"),
        ),
      );

    const today = todayUtc();
    const activeMemberships = [] as typeof memberships;
    for (const candidate of memberships) {
      await tx.execute(
        sql`select set_config('app.current_tenant_id', ${candidate.tenantId}, true)`,
      );
      const [period] = await tx
        .select({ status: tenantStatusPeriods.status })
        .from(tenantStatusPeriods)
        .where(
          and(
            eq(tenantStatusPeriods.tenantId, candidate.tenantId),
            isNull(tenantStatusPeriods.supersededAt),
            lte(tenantStatusPeriods.validFrom, today),
            or(
              isNull(tenantStatusPeriods.validTo),
              gt(tenantStatusPeriods.validTo, today),
            ),
          ),
        )
        .limit(1);
      if (period?.status === "active") activeMemberships.push(candidate);
    }

    const requestedTenantId = requestSession.session.currentTenantId;
    const requestedMembership = requestedTenantId
      ? activeMemberships.find((item) => item.tenantId === requestedTenantId)
      : undefined;
    const membership =
      requestedMembership ??
      (activeMemberships.length === 1 ? activeMemberships[0] : undefined);

    if (!membership) throw new TenantUnavailableError();
    if (requiredRole && membership.role !== requiredRole) {
      throw new AuthorizationError();
    }

    await tx.execute(
      sql`select set_config('app.current_tenant_id', ${membership.tenantId}, true)`,
    );

    if (requestedTenantId !== membership.tenantId) {
      await tx
        .update(sessions)
        .set({ currentTenantId: membership.tenantId })
        .where(eq(sessions.id, requestSession.session.id));
    }

    return operation(tx, {
      tenantId: membership.tenantId,
      userId: requestSession.user.id,
      sessionId: requestSession.session.id,
      role: membership.role,
    });
  });
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
