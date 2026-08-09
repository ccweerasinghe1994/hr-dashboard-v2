import { Blend } from "lucide-react";

export function TeamHubLogo() {
  return (
    <a
      href="#top"
      className="flex items-center gap-3"
      aria-label="TeamHub home"
    >
      <Blend aria-hidden="true" className="size-8 text-primary" />
      <span className="font-heading text-2xl font-bold tracking-tight">
        TeamHub
      </span>
    </a>
  );
}
