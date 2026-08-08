import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import { calendarDates, weekdays } from "./data";

export function MiniCalendar() {
  return (
    <div className="rounded-xl bg-muted p-3">
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="icon" aria-label="Previous week">
          <ChevronLeft aria-hidden="true" />
        </Button>
        <strong className="text-sm">June 2035</strong>
        <Button variant="ghost" size="icon" aria-label="Next week">
          <ChevronRight aria-hidden="true" />
        </Button>
      </div>
      <div
        className="mt-3 grid grid-cols-7 text-center text-xs text-muted-foreground"
        aria-hidden="true"
      >
        {weekdays.map((day) => (
          <span key={day.name}>{day.short}</span>
        ))}
      </div>
      <div className="mt-2 grid grid-cols-7 text-center text-sm">
        {calendarDates.map((date) => (
          <span
            key={date}
            className={cn(
              "flex size-9 items-center justify-center justify-self-center rounded-lg",
              date === 20 && "bg-primary font-semibold text-primary-foreground",
            )}
            aria-current={date === 20 ? "date" : undefined}
          >
            {date}
          </span>
        ))}
      </div>
    </div>
  );
}
