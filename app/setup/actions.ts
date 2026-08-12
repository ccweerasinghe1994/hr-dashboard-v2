"use server";

import { redirect } from "next/navigation";
import { type ActionState, formValue } from "@/app/action-state";
import { provisionFirstTenant } from "@/data/bootstrap";
import { bootstrapErrorMessage } from "@/data/expected-errors";
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
    const message = bootstrapErrorMessage(error);
    if (message !== null) {
      return { status: "error", message };
    }
    throw error;
  }

  redirect("/settings/organization");
}
