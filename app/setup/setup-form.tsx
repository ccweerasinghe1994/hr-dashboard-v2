"use client";

import { useActionState } from "react";
import { initialActionState } from "@/app/action-state";
import { ActionFeedback } from "@/components/forms/action-feedback";
import { SubmitButton } from "@/components/forms/submit-button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { bootstrapAction } from "./actions";

export function SetupForm() {
  const [state, action] = useActionState(bootstrapAction, initialActionState);
  const errors = (name: string) =>
    state.fieldErrors?.[name]?.map((message) => ({ message }));

  return (
    <form action={action} className="flex flex-col gap-8">
      <ActionFeedback state={state} />
      <FieldGroup>
        <FieldSet>
          <FieldLegend>System authorization</FieldLegend>
          <Field>
            <FieldLabel htmlFor="bootstrapSecret">Bootstrap secret</FieldLabel>
            <Input
              id="bootstrapSecret"
              name="bootstrapSecret"
              type="password"
              autoComplete="off"
              required
              aria-invalid={Boolean(errors("bootstrapSecret"))}
            />
            <FieldDescription>
              The one-time server secret from TENANT_BOOTSTRAP_SECRET.
            </FieldDescription>
            <FieldError errors={errors("bootstrapSecret")} />
          </Field>
        </FieldSet>
        <Separator />
        <FieldSet>
          <FieldLegend>Owner account</FieldLegend>
          <div className="grid gap-6 sm:grid-cols-2">
            <Field>
              <FieldLabel htmlFor="ownerName">Full name</FieldLabel>
              <Input
                id="ownerName"
                name="ownerName"
                autoComplete="name"
                required
                aria-invalid={Boolean(errors("ownerName"))}
              />
              <FieldError errors={errors("ownerName")} />
            </Field>
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
          </div>
          <Field>
            <FieldLabel htmlFor="password">Password</FieldLabel>
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              minLength={12}
              required
              aria-invalid={Boolean(errors("password"))}
            />
            <FieldDescription>Use at least 12 characters.</FieldDescription>
            <FieldError errors={errors("password")} />
          </Field>
        </FieldSet>
        <Separator />
        <FieldSet>
          <FieldLegend>Organization</FieldLegend>
          <div className="grid gap-6 sm:grid-cols-2">
            <Field>
              <FieldLabel htmlFor="tenantName">Organization name</FieldLabel>
              <Input
                id="tenantName"
                name="tenantName"
                required
                aria-invalid={Boolean(errors("tenantName"))}
              />
              <FieldError errors={errors("tenantName")} />
            </Field>
            <Field>
              <FieldLabel htmlFor="tenantSlug">Permanent slug</FieldLabel>
              <Input
                id="tenantSlug"
                name="tenantSlug"
                placeholder="acme-holdings"
                required
                aria-invalid={Boolean(errors("tenantSlug"))}
              />
              <FieldDescription>
                Lowercase letters, numbers, and hyphens. This cannot be changed.
              </FieldDescription>
              <FieldError errors={errors("tenantSlug")} />
            </Field>
            <Field>
              <FieldLabel htmlFor="locale">Default locale</FieldLabel>
              <Input
                id="locale"
                name="locale"
                defaultValue="en-US"
                placeholder="en-US"
                required
                aria-invalid={Boolean(errors("locale"))}
              />
              <FieldError errors={errors("locale")} />
            </Field>
            <Field>
              <FieldLabel htmlFor="timezone">Default timezone</FieldLabel>
              <Input
                id="timezone"
                name="timezone"
                defaultValue="UTC"
                placeholder="Asia/Colombo"
                required
                aria-invalid={Boolean(errors("timezone"))}
              />
              <FieldError errors={errors("timezone")} />
            </Field>
          </div>
        </FieldSet>
      </FieldGroup>
      <SubmitButton size="lg" pendingLabel="Creating TeamHub…">
        Create organization
      </SubmitButton>
    </form>
  );
}
