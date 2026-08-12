import "server-only";

import { eq } from "drizzle-orm";
import { auditEvents, tenants } from "@/db/schema";
import { NotFoundError } from "./errors";
import { withTenantContext } from "./tenant-context";

export type TenantSettingsDto = Readonly<{
  id: string;
  name: string;
  slug: string;
  locale: string;
  timezone: string;
  dataRegion: string | null;
}>;

export async function getTenantSettings() {
  return withTenantContext(async (tx, context) => {
    const [tenant] = await tx
      .select({
        id: tenants.id,
        name: tenants.name,
        slug: tenants.slug,
        locale: tenants.defaultLocale,
        timezone: tenants.defaultTimezone,
        dataRegion: tenants.dataRegion,
      })
      .from(tenants)
      .where(eq(tenants.id, context.tenantId))
      .limit(1);
    if (!tenant) throw new NotFoundError("Organization not found.");
    return tenant satisfies TenantSettingsDto;
  }, "owner");
}

export async function updateTenantSettings(input: {
  name: string;
  locale: string;
  timezone: string;
}) {
  return withTenantContext(async (tx, context) => {
    const [before] = await tx
      .select({
        id: tenants.id,
        name: tenants.name,
        locale: tenants.defaultLocale,
        timezone: tenants.defaultTimezone,
      })
      .from(tenants)
      .where(eq(tenants.id, context.tenantId))
      .limit(1);
    if (!before) throw new NotFoundError("Organization not found.");

    const [after] = await tx
      .update(tenants)
      .set({
        name: input.name,
        defaultLocale: input.locale,
        defaultTimezone: input.timezone,
      })
      .where(eq(tenants.id, context.tenantId))
      .returning({
        id: tenants.id,
        name: tenants.name,
        locale: tenants.defaultLocale,
        timezone: tenants.defaultTimezone,
      });

    await tx.insert(auditEvents).values({
      tenantId: context.tenantId,
      actorUserId: context.userId,
      source: "ui",
      action: "tenant.settings_updated",
      objectType: "tenant",
      objectId: context.tenantId,
      before,
      after,
      reason: "Organization settings updated",
    });
    return after;
  }, "owner");
}
