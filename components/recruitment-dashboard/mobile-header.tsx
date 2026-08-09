import { SlidersHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";

import { TeamHubLogo } from "./team-hub-logo";

export function MobileHeader() {
  return (
    <div className="flex items-center justify-between bg-sidebar px-4 py-4 lg:hidden">
      <TeamHubLogo />
      <Button
        variant="secondary"
        size="icon-lg"
        aria-label="Open dashboard filters"
      >
        <SlidersHorizontal aria-hidden="true" />
      </Button>
    </div>
  );
}
