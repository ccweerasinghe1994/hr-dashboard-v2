"use client";

import { useActionState } from "react";
import { initialActionState } from "@/app/action-state";
import { ActionFeedback } from "@/components/forms/action-feedback";
import { SubmitButton } from "@/components/forms/submit-button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { signInAction } from "./actions";

export function SignInForm() {
  const [state, action] = useActionState(signInAction, initialActionState);
  const errors = (name: string) =>
    state.fieldErrors?.[name]?.map((message) => ({ message }));
  return (
    <form action={action} className="flex flex-col gap-6">
      <ActionFeedback state={state} />
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="email">Email address</FieldLabel>
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            aria-invalid={Boolean(errors("email"))}
          />
          <FieldError errors={errors("email")} />
        </Field>
        <Field>
          <FieldLabel htmlFor="password">Password</FieldLabel>
          <Input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            aria-invalid={Boolean(errors("password"))}
          />
          <FieldError errors={errors("password")} />
        </Field>
      </FieldGroup>
      <SubmitButton size="lg" pendingLabel="Signing in…">
        Sign in
      </SubmitButton>
    </form>
  );
}
