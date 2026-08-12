import { Settings2Icon } from "lucide-react";
import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

import { navigation } from "./data";
import { TeamHubLogo } from "./team-hub-logo";

export function Sidebar() {
  return (
    <aside className="hidden min-h-full bg-sidebar px-5 py-8 text-sidebar-foreground lg:flex lg:flex-col">
      <div className="px-3">
        <TeamHubLogo />
      </div>
      <nav aria-label="Primary navigation" className="mt-10">
        <ul className="flex flex-col gap-1.5">
          {navigation.map((item) => {
            const Icon = item.icon;

            return (
              <li key={item.label}>
                <a
                  href={`#${item.label.toLowerCase().replaceAll(" ", "-")}`}
                  aria-current={item.active ? "page" : undefined}
                  className={cn(
                    buttonVariants({
                      variant: item.active ? "default" : "ghost",
                      size: "lg",
                    }),
                    "h-12 w-full justify-start gap-3 px-4 text-base",
                  )}
                >
                  <Icon aria-hidden="true" />
                  {item.label}
                </a>
              </li>
            );
          })}
        </ul>
      </nav>
      <Link
        href="/settings/organization"
        className={cn(
          buttonVariants({ variant: "ghost", size: "lg" }),
          "mt-4 h-12 justify-start gap-3 px-4 text-base",
        )}
      >
        <Settings2Icon aria-hidden="true" />
        Organization settings
      </Link>
      <Card className="mt-auto" size="sm" tone="highlight">
        <CardHeader>
          <CardTitle>Level Up Your HR System</CardTitle>
          <CardDescription>
            TeamHub Pro gives you full control with advanced modules and
            extended layouts.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button className="w-full" size="lg">
            Get TeamHub Pro
          </Button>
        </CardContent>
      </Card>
    </aside>
  );
}
