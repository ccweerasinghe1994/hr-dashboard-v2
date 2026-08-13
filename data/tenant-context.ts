import "server-only";

import { headers } from "next/headers";
import { cache } from "react";
import { db } from "@/db/client";
import { auth } from "@/lib/auth";
import {
  type MembershipRole,
  switchCurrentTenantForSession,
  type TenantContext,
  type TenantTransaction,
  withTenantContextForSession,
} from "@/lib/tenancy/tenant-context-persistence";
import { AuthenticationRequiredError } from "./errors";

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
  return switchCurrentTenantForSession(
    db,
    requestSession,
    todayUtc(),
    tenantId,
  );
}
