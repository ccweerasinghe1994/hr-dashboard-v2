import "server-only";

import { eq } from "drizzle-orm";
import { db } from "@/db/client";
import { systemState } from "@/db/schema";
import { bootstrapSecret } from "@/env/server";
import {
  type BootstrapInput,
  provisionFirstTenantInDatabase,
} from "@/lib/organization/bootstrap-persistence";

export type { BootstrapInput };

function todayUtc() {
  return new Date().toISOString().slice(0, 10);
}

export async function isBootstrapAvailable() {
  const [state] = await db
    .select({ completed: systemState.bootstrapCompleted })
    .from(systemState)
    .where(eq(systemState.id, 1))
    .limit(1);
  return state?.completed === false;
}

export async function provisionFirstTenant(input: BootstrapInput) {
  return provisionFirstTenantInDatabase(
    db,
    input,
    bootstrapSecret(),
    todayUtc(),
  );
}
