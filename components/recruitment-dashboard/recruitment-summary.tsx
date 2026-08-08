import { CircleUserRound, FileText, MessageSquareText } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

import { MetricCard } from "./metric-card";

export function RecruitmentSummary() {
  return (
    <section
      aria-label="Recruitment summary"
      className="grid gap-4 sm:grid-cols-[0.9fr_1.3fr] sm:grid-rows-2"
    >
      <Card className="sm:row-span-2" tone="highlight">
        <CardHeader>
          <span className="flex size-14 items-center justify-center rounded-full bg-chart-1 text-primary-foreground">
            <FileText aria-hidden="true" className="size-7" />
          </span>
        </CardHeader>
        <CardContent className="mt-auto">
          <div className="flex items-center gap-2">
            <strong className="font-heading text-5xl leading-none">146</strong>
            <Badge>+8.2%</Badge>
          </div>
          <p className="mt-3 text-sm text-muted-foreground">Total Applicants</p>
        </CardContent>
      </Card>
      <MetricCard
        label="Interviewed"
        value="42"
        percentage="28.8%"
        icon={MessageSquareText}
      />
      <MetricCard
        label="Hired"
        value="12"
        percentage="8.2%"
        icon={CircleUserRound}
      />
    </section>
  );
}
