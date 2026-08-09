import { ArrowLeftIcon } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { LegalEntityForm } from "@/components/organization/legal-entity-form";
import {
  PermissionNotice,
  TenantUnavailableNotice,
} from "@/components/organization/permission-notice";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AuthenticationRequiredError,
  AuthorizationError,
  TenantUnavailableError,
} from "@/data/errors";
import { getTenantSettings } from "@/data/tenants";
import { cn } from "@/lib/utils";

function todayUtc() {
  return new Date().toISOString().slice(0, 10);
}

export default async function NewLegalEntityPage() {
  try {
    await getTenantSettings();
  } catch (error) {
    if (error instanceof AuthenticationRequiredError) redirect("/sign-in");
    if (error instanceof AuthorizationError) return <PermissionNotice />;
    if (error instanceof TenantUnavailableError) {
      return <TenantUnavailableNotice />;
    }
    throw error;
  }
  return (
    <div className="flex flex-col gap-6">
      <Link
        href="/settings/organization"
        className={cn(buttonVariants({ variant: "ghost" }), "self-start")}
      >
        <ArrowLeftIcon data-icon="inline-start" aria-hidden="true" />
        Organization
      </Link>
      <Card>
        <CardHeader>
          <CardTitle>Create legal entity</CardTitle>
          <CardDescription>
            This creates a stable entity identity and its first effective-dated
            configuration. Records cannot be hard-deleted.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <LegalEntityForm
            mode={{ type: "create" }}
            defaults={{
              effectiveDate: todayUtc(),
              reason: "Initial legal entity registration",
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
}
