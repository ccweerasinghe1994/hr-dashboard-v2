import type { LucideIcon } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";

export type MetricCardProps = {
  label: string;
  value: string;
  percentage: string;
  icon: LucideIcon;
};

export function MetricCard({
  label,
  value,
  percentage,
  icon: Icon,
}: MetricCardProps) {
  return (
    <Card size="sm">
      <CardHeader className="grid grid-cols-[auto_1fr_auto] items-center gap-3">
        <span className="flex size-11 items-center justify-center rounded-full bg-muted text-primary">
          <Icon aria-hidden="true" className="size-6" />
        </span>
        <CardDescription>{label}</CardDescription>
        <span className="text-sm font-semibold text-chart-1">{percentage}</span>
      </CardHeader>
      <CardContent className="flex items-end justify-between gap-3">
        <strong className="font-heading text-4xl leading-none">{value}</strong>
        <span className="text-xs text-muted-foreground">of applicants</span>
      </CardContent>
    </Card>
  );
}
