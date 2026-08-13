import { describe, expect, test } from "bun:test";
import { selectCurrentTenant } from "@/lib/security/tenant-selection";

const memberships = [
  {
    tenantId: "tenant-a",
    role: "owner",
    membershipStatus: "active",
    tenantStatus: "active",
  },
  {
    tenantId: "tenant-b",
    role: "member",
    membershipStatus: "active",
    tenantStatus: "active",
  },
] as const;

describe("current tenant selection", () => {
  test("selects a requested active membership when authorized", () => {
    expect(
      selectCurrentTenant({
        memberships,
        requestedTenantId: "tenant-a",
        requiredRole: "owner",
      }),
    ).toEqual({ ok: true, membership: memberships[0] });
  });

  test("uses the sole active membership when the requested tenant is invalid", () => {
    const soleActiveMembership = memberships[0];

    expect(
      selectCurrentTenant({
        memberships: [
          soleActiveMembership,
          { ...memberships[1], membershipStatus: "inactive" },
        ],
        requestedTenantId: "missing-tenant",
      }),
    ).toEqual({ ok: true, membership: soleActiveMembership });
  });

  test("fails closed when multiple active memberships are ambiguous", () => {
    expect(selectCurrentTenant({ memberships })).toEqual({
      ok: false,
      reason: "ambiguous-memberships",
    });
  });

  test.each([
    ["none exist", []],
    [
      "the membership is inactive",
      [{ ...memberships[0], membershipStatus: "inactive" }],
    ],
    [
      "the tenant is inactive",
      [{ ...memberships[0], tenantStatus: "inactive" }],
    ],
  ] as const)("fails closed when %s", (_case, unavailableMemberships) => {
    expect(
      selectCurrentTenant({ memberships: unavailableMemberships }),
    ).toEqual({ ok: false, reason: "no-active-membership" });
  });

  test("fails closed when the selected membership lacks the required role", () => {
    expect(
      selectCurrentTenant({
        memberships,
        requestedTenantId: "tenant-b",
        requiredRole: "owner",
      }),
    ).toEqual({ ok: false, reason: "insufficient-role" });
  });
});
