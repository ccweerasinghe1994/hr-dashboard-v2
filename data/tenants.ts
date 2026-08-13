import "server-only";

import {
  getTenantSettingsForTenant,
  type TenantSettingsDto,
  type TenantSettingsUpdateInput,
  updateTenantSettingsForTenant,
} from "@/lib/organization/tenant-settings-persistence";
import { withTenantContext } from "./tenant-context";

export type { TenantSettingsDto };

export async function getTenantSettings() {
  return withTenantContext(getTenantSettingsForTenant, "owner");
}

export async function updateTenantSettings(input: TenantSettingsUpdateInput) {
  return withTenantContext(
    (tx, context) => updateTenantSettingsForTenant(tx, context, input),
    "owner",
  );
}
