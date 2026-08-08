import { BriefcaseBusiness, LayoutDashboard, UsersRound } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import type { Vacancy } from "./types";

export type VacancyCardProps = {
  vacancy: Vacancy;
};

export function VacancyCard({ vacancy }: VacancyCardProps) {
  return (
    <Card size="sm">
      <CardHeader>
        <CardTitle>{vacancy.role}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <BriefcaseBusiness aria-hidden="true" className="size-4" />
          {vacancy.type}
        </span>
        <span className="flex items-center gap-1.5">
          <LayoutDashboard aria-hidden="true" className="size-4" />
          {vacancy.place}
        </span>
        <span className="flex items-center gap-1.5">
          <UsersRound aria-hidden="true" className="size-4" />
          {vacancy.applicants}
        </span>
      </CardContent>
    </Card>
  );
}
