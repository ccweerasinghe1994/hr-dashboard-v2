import "server-only";

import {
  getTenantSettingsForTenant,
  type TenantSettingsDto,
  updateTenantSettingsForTenant,
} from "@/lib/organization/tenant-settings-persistence";
import { withTenantContext } from "./tenant-context";

export type { TenantSettingsDto };

export async function getTenantSettings() {
  return withTenantContext(getTenantSettingsForTenant, "owner");
}

export async function updateTenantSettings(input: {
  name: string;
  locale: string;
  timezone: string;
}) {
  return withTenantContext(
    (tx, context) => updateTenantSettingsForTenant(tx, context, input),
    "owner",
  );
}
