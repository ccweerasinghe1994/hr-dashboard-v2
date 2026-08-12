"use client";

import { useActionState } from "react";
import { initialActionState } from "@/app/action-state";
import { changeLegalEntityStatusAction } from "@/app/settings/organization/actions";
import { ActionFeedback } from "@/components/forms/action-feedback";
import { SubmitButton } from "@/components/forms/submit-button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export function StatusChangeForm({
  legalEntityId,
  currentStatus,
  defaultDate,
}: {
  legalEntityId: string;
  currentStatus: "active" | "inactive";
  defaultDate: string;
}) {
  const targetStatus = currentStatus === "active" ? "inactive" : "active";
  const [state, action] = useActionState(
    changeLegalEntityStatusAction.bind(null, legalEntityId),
    initialActionState,
  );
  const errors = (name: string) =>
    state.fieldErrors?.[name]?.map((message) => ({ message }));
  return (
    <form action={action} className="flex flex-col gap-6">
      <input type="hidden" name="targetStatus" value={targetStatus} />
      <ActionFeedback state={state} />
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="statusEffectiveDate">Effective date</FieldLabel>
          <Input
            id="statusEffectiveDate"
            name="effectiveDate"
            type="date"
            defaultValue={defaultDate}
            required
            aria-invalid={Boolean(errors("effectiveDate"))}
          />
          <FieldError errors={errors("effectiveDate")} />
        </Field>
        <Field>
          <FieldLabel htmlFor="statusReason">Reason</FieldLabel>
          <Textarea
            id="statusReason"
            name="reason"
            required
            aria-invalid={Boolean(errors("reason"))}
          />
          <FieldError errors={errors("reason")} />
        </Field>
      </FieldGroup>
      <SubmitButton
        variant={targetStatus === "inactive" ? "destructive" : "default"}
        className="self-start"
      >
        {targetStatus === "inactive" ? "Deactivate" : "Reactivate"}
      </SubmitButton>
    </form>
  );
}
