import { ChevronDown, Filter } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { vacancies } from "./data";
import { VacancyCard } from "./vacancy-card";

export function VacanciesCard() {
  return (
    <Card className="2xl:col-start-1 2xl:row-start-2">
      <CardHeader>
        <CardTitle>Current Vacancies</CardTitle>
        <CardAction>
          <Button variant="secondary">
            <Filter data-icon="inline-start" aria-hidden="true" />
            Filter
            <ChevronDown data-icon="inline-end" aria-hidden="true" />
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent className="grid gap-3 sm:grid-cols-2">
        {vacancies.map((vacancy) => (
          <VacancyCard key={vacancy.role} vacancy={vacancy} />
        ))}
      </CardContent>
    </Card>
  );
}
