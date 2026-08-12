import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { AuthShell } from "@/components/auth/auth-shell";
import { auth } from "@/lib/auth";
import { SignInForm } from "./sign-in-form";

export const dynamic = "force-dynamic";

export default async function SignInPage() {
  if (await auth.api.getSession({ headers: await headers() })) {
    redirect("/settings/organization");
  }
  return (
    <AuthShell
      title="Welcome back"
      description="Sign in with your organization owner account."
    >
      <SignInForm />
    </AuthShell>
  );
}
