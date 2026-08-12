"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { type ActionState, formValue } from "@/app/action-state";
import { auth } from "@/lib/auth";
import { signInSchema } from "@/lib/validation/organization";

export async function signInAction(
  _previousState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = signInSchema.safeParse({
    email: formValue(formData, "email"),
    password: formValue(formData, "password"),
  });
  if (!parsed.success) {
    return {
      status: "error",
      message: "Enter your email address and password.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  try {
    await auth.api.signInEmail({ body: parsed.data });
  } catch {
    return {
      status: "error",
      message: "The email address or password is incorrect.",
    };
  }
  redirect("/settings/organization");
}

export async function signOutAction() {
  await auth.api.signOut({ headers: await headers() });
  redirect("/sign-in");
}
