import { Settings2Icon, SlidersHorizontal } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";

import { TeamHubLogo } from "./team-hub-logo";

export function MobileHeader() {
  return (
    <div className="flex items-center justify-between bg-sidebar px-4 py-4 lg:hidden">
      <TeamHubLogo />
      <div className="flex items-center gap-2">
        <Button
          render={<Link href="/settings/organization" />}
          variant="ghost"
          size="icon-lg"
          aria-label="Organization settings"
        >
          <Settings2Icon aria-hidden="true" />
        </Button>
        <Button
          variant="secondary"
          size="icon-lg"
          aria-label="Open dashboard filters"
        >
          <SlidersHorizontal aria-hidden="true" />
        </Button>
      </div>
    </div>
  );
}
