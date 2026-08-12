import { redirect } from "next/navigation";
import { AuthShell } from "@/components/auth/auth-shell";
import { isBootstrapAvailable } from "@/data/bootstrap";
import { SetupForm } from "./setup-form";

export const dynamic = "force-dynamic";

export default async function SetupPage() {
  if (!(await isBootstrapAvailable())) redirect("/sign-in");
  return (
    <AuthShell
      title="Set up TeamHub"
      description="Create the first organization and its owner account. This page closes permanently after setup."
    >
      <SetupForm />
    </AuthShell>
  );
}
