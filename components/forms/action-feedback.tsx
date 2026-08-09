import { AlertCircleIcon, CheckCircle2Icon } from "lucide-react";
import type { ActionState } from "@/app/action-state";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export function ActionFeedback({ state }: { state: ActionState }) {
  if (state.status === "idle" || !state.message) return null;
  const isError = state.status === "error";
  const Icon = isError ? AlertCircleIcon : CheckCircle2Icon;
  return (
    <Alert variant={isError ? "destructive" : "default"}>
      <Icon aria-hidden="true" />
      <AlertTitle>{isError ? "Couldn’t save" : "Saved"}</AlertTitle>
      <AlertDescription>{state.message}</AlertDescription>
    </Alert>
  );
}
