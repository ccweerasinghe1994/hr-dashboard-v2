import { Badge } from "@/components/ui/badge";

import { applicationStages } from "./data";

export type StagesProps = {
  current: number;
  label: string;
};

export function Stages({ current, label }: StagesProps) {
  return (
    <div
      className="flex gap-1"
      role="img"
      aria-label={`${label}, stage ${current} of 5`}
    >
      {applicationStages.map((stage) => (
        <Badge
          key={stage}
          variant={stage <= current ? "secondary" : "outline"}
          aria-hidden="true"
        >
          {stage}
        </Badge>
      ))}
    </div>
  );
}
