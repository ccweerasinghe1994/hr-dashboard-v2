import "server-only";

import { eq, sql } from "drizzle-orm";
import { headers } from "next/headers";
import { cache } from "react";
import { db } from "@/db/client";
import { sessions } from "@/db/schema";
import { auth } from "@/lib/auth";
import {
  type MembershipRole,
  selectCurrentTenant,
  type TenantSelectionMembership,
} from "@/lib/security/tenant-selection";
import {
  AuthenticationRequiredError,
  AuthorizationError,
  TenantUnavailableError,
} from "./errors";

export type { MembershipRole } from "@/lib/security/tenant-selection";

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

function resolveTenantMemberships(tx: TenantTransaction, asOfDate: string) {
  return tx.execute<TenantSelectionMembership>(
    sql`
      select
        tenant_id as "tenantId",
        role,
        membership_status as "membershipStatus",
        tenant_status as "tenantStatus"
      from resolve_current_user_tenant_memberships(${asOfDate})
    `,
  );
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

    const today = todayUtc();
    const memberships = await resolveTenantMemberships(tx, today);

    const requestedTenantId = requestSession.session.currentTenantId;
    const selection = selectCurrentTenant({
      memberships,
      requestedTenantId,
      requiredRole,
    });
    if (!selection.ok && selection.reason === "insufficient-role") {
      throw new AuthorizationError();
    }
    if (!selection.ok) throw new TenantUnavailableError();
    const { membership } = selection;

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
    const memberships = await resolveTenantMemberships(tx, todayUtc());
    const membership = memberships.find(
      (candidate) => candidate.tenantId === tenantId,
    );
    if (!membership || membership.membershipStatus !== "active") {
      throw new AuthorizationError();
    }
    if (membership.tenantStatus !== "active") {
      throw new TenantUnavailableError("This organization is inactive.");
    }

    await tx.execute(
      sql`select set_config('app.current_tenant_id', ${tenantId}, true)`,
    );
    await tx
      .update(sessions)
      .set({ currentTenantId: tenantId })
      .where(eq(sessions.id, requestSession.session.id));
  });
}
