"use client";

import { useActionState } from "react";
import { initialActionState } from "@/app/action-state";
import { updateTenantAction } from "@/app/settings/organization/actions";
import { ActionFeedback } from "@/components/forms/action-feedback";
import { SubmitButton } from "@/components/forms/submit-button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import type { TenantSettingsDto } from "@/data/tenants";

export function TenantSettingsForm({ tenant }: { tenant: TenantSettingsDto }) {
  const [state, action] = useActionState(
    updateTenantAction,
    initialActionState,
  );
  const errors = (name: string) =>
    state.fieldErrors?.[name]?.map((message) => ({ message }));
  return (
    <form action={action} className="flex flex-col gap-6">
      <ActionFeedback state={state} />
      <FieldGroup>
        <div className="grid gap-6 md:grid-cols-2">
          <Field>
            <FieldLabel htmlFor="name">Organization name</FieldLabel>
            <Input
              id="name"
              name="name"
              defaultValue={tenant.name}
              required
              aria-invalid={Boolean(errors("name"))}
            />
            <FieldError errors={errors("name")} />
          </Field>
          <Field data-disabled="true">
            <FieldLabel htmlFor="slug">Permanent slug</FieldLabel>
            <Input id="slug" value={tenant.slug} readOnly disabled />
            <FieldDescription>
              This stable routing identity cannot be changed.
            </FieldDescription>
          </Field>
          <Field>
            <FieldLabel htmlFor="locale">Default locale</FieldLabel>
            <Input
              id="locale"
              name="locale"
              defaultValue={tenant.locale}
              required
              aria-invalid={Boolean(errors("locale"))}
            />
            <FieldDescription>BCP 47 format, such as en-US.</FieldDescription>
            <FieldError errors={errors("locale")} />
          </Field>
          <Field>
            <FieldLabel htmlFor="timezone">Default timezone</FieldLabel>
            <Input
              id="timezone"
              name="timezone"
              defaultValue={tenant.timezone}
              required
              aria-invalid={Boolean(errors("timezone"))}
            />
            <FieldDescription>
              IANA format, such as Asia/Colombo.
            </FieldDescription>
            <FieldError errors={errors("timezone")} />
          </Field>
        </div>
      </FieldGroup>
      <SubmitButton className="self-start">Save settings</SubmitButton>
    </form>
  );
}
