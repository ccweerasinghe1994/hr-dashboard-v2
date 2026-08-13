export type MembershipRole = "owner" | "member";

export type TenantSelectionMembership = Readonly<{
  tenantId: string;
  role: MembershipRole;
  membershipStatus: "active" | "inactive";
  tenantStatus: "active" | "inactive";
}>;

export type TenantSelectionInput = Readonly<{
  memberships: readonly TenantSelectionMembership[];
  requestedTenantId?: string | null;
  requiredRole?: MembershipRole;
}>;

export type TenantSelectionFailureReason =
  | "no-active-membership"
  | "ambiguous-memberships"
  | "insufficient-role";

export type TenantSelectionResult =
  | Readonly<{ ok: true; membership: TenantSelectionMembership }>
  | Readonly<{ ok: false; reason: TenantSelectionFailureReason }>;

export function selectCurrentTenant({
  memberships,
  requestedTenantId,
  requiredRole,
}: TenantSelectionInput): TenantSelectionResult {
  const activeMemberships = memberships.filter(
    (membership) =>
      membership.membershipStatus === "active" &&
      membership.tenantStatus === "active",
  );
  const requestedMembership = activeMemberships.find(
    (membership) => membership.tenantId === requestedTenantId,
  );
  const selectedMembership =
    requestedMembership ??
    (activeMemberships.length === 1 ? activeMemberships[0] : undefined);

  if (
    selectedMembership &&
    requiredRole &&
    selectedMembership.role !== requiredRole
  ) {
    return { ok: false, reason: "insufficient-role" };
  }

  if (selectedMembership) {
    return { ok: true, membership: selectedMembership };
  }

  return {
    ok: false,
    reason:
      activeMemberships.length === 0
        ? "no-active-membership"
        : "ambiguous-memberships",
  };
}
