import { ArrowLeftIcon, HistoryIcon, PencilLineIcon } from "lucide-react";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { LegalEntityForm } from "@/components/organization/legal-entity-form";
import {
  PermissionNotice,
  TenantUnavailableNotice,
} from "@/components/organization/permission-notice";
import { StatusChangeForm } from "@/components/organization/status-change-form";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AuthenticationRequiredError,
  AuthorizationError,
  NotFoundError,
  TenantUnavailableError,
} from "@/data/errors";
import { getLegalEntity } from "@/data/legal-entities";
import { cn } from "@/lib/utils";

function tomorrowUtc() {
  return new Date(Date.now() + 86_400_000).toISOString().slice(0, 10);
}

export default async function LegalEntityPage({
  params,
}: PageProps<"/settings/organization/legal-entities/[legalEntityId]">) {
  const { legalEntityId } = await params;
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

  const current = entity.current;
  return (
    <div className="flex flex-col gap-6">
      <Link
        href="/settings/organization"
        className={cn(buttonVariants({ variant: "ghost" }), "self-start")}
      >
        <ArrowLeftIcon data-icon="inline-start" aria-hidden="true" />
        Organization
      </Link>
      <div>
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-3xl font-semibold tracking-tight">
            {current?.legalName ?? "Legal entity"}
          </h1>
          {current ? (
            <Badge
              variant={current.status === "active" ? "secondary" : "outline"}
            >
              {current.status}
            </Badge>
          ) : null}
        </div>
        <p className="mt-2 text-muted-foreground">
          Entity identity {entity.id}. All changes preserve business and
          transaction history.
        </p>
      </div>

      {current ? (
        <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(18rem,1fr)]">
          <Card>
            <CardHeader>
              <CardTitle>Record a configuration change</CardTitle>
              <CardDescription>
                Schedule a future or backdated business change. Use correction
                for an error in an existing record.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <LegalEntityForm
                mode={{ type: "change", legalEntityId: entity.id }}
                defaults={{
                  legalName: current.legalName,
                  displayName: current.displayName,
                  countryCode: current.countryCode,
                  registrationNumber: current.registrationNumber,
                  maskedTaxIdentifier: current.maskedTaxIdentifier,
                  currencyCode: current.currencyCode,
                  effectiveDate: tomorrowUtc(),
                }}
              />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>
                {current.status === "active" ? "Deactivate" : "Reactivate"}
              </CardTitle>
              <CardDescription>
                Status changes are effective-dated. The entity is never deleted.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <StatusChangeForm
                legalEntityId={entity.id}
                currentStatus={current.status}
                defaultDate={tomorrowUtc()}
              />
            </CardContent>
          </Card>
        </div>
      ) : null}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HistoryIcon aria-hidden="true" />
            Configuration history
          </CardTitle>
          <CardDescription>
            Superseded rows retain transaction-time history; active rows form
            the current effective timeline.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Effective interval</TableHead>
                <TableHead>Legal name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Recorded</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {entity.configurations.map((configuration) => (
                <TableRow key={configuration.configurationId}>
                  <TableCell>
                    {configuration.validFrom} →{" "}
                    {configuration.validTo ?? "open"}
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{configuration.legalName}</div>
                    <div className="max-w-64 truncate text-xs text-muted-foreground">
                      {configuration.changeReason}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        configuration.superseded ? "outline" : "secondary"
                      }
                    >
                      {configuration.superseded
                        ? "superseded"
                        : configuration.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <time dateTime={configuration.recordedAt.toISOString()}>
                      {configuration.recordedAt.toLocaleDateString()}
                    </time>
                  </TableCell>
                  <TableCell className="text-right">
                    {!configuration.superseded ? (
                      <Link
                        href={`/settings/organization/legal-entities/${entity.id}/correct/${configuration.configurationId}`}
                        className={cn(
                          buttonVariants({ variant: "ghost", size: "sm" }),
                        )}
                      >
                        <PencilLineIcon
                          data-icon="inline-start"
                          aria-hidden="true"
                        />
                        Correct
                      </Link>
                    ) : (
                      "—"
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
