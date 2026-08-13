import "server-only";

import { eq, sql } from "drizzle-orm";
import { AuthorizationError, TenantUnavailableError } from "@/data/errors";
import type { Database } from "@/db/client";
import { sessions } from "@/db/schema";
import {
  type MembershipRole,
  selectCurrentTenant,
  type TenantSelectionMembership,
} from "@/lib/security/tenant-selection";

export type { MembershipRole } from "@/lib/security/tenant-selection";

export type TenantContext = Readonly<{
  tenantId: string;
  userId: string;
  sessionId: string;
  role: MembershipRole;
}>;

export type TenantTransaction = Parameters<
  Parameters<Database["transaction"]>[0]
>[0];

export type AuthenticatedSession = Readonly<{
  user: Readonly<{ id: string }>;
  session: Readonly<{
    id: string;
    currentTenantId?: string | null;
  }>;
}>;

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

export async function withTenantContextForSession<T>(
  database: Database,
  requestSession: AuthenticatedSession,
  asOfDate: string,
  operation: (tx: TenantTransaction, context: TenantContext) => Promise<T>,
  requiredRole?: MembershipRole,
) {
  return database.transaction(async (tx) => {
    await tx.execute(
      sql`select set_config('app.current_user_id', ${requestSession.user.id}, true)`,
    );

    const memberships = await resolveTenantMemberships(tx, asOfDate);
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

export async function switchCurrentTenantForSession(
  database: Database,
  requestSession: AuthenticatedSession,
  asOfDate: string,
  tenantId: string,
) {
  return database.transaction(async (tx) => {
    await tx.execute(
      sql`select set_config('app.current_user_id', ${requestSession.user.id}, true)`,
    );

    const memberships = await resolveTenantMemberships(tx, asOfDate);
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
