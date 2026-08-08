import { MessageCircle, Share2, Video } from "lucide-react";

import { Button } from "@/components/ui/button";

const socialLinks = [
  { label: "Twitter", icon: MessageCircle },
  { label: "YouTube", icon: Video },
  { label: "LinkedIn", icon: Share2 },
];

export function DashboardFooter() {
  return (
    <footer className="mt-5 flex flex-col gap-4 text-sm text-muted-foreground xl:flex-row xl:items-center xl:justify-between">
      <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
        <strong className="text-foreground">Copyright © 2025 Peetrdraw</strong>
        <a href="#privacy">Privacy Policy</a>
        <a href="#terms">Terms and conditions</a>
        <a href="#contact">Contact</a>
      </div>
      <div className="flex items-center gap-1">
        {socialLinks.map((social) => {
          const Icon = social.icon;

          return (
            <Button
              key={social.label}
              variant="ghost"
              size="icon"
              aria-label={social.label}
            >
              <Icon aria-hidden="true" />
            </Button>
          );
        })}
      </div>
    </footer>
  );
}
