"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { type ActionState, formValue } from "@/app/action-state";
import { isConstraintConflict } from "@/data/database-errors";
import {
  ConflictError,
  NotFoundError,
  TenantUnavailableError,
} from "@/data/errors";
import {
  changeLegalEntityStatus,
  correctLegalEntityConfiguration,
  createLegalEntity,
  scheduleLegalEntityChange,
} from "@/data/legal-entities";
import { updateTenantSettings } from "@/data/tenants";
import {
  legalEntityIdSchema,
  legalEntitySchema,
  updateTenantSchema,
} from "@/lib/validation/organization";

function legalEntityInput(formData: FormData) {
  return {
    legalName: formValue(formData, "legalName"),
    displayName: formValue(formData, "displayName"),
    countryCode: formValue(formData, "countryCode"),
    registrationNumber: formValue(formData, "registrationNumber"),
    taxIdentifier: formValue(formData, "taxIdentifier"),
    currencyCode: formValue(formData, "currencyCode"),
    effectiveDate: formValue(formData, "effectiveDate"),
    reason: formValue(formData, "reason"),
  };
}

function expectedMutationError(error: unknown): ActionState | null {
  if (
    error instanceof ConflictError ||
    error instanceof NotFoundError ||
    error instanceof TenantUnavailableError
  ) {
    return { status: "error", message: error.message };
  }
  if (isConstraintConflict(error)) {
    return {
      status: "error",
      message:
        "That legal name or identifier conflicts with another effective record in this organization.",
    };
  }
  return null;
}

export async function updateTenantAction(
  _previousState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = updateTenantSchema.safeParse({
    name: formValue(formData, "name"),
    locale: formValue(formData, "locale"),
    timezone: formValue(formData, "timezone"),
  });
  if (!parsed.success) {
    return {
      status: "error",
      message: "Review the highlighted organization fields.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  await updateTenantSettings(parsed.data);
  revalidatePath("/settings/organization");
  return { status: "success", message: "Organization settings saved." };
}

export async function createLegalEntityAction(
  _previousState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = legalEntitySchema.safeParse(legalEntityInput(formData));
  if (!parsed.success) {
    return {
      status: "error",
      message: "Review the highlighted legal-entity fields.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  let entityId: string;
  try {
    ({ id: entityId } = await createLegalEntity(parsed.data));
  } catch (error) {
    const expected = expectedMutationError(error);
    if (expected) return expected;
    throw error;
  }
  revalidatePath("/settings/organization");
  redirect(`/settings/organization/legal-entities/${entityId}`);
}

export async function scheduleLegalEntityChangeAction(
  legalEntityId: string,
  _previousState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const id = legalEntityIdSchema.safeParse(legalEntityId);
  const parsed = legalEntitySchema.safeParse(legalEntityInput(formData));
  if (!id.success || !parsed.success) {
    return {
      status: "error",
      message: "Review the highlighted configuration fields.",
      fieldErrors: parsed.success
        ? undefined
        : parsed.error.flatten().fieldErrors,
    };
  }
  try {
    await scheduleLegalEntityChange(id.data, parsed.data);
  } catch (error) {
    const expected = expectedMutationError(error);
    if (expected) return expected;
    throw error;
  }
  revalidatePath(`/settings/organization/legal-entities/${id.data}`);
  return {
    status: "success",
    message: "The configuration change was recorded.",
  };
}

export async function correctLegalEntityConfigurationAction(
  legalEntityId: string,
  configurationId: string,
  _previousState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const ids = z
    .object({ entityId: z.uuid(), configurationId: z.uuid() })
    .safeParse({ entityId: legalEntityId, configurationId });
  const parsed = legalEntitySchema.safeParse(legalEntityInput(formData));
  if (!ids.success || !parsed.success) {
    return {
      status: "error",
      message: "Review the highlighted correction fields.",
      fieldErrors: parsed.success
        ? undefined
        : parsed.error.flatten().fieldErrors,
    };
  }
  try {
    await correctLegalEntityConfiguration(
      ids.data.entityId,
      ids.data.configurationId,
      parsed.data,
    );
  } catch (error) {
    const expected = expectedMutationError(error);
    if (expected) return expected;
    throw error;
  }
  revalidatePath(`/settings/organization/legal-entities/${ids.data.entityId}`);
  redirect(`/settings/organization/legal-entities/${ids.data.entityId}`);
}

const statusChangeSchema = z.object({
  effectiveDate: z.iso.date("Enter a valid effective date."),
  reason: z.string().trim().min(1, "A reason is required.").max(300),
  targetStatus: z.enum(["active", "inactive"]),
});

export async function changeLegalEntityStatusAction(
  legalEntityId: string,
  _previousState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const id = legalEntityIdSchema.safeParse(legalEntityId);
  const parsed = statusChangeSchema.safeParse({
    effectiveDate: formValue(formData, "effectiveDate"),
    reason: formValue(formData, "reason"),
    targetStatus: formValue(formData, "targetStatus"),
  });
  if (!id.success || !parsed.success) {
    return {
      status: "error",
      message: "Enter an effective date and a reason.",
      fieldErrors: parsed.success
        ? undefined
        : parsed.error.flatten().fieldErrors,
    };
  }
  try {
    await changeLegalEntityStatus(
      id.data,
      parsed.data.targetStatus,
      parsed.data.effectiveDate,
      parsed.data.reason,
    );
  } catch (error) {
    const expected = expectedMutationError(error);
    if (expected) return expected;
    throw error;
  }
  revalidatePath(`/settings/organization/legal-entities/${id.data}`);
  return {
    status: "success",
    message: `Legal entity ${parsed.data.targetStatus}.`,
  };
}
