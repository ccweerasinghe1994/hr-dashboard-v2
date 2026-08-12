import { Building2Icon, PlusIcon } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import {
  PermissionNotice,
  TenantUnavailableNotice,
} from "@/components/organization/permission-notice";
import { TenantSettingsForm } from "@/components/organization/tenant-settings-form";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
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
  TenantUnavailableError,
} from "@/data/errors";
import { listLegalEntities } from "@/data/legal-entities";
import { getTenantSettings } from "@/data/tenants";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function OrganizationPage() {
  let data: Awaited<ReturnType<typeof getTenantSettings>>;
  let legalEntities: Awaited<ReturnType<typeof listLegalEntities>>;
  try {
    [data, legalEntities] = await Promise.all([
      getTenantSettings(),
      listLegalEntities(),
    ]);
  } catch (error) {
    if (error instanceof AuthenticationRequiredError) redirect("/sign-in");
    if (error instanceof AuthorizationError) return <PermissionNotice />;
    if (error instanceof TenantUnavailableError) {
      return <TenantUnavailableNotice />;
    }
    throw error;
  }

  return (
    <div className="flex flex-col gap-8">
      <div>
        <p className="text-sm font-medium text-primary">
          Organization settings
        </p>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight">
          {data.name}
        </h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          Manage tenant defaults and the employing or payroll entities owned by
          this organization.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Organization profile</CardTitle>
          <CardDescription>
            Locale and timezone changes are audited. Dates are stored in UTC and
            rendered using these defaults.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <TenantSettingsForm tenant={data} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Legal entities</CardTitle>
          <CardDescription>
            Legal names, identifiers, status, and future changes are
            effective-dated and tenant-isolated.
          </CardDescription>
          <CardAction>
            <Link
              href="/settings/organization/legal-entities/new"
              className={cn(buttonVariants())}
            >
              <PlusIcon data-icon="inline-start" aria-hidden="true" />
              Add legal entity
            </Link>
          </CardAction>
        </CardHeader>
        <CardContent>
          {legalEntities.length === 0 ? (
            <Empty className="border">
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <Building2Icon aria-hidden="true" />
                </EmptyMedia>
                <EmptyTitle>No legal entities yet</EmptyTitle>
                <EmptyDescription>
                  Create the first employing or payroll entity for this
                  organization.
                </EmptyDescription>
              </EmptyHeader>
              <EmptyContent>
                <Link
                  href="/settings/organization/legal-entities/new"
                  className={cn(buttonVariants())}
                >
                  <PlusIcon data-icon="inline-start" aria-hidden="true" />
                  Create legal entity
                </Link>
              </EmptyContent>
            </Empty>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Legal entity</TableHead>
                  <TableHead>Country</TableHead>
                  <TableHead>Registration</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {legalEntities.map((entity) => (
                  <TableRow key={entity.id}>
                    <TableCell>
                      <div className="font-medium">{entity.legalName}</div>
                      {entity.displayName ? (
                        <div className="text-xs text-muted-foreground">
                          {entity.displayName}
                        </div>
                      ) : null}
                    </TableCell>
                    <TableCell>{entity.countryCode}</TableCell>
                    <TableCell>{entity.registrationNumber ?? "—"}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          entity.status === "active" ? "secondary" : "outline"
                        }
                      >
                        {entity.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Link
                        href={`/settings/organization/legal-entities/${entity.id}`}
                        className={cn(buttonVariants({ variant: "ghost" }))}
                      >
                        View
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
