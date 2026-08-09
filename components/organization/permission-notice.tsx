import { ShieldAlertIcon } from "lucide-react";
import { signOutAction } from "@/app/sign-in/actions";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

export function PermissionNotice() {
  return (
    <Alert variant="destructive">
      <ShieldAlertIcon aria-hidden="true" />
      <AlertTitle>Owner access required</AlertTitle>
      <AlertDescription>
        Only an active organization owner can manage organization settings and
        legal entities.
      </AlertDescription>
    </Alert>
  );
}

export function TenantUnavailableNotice() {
  return (
    <Alert variant="destructive">
      <ShieldAlertIcon aria-hidden="true" />
      <AlertTitle>No active organization</AlertTitle>
      <AlertDescription>
        <p>
          Your session has no active tenant membership. Contact a system
          operator if this organization should be reactivated.
        </p>
        <form action={signOutAction}>
          <Button type="submit" className="mt-4" variant="outline">
            Sign out
          </Button>
        </form>
      </AlertDescription>
    </Alert>
  );
}
