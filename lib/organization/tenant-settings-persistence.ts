import { eq } from "drizzle-orm";
import { NotFoundError } from "@/data/errors";
import { auditEvents, tenants } from "@/db/schema";
import type {
  TenantContext,
  TenantTransaction,
} from "@/lib/tenancy/tenant-context-persistence";

export type TenantSettingsDto = Readonly<{
  id: string;
  name: string;
  slug: string;
  locale: string;
  timezone: string;
  dataRegion: string | null;
}>;

export async function getTenantSettingsForTenant(
  tx: TenantTransaction,
  context: TenantContext,
) {
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
}

export async function updateTenantSettingsForTenant(
  tx: TenantTransaction,
  context: TenantContext,
  input: { name: string; locale: string; timezone: string },
) {
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
}
