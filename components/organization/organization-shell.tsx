import { Building2Icon, LayoutDashboardIcon, LogOutIcon } from "lucide-react";
import Link from "next/link";
import { signOutAction } from "@/app/sign-in/actions";
import { TeamHubLogo } from "@/components/recruitment-dashboard/team-hub-logo";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function OrganizationShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-svh bg-muted/30">
      <header className="border-b bg-background">
        <div className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-4 sm:px-6">
          <TeamHubLogo />
          <nav
            aria-label="Settings navigation"
            className="ml-auto flex items-center gap-1"
          >
            <Link
              href="/"
              className={cn(
                buttonVariants({ variant: "ghost" }),
                "hidden sm:inline-flex",
              )}
            >
              <LayoutDashboardIcon
                data-icon="inline-start"
                aria-hidden="true"
              />
              Dashboard
            </Link>
            <Link
              href="/settings/organization"
              className={cn(buttonVariants({ variant: "secondary" }))}
              aria-current="page"
            >
              <Building2Icon data-icon="inline-start" aria-hidden="true" />
              Organization
            </Link>
            <form action={signOutAction}>
              <Button type="submit" variant="ghost" aria-label="Sign out">
                <LogOutIcon aria-hidden="true" />
                <span className="hidden sm:inline">Sign out</span>
              </Button>
            </form>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">{children}</main>
    </div>
  );
}
