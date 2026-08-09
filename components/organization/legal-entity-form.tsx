"use client";

import { useActionState } from "react";
import type { ActionState } from "@/app/action-state";
import { initialActionState } from "@/app/action-state";
import {
  correctLegalEntityConfigurationAction,
  createLegalEntityAction,
  scheduleLegalEntityChangeAction,
} from "@/app/settings/organization/actions";
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
import { Textarea } from "@/components/ui/textarea";

export type LegalEntityDefaults = {
  legalName?: string;
  displayName?: string | null;
  countryCode?: string;
  registrationNumber?: string | null;
  maskedTaxIdentifier?: string | null;
  currencyCode?: string | null;
  effectiveDate: string;
  reason?: string;
};

type FormMode =
  | { type: "create" }
  | { type: "change"; legalEntityId: string }
  | {
      type: "correct";
      legalEntityId: string;
      configurationId: string;
    };

export function LegalEntityForm({
  mode,
  defaults,
}: {
  mode: FormMode;
  defaults: LegalEntityDefaults;
}) {
  const serverAction: (
    state: ActionState,
    formData: FormData,
  ) => Promise<ActionState> =
    mode.type === "create"
      ? createLegalEntityAction
      : mode.type === "change"
        ? scheduleLegalEntityChangeAction.bind(null, mode.legalEntityId)
        : correctLegalEntityConfigurationAction.bind(
            null,
            mode.legalEntityId,
            mode.configurationId,
          );
  const [state, action] = useActionState(serverAction, initialActionState);
  const errors = (name: string) =>
    state.fieldErrors?.[name]?.map((message) => ({ message }));
  const preservesTax = mode.type !== "create" && defaults.maskedTaxIdentifier;

  return (
    <form action={action} className="flex flex-col gap-6">
      <ActionFeedback state={state} />
      <FieldGroup>
        <div className="grid gap-6 md:grid-cols-2">
          <Field>
            <FieldLabel htmlFor="legalName">Legal name</FieldLabel>
            <Input
              id="legalName"
              name="legalName"
              defaultValue={defaults.legalName}
              required
              aria-invalid={Boolean(errors("legalName"))}
            />
            <FieldError errors={errors("legalName")} />
          </Field>
          <Field>
            <FieldLabel htmlFor="displayName">Display name</FieldLabel>
            <Input
              id="displayName"
              name="displayName"
              defaultValue={defaults.displayName ?? ""}
              aria-invalid={Boolean(errors("displayName"))}
            />
            <FieldDescription>
              Optional shorter name for the UI.
            </FieldDescription>
            <FieldError errors={errors("displayName")} />
          </Field>
          <Field>
            <FieldLabel htmlFor="countryCode">Country code</FieldLabel>
            <Input
              id="countryCode"
              name="countryCode"
              defaultValue={defaults.countryCode}
              placeholder="LK"
              maxLength={2}
              required
              aria-invalid={Boolean(errors("countryCode"))}
            />
            <FieldDescription>Two-letter ISO 3166-1 code.</FieldDescription>
            <FieldError errors={errors("countryCode")} />
          </Field>
          <Field>
            <FieldLabel htmlFor="currencyCode">Currency code</FieldLabel>
            <Input
              id="currencyCode"
              name="currencyCode"
              defaultValue={defaults.currencyCode ?? ""}
              placeholder="LKR"
              maxLength={3}
              aria-invalid={Boolean(errors("currencyCode"))}
            />
            <FieldDescription>
              Optional three-letter ISO 4217 code.
            </FieldDescription>
            <FieldError errors={errors("currencyCode")} />
          </Field>
          <Field>
            <FieldLabel htmlFor="registrationNumber">
              Registration number
            </FieldLabel>
            <Input
              id="registrationNumber"
              name="registrationNumber"
              defaultValue={defaults.registrationNumber ?? ""}
              autoComplete="off"
              aria-invalid={Boolean(errors("registrationNumber"))}
            />
            <FieldError errors={errors("registrationNumber")} />
          </Field>
          <Field>
            <FieldLabel htmlFor="taxIdentifier">Tax identifier</FieldLabel>
            <Input
              id="taxIdentifier"
              name="taxIdentifier"
              type="password"
              autoComplete="off"
              placeholder={
                preservesTax ? String(defaults.maskedTaxIdentifier) : undefined
              }
              aria-invalid={Boolean(errors("taxIdentifier"))}
            />
            <FieldDescription>
              {preservesTax
                ? "Leave blank to keep the existing encrypted value."
                : "Encrypted at rest and shown only in masked form."}
            </FieldDescription>
            <FieldError errors={errors("taxIdentifier")} />
          </Field>
          <Field>
            <FieldLabel htmlFor="effectiveDate">Effective date</FieldLabel>
            <Input
              id="effectiveDate"
              name="effectiveDate"
              type="date"
              defaultValue={defaults.effectiveDate}
              readOnly={mode.type === "correct"}
              required
              aria-invalid={Boolean(errors("effectiveDate"))}
            />
            <FieldDescription>
              {mode.type === "correct"
                ? "Corrections keep the original effective date."
                : "Business-effective date; future dates are supported."}
            </FieldDescription>
            <FieldError errors={errors("effectiveDate")} />
          </Field>
        </div>
        <Field>
          <FieldLabel htmlFor="reason">Reason</FieldLabel>
          <Textarea
            id="reason"
            name="reason"
            defaultValue={defaults.reason}
            required
            aria-invalid={Boolean(errors("reason"))}
          />
          <FieldDescription>
            Recorded in the audit event. Explain backdated changes and
            corrections.
          </FieldDescription>
          <FieldError errors={errors("reason")} />
        </Field>
      </FieldGroup>
      <SubmitButton className="self-start">
        {mode.type === "create"
          ? "Create legal entity"
          : mode.type === "correct"
            ? "Record correction"
            : "Record configuration change"}
      </SubmitButton>
    </form>
  );
}
