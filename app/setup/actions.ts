"use server";

import { redirect } from "next/navigation";
import { type ActionState, formValue } from "@/app/action-state";
import { provisionFirstTenant } from "@/data/bootstrap";
import { isConstraintConflict } from "@/data/database-errors";
import { ConflictError } from "@/data/errors";
import { auth } from "@/lib/auth";
import { bootstrapSchema } from "@/lib/validation/organization";

export async function bootstrapAction(
  _previousState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = bootstrapSchema.safeParse({
    bootstrapSecret: formValue(formData, "bootstrapSecret"),
    ownerName: formValue(formData, "ownerName"),
    email: formValue(formData, "email"),
    password: formValue(formData, "password"),
    tenantName: formValue(formData, "tenantName"),
    tenantSlug: formValue(formData, "tenantSlug"),
    locale: formValue(formData, "locale"),
    timezone: formValue(formData, "timezone"),
  });
  if (!parsed.success) {
    return {
      status: "error",
      message: "Review the highlighted setup fields.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  try {
    await provisionFirstTenant(parsed.data);
    await auth.api.signInEmail({
      body: { email: parsed.data.email, password: parsed.data.password },
    });
  } catch (error) {
    if (error instanceof ConflictError) {
      return { status: "error", message: error.message };
    }
    if (isConstraintConflict(error)) {
      return {
        status: "error",
        message: "That email address or organization slug is already in use.",
      };
    }
    throw error;
  }

  redirect("/settings/organization");
}
