import { ArrowLeftIcon } from "lucide-react";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
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
  NotFoundError,
  TenantUnavailableError,
} from "@/data/errors";
import { getLegalEntity } from "@/data/legal-entities";
import { cn } from "@/lib/utils";

export default async function CorrectConfigurationPage({
  params,
}: PageProps<"/settings/organization/legal-entities/[legalEntityId]/correct/[configurationId]">) {
  const { legalEntityId, configurationId } = await params;
  let entity: Awaited<ReturnType<typeof getLegalEntity>>;
  try {
    entity = await getLegalEntity(legalEntityId);
  } catch (error) {
    if (error instanceof AuthenticationRequiredError) redirect("/sign-in");
    if (error instanceof AuthorizationError) return <PermissionNotice />;
    if (error instanceof TenantUnavailableError) {
      return <TenantUnavailableNotice />;
    }
    if (error instanceof NotFoundError) notFound();
    throw error;
  }
  const configuration = entity.configurations.find(
    (item) => item.configurationId === configurationId && !item.superseded,
  );
  if (!configuration) notFound();

  return (
    <div className="flex flex-col gap-6">
      <Link
        href={`/settings/organization/legal-entities/${legalEntityId}`}
        className={cn(buttonVariants({ variant: "ghost" }), "self-start")}
      >
        <ArrowLeftIcon data-icon="inline-start" aria-hidden="true" />
        Legal entity
      </Link>
      <Card>
        <CardHeader>
          <CardTitle>Correct configuration</CardTitle>
          <CardDescription>
            Correct erroneous transaction-time data without changing the
            business-effective interval. The original row remains in history.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <LegalEntityForm
            mode={{ type: "correct", legalEntityId, configurationId }}
            defaults={{
              legalName: configuration.legalName,
              displayName: configuration.displayName,
              countryCode: configuration.countryCode,
              registrationNumber: configuration.registrationNumber,
              maskedTaxIdentifier: configuration.maskedTaxIdentifier,
              currencyCode: configuration.currencyCode,
              effectiveDate: configuration.validFrom,
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
}
